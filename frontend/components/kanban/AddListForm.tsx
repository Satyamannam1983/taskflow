'use client';

import { useState } from 'react';

interface AddListFormProps {
  onAddList: (title: string) => void;
  onCancel: () => void;
}

export default function AddListForm({ onAddList, onCancel }: AddListFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddList(title.trim());
      setTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
      setTitle('');
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0 shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Add list
          </button>
          <button
            type="button"
            onClick={() => {
              onCancel();
              setTitle('');
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
