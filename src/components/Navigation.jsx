import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navigation() {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">
              FAssets Liquidator
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/settings">Settings</NavLink>
              <NavLink to="/docs">Documentation</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}