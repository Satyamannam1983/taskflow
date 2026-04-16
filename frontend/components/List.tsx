'use client';

import { useState } from 'react';
import Card from './Card';

interface Card {
  id: number;
  title: string;
  description?: string;
  position: number;
  dueDate?: string;
}

interface ListProps {
  id: number;
  title: string;
  cards: Card[];
  onAddCard: (title: string, listId: number) => Promise<void>;
  onDeleteList: (listId: number) => Promise<void>;
}

export default function List({ id, title, cards, onAddCard, onDeleteList }: ListProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;

    setIsAddingCard(true);
    try {
      await onAddCard(newCardTitle, id);
      setNewCardTitle('');
      setShowAddCard(false);
    } catch (error) {
      console.error('Failed to add card:', error);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDeleteList = async () => {
    if (!confirm('Are you sure you want to delete this list and all its cards?')) return;

    setIsDeleting(true);
    try {
      await onDeleteList(id);
    } catch (error) {
      console.error('Failed to delete list:', error);
      setIsDeleting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      setShowAddCard(false);
      setNewCardTitle('');
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 w-72 flex-shrink-0 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-gray-700">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {cards.length}
          </span>
          <button
            onClick={handleDeleteList}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete list"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-2 min-h-[100px]">
        {cards.map((card) => (
          <Card 
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            position={card.position}
            dueDate={card.dueDate}
            listId={id}
          />
        ))}
        
        {cards.length === 0 && !showAddCard && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No cards in this list
          </div>
        )}

        {showAddCard && (
          <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter card title..."
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              autoFocus
              onKeyDown={handleKeyPress}
              disabled={isAddingCard}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                disabled={!newCardTitle.trim() || isAddingCard}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingCard ? 'Adding...' : 'Add card'}
              </button>
              <button
                onClick={() => {
                  setShowAddCard(false);
                  setNewCardTitle('');
                }}
                disabled={isAddingCard}
                className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {!showAddCard && (
        <button 
          onClick={() => setShowAddCard(true)}
          className="mt-3 w-full text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded transition-colors"
        >
          + Add card
        </button>
      )}
    </div>
  );
}
