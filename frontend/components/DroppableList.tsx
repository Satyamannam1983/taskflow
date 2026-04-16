'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableCard from './DraggableCard';
import { Card } from './types';

interface DroppableListProps {
  id: number;
  title: string;
  cards: Card[];
  onAddCard: (title: string, listId: number) => Promise<void>;
  onDeleteList: (listId: number) => Promise<void>;
}

export default function DroppableList({ id, title, cards, onAddCard, onDeleteList }: DroppableListProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `list-${id}`,
    data: {
      type: 'list',
      listId: id,
      cardCount: cards.length
    }
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0 shadow-sm transition-all ${
        isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {cards.length}
          </span>
          <button
            onClick={() => onDeleteList(id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
            title="Delete list"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <SortableContext 
        items={cards.map(card => `card-${card.id}`)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 min-h-[100px]">
          {cards.map((card) => (
            <DraggableCard 
              key={card.id}
              card={card}
            />
          ))}
          
          {cards.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              {isOver ? 'Drop card here' : 'No cards in this list'}
            </div>
          )}
        </div>
      </SortableContext>

      <button 
        onClick={() => {
          const title = prompt('Enter card title:');
          if (title) {
            onAddCard(title, id);
          }
        }}
        className="mt-3 w-full text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
      >
        + Add card
      </button>
    </div>
  );
}
