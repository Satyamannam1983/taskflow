'use client';

import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, 
         closestCenter, PointerSensor, useSensor, useSensors, 
         DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, 
         horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';

interface DragDropContextProps {
  children: React.ReactNode;
  onCardMove: (cardId: number, newListId: number, newPosition: number) => Promise<void>;
  onListReorder: (listIds: number[]) => Promise<void>;
  onCardReorder: (listId: number, cardIds: number[]) => Promise<void>;
}

interface Card {
  id: number;
  title: string;
  description?: string;
  position: number;
  dueDate?: string;
  listId: number;
}

interface List {
  id: number;
  title: string;
  position: number;
  boardId: number;
  cards: Card[];
}

export default function DragDropProvider({ 
  children, 
  onCardMove, 
  onListReorder, 
  onCardReorder 
}: DragDropContextProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveData(event.active.data.current);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveData(null);
      return;
    }

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // Handle list reordering
    if (activeData?.type === 'list' && over.data?.current?.type === 'list') {
      const oldIndex = activeData.index;
      const newIndex = over.data.current.index;
      
      if (oldIndex !== newIndex) {
        // This would be handled by the parent component
        // For now, we'll just log it
        console.log('List reorder:', { oldIndex, newIndex });
      }
    }

    // Handle card movement
    if (activeData?.type === 'card') {
      const cardId = parseInt(activeIdStr.replace('card-', ''));
      const overData = over.data.current;
      
      if (overData?.type === 'list') {
        // Moving card to a different list
        const newListId = parseInt(overIdStr.replace('list-', ''));
        const newPosition = overData.cardCount || 0;
        
        try {
          await onCardMove(cardId, newListId, newPosition);
        } catch (error) {
          console.error('Failed to move card:', error);
        }
      } else if (overData?.type === 'card') {
        // Reordering cards within the same list or moving to another list
        const overCardId = parseInt(overIdStr.replace('card-', ''));
        const overListId = overData.listId;
        const overPosition = overData.position;
        
        try {
          await onCardMove(cardId, overListId, overPosition);
        } catch (error) {
          console.error('Failed to move card:', error);
        }
      }
    }

    setActiveId(null);
    setActiveData(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {children}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeId && activeData?.type === 'card' && (
          <div className="bg-white p-3 rounded shadow-lg border-2 border-blue-400 opacity-90 rotate-2 transform">
            <h3 className="text-sm font-medium text-gray-800">{activeData.title}</h3>
            {activeData.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{activeData.description}</p>
            )}
          </div>
        )}
        {activeId && activeData?.type === 'list' && (
          <div className="bg-gray-100 p-4 w-72 rounded-lg shadow-lg border-2 border-blue-400 opacity-90">
            <h2 className="font-semibold text-gray-700">{activeData.title}</h2>
            <div className="text-xs text-gray-500 mt-1">
              {activeData.cardCount} cards
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
