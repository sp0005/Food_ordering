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
    pending_orders: 0,
    approved_orders: 0,
    total_sales: 0,
  });

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate, token]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(STATS_URL);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    // Fetch initially
    fetchStats();

    // Live update every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const isDashboardRoot = location.pathname === "/admin-dashboard";

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
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-600">Total Orders</h2>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total_orders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-600">Pending Orders</h2>
                  <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending_orders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-600">Approved Orders</h2>
                  <p className="mt-2 text-2xl font-bold text-green-600">{stats.approved_orders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-600">Total Sales</h2>
                  <p className="mt-2 text-2xl font-bold text-blue-600">Rs {stats.total_sales}</p>
                </div>
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
