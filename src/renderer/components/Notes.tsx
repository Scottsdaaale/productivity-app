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
    <div>
      <h1 className='text-green-300'>Note Taker</h1>
      <textarea
        value={newNote}
        onChange={handleInputChange}
        placeholder="Enter a new note"
        rows={5}
      />
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {note.text}
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;