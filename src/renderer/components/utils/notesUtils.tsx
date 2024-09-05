import { useState, useEffect, useCallback } from 'react';
import { getNotes, createNote, updateNote, deleteNote, Note } from '../api/notesRoutes';

export const useNotes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [currentNoteTitle, setCurrentNoteTitle] = useState<string>('');
    const [currentNoteContent, setCurrentNoteContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getNotes();
            const sortedNotes = data.notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setNotes(sortedNotes);
        } catch (error) {
            setError('Failed to fetch notes');
            console.error('Failed to fetch notes:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    useEffect(() => {
        if (notes.length > 0 && selectedNoteId === null) {
            const newestNote = notes[0];
            selectNote(newestNote.id);
        }
    }, [notes, selectedNoteId]);

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

    const selectNote = (id: number) => {
        setSelectedNoteId(id);
        const selectedNote = notes.find((note) => note.id === id);
        if (selectedNote) {
            setCurrentNoteTitle(selectedNote.title);
            setCurrentNoteContent(selectedNote.content);
        }
    };

    const addNote = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createNote('New Note', '');
            if (response.message === 'Note created successfully' && response.note) {
                const newNote = response.note;
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

    return {
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
    };
};

export const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}