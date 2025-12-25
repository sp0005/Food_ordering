import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost/api/orders/orders.php";

const AdminOrders = () => {
  const location = useLocation();
  const { filterStatus: initialFilterStatus } = location.state || {
    filterStatus: "All",
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL);
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
  }, []);

  const getDeliveryCharge = (location) => {
    if (!location) return 0;
    const charges = {
      Butwal: 100,
      Tilottama: 100,
      Sainamaina: 150,
      Bhairawa: 150,
    };
    return charges[location] || 0;
  };

  const printBill = (order) => {
    const deliveryCharge = getDeliveryCharge(order.location);
    const totalWithDelivery = Number(order.total) + deliveryCharge;

    const itemsHtml = order.items
      .map(
        (item) => `<tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>Rs ${item.price}</td>
        </tr>`
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>Bill - FoodHub</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>FoodHub - Bill</h2>
          <p><strong>User:</strong> ${order.user_name}</p>
          <p><strong>Location:</strong> ${order.location}</p>
          <p><strong>Address:</strong> ${order.address}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="2"><strong>Delivery Charge</strong></td>
                <td>Rs ${deliveryCharge}</td>
              </tr>
              <tr>
                <td colspan="2"><strong>Total</strong></td>
                <td>Rs ${totalWithDelivery}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(html);
    newWindow.document.close();
    newWindow.print();
  };

  const updateOrderStatus = async (id, status, orderForPrint = null) => {
    try {
      const formData = new FormData();
      formData.append("action", "update_status");
      formData.append("id", id);
      formData.append("status", status);

      await axios.post(API_URL, formData);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );

      if (status === "Delivered" && orderForPrint) {
        printBill(orderForPrint);
      }
    } catch (err) {
      alert("Failed to update order!");
    }
  };

  const filteredOrders = orders; // you can keep filter by status if needed

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Admin Orders Panel
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{order.user_name}</td>
                  <td className="py-3 px-4">{order.location || "—"}</td>
                  <td className="py-3 px-4">{order.address || "—"}</td>

                  <td className="py-3 px-4">
                    {order.items?.map((item, i) => (
                      <div key={i}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="py-3 px-4 font-semibold">
                    Rs {Number(order.total).toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 flex gap-2">
                    {order.status === "Order Placed" && (
                      <>
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Delivered", order)
                          }
                          className="bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800 transition"
                        >
                          Deliver
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Cancelled")
                          }
                          className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-800 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
