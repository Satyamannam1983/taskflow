'use client';

import DraggableBoard from './DraggableBoard';
import { Card, ListData } from './types';

interface BoardProps {
  lists: ListData[];
  onAddList: (title: string, boardId: number) => Promise<void>;
  onAddCard: (title: string, listId: number) => Promise<void>;
  onDeleteList: (listId: number) => Promise<void>;
  boardId: number;
}

export default function Board({ lists, onAddList, onAddCard, onDeleteList, boardId }: BoardProps) {
  return (
    <DraggableBoard
      lists={lists}
      onAddList={onAddList}
      onAddCard={onAddCard}
      onDeleteList={onDeleteList}
      boardId={boardId}
    />
  );
}
