import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Trash2, ShoppingBag, Gift, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                 onClick={toggleSidebar}
                 className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
              >
                  {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="ml-4 flex items-center gap-2 font-bold text-xl text-primary-dark">
                <Trash2 className="h-8 w-8 text-primary" />
                WasteChain
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 hidden sm:block">Hello, {user.firstName}</span>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Login</Link>
                <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
