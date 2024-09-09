import React from 'react';
import TiptapEditor from './Tiptap';

interface MainContentProps {
    currentNoteTitle: string;
    currentNoteContent: string;
    setCurrentNoteTitle: (title: string) => void;
    setCurrentNoteContent: (content: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
    currentNoteTitle,
    currentNoteContent,
    setCurrentNoteTitle,
    setCurrentNoteContent
}) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
            <input
                type="text"
                value={currentNoteTitle}
                onChange={(e) => setCurrentNoteTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full p-4 text-xl font-semibold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <div className="flex-1">
                <TiptapEditor
                    content={currentNoteContent}
                    onUpdate={(content) => setCurrentNoteContent(content)}
                />
            </div>
        </div>
    );
};

export default MainContent;