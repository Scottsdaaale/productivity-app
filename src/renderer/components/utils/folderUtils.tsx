import { useState, useEffect, useCallback } from 'react';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../api/foldersRoutes';
import { Folder } from '../../types'

export const useFolders = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    

    const fetchFolders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getFolders();
            setFolders(data.folders);
        } catch (error) {
            setError('Failed to fetch folders');
            console.error('Failed to fetch folders:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFolders();
    }, [fetchFolders]);

    const addFolder = async (name: string, parentId: number | null) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createFolder(name, parentId);
            if (response.message === 'Folder created successfully' && response.folder_id) {
                const newFolder: Folder = {
                    id: response.folder_id,
                    name,
                    parent_id: parentId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    user_id: 0, // You might want to update this with the actual user ID
                };
                setFolders(prevFolders => [...prevFolders, newFolder]);
            }
        } catch (error) {
            setError('Failed to create folder');
            console.error('Failed to create folder:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateFolderHandler = async (folderId: number, name: string, parentId: number | null) => {
        setIsLoading(true);
        setError(null);
        try {
            await updateFolder(folderId, name, parentId);
            setFolders(prevFolders =>
                prevFolders.map(folder =>
                    folder.id === folderId
                        ? { ...folder, name, parent_id: parentId, updated_at: new Date().toISOString() }
                        : folder
                )
            );
        } catch (error) {
            setError('Failed to update folder');
            console.error('Failed to update folder:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFolderHandler = async (folderId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteFolder(folderId);
            setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));
            if (selectedFolderId === folderId) {
                setSelectedFolderId(null);
            }
        } catch (error) {
            setError('Failed to delete folder');
            console.error('Failed to delete folder:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        folders,
        selectedFolderId,
        isLoading,
        error,
        setSelectedFolderId,
        addFolder,
        updateFolderHandler,
        deleteFolderHandler,
    };
};