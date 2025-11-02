import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMenu, FiShoppingCart, FiUsers, FiBarChart2, FiLogOut, FiMenu as FiMenuIcon, FiX } from 'react-icons/fi';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 text-white fixed w-full top-0 z-20 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link to="/admin-dashboard" className="text-lg font-bold hover:text-orange-300 flex items-center">
          <FiHome className="mr-2" /> Admin
        </Link>
          {/* desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/admin-dashboard/menu" className="flex items-center hover:text-orange-300">
            <FiMenu className="mr-2" /> Menu
          </Link>
          <Link to="/admin-dashboard/orders" className="flex items-center hover:text-orange-300">
            <FiShoppingCart className="mr-2" /> Orders
          </Link>
          <Link to="/admin-dashboard/reports" className="flex items-center hover:text-orange-300">
            <FiBarChart2 className="mr-2" /> Reports
          </Link>
          <Link to="/admin-dashboard/message" className="flex items-center hover:text-orange-300">
            <FiBarChart2 className="mr-2" /> Message
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-md"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
        {/* Mobile button*/}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <FiX size={24} /> : <FiMenuIcon size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <Link
            to="/admin-dashboard/menu"
            onClick={toggleMenu}
            className="block px-4 py-2 hover:bg-gray-700 flex items-center"
          >
            <FiMenu className="mr-2" /> Menu
          </Link>
          <Link
            to="/admin-dashboard/orders"
            onClick={toggleMenu}
            className="block px-4 py-2 hover:bg-gray-700 flex items-center"
          >
            <FiShoppingCart className="mr-2" /> Orders
          </Link>
          
          <Link
            to="/admin-dashboard/reports"
            onClick={toggleMenu}
            className="block px-4 py-2 hover:bg-gray-700 flex items-center"
          >
            <FiBarChart2 className="mr-2" /> Reports
          </Link>
          <Link
            to="/admin-dashboard/message"
            onClick={toggleMenu}
            className="block px-4 py-2 hover:bg-gray-700 flex items-center"
          >
            <FiBarChart2 className="mr-2" /> Message
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-700 flex items-center text-white"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
