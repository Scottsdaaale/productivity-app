import React from 'react';
import { useNotes, truncateText, stripHtml } from './utils/notesUtils';
import TiptapEditor from './Tiptap';

const Notes: React.FC = () => {
  const {
    notes,
    selectedNoteId,
    currentNoteTitle,
    currentNoteContent,
    isLoading,
    error,
    showDeleteConfirmation,
    setCurrentNoteTitle,
    setCurrentNoteContent,
    setShowDeleteConfirmation,
    selectNote,
    addNote,
    deleteNoteHandler,
  } = useNotes();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentNoteTitle(e.target.value);
  };

  const handleContentChange = (content: string) => {
    setCurrentNoteContent(content);
  };

  const showDeleteConfirmationPrompt = () => {
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmationPrompt = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Side Menu */}
      <div className="w-64 bg-gray-200 dark:bg-gray-800 shadow-lg flex flex-col h-screen transition-colors duration-200">
        <div className="px-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          {/* Add Note Button */}
          <button
            onClick={addNote}
            className="w-12 h-12  flex items-center justify-center 
      bg-transparent 
      text-gray-800 dark:text-gray-200 
      hover:text-blue-600 dark:hover:text-blue-400 
      rounded transition duration-200"
            aria-label="Add New Note"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={showDeleteConfirmationPrompt}
            className="w-12 h-12  flex items-center justify-center 
      bg-transparent 
      text-gray-800 dark:text-gray-200 
      hover:text-red-600 dark:hover:text-red-400 
      rounded transition duration-200"
            aria-label="Delete Note"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto ">
          <ul>
            {notes.map((note) => (
              <li
                key={note.id}
                className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedNoteId === note.id ? 'bg-gray-100 dark:bg-gray-600' : ''
                  } transition-colors duration-200`}
                onClick={() => selectNote(note.id)}
              >
                <div className="flex-1">
                  <h3 className="text-sm truncate text-gray-900 dark:text-gray-100">
                    {truncateText(note.title || 'New Note', 20)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {truncateText(stripHtml(note.content), 20)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {`${new Date(note.updated_at).toLocaleDateString()}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-700">
        <input
          type="text"
          value={currentNoteTitle}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="w-full p-[10px] text-xl font-semibold border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div className="h-full">
          <TiptapEditor
            content={currentNoteContent}
            onUpdate={handleContentChange}
          />
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Are you sure?</h2>
            <div className="flex justify-end">
              <button
                onClick={deleteNoteHandler}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-red-400 transition duration-300 mr-2"
              >
                Yes
              </button>
              <button
                onClick={closeDeleteConfirmationPrompt}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;