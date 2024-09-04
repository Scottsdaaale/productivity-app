import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import Navbar from './components/Navbar';
import Notes from './components/Notes';
import Pomodoro from './components/Pomodoro';
import TodoList from './components/TodoList';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('access_token'));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.theme = darkMode ? 'light' : 'dark';
  };

  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
        <Navbar
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="notes" element={<Notes />} />
            <Route path="todo" element={<TodoList />} />
            <Route path="pomodoro" element={<Pomodoro />} />
            <Route path="login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
