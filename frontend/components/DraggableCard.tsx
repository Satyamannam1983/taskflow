'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from './Card';
import { Card as CardType } from './types';

interface DraggableCardProps {
  card: CardType;
}

export default function DraggableCard({ card }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `card-${card.id}`,
    data: {
      type: 'card',
      card,
      listId: card.listId,
      position: card.position,
      title: card.title,
      description: card.description
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div {...listeners}>
        <Card 
          id={card.id}
          title={card.title}
          description={card.description}
          position={card.position}
          dueDate={card.dueDate}
          listId={card.listId}
        />
      </div>
    </div>
  );
}
