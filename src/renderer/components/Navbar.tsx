import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, darkMode, isAuthenticated, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/notes', label: 'Notes' },
    { path: '/todo', label: 'Todo' },
    { path: '/pomodoro', label: 'Pomodoro' },
  ];

  return (
    <nav className={`w-full ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`py-2 px-3 text-sm font-medium rounded-md whitespace-nowrap ${location.pathname === item.path
                    ? darkMode
                      ? 'text-white bg-gray-800'
                      : 'text-black bg-gray-300'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-black hover:bg-gray-400'
                  } transition duration-300`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 whitespace-nowrap"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;