import { FiMenu, FiTruck, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Home = () => {
  const items = [
    { icon: FiMenu, title: 'Menu', description: 'Explore our wide variety of delicious dishes.' },
    { icon: FiTruck, title: 'Services', description: 'Enjoy fast delivery and catering options.' },
    { icon: FiPhone, title: 'Contact', description: 'Reach out to us for support or inquiries.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-orange-500 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center">
             Welcome to FoodHub
          </h1>
          <p className="text-xl mb-6">
            Delicious meals delivered to your door. Order now and savor the taste!
          </p>
          <Link to="/menu"
            className="bg-white text-orange-500 hover:bg-gray-100 py-3 px-6 rounded-md font-medium">
            Order Now </Link>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">What We Offer</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.title.toLowerCase() === 'home' ? '/' : `/${item.title.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-gray-50 transition duration-300" >
                <Icon className="text-4xl text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;