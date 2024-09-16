import React, { useState } from 'react';
import DueDate from './DueDate';
import { todoRoutes } from '../api/todo-routes/todoRoutes';
import { CreateTodoRequest, Todo } from '../../types';

interface AddEditTodoProps {
    onAddEditTodo: (newTodo: Todo) => void; // Prop to handle new todos
}

const AddEditTodo: React.FC<AddEditTodoProps> = ({ onAddEditTodo }) => {
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState('');
    const [showDueDate, setShowDueDate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const todoData: CreateTodoRequest = {
            name: task,
            description,
            due_date: dueDate ? dueDate.toISOString() : undefined,
            priority: priority || undefined,
        };

        try {
            const response = await todoRoutes.createTodo(todoData);

            if (response && response.todo) {
                // Ensure response.todo is not undefined
                onAddEditTodo(response.todo); // Call the callback function to update the list
            } else {
                throw new Error('Invalid response format');
            }

            // Reset form
            setTask('');
            setDescription('');
            setDueDate(null);
            setPriority('');
        } catch (err) {
            setError('Failed to create todo. Please try again.');
            console.error('Error creating todo:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectDate = (date: Date) => {
        setDueDate(date);
        setShowDueDate(false);
    };

    return (
        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md max-w-md relative">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowDueDate(!showDueDate)}
                        className="flex items-center justify-center p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        <span className="mr-2">&#128197;</span>
                        {dueDate ? dueDate.toLocaleDateString() : 'Select Due Date'}
                    </button>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="p-2 rounded flex-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        <option value="">Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                {showDueDate && (
                    <div className="absolute z-10 mt-2">
                        <DueDate onSelectDate={handleSelectDate} />
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Adding...' : 'Add Task'}
                </button>
            </form>
        </div>
    );
};

export default AddEditTodo;
