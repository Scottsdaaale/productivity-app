import React from 'react';
import { Note, Folder } from '../types';
import { truncateText, stripHtml } from './utils/notesUtils';

interface FolderContentsProps {
    folder: Folder;
    notes: Note[];
    subfolders: Folder[];
    onNoteSelect: (noteId: number) => void;
    onFolderSelect: (folderId: number) => void;
    onAddNote: () => void;
    onAddFolder: () => void;
}

const FolderContents: React.FC<FolderContentsProps> = ({
    folder,
    notes,
    subfolders,
    onNoteSelect,
    onFolderSelect,
    onAddNote,
    onAddFolder,
}) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold dark:text-gray-200">{folder.name}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={onAddFolder}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        New Folder
                    </button>
                    <button
                        onClick={onAddNote}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        New Note
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {subfolders.map((subfolder) => (
                    <div
                        key={subfolder.id}
                        className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => onFolderSelect(subfolder.id)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span className="dark:text-gray-200">{subfolder.name}</span>
                    </div>
                ))}
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => onNoteSelect(note.id)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold dark:text-gray-200">{truncateText(note.title, 20)}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{truncateText(stripHtml(note.content), 30)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolderContents;