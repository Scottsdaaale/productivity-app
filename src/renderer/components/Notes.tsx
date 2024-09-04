import React, { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote, Note } from './api/notesRoutes';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [currentNoteTitle, setCurrentNoteTitle] = useState<string>('');
  const [currentNoteContent, setCurrentNoteContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0 && selectedNoteId === null) {
      const newestNote = notes[0];
      selectNote(newestNote.id);
    }
  }, [notes]);

  useEffect(() => {
    const autoSave = async () => {
      if (selectedNoteId !== null && (currentNoteTitle || currentNoteContent)) {
        try {
          await updateNote(selectedNoteId, currentNoteTitle, currentNoteContent);
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note.id === selectedNoteId
                ? { ...note, title: currentNoteTitle, content: currentNoteContent, updated_at: new Date().toISOString() }
                : note
            )
          );
        } catch (error) {
          setError('Failed to update note');
          console.error('Failed to update note:', error);
        }
      }
    };

    autoSave();
  }, [currentNoteTitle, currentNoteContent, selectedNoteId]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotes();
      // Sort notes by newest first
      const sortedNotes = data.notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setNotes(sortedNotes);
    } catch (error) {
      setError('Failed to fetch notes');
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentNoteTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNoteContent(e.target.value);
  };

  const addNote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createNote('New Note', '');
      if (response.message === 'Note created successfully' && response.note) {
        const newNote = response.note;
        // Add the new note on top of the list
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setSelectedNoteId(newNote.id);
        setCurrentNoteTitle(newNote.title);
        setCurrentNoteContent(newNote.content);
      }
    } catch (error) {
      setError('Failed to create note');
      console.error('Failed to create note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNoteHandler = async () => {
    if (selectedNoteId === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteNote(selectedNoteId);
      if (response.message === 'Note deleted successfully') {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== selectedNoteId));
        const remainingNotes = notes.filter((note) => note.id !== selectedNoteId);
        if (remainingNotes.length > 0) {
          selectNote(remainingNotes[0].id);
        } else {
          setSelectedNoteId(null);
          setCurrentNoteTitle('');
          setCurrentNoteContent('');
        }
      }
    } catch (error) {
      setError('Failed to delete note');
      console.error('Failed to delete note:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  const selectNote = (id: number) => {
    setSelectedNoteId(id);
    const selectedNote = notes.find((note) => note.id === id);
    if (selectedNote) {
      setCurrentNoteTitle(selectedNote.title);
      setCurrentNoteContent(selectedNote.content);
    }
  };

  const showDeleteConfirmationPrompt = () => {
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmationPrompt = () => {
    setShowDeleteConfirmation(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Side Menu */}
      <div className="w-64 bg-gray-200 dark:bg-gray-800 shadow-lg flex flex-col h-screen transition-colors duration-200">
        <div className="px-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          {/* Add Note Button */}
          <button
            onClick={addNote}
            className="w-12 h-12 mb-2 flex items-center justify-center 
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
            className="w-12 h-12 mb-2 flex items-center justify-center 
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
                className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedNoteId === note.id ? 'bg-gray-200 dark:bg-gray-600' : ''
                  } transition-colors duration-200`}
                onClick={() => selectNote(note.id)}
              >
                <div className="flex-1">
                  <h3 className="font-medium truncate text-gray-900 dark:text-gray-100">
                    {truncateText(note.title || 'New Note', 20)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {truncateText(note.content, 20)}
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
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
        <div className="flex-grow flex flex-col overflow-hidden">
          <input
            type="text"
            value={currentNoteTitle}
            onChange={handleTitleChange}
            placeholder="Note Title"
            className="w-full p-3 border-b-[1px] text-xl font-semibold border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <textarea
            value={currentNoteContent}
            onChange={handleContentChange}
            placeholder="Enter your note here"
            className="h-full p-3 border-gray-300 dark:border-gray-600 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
