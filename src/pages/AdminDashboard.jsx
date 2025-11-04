import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";

const STATS_URL = "http://localhost/api/orders/stats.php";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  const [stats, setStats] = useState({
    total_orders: 0,
    active_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
    total_sales: 0,
  });

  // Redirect to admin login if no token
  useEffect(() => {
    if (!token) navigate("/admin-login");
  }, [token, navigate]);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(STATS_URL);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const isDashboardRoot = location.pathname === "/admin-dashboard";

  // Navigate to AdminOrders with filter
  const handleNavigate = (status) => {
    navigate("/admin-dashboard/orders", { state: { filterStatus: status } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isDashboardRoot && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mb-6">
                Welcome, Admin! Manage your system from here.
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  onClick={() => handleNavigate("All")}
                  className="cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h2 className="text-lg font-medium text-gray-600">Total Orders</h2>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total_orders}</p>
                </div>

                <div
                  onClick={() => handleNavigate("Active")}
                  className="cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h2 className="text-lg font-medium text-gray-600">Active Orders</h2>
                  <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.active_orders}</p>
                </div>

                <div
                  onClick={() => handleNavigate("Delivered")}
                  className="cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h2 className="text-lg font-medium text-gray-600">Delivered Orders</h2>
                  <p className="mt-2 text-2xl font-bold text-green-600">{stats.delivered_orders}</p>
                </div>

                <div
                  onClick={() => handleNavigate("Cancelled")}
                  className="cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h2 className="text-lg font-medium text-gray-600">Cancelled Orders</h2>
                  <p className="mt-2 text-2xl font-bold text-red-600">{stats.cancelled_orders}</p>
                </div>
              </div>

              {/* Total Sales Card */}
              <div className="mt-6 bg-white p-6 rounded-lg shadow flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-600">Total Sales</h2>
                <p className="text-2xl font-bold text-blue-600">Rs {stats.total_sales}</p>
              </div>
            </>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
