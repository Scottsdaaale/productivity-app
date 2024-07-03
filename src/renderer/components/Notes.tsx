import React, { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../../api/notes';

interface Note {
  id: number;
  title: string;
  content: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [currentNoteTitle, setCurrentNoteTitle] = useState<string>('');
  const [currentNoteContent, setCurrentNoteContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotes();
      setNotes(data.notes);
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
      const newNote = await createNote(currentNoteTitle, currentNoteContent);
      setNotes([...notes, newNote]);
      setSelectedNoteId(newNote.id);
      setCurrentNoteTitle('');
      setCurrentNoteContent('');
    } catch (error) {
      setError('Failed to create note');
      console.error('Failed to create note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNoteHandler = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
        setCurrentNoteTitle('');
        setCurrentNoteContent('');
      }
    } catch (error) {
      setError('Failed to delete note');
      console.error('Failed to delete note:', error);
    } finally {
      setIsLoading(false);
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

  const updateNoteHandler = async () => {
    if (selectedNoteId) {
      setIsLoading(true);
      setError(null);
      try {
        await updateNote(selectedNoteId, currentNoteTitle, currentNoteContent);
        setNotes(
          notes.map((note) =>
            note.id === selectedNoteId
              ? {
                  ...note,
                  title: currentNoteTitle,
                  content: currentNoteContent,
                }
              : note,
          ),
        );
      } catch (error) {
        setError('Failed to update note');
        console.error('Failed to update note:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex bg-gray-100">
      {/* Side Menu */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <button
            onClick={addNote}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
          >
            + New Note
          </button>
        </div>
        <ul className="overflow-auto h-full">
          {notes.map((note) => (
            <li
              key={note.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                selectedNoteId === note.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => selectNote(note.id)}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-sm text-gray-600 truncate">{note.content}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="mb-4">
          <input
            type="text"
            value={currentNoteTitle}
            onChange={handleTitleChange}
            placeholder="Note Title"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <textarea
            value={currentNoteContent}
            onChange={handleContentChange}
            placeholder="Enter your note here"
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={selectedNoteId ? updateNoteHandler : addNote}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
          >
            {selectedNoteId ? 'Update Note' : 'Save Note'}
          </button>
          {selectedNoteId && (
            <button
              onClick={() => deleteNoteHandler(selectedNoteId)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
            >
              Delete Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
