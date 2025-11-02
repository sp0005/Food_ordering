import { useOutletContext, useNavigate } from "react-router-dom";

const UserCart = () => {
  const { cart, setCart } = useOutletContext();
  const navigate = useNavigate();

  const handleDecrease = (itemId) => {
    const updatedCart = cart
      .map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
  };

  const handleIncrease = (itemId) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate("/dashboard/checkout");
  };

  if (!cart || cart.length === 0)
    return (
      <p className="text-center text-gray-600 mt-10 text-lg animate-pulse">
        Your cart is empty
      </p>
    );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-sm hover:shadow-lg p-4 rounded-2xl transition-all"
          >
            <div className="flex items-center space-x-4 flex-1">
              <img
                src={`http://localhost/api/uploads/${item.image}`}
                alt={item.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
              />
              <div>
                <h2 className="font-semibold text-lg sm:text-xl text-gray-800">{item.name}</h2>
                <p className="text-gray-500 mt-1">Rs {item.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <button
                onClick={() => handleDecrease(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition"
              >
                −
              </button>
              <span className="px-3 font-semibold text-gray-800">{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item.id)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg font-semibold transition"
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className="bg-gray-100 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between mt-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Total: Rs {totalPrice}</h2>
          <button
            onClick={handleCheckout}
            className="mt-3 sm:mt-0 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-semibold transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCart;
