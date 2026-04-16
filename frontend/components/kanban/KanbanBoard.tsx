'use client';

import { useState } from 'react';
import { cardStyles, buttonStyles } from '@/components/design-system/DesignSystem';
import KanbanList from './KanbanList';

interface Card {
  id: string | number;
  title: string;
  description?: string;
  position: number;
  listId: string | number;
  dueDate?: string;
}

interface List {
  id: string | number;
  title: string;
  position: number;
  boardId: string | number;
  cards: Card[];
}

interface BoardData {
  id: string | number;
  title: string;
  lists: List[];
}

interface KanbanBoardProps {
  board: BoardData;
  onAddList: (title: string, boardId: string | number) => Promise<void>;
  onAddCard: (title: string, listId: string | number) => Promise<void>;
  onDeleteList: (listId: string | number) => Promise<void>;
}

export default function KanbanBoard({ board, onAddList, onAddCard, onDeleteList }: KanbanBoardProps) {
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;

    setIsAddingList(true);
    try {
      await onAddList(newListTitle, board.id);
      setNewListTitle('');
      setShowAddList(false);
    } catch (error) {
      console.error('Failed to add list:', error);
    } finally {
      setIsAddingList(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="bg-white border-b border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{board.title}</h1>
            <span className="text-sm text-gray-500">
              {board.lists?.length || 0} lists
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className={buttonStyles.ghost}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className={buttonStyles.ghost}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Lists Container */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-4 h-full">
          {board.lists?.map((list) => (
            <KanbanList
              key={list.id}
              list={list}
              onAddCard={onAddCard}
              onDeleteList={onDeleteList}
            />
          ))}

          {/* Add List Form */}
          {showAddList && (
            <div className={`
              ${cardStyles.base}
              w-72
              p-4
              border-2 border-blue-300
              shadow-sm
            `}>
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddList}
                  disabled={!newListTitle.trim() || isAddingList}
                  className={`
                    ${buttonStyles.primary}
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                  `}
                >
                  {isAddingList ? 'Adding...' : 'Add list'}
                </button>
                <button
                  onClick={() => {
                    setShowAddList(false);
                    setNewListTitle('');
                  }}
                  className={buttonStyles.secondary}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add List Button */}
          {!showAddList && (
            <button
              onClick={() => setShowAddList(true)}
              className={`
                ${cardStyles.base}
                w-72
                flex-shrink-0
                border-2 border-dashed border-gray-300
                hover:border-gray-400
                hover:bg-gray-50
                flex flex-col items-center justify-center
                min-h-[200px]
                transition-colors duration-150
              `}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Add another list</h3>
              <p className="text-sm text-gray-500">Create a new list</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
