import React, { useState, useEffect } from 'react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'year'>('day');

  useEffect(() => {
    // Load todos from localStorage on component mount
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever they change
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: TodoItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        dueDate: currentDate.toISOString().split('T')[0],
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const changeDate = (increment: number) => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + increment);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7 * increment);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + increment);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + increment);
        break;
    }
    setCurrentDate(newDate);
  };

  const filteredTodos = todos.filter((todo) => {
    const todoDate = new Date(todo.dueDate);
    switch (view) {
      case 'day':
        return todoDate.toDateString() === currentDate.toDateString();
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return todoDate >= weekStart && todoDate <= weekEnd;
      case 'month':
        return (
          todoDate.getMonth() === currentDate.getMonth() &&
          todoDate.getFullYear() === currentDate.getFullYear()
        );
      case 'year':
        return todoDate.getFullYear() === currentDate.getFullYear();
    }
  });

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between mb-4">
          {['day', 'week', 'month', 'year'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as 'day' | 'week' | 'month' | 'year')}
              className={`px-2 py-1 rounded ${
                view === v ? 'bg-pink-500' : 'bg-gray-700'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeDate(-1)} className="text-2xl">
            &lt;
          </button>
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <button onClick={() => changeDate(1)} className="text-2xl">
            &gt;
          </button>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a task..."
            className="flex-grow mr-2 px-3 py-2 bg-gray-700 rounded"
          />
          <button onClick={addTodo} className="px-4 py-2 bg-pink-500 rounded">
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-700 p-2 rounded"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-2"
                />
                <span className={todo.completed ? 'line-through' : ''}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
