import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { TiStar } from "react-icons/ti";

const API_URL = "http://localhost/api/menu/read.php";
const IMAGE_URL = "http://localhost/api/uploads/";

const UserMenu = () => {
  const { cart, setCart } = useOutletContext();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(API_URL);
        let menuItems = Array.isArray(res.data) ? res.data : [];

        const user = JSON.parse(localStorage.getItem("user"));
        const preference = user?.food_preference?.toLowerCase() || "both";

        if (preference !== "both") {
          menuItems = menuItems.filter(
            (item) => item.preference.toLowerCase() === preference
          );
        }

        menuItems.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

        setMenus(menuItems);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    const updatedCart = existing
      ? cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      : [...cart, { ...item, quantity: 1 }];
    setCart(updatedCart);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCart = cart
      .map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
  };

  const filteredMenus = menus.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg animate-pulse">
        Loading menu...
      </p>
    );

  if (filteredMenus.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        No items found for your search or preference.
      </p>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 max-w-md mx-auto relative">
        <input
          type="text"
          placeholder="🔍 Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {filteredMenus.map((item) => {
          const cartItem = cart.find((c) => c.id === item.id);

          return (
            <div
              key={item.id}
              className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden 
             hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col"
            >
              {item.popular && (
                <div
                  className="absolute top-3 left-3 flex items-center gap-1 bg-yellow-400 text-yellow-900 
                    text-xs font-bold px-2 py-1 rounded-full shadow-md z-20"
                >
                  <TiStar className="text-yellow-600" />
                  Popular
                </div>
              )}

              <div className="relative">
                <img
                  src={`${IMAGE_URL}${item.image}`}
                  alt={item.name}
                  className="w-full h-44 sm:h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/70 backdrop-blur-md text-xs px-2 py-1 rounded-full font-medium text-gray-700 z-10">
                  {item.preference}
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-lg sm:text-xl text-gray-800 mb-1 truncate">
                    {item.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <p className="font-semibold text-orange-600 text-base mt-2">
                  Rs {item.price}
                </p>
                {!cartItem ? (
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-3 w-full bg-orange-500 hover:bg-orange-600 
                    text-white py-2 rounded-xl font-medium transition"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="mt-3 flex items-center justify-center space-x-3">
                    <button
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg font-semibold"
                    >
                      −
                    </button>
                    <span className="text-gray-800 font-semibold">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded-lg font-semibold"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserMenu;
