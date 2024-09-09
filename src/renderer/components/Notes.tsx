import React, { useState } from 'react';
import { useNotes } from './utils/notesUtils';
import { useFolders } from './utils/folderUtils';
import MainContent from './MainContent';
import ConfirmationModals from './ConfirmationModals';

const Notes: React.FC = () => {
  const {
    notes,
    selectedNoteId,
    currentNoteTitle,
    currentNoteContent,
    isLoading: notesLoading,
    error: notesError,
    showDeleteConfirmation,
    setCurrentNoteTitle,
    setCurrentNoteContent,
    setShowDeleteConfirmation,
    selectNote,
    addNote,
    deleteNoteHandler,
  } = useNotes();

  const {
    folders,
    selectedFolderId,
    isLoading: foldersLoading,
    error: foldersError,
    setSelectedFolderId,
    addFolder,
    updateFolderHandler,
    deleteFolderHandler,
  } = useFolders();

  const [showDeleteFolderConfirmation, setShowDeleteFolderConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [navigationStack, setNavigationStack] = useState<(number | null)[]>([null]);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  if (notesLoading || foldersLoading) {
    return <div>Loading...</div>;
  }

  if (notesError || foldersError) {
    return <div>Error: {notesError || foldersError}</div>;
  }

  const handleAddNote = () => {
    addNote(selectedFolderId);
  };

  const handleAddFolder = () => {
    setShowNewFolderModal(true);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName, selectedFolderId);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const handleFolderClick = (folderId: number) => {
    setNavigationStack(prevStack => [...prevStack, folderId]);
    setSelectedFolderId(folderId);
  };

  const handleBackNavigation = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop(); // Remove the current folder
      const previousFolderId = newStack[newStack.length - 1];
      setSelectedFolderId(previousFolderId);
      setNavigationStack(newStack);
    }
  };

  const handleDeleteFolder = (folderId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteFolderConfirmation(true);
    setSelectedFolderId(folderId);
  };

  const handleDeleteNote = (noteId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirmation(true);
    selectNote(noteId);
  };

  const isRootLevel = navigationStack.length === 1;

  const currentFolder = selectedFolderId !== null ? folders.find(folder => folder.id === selectedFolderId) : null;
  const currentFolderNotes = notes.filter(note => note.folder_id === selectedFolderId);
  const currentSubfolders = folders.filter(folder =>
    isRootLevel ? folder.parent_id === null : folder.parent_id === selectedFolderId
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-700 shadow-lg flex flex-col">
        {/* Top bar */}
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
          <button
            onClick={handleBackNavigation}
            disabled={isRootLevel}
            className={`p-2 ${isRootLevel ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} rounded`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleAddFolder}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button
            onClick={handleAddNote}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Folder contents */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentFolder && <h2 className="text-lg font-semibold mb-2 dark:text-white">{currentFolder.name}</h2>}
          {!currentFolder && isRootLevel && <h2 className="text-lg font-semibold mb-2 dark:text-white">Root</h2>}
          {currentSubfolders.map(folder => (
            <div
              key={folder.id}
              className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded group"
              onClick={() => handleFolderClick(folder.id)}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
                <span className="text-sm dark:text-gray-200">{folder.name}</span>
              </div>
              <button
                className="hidden group-hover:block p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                onClick={(e) => handleDeleteFolder(folder.id, e)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {currentFolderNotes.map(note => (
            <div
              key={note.id}
              className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded group"
              onClick={() => selectNote(note.id)}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm dark:text-gray-200">{note.title}</span>
              </div>
              <button
                className="hidden group-hover:block p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                onClick={(e) => handleDeleteNote(note.id, e)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNoteId ? (
          <MainContent
            currentNoteTitle={currentNoteTitle}
            currentNoteContent={currentNoteContent}
            setCurrentNoteTitle={setCurrentNoteTitle}
            setCurrentNoteContent={setCurrentNoteContent}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a note or create a new one
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Create New Folder</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModals
        showDeleteConfirmation={showDeleteConfirmation}
        showDeleteFolderConfirmation={showDeleteFolderConfirmation}
        deleteNoteHandler={deleteNoteHandler}
        handleDeleteFolder={() => {
          if (selectedFolderId !== null) {
            deleteFolderHandler(selectedFolderId);
            setShowDeleteFolderConfirmation(false);
            if (navigationStack[navigationStack.length - 1] === selectedFolderId) {
              handleBackNavigation();
            }
          }
        }}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
        setShowDeleteFolderConfirmation={setShowDeleteFolderConfirmation}
      />
    </div>
  );
};

export default Notes;