'use client';

import Card from './Card';

interface CardData {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
}

interface ListProps {
  id: number;
  title: string;
  cards: CardData[];
  onAddCard: (listId: number) => void;
  onDeleteList: (listId: number) => void;
}

export default function List({ id, title, cards, onAddCard, onDeleteList }: ListProps) {
  const handleDeleteList = () => {
    if (confirm(`Are you sure you want to delete the "${title}" list?`)) {
      onDeleteList(id);
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0 shadow-sm">
      {/* List Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {cards.length}
          </span>
          <button
            onClick={handleDeleteList}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
            title="Delete list"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2 min-h-[100px]">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            dueDate={card.dueDate}
            listId={id}
            onClick={() => {
              // Future: Open detailed modal
              alert(`Card: ${card.title}\n\n${card.description || 'No description'}`);
            }}
          />
        ))}
        
        {cards.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No cards in this list
          </div>
        )}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => onAddCard(id)}
        className="mt-3 w-full text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
      >
        + Add card
      </button>
    </div>
  );
}
