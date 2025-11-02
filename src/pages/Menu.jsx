import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost/api/menu";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();

  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${API_URL}/read.php`);
      setMenus(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching menus:", error);
      setMenus([]);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen pt-20">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        🍽️ Our Delicious Menu
      </h1>

      {menus.length === 0 ? (
        <p className="text-center text-gray-600">No menu items available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl relative" >
              <div className="relative">
                {menu.image && (
                  <img
                    src={`http://localhost/api/uploads/${menu.image}`}
                    alt={menu.name}
                    className="h-48 w-full object-cover" />
                )}
                <span
                  className={`absolute top-2 left-2 px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
                    menu.preference === "veg"
                      ? "bg-green-500 text-white"
                      : menu.preference === "nonveg"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`} >
                  {menu.preference.toUpperCase()}
                </span>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {menu.name}
                </h2>
                <p className="text-gray-600 mb-3">{menu.description}</p>
                <p className="text-lg font-semibold text-gray-800 mb-4"> Rs {menu.price}
                </p>
                <button onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:from-orange-600 hover:to-red-600 transition" >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
