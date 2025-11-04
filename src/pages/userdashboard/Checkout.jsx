import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiCheckCircle } from "react-icons/fi";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext();

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [savedAddress] = useState(savedUser.address || "");
  const [savedLocation] = useState(savedUser.location || "Butwal");

  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryCharge = ["Butwal", "Tilottama"].includes(location) ? 100 : 150;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryCharge;

  const handleUseSavedAddress = () => {
    setLocation(savedLocation);
    setAddress(savedAddress);
  };

  const handleSubmit = async () => {
    if (!address.trim()) return alert("Please enter delivery address!");
    if (!savedUser.id) return navigate("/login");

    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", savedUser.id);
    formData.append("location", location);
    formData.append("address", address);
    formData.append("cart", JSON.stringify(cart));
    formData.append("delivery_charge", deliveryCharge);
    formData.append("total_amount", total);
    formData.append("payment_method", "Cash");

    try {
      const res = await fetch("http://localhost/api/orders/orders.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        // Save the new address in the database
        try {
          await fetch("http://localhost/api/users/update_address.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: savedUser.id, address, location }),
          });

          // Update localStorage
          const updatedUser = { ...savedUser, address, location };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
          console.error("Failed to save address:", err);
        }

        alert("Your order has been placed!");
        setCart([]);
        navigate("/dashboard/menu");
      } else {
        alert("Order failed: " + data.message);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-pink-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          <FiArrowLeft className="text-xl" /> Back to Cart
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Order</h1>

          <div className="text-sm text-gray-600 mb-4">
            Payment Method: <span className="font-semibold text-orange-600">Cash on Delivery</span>
          </div>

          {savedAddress && (
            <button
              onClick={handleUseSavedAddress}
              className="px-4 py-2 bg-gray-200 rounded mb-2"
            >
              Use Saved Address: {savedAddress}, {savedLocation}
            </button>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FiMapPin className="text-orange-500" /> Delivery Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select Location</option>
                <option value="Butwal">Butwal</option>
                <option value="Tilottama">Tilottama</option>
                <option value="Bhairawa">Bhairawa</option>
                <option value="Sainamaina">Sainamaina</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Delivery Address</label>
              <input
                type="text"
                placeholder="House / Street / Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-5 rounded-2xl mb-6 border border-orange-100">
            <h3 className="font-bold text-lg text-orange-700 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-700">{item.name} × {item.quantity}</span>
                  <span className="font-medium">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="my-3 border-dashed border-orange-200" />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>Rs. {deliveryCharge}</span></div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-orange-200">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-orange-600">Rs. {total}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-pink-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Placing Order...
              </>
            ) : (
              <>
                <FiCheckCircle className="text-xl" /> Confirm Order
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            COD • Delivery 30–60 mins • Support: 9867391430
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
