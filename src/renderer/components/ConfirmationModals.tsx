import React from 'react';

interface ConfirmationModalsProps {
    showDeleteConfirmation: boolean;
    showDeleteFolderConfirmation: boolean;
    deleteNoteHandler: () => void;
    handleDeleteFolder: () => void;
    setShowDeleteConfirmation: (show: boolean) => void;
    setShowDeleteFolderConfirmation: (show: boolean) => void;
}

const ConfirmationModals: React.FC<ConfirmationModalsProps> = ({
    showDeleteConfirmation,
    showDeleteFolderConfirmation,
    deleteNoteHandler,
    handleDeleteFolder,
    setShowDeleteConfirmation,
    setShowDeleteFolderConfirmation
}) => {
    return (
        <>
            {/* Delete Note Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this note?</h2>
                        <div className="flex justify-end">
                            <button onClick={deleteNoteHandler} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Delete</button>
                            <button onClick={() => setShowDeleteConfirmation(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Folder Confirmation Modal */}
            {showDeleteFolderConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this folder?</h2>
                        <p className="mb-4 text-red-600">This will also delete all notes inside the folder.</p>
                        <div className="flex justify-end">
                            <button onClick={handleDeleteFolder} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Delete</button>
                            <button onClick={() => setShowDeleteFolderConfirmation(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConfirmationModals;