import React, { useState } from 'react';

interface Note {
  id: number;
  text: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  };

  const addNote = () => {
    if (newNote.trim()) {
      const id = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;
      setNotes([...notes, { id, text: newNote.trim() }]);
      setNewNote('');
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Note Taker</h1>
      <div className="mb-4">
        <textarea
          value={newNote}
          onChange={handleInputChange}
          placeholder="Enter a new note"
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>
      <button
        onClick={addNote}
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
      >
        Add Note
      </button>
      <ul className="space-y-4">
        {notes.map((note) => (
          <li
            key={note.id}
            className="bg-white p-4 rounded-md shadow flex justify-between items-start"
          >
            <p className="text-gray-800 whitespace-pre-wrap">{note.text}</p>
            <button
              onClick={() => deleteNote(note.id)}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
