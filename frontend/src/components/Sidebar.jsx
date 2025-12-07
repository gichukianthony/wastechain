import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trash2, ShoppingBag, Gift, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/waste-requests', icon: Trash2, label: 'Waste Requests' },
    { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { to: '/rewards', icon: Gift, label: 'Rewards' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={clsx(
            "fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      <aside className={clsx(
        "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 pt-16",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => clsx(
                    "flex items-center p-2 rounded-lg group",
                    isActive ? "bg-primary/10 text-primary-dark" : "text-gray-900 hover:bg-gray-100"
                  )}
                  onClick={() => {
                      if (window.innerWidth < 768) closeSidebar();
                  }}
                >
                  <link.icon className={clsx("w-5 h-5 transition duration-75", ({ isActive }) => isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-900")} />
                  <span className="ml-3">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
