import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost/api/orders/orders.php";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

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

  const updateOrderStatus = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("action", "update_status");
      formData.append("id", id);
      formData.append("status", status);

      await axios.post(API_URL, formData);
      fetchOrders();
    } catch (err) {
      alert("Failed to update order!");
    }
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-4">Admin Orders Panel</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="font-medium">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1">
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
  <tr className="bg-blue-600 text-white text-left">
    <th className="py-3 px-4">#</th>
    <th className="py-3 px-4">User</th>
    <th className="py-3 px-4">Location</th>
    <th className="py-3 px-4">Address</th>
    <th className="py-3 px-4">Transaction Code</th>
    <th className="py-3 px-4">Receipt</th>
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
        <td className="py-3 px-4">{order.transaction_code || "—"}</td>
        <td className="py-3 px-4">
          {order.receipt_url ? (
            <a href={order.receipt_url} target="_blank" rel="noopener noreferrer">
              <img
                src={order.receipt_url}
                alt="Receipt"
                className="w-16 h-16 object-cover rounded-md border" />
            </a>
          ) : (
            "No Receipt"
          )}
        </td>
        <td className="py-3 px-4">
          {order.items?.map((item, i) => (
            <div key={i}>
              {item.name} × {item.quantity}
            </div>
          ))}
        </td>
        <td className="py-3 px-4 font-semibold">₹{order.total.toFixed(2)}</td>
        <td className="py-3 px-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              order.status === "Approved"
                ? "bg-green-100 text-green-700"
                : order.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`} >
            {order.status}
          </span>
        </td>
        <td className="py-3 px-4 flex gap-2">
          <button onClick={() => updateOrderStatus(order.id, "Approved")}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700" >
            Approve </button>
          <button onClick={() => updateOrderStatus(order.id, "Rejected")}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700" >
            Reject </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="10" className="text-center py-4 text-gray-500">
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
