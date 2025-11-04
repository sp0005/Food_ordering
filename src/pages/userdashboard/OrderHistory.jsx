import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const API_URL = "http://localhost/api/orders/orders.php";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCart } = useOutletContext();

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const res = await axios.get(`${API_URL}?user_id=${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Status color
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Check if order can be cancelled (5 minutes)
  const canCancel = (createdAt) => {
    if (!createdAt) return false;
    const orderTime = new Date(createdAt).getTime();
    const now = Date.now();
    const diffMinutes = (now - orderTime) / 1000 / 60;
    return diffMinutes <= 5;
  };

  // Handle reorder
  const handleReorder = (items) => {
    const reorderedItems = items
      .filter(item => item.menu_item_id) // only valid items
      .map((item, index) => ({
        id: `${item.menu_item_id}-${index}`,
        menu_item_id: item.menu_item_id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        image: item.image || "", // fallback
      }));
    setCart(reorderedItems);
  };

  // Handle cancel order
  const handleCancel = async (orderId) => {
    try {
      const formData = new FormData();
      formData.append("action", "update_status");
      formData.append("id", orderId);
      formData.append("status", "Cancelled");

      await axios.post(API_URL, formData);
      fetchOrders();
    } catch (err) {
      alert("Failed to cancel order!");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading orders...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">My Orders</h2>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold text-lg">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : "Order Date"}
                  </p>
                  <p className="text-gray-500 text-sm">Order ID: {order.id}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items list */}
              <div className="border-t border-gray-200 pt-3 space-y-2 max-h-36 overflow-y-auto">
                {order.items?.map((item, i) => (
                  <div key={`${item.menu_item_id}-${i}`} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      {item.image && (
                        <img
                          src={`http://localhost/api/uploads/${item.image}`}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span>{item.name} × {item.quantity}</span>
                    </div>
                    <span>Rs {item.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">Rs {Number(order.total).toFixed(2)}</span>
              </div>

              <div className="mt-3 flex gap-2">
                {/* Cancel button for first 5 minutes */}
                {order.status === "Order Placed" && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={!canCancel(order.created_at)}
                    className={`flex-1 py-2 rounded-xl font-semibold transition ${
                      canCancel(order.created_at)
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Cancel
                  </button>
                )}

                {/* Reorder button only after Delivered */}
                {order.status === "Delivered" && (
                  <button
                    onClick={() => handleReorder(order.items)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold transition"
                  >
                    Reorder
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            You haven’t placed any orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
