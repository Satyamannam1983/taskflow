'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import DragDropProvider from './DragDropContext';
import DroppableList from './DroppableList';
import AddListButton from './AddListButton';
import { Card, ListData } from './types';

interface DraggableBoardProps {
  lists: ListData[];
  onAddList: (title: string, boardId: number) => Promise<void>;
  onAddCard: (title: string, listId: number) => Promise<void>;
  onDeleteList: (listId: number) => Promise<void>;
  boardId: number;
}

function DraggableBoardContent({ 
  lists, 
  onAddList, 
  onAddCard, 
  onDeleteList, 
  boardId 
}: DraggableBoardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleCardMove = async (cardId: number, newListId: number, newPosition: number) => {
    // In a real app, this would update the backend
    console.log('Moving card:', { cardId, newListId, newPosition });
    
    // For now, we'll just simulate the move
    // The parent component would handle the actual state update
  };

  const handleListReorder = async (listIds: number[]) => {
    // In a real app, this would update the backend
    console.log('Reordering lists:', listIds);
  };

  const handleCardReorder = async (listId: number, cardIds: number[]) => {
    // In a real app, this would update the backend
    console.log('Reordering cards:', { listId, cardIds });
  };

  return (
    <DragDropProvider
      onCardMove={handleCardMove}
      onListReorder={handleListReorder}
      onCardReorder={handleCardReorder}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 px-2">
        <SortableContext 
          items={lists.map(list => `list-${list.id}`)} 
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list) => (
            <DroppableList
              key={list.id}
              id={list.id}
              title={list.title}
              cards={list.cards}
              onAddCard={onAddCard}
              onDeleteList={onDeleteList}
            />
          ))}
        </SortableContext>

        <AddListButton 
          onAddList={(title) => onAddList(title, boardId)} 
        />
      </div>
    </DragDropProvider>
  );
}

export default function DraggableBoard(props: DraggableBoardProps) {
  return <DraggableBoardContent {...props} />;
}
