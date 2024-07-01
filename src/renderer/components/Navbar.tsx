import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  toggleDarkMode: () => void;
  darkMode: boolean; // Add this line
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, darkMode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/notes', label: 'Notes' },
    { path: '/pomodoro', label: 'Pomodoro' },
    { path: '/todo', label: 'Todo List' },
  ];

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-white text-lg">
                  ProductivityApp
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`py-4 px-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-white bg-gray-700'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                } transition duration-300`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
