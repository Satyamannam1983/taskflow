// Centralized data management for TaskFlow
// Ensures consistency across all pages and components

export interface Board {
  id: string;
  name: string;
  description: string;
  cards: number;
  lists: number;
  lastActivity: string;
  color?: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards: Card[];
  color: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  listId: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels: string[];
  assignees: User[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
  lastLoginAt?: string;
}

// Mock data with consistent structure
export const mockBoards: Board[] = [
  {
    id: 'board-1',
    name: 'Sprint Planning',
    description: 'Agile sprint planning and tracking for development teams',
    cards: 24,
    lists: 5,
    lastActivity: '2 hours ago',
    color: 'blue',
    progress: 68,
    createdAt: '2024-04-15T10:30:00Z',
    updatedAt: '2024-04-16T14:20:00Z'
  },
  {
    id: 'board-2',
    name: 'Product Roadmap',
    description: 'Long-term product development planning and feature tracking',
    cards: 18,
    lists: 4,
    lastActivity: '1 hour ago',
    color: 'green',
    progress: 45,
    createdAt: '2024-04-10T09:15:00Z',
    updatedAt: '2024-04-16T11:45:00Z'
  },
  {
    id: 'board-3',
    name: 'Bug Tracker',
    description: 'Issue tracking and resolution management for quality assurance',
    cards: 31,
    lists: 6,
    lastActivity: '30 minutes ago',
    color: 'red',
    progress: 82,
    createdAt: '2024-04-08T16:45:00Z',
    updatedAt: '2024-04-16T13:30:00Z'
  },
  {
    id: 'board-4',
    name: 'Marketing Campaign',
    description: 'Campaign planning and execution tracking for marketing initiatives',
    cards: 12,
    lists: 3,
    lastActivity: '3 hours ago',
    color: 'purple',
    progress: 35,
    createdAt: '2024-04-12T11:20:00Z',
    updatedAt: '2024-04-15T16:10:00Z'
  },
  {
    id: 'board-5',
    name: 'Design System',
    description: 'UI/UX design system documentation and component library',
    cards: 8,
    lists: 2,
    lastActivity: '5 hours ago',
    color: 'orange',
    progress: 90,
    createdAt: '2024-04-05T14:30:00Z',
    updatedAt: '2024-04-14T10:15:00Z'
  }
];

export const mockLists: List[] = [
  {
    id: 'list-1',
    title: 'Backlog',
    position: 0,
    boardId: 'board-1',
    cards: [
      {
        id: 'card-1',
        title: 'Implement user authentication',
        description: 'Add OAuth2.0 integration with Google, GitHub, and Microsoft',
        position: 0,
        listId: 'list-1',
        priority: 'high',
        labels: ['feature', 'backend'],
        assignees: [],
        createdAt: '2024-04-15T10:30:00Z',
        updatedAt: '2024-04-16T14:20:00Z'
      },
      {
        id: 'card-2',
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        position: 1,
        listId: 'list-1',
        priority: 'medium',
        labels: ['devops', 'automation'],
        assignees: [],
        createdAt: '2024-04-15T11:45:00Z',
        updatedAt: '2024-04-16T13:30:00Z'
      }
    ],
    color: 'red',
    createdAt: '2024-04-15T10:00:00Z'
  },
  {
    id: 'list-2',
    title: 'In Progress',
    position: 1,
    boardId: 'board-1',
    cards: [
      {
        id: 'card-3',
        title: 'Design responsive layouts',
        description: 'Create mobile-first responsive designs for all components',
        position: 0,
        listId: 'list-2',
        priority: 'medium',
        labels: ['design', 'frontend'],
        assignees: [],
        createdAt: '2024-04-14T16:20:00Z',
        updatedAt: '2024-04-16T12:15:00Z'
      },
      {
        id: 'card-4',
        title: 'Implement drag and drop',
        description: 'Add drag-and-drop functionality for cards and lists',
        position: 1,
        listId: 'list-2',
        priority: 'high',
        labels: ['feature', 'frontend'],
        assignees: [],
        createdAt: '2024-04-13T09:30:00Z',
        updatedAt: '2024-04-16T10:45:00Z'
      }
    ],
    color: 'yellow',
    createdAt: '2024-04-15T10:00:00Z'
  },
  {
    id: 'list-3',
    title: 'Testing',
    position: 2,
    boardId: 'board-1',
    cards: [
      {
        id: 'card-5',
        title: 'Write unit tests',
        description: 'Create comprehensive unit tests for authentication and board components',
        position: 0,
        listId: 'list-3',
        priority: 'medium',
        labels: ['testing', 'quality'],
        assignees: [],
        createdAt: '2024-04-12T14:20:00Z',
        updatedAt: '2024-04-16T11:45:00Z'
      },
      {
        id: 'card-6',
        title: 'Performance testing',
        description: 'Test application performance and optimize loading times',
        position: 1,
        listId: 'list-3',
        priority: 'low',
        labels: ['performance', 'optimization'],
        assignees: [],
        createdAt: '2024-04-11T16:45:00Z',
        updatedAt: '2024-04-16T09:30:00Z'
      }
    ],
    color: 'green',
    createdAt: '2024-04-15T10:00:00Z'
  }
];

export const mockCards: Card[] = mockLists.flatMap(list => list.cards);

// Data access functions
export const getBoards = (): Board[] => mockBoards;
export const getBoardById = (id: string): Board | undefined => mockBoards.find(board => board.id === id);
export const getListsByBoardId = (boardId: string): List[] => mockLists.filter(list => list.boardId === boardId);
export const getCardsByBoardId = (boardId: string): Card[] => mockCards.filter(card => {
  const list = mockLists.find(l => l.id === card.listId);
  return Boolean(list && list.boardId === boardId);
});
export const getAllLists = (): List[] => mockLists;
export const getAllCards = (): Card[] => mockCards;

// Statistics functions
export const getTotalStats = () => ({
  totalBoards: mockBoards.length,
  totalCards: mockCards.length,
  totalLists: mockLists.length,
  avgCardsPerBoard: Math.round(mockCards.length / mockBoards.length),
  avgListsPerBoard: Math.round(mockLists.length / mockBoards.length),
  boardsWithRecentActivity: mockBoards.filter(board => {
    const activityTime = new Date(board.updatedAt);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return activityTime > oneHourAgo;
  }).length
});

// Search and filter functions
export const searchBoards = (boards: Board[], query: string): Board[] => {
  if (!query.trim()) return boards;
  const lowercaseQuery = query.toLowerCase();
  return boards.filter(board => 
    board.name.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterBoardsByColor = (boards: Board[], color: string): Board[] => {
  if (!color || color === 'all') return boards;
  return boards.filter(board => board.color === color);
};

export const sortBoards = (boards: Board[], sortBy: 'name' | 'createdAt' | 'updatedAt' | 'cards' | 'progress'): Board[] => {
  const sorted = [...boards];
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'createdAt':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'updatedAt':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    case 'cards':
      return sorted.sort((a, b) => b.cards - a.cards);
    case 'progress':
      return sorted.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    default:
      return sorted;
  }
};
