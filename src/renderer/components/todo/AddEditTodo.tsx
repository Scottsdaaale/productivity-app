import React, { useState, useEffect } from 'react';
import DueDate from './DueDate';
import { todoRoutes } from '../api/todo-routes/todoRoutes';
import { CreateTodoRequest, UpdateTodoRequest, Todo } from '../../types';

interface AddEditTodoProps {
    onAddEditTodo: (newTodo: Todo) => void;
    selectedFolderId: number | null;
    editingTodo?: Todo | null;
    onCancelEdit?: () => void;
}

const AddEditTodo: React.FC<AddEditTodoProps> = ({ onAddEditTodo, selectedFolderId, editingTodo, onCancelEdit }) => {
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState('');
    const [showDueDate, setShowDueDate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (editingTodo) {
            setTask(editingTodo.name);
            setDescription(editingTodo.description || '');
            setDueDate(editingTodo.due_date ? new Date(editingTodo.due_date) : null);
            setPriority(editingTodo.priority || '');
        }
    }, [editingTodo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const todoData: CreateTodoRequest | UpdateTodoRequest = {
            name: task,
            description,
            due_date: dueDate ? dueDate.toISOString() : undefined,
            priority: priority || undefined,
            folder_id: selectedFolderId !== null ? selectedFolderId : undefined
        };

        try {
            let response;
            if (editingTodo) {
                console.log('Updating todo with data:', todoData);
                response = await todoRoutes.updateTodo(editingTodo.id, todoData as UpdateTodoRequest);
            } else {
                console.log('Creating todo with data:', todoData);
                response = await todoRoutes.createTodo(todoData as CreateTodoRequest);
            }
            console.log('Server response:', response);

            if (response && response.todo) {
                onAddEditTodo(response.todo);
            } else {
                throw new Error('Invalid response format');
            }

            // Reset form
            setTask('');
            setDescription('');
            setDueDate(null);
            setPriority('');
            if (editingTodo && onCancelEdit) {
                onCancelEdit();
            }
        } catch (err) {
            setError(`Failed to ${editingTodo ? 'update' : 'create'} todo. Please try again.`);
            console.error(`Error ${editingTodo ? 'updating' : 'creating'} todo:`, err);
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
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex-1 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? (editingTodo ? 'Updating...' : 'Adding...') : (editingTodo ? 'Update Task' : 'Add Task')}
                    </button>
                    {editingTodo && onCancelEdit && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded flex-1"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddEditTodo;