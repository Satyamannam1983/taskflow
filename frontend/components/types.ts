export interface Card {
  id: number;
  title: string;
  description?: string;
  position: number;
  dueDate?: string;
  listId: number;
}

export interface ListData {
  id: number;
  title: string;
  position: number;
  boardId: number;
  cards: Card[];
}

export interface BoardData {
  id: number;
  title: string;
  lists: ListData[];
}
