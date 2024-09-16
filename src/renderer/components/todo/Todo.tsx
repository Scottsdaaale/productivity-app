// todo.tsx
import React, { useState } from 'react'
import TodoList from './TodoList'
import TodoSidebar from './TodoSidebar'

function Todo() {
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

    return (
        <div className="flex bg-blue-100">
            <TodoSidebar onFolderSelect={setSelectedFolderId} />
            <TodoList selectedFolderId={selectedFolderId} />
        </div>
    )
}

export default Todo