import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost/api/orders";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { setCart } = useOutletContext();
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders.php?user_id=${user_id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [user_id]);

  const handleReorder = async (orderId) => {
    try {
      const res = await axios.get(`${API_BASE}/get_order_items.php?order_id=${orderId}`);

      if (res.data.success && Array.isArray(res.data.items)) {
        // Convert to cart format
        const reorderedItems = res.data.items.map((item) => ({
          id: item.menu_item_id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          image: item.image,
        }));

        setCart(reorderedItems);
        navigate("/dashboard/cart"); // go to cart page
      } else {
        alert("No items found for reorder.");
      }
    } catch (error) {
      console.error("Reorder error:", error);
      alert("Error reordering items.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-700 bg-green-100";
      case "Rejected":
        return "text-red-700 bg-red-100";
      default:
        return "text-yellow-700 bg-yellow-100";
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  }

  if (!orders || orders.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No orders found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
        My Order History
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-2xl shadow-sm hover:shadow-md transition bg-white p-4 flex flex-col"
          >
            <div
              className="cursor-pointer relative group rounded-lg overflow-hidden"
              onClick={() =>
                setSelectedImage(
                  `http://localhost/api/orders/uploads/${order.receipt}`
                )
              }
            >
              <img
                src={`http://localhost/api/orders/uploads/${order.receipt}`}
                alt="Receipt"
                className="w-full h-48 sm:h-56 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white font-semibold text-sm sm:text-base">
                  View Receipt
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm sm:text-base text-gray-700 space-y-1">
              <p>
                <strong>Transaction Code:</strong> {order.transaction_code}
              </p>
              <p>
                <strong>Date:</strong> {order.created_at}
              </p>
              <p
                className={`mt-2 inline-block px-3 py-1 rounded-full font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </p>

              {/* Reorder Button */}
              <button
                onClick={() => handleReorder(order.id)}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition w-full"
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 relative max-w-3xl w-full mx-auto">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Full Receipt"
              className="max-h-[80vh] w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
