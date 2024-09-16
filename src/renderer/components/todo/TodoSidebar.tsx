import React, { useState, useEffect } from 'react';
import { todoFolderApi } from '../api/todo-routes/todoFolderRoutes';
import { TodoFolder, CreateTodoFolderRequest, MessageResponse, TodoFoldersResponse } from '../../types';

interface TodoSidebarProps {
    onFolderSelect: (folderId: number | null) => void;
}

const TodoSidebar: React.FC<TodoSidebarProps> = ({ onFolderSelect }) => {
    const [folders, setFolders] = useState<TodoFolder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            setIsLoading(true);
            setError(null);
           const response: TodoFoldersResponse = await todoFolderApi.getFolders();
            console.log('Fetched folders:', response);
            setFolders(response.folders || []);
        } catch (error) {
            console.error('Error fetching folders:', error);
            setError('Failed to load folders. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            setIsCreatingFolder(true);
            const newFolder: CreateTodoFolderRequest = {
                name: newFolderName,
                parent_id: null // Assuming top-level folder creation
            };
            console.log('Creating folder with data:', newFolder);
            const response: MessageResponse = await todoFolderApi.createFolder(newFolder);
            console.log('Create folder response:', response);
            if (response.folder) {
                setFolders([...folders, response.folder as TodoFolder]);
                setNewFolderName('');
            } else {
                await fetchFolders();
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            setError('Failed to create folder. Please try again.');
        } finally {
            setIsCreatingFolder(false);
        }
    };

    const handleFolderClick = (folderId: number) => {
        setSelectedFolder(folderId);
        onFolderSelect(folderId);
    };

    if (isLoading) {
        return <div className="w-64 bg-white shadow-md h-screen p-4">Loading...</div>;
    }

    if (error) {
        return <div className="w-64 bg-white shadow-md h-screen p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="w-64 bg-white shadow-md h-screen p-4">
            <div className="mb-4">
                <h2 className="text-lg font-semibold bg-blue-200 p-2 rounded cursor-pointer"
                    onClick={() => onFolderSelect(null)}>Today</h2>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold bg-blue-200 p-2 rounded cursor-pointer"
                    onClick={() => onFolderSelect(null)}>All todos</h2>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Folders</h2>
                {folders.length > 0 ? (
                    folders.map((folder) => (
                        <div
                            key={folder.id}
                            className={`bg-blue-200 p-2 rounded mb-2 cursor-pointer ${selectedFolder === folder.id ? 'bg-blue-300' : ''
                                }`}
                            onClick={() => handleFolderClick(folder.id)}
                        >
                            {folder.name}
                        </div>
                    ))
                ) : (
                    <p>No folders found.</p>
                )}
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                    className="w-full p-2 border rounded mb-2"
                />
                <button
                    onClick={handleCreateFolder}
                    disabled={isCreatingFolder || !newFolderName.trim()}
                    className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
                >
                    {isCreatingFolder ? 'Creating...' : 'Create New Folder'}
                </button>
            </div>
        </div>
    );
};

export default TodoSidebar;