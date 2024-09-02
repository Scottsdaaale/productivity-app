import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import 'tailwindcss/tailwind.css';
import Navbar from './components/Navbar';
import Notes from './components/Notes';
import Pomodoro from './components/Pomodoro';
import TodoList from './components/TodoList';
import Dashboard from './components/Dashboard';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

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
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="notes" element={<Notes />} />
            <Route path="pomodoro" element={<Pomodoro />} />
            <Route path="todo" element={<TodoList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
