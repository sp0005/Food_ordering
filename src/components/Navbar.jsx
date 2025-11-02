import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMenu, FiPhone, FiSettings, FiUser } from 'react-icons/fi';
import logo from "../assets/logo.png";  

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="FoodHub Logo" className="h-10 w-10 object-contain mr-2" />
              <span className="text-xl font-bold text-orange-500">FoodHub</span>
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FiHome className="mr-1" /> Home
              </Link>
              <Link to="/menu" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FiMenu className="mr-1" /> Menu
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FiSettings className="mr-1" /> Services
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FiPhone className="mr-1" /> Contact
              </Link>
            </div>
          </div>
          {/* Desktop Login/Register */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-2">
              <Link to="/login" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FiUser className="mr-1" /> Login
              </Link>
              <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium">
                Register
              </Link>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-500 inline-flex items-center justify-center p-2 rounded-md">
              <span className="sr-only">Open main menu</span>
              <FiMenu className="block h-6 w-6" />
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {/* Mobile Links */}
              <Link to="/" className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={() => setIsOpen(false)} >
                <FiHome className="mr-2" /> Home
              </Link>
              <Link to="/menu" className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={() => setIsOpen(false)} >
                <FiMenu className="mr-2" /> Menu
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={() => setIsOpen(false)}>
                <FiSettings className="mr-2" /> Services
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={() => setIsOpen(false)} >
                <FiPhone className="mr-2" /> Contact
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={() => setIsOpen(false)} >
                <FiUser className="mr-2" /> Login
              </Link>
              <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
