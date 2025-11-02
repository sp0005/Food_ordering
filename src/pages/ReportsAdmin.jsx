import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const USERS_API = "http://localhost/api/users/read.php";
const DELETE_USER_API = "http://localhost/api/users/delete.php";
const TOP_ITEMS_API = "http://localhost/api/reports/top_items.php";
const USER_STATS_API = "http://localhost/api/reports/user_stats.php";
const REVENUE_API = "http://localhost/api/reports/revenue.php";

const ReportsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [userStats, setUserStats] = useState({ daily: 0, weekly: 0, monthly: 0, yearly: 0 });
  const [revenueStats, setRevenueStats] = useState({ daily: 0, weekly: 0, monthly: 0, yearly: 0 });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.get(`${DELETE_USER_API}?id=${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const fetchTopItems = async () => {
    try {
      const res = await axios.get(TOP_ITEMS_API);
      setTopItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch top items");
    }
  };

  const fetchUserStats = async () => {
    try {
      const daily = await axios.get(USER_STATS_API + "?time=daily");
      const weekly = await axios.get(USER_STATS_API + "?time=weekly");
      const monthly = await axios.get(USER_STATS_API + "?time=monthly");
      const yearly = await axios.get(USER_STATS_API + "?time=yearly");
      setUserStats({
        daily: daily.data.count,
        weekly: weekly.data.count,
        monthly: monthly.data.count,
        yearly: yearly.data.count
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRevenueStats = async () => {
    try {
      const daily = await axios.get(REVENUE_API + "?time=daily");
      const weekly = await axios.get(REVENUE_API + "?time=weekly");
      const monthly = await axios.get(REVENUE_API + "?time=monthly");
      const yearly = await axios.get(REVENUE_API + "?time=yearly");
      setRevenueStats({
        daily: daily.data.total,
        weekly: weekly.data.total,
        monthly: monthly.data.total,
        yearly: yearly.data.total
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllData = () => {
    fetchUsers();
    fetchTopItems();
    fetchUserStats();
    fetchRevenueStats();
  };

  useEffect(() => {
    fetchAllData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reports Panel</h1>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-blue-100 rounded shadow text-center">
          <p className="text-lg font-semibold">Daily Users</p>
          <p className="text-2xl">{userStats.daily}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow text-center">
          <p className="text-lg font-semibold">Weekly Users</p>
          <p className="text-2xl">{userStats.weekly}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow text-center">
          <p className="text-lg font-semibold">Monthly Users</p>
          <p className="text-2xl">{userStats.monthly}</p>
        </div>
        <div className="p-4 bg-red-100 rounded shadow text-center">
          <p className="text-lg font-semibold">Yearly Users</p>
          <p className="text-2xl">{userStats.yearly}</p>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-blue-200 rounded shadow text-center">
          <p className="text-lg font-semibold">Daily Revenue</p>
          <p className="text-2xl">Rs {revenueStats.daily || 0}</p>
        </div>
        <div className="p-4 bg-green-200 rounded shadow text-center">
          <p className="text-lg font-semibold">Weekly Revenue</p>
          <p className="text-2xl">Rs {revenueStats.weekly || 0}</p>
        </div>
        <div className="p-4 bg-yellow-200 rounded shadow text-center">
          <p className="text-lg font-semibold">Monthly Revenue</p>
          <p className="text-2xl">Rs {revenueStats.monthly || 0}</p>
        </div>
        <div className="p-4 bg-red-200 rounded shadow text-center">
          <p className="text-lg font-semibold">Yearly Revenue</p>
          <p className="text-2xl">Rs {revenueStats.yearly || 0}</p>
        </div>
      </div>

      {/* Top Items */}
      <h2 className="text-2xl font-bold mb-4">Top Selling Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {topItems.map((item, idx) => (
          <div key={idx} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{item.name}</h3>
            <p>Quantity Sold: {item.total_quantity}</p>
            <p>Total Sales: Rs {item.total_sales}</p>
          </div>
        ))}
      </div>

      {/* User List */}
      <h2 className="text-2xl font-bold mb-4">Users List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Food Pref.</th>
              <th className="px-4 py-2">Registered At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phone || "—"}</td>
                <td className="px-4 py-2">{user.food_preference}</td>
                <td className="px-4 py-2">{user.created_at}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsAdmin;
