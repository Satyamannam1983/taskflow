'use client';

import { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Board from '@/components/kanban/Board';
import SearchAndFilter from '@/components/kanban/SearchAndFilter';

interface Card {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  listId: number;
  position: number;
}

interface List {
  id: number;
  title: string;
  position: number;
  boardId: number;
  cards: Card[];
}

interface BoardData {
  id: number;
  title: string;
  lists: List[];
}

export default function ModularKanbanBoard() {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedDueDates, setSelectedDueDates] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    try {
      // Simulate API call - in real app, this would fetch from backend
      const mockBoard: BoardData = {
        id: 1,
        title: 'My Trello Board',
        lists: [
          {
            id: 1,
            title: 'To Do',
            position: 0,
            boardId: 1,
            cards: [
              {
                id: 1,
                title: 'Bug: Fix login issue',
                description: 'Users cannot login with correct credentials',
                position: 0,
                listId: 1,
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
              },
              {
                id: 2,
                title: 'Feature: Add dark mode',
                description: 'Implement dark mode toggle for better UX',
                position: 1,
                listId: 1,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 3,
                title: 'Enhancement: Improve performance',
                description: 'Optimize app loading time',
                position: 2,
                listId: 1,
                dueDate: new Date().toISOString(), // Due today
              },
            ]
          },
          {
            id: 2,
            title: 'In Progress',
            position: 1,
            boardId: 1,
            cards: [
              {
                id: 4,
                title: 'Documentation: Update API docs',
                description: 'Add new endpoints to documentation',
                position: 0,
                listId: 2,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 5,
                title: 'Bug: Memory leak fix',
                description: 'Investigate and fix memory leak in charts',
                position: 1,
                listId: 2,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              },
            ]
          },
          {
            id: 3,
            title: 'Done',
            position: 2,
            boardId: 1,
            cards: [
              {
                id: 6,
                title: 'Feature: User profile page',
                description: 'Create comprehensive user profile management',
                position: 0,
                listId: 3,
                dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              },
            ]
          },
        ]
      };
      
      setBoard(mockBoard);
    } catch (error) {
      console.error('Failed to fetch board:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = useMemo(() => {
    if (!board) return [];
    
    return board.lists.flatMap(list => 
      list.cards.filter(card => {
        // Search filter
        if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Label filter (simulated based on title)
        if (selectedLabels.length > 0) {
          const hasLabel = selectedLabels.some(label => {
            if (label === 'bug' && card.title.toLowerCase().includes('bug')) return true;
            if (label === 'feature' && card.title.toLowerCase().includes('feature')) return true;
            if (label === 'enhancement' && card.title.toLowerCase().includes('enhancement')) return true;
            if (label === 'documentation' && card.title.toLowerCase().includes('documentation')) return true;
            return false;
          });
          if (!hasLabel) return false;
        }
        
        // Due date filter
        if (selectedDueDates.length > 0 && card.dueDate) {
          const dueDate = new Date(card.dueDate);
          const now = new Date();
          const isOverdue = dueDate < now;
          const isToday = dueDate.toDateString() === now.toDateString();
          const isThisWeek = dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const isThisMonth = dueDate <= new Date(now.getFullYear(), now.getMonth() + 1, 0);
          
          const matchesDueDate = selectedDueDates.some(option => {
            if (option === 'overdue' && isOverdue) return true;
            if (option === 'today' && isToday) return true;
            if (option === 'week' && isThisWeek) return true;
            if (option === 'month' && isThisMonth) return true;
            return false;
          });
          
          if (!matchesDueDate) return false;
        }
        
        return true;
      })
    );
  }, [board, searchQuery, selectedLabels, selectedDueDates, selectedMembers]);

  const filteredBoard = useMemo(() => {
    if (!board) return null;
    
    const filteredLists = board.lists.map(list => ({
      ...list,
      cards: list.cards.filter(card => 
        filteredCards.some(filteredCard => filteredCard.id === card.id)
      )
    })).filter(list => list.cards.length > 0 || searchQuery || selectedLabels.length > 0 || selectedDueDates.length > 0 || selectedMembers.length > 0);
    
    return {
      ...board,
      lists: filteredLists
    };
  }, [board, filteredCards, selectedMembers]);

  const addList = (title: string) => {
    // In real app, this would call API
    const newList: List = {
      id: Date.now(),
      title,
      position: board?.lists.length || 0,
      boardId: 1,
      cards: []
    };
    
    setBoard(prev => prev ? {
      ...prev,
      lists: [...prev.lists, newList]
    } : null);
  };

  const addCard = (listId: number) => {
    const title = prompt('Enter card title:');
    if (!title?.trim()) return;
    
    // In real app, this would call API
    const newCard: Card = {
      id: Date.now(),
      title,
      description: '',
      position: 0,
      listId,
    };
    
    setBoard(prev => prev ? {
      ...prev,
      lists: prev.lists.map(list => 
        list.id === listId 
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    } : null);
  };

  const deleteList = (listId: number) => {
    // In real app, this would call API
    setBoard(prev => prev ? {
      ...prev,
      lists: prev.lists.filter(list => list.id !== listId)
    } : null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-500">Board not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      {/* Search and Filter Bar */}
      <div className="px-6 py-4">
        <SearchAndFilter
          onSearch={setSearchQuery}
          onLabelFilter={setSelectedLabels}
          onDueDateFilter={setSelectedDueDates}
          onMemberFilter={setSelectedMembers}
        />
      </div>

      {/* Board Content */}
      <div className="px-6 py-4">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{board.title}</h1>
        </div>

        <Board 
          lists={filteredBoard?.lists || board.lists}
          onAddList={addList}
          onAddCard={addCard}
          onDeleteList={deleteList}
        />

        {/* No Results Message */}
        {filteredBoard && filteredBoard.lists.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cards found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
