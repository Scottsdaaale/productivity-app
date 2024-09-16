import React, { useState, useEffect } from 'react';
import AddEditTodo from './AddEditTodo';
import { Todo, TodosResponse } from '../../types';
import { todoRoutes } from '../api/todo-routes/todoRoutes';
import { todoFolderApi } from '../api/todo-routes/todoFolderRoutes';

interface TodoListProps {
  selectedFolderId: number | null;
}

const TodoList: React.FC<TodoListProps> = ({ selectedFolderId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [folderName, setFolderName] = useState<string>('All Todos');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
  }, [selectedFolderId]);

  const fetchTodos = async () => {
    try {
      let data: TodosResponse;
      if (selectedFolderId === null) {
        data = await todoRoutes.getTodos();
        setFolderName('All Todos');
      } else {
        data = await todoFolderApi.getFolderTodos(selectedFolderId);
        const folder = await todoFolderApi.getFolders();
        const selectedFolder = folder.folders.find(f => f.id === selectedFolderId);
        setFolderName(selectedFolder?.name || 'Unknown Folder');
      }
      setTodos(data.todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleToggleCompletion = async (todoId: number, completed: boolean) => {
    try {
      await todoRoutes.updateTodo(todoId, { completed: !completed });
      // Update local state
      setTodos(todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !completed } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleAddEditTodo = (updatedTodo: Todo) => {
    if (editingTodo) {
      setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    } else {
      setTodos([...todos, updatedTodo]);
    }
    setEditingTodo(null);
  };

  const handleTodoClick = (todo: Todo) => {
    setEditingTodo(todo);
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800">
      {/* Folder Title */}
      <div className="bg-gray-300 dark:bg-gray-700 p-4 rounded-md mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{folderName}</h2>
      </div>

      {/* Number of tasks */}
      <div className="bg-gray-200 dark:bg-gray-600 p-2 rounded-md mb-4">
        <p className="text-gray-800 dark:text-gray-200"># of tasks: {todos.length}</p>
      </div>

      {/* Task List */}
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-md flex items-center justify-between cursor-pointer"
              onClick={() => handleTodoClick(todo)}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleCompletion(todo.id, todo.completed);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                />
                <span className={`text-sm ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  {todo.name}
                </span>
              </div>
              <span className="text-sm text-blue-500 dark:text-blue-300">Click to edit</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Todo Component */}
      <div className="mt-6">
        <AddEditTodo
          onAddEditTodo={handleAddEditTodo}
          selectedFolderId={selectedFolderId}
          editingTodo={editingTodo}
          onCancelEdit={() => setEditingTodo(null)}
        />
      </div>
    </div>
  );
};

export default TodoList;