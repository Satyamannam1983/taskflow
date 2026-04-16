'use client';

import { useState } from 'react';

interface AddListButtonProps {
  onAddList: (title: string) => Promise<void>;
}

export default function AddListButton({ onAddList }: AddListButtonProps) {
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;

    setIsAddingList(true);
    try {
      await onAddList(newListTitle);
      setNewListTitle('');
      setShowAddList(false);
    } catch (error) {
      console.error('Failed to add list:', error);
    } finally {
      setIsAddingList(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddList();
    } else if (e.key === 'Escape') {
      setShowAddList(false);
      setNewListTitle('');
    }
  };

  return (
    <div className="w-72 flex-shrink-0">
      {!showAddList ? (
        <button
          onClick={() => setShowAddList(true)}
          className="w-full h-32 bg-gray-200 hover:bg-gray-300 rounded-lg p-4 text-gray-600 hover:text-gray-800 transition-colors border-2 border-dashed border-gray-400 flex items-center justify-center"
        >
          <span className="text-lg font-medium">+ Add another list</span>
        </button>
      ) : (
        <div className="bg-gray-100 rounded-lg p-4 shadow-sm border border-gray-200">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
            onKeyDown={handleKeyPress}
            disabled={isAddingList}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddList}
              disabled={!newListTitle.trim() || isAddingList}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isAddingList ? 'Adding...' : 'Add list'}
            </button>
            <button
              onClick={() => {
                setShowAddList(false);
                setNewListTitle('');
              }}
              disabled={isAddingList}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
