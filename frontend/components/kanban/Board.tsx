'use client';

import { useState } from 'react';
import List from './List';
import AddListForm from './AddListForm';

interface Card {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  listId: number;
}

interface ListData {
  id: number;
  title: string;
  position: number;
  boardId: number;
  cards: Card[];
}

interface BoardProps {
  lists: ListData[];
  onAddList: (title: string) => void;
  onAddCard: (listId: number) => void;
  onDeleteList: (listId: number) => void;
}

export default function Board({ lists, onAddList, onAddCard, onDeleteList }: BoardProps) {
  const [showAddList, setShowAddList] = useState(false);

  const handleAddList = (title: string) => {
    onAddList(title);
    setShowAddList(false);
  };

  const handleCancelAddList = () => {
    setShowAddList(false);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {/* Lists */}
      {lists.map((list) => (
        <List
          key={list.id}
          id={list.id}
          title={list.title}
          cards={list.cards}
          onAddCard={onAddCard}
          onDeleteList={onDeleteList}
        />
      ))}

      {/* Add List Button/Form */}
      {showAddList ? (
        <AddListForm
          onAddList={handleAddList}
          onCancel={handleCancelAddList}
        />
      ) : (
        <button
          onClick={() => setShowAddList(true)}
          className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 w-72 flex-shrink-0 text-gray-600 hover:text-gray-800 transition-colors border-2 border-dashed border-gray-400 flex items-center justify-center"
        >
          <span className="text-lg font-medium">+ Add another list</span>
        </button>
      )}
    </div>
  );
}
