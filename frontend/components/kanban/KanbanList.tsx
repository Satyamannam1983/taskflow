'use client';

import { useState } from 'react';
import { cardStyles, buttonStyles } from '@/components/design-system/DesignSystem';
import AddListButton from '../AddListButton';

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

interface KanbanListProps {
  list: List;
  onAddCard: (title: string, listId: string | number) => Promise<void>;
  onDeleteList: (listId: string | number) => Promise<void>;
  isLast?: boolean;
}

export default function KanbanList({ list, onAddCard, onDeleteList, isLast = false }: KanbanListProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;

    setIsAddingCard(true);
    try {
      await onAddCard(newCardTitle, list.id);
      setNewCardTitle('');
      setShowAddCard(false);
    } catch (error) {
      console.error('Failed to add card:', error);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDeleteList = async () => {
    try {
      await onDeleteList(list.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  };

  return (
    <div className="flex-shrink-0 w-72">
      <div className={`
        ${cardStyles.base}
        h-full
        flex flex-col
      `}>
        {/* List Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{list.title}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {list.cards?.length || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowAddCard(true)}
              className={buttonStyles.ghost}
              title="Add card"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={buttonStyles.ghost}
              title="Delete list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="flex-1 p-3 space-y-2 min-h-[200px]">
          {list.cards?.map((card) => (
            <div
              key={card.id}
              className={`
                ${cardStyles.base}
                ${cardStyles.interactive}
                p-3
                cursor-pointer
                hover:shadow-sm
                border border-gray-200
              `}
            >
              <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                {card.title}
              </h4>
              {card.description && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {card.description}
                </p>
              )}
              {card.dueDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(card.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}

          {/* Add Card Form */}
          {showAddCard && (
            <div className={`
              ${cardStyles.base}
              p-3
              border-2 border-blue-300
              shadow-sm
            `}>
              <input
                type="text"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Enter card title..."
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCard}
                  disabled={!newCardTitle.trim() || isAddingCard}
                  className={`
                    ${buttonStyles.primary}
                    text-xs
                    px-3 py-1
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                  `}
                >
                  {isAddingCard ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setShowAddCard(false);
                    setNewCardTitle('');
                  }}
                  className={`
                    ${buttonStyles.secondary}
                    text-xs
                    px-3 py-1
                  `}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add Card Button */}
          {!showAddCard && (
            <button
              onClick={() => setShowAddCard(true)}
              className={`
                w-full
                p-2
                text-left
                text-sm
                text-gray-600
                hover:text-gray-900
                hover:bg-gray-50
                rounded-md
                transition-colors duration-150
                border border-dashed border-gray-300
                hover:border-gray-400
              `}
            >
              + Add card
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`
            ${cardStyles.base}
            w-full max-w-sm p-6
          `}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete List
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{list.title}"? This will also delete all cards in this list.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={buttonStyles.secondary}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteList}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
