'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import SearchAndFilter from '@/components/SearchAndFilter';
import { Card, BoardData } from '@/components/types';

export default function BoardPage() {
  const params = useParams();
  const boardId = params?.id as string;
  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  console.log('BoardPage: Component mounted with boardId:', boardId);

  const fetchBoard = async () => {
    console.log('BoardPage: Fetching board data for ID:', boardId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('BoardPage: API URL:', apiUrl);
      const response = await fetch(`${apiUrl}/boards/${boardId}`);
      console.log('BoardPage: Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch board: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('BoardPage: Fetched board data:', data);
      
      // Add sample cards for demonstration
      const boardWithCards = {
        ...data,
        lists: data.lists.map((list: any, index: number) => ({
          ...list,
          cards: index === 0 ? [
            { 
              id: 1, 
              title: 'Bug: Login button not working', 
              description: 'Users report that the login button is unresponsive on mobile devices. This needs immediate attention.', 
              position: 0, 
              listId: list.id,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
            },
            { 
              id: 2, 
              title: 'Feature: Add dark mode support', 
              description: 'Implement dark mode toggle for better user experience in low-light conditions.', 
              position: 1, 
              listId: list.id 
            },
            { 
              id: 3, 
              title: 'Enhancement: Improve search performance', 
              description: 'Optimize search queries to reduce response time from 2s to under 500ms.', 
              position: 2, 
              listId: list.id,
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
            },
            {
              id: 6,
              title: 'Documentation: Update API docs',
              description: 'Update the API documentation to include the new endpoints and authentication methods.',
              position: 3,
              listId: list.id
            }
          ] : index === 1 ? [
            { 
              id: 4, 
              title: 'In Progress: Dashboard redesign', 
              description: 'Currently working on the new dashboard design with improved analytics.', 
              position: 0, 
              listId: list.id,
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 day from now
            },
            {
              id: 5,
              title: 'Feature: Real-time notifications',
              description: 'Implement WebSocket-based real-time notifications for better user engagement.',
              position: 1,
              listId: list.id,
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
            },
            {
              id: 7,
              title: 'Bug: Memory leak in charts',
              description: 'Investigate and fix memory leak when rendering multiple charts on the dashboard.',
              position: 2,
              listId: list.id
            }
          ] : []
        }))
      };
      
      setBoard(boardWithCards);
      console.log('BoardPage: Board data set successfully');
    } catch (err) {
      console.error('BoardPage: Error fetching board:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      console.log('BoardPage: Loading completed');
    }
  };

  const addList = async (title: string, boardId: string | number) => {
    console.log('BoardPage: addList called with title:', title, 'boardId:', boardId);
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login first to add lists');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          boardId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const newList = await response.json();
      console.log('BoardPage: List created successfully:', newList);
      setBoard(prev => prev ? {
        ...prev,
        lists: [...prev.lists, { ...newList, cards: [] }]
      } : null);
    } catch (err) {
      console.error('BoardPage: Error creating list:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create list');
    }
  };

  const addCard = async (title: string, listId: string | number) => {
    console.log('BoardPage: addCard called with title:', title, 'listId:', listId);
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login first to add cards');
      return;
    }

    try {
      // For now, we'll simulate card creation since the backend doesn't have card endpoints yet
      const newCard = {
        id: Date.now(), // Temporary ID
        title,
        description: '',
        position: 0,
        listId: typeof listId === 'number' ? listId : parseInt(listId as string)
      };

      console.log('BoardPage: Card created (simulated):', newCard);
      setBoard(prev => prev ? {
        ...prev,
        lists: prev.lists.map(list => 
          list.id === listId 
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      } : null);
    } catch (err) {
      console.error('BoardPage: Error creating card:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create card');
    }
  };

  const deleteList = async (listId: string | number) => {
    console.log('BoardPage: deleteList called with listId:', listId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/lists/${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      console.log('BoardPage: List deleted successfully');
      setBoard(prev => prev ? {
        ...prev,
        lists: prev.lists.filter(list => list.id !== listId)
      } : null);
    } catch (err) {
      console.error('BoardPage: Error deleting list:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to delete list');
    }
  };

  // Fetch board data when component mounts
  useEffect(() => {
    console.log('BoardPage: useEffect triggered, boardId:', boardId);
    if (boardId) {
      fetchBoard();
    } else {
      console.error('BoardPage: No boardId provided');
      setError('No board ID provided');
      setLoading(false);
    }
  }, [boardId]);

  const filterCards = (cards: Card[]) => {
    return cards.filter(card => {
      // Search by title
      if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by labels (simulated - in real app, cards would have label relationships)
      if (selectedLabels.length > 0) {
        // For demo, we'll simulate labels based on card content
        const hasLabel = selectedLabels.some(labelId => {
          if (labelId === '1' && card.title.toLowerCase().includes('bug')) return true;
          if (labelId === '2' && card.title.toLowerCase().includes('feature')) return true;
          if (labelId === '3' && card.title.toLowerCase().includes('enhancement')) return true;
          if (labelId === '4' && card.title.toLowerCase().includes('documentation')) return true;
          return false;
        });
        if (!hasLabel) return false;
      }
      
            
      return true;
    });
  };

  const getFilteredBoard = () => {
    if (!board) return null;
    
    return {
      ...board,
      lists: board.lists.map(list => ({
        ...list,
        cards: filterCards(list.cards)
      })).filter(list => list.cards.length > 0 || searchQuery || selectedLabels.length > 0)
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 p-4 w-64 rounded">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-16 bg-gray-300 rounded"></div>
                  <div className="h-16 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchBoard}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Board not found</div>
      </div>
    );
  }

  const filteredBoard = getFilteredBoard();
  const labels = [
    { id: '1', name: 'Bug', color: 'bg-red-500' },
    { id: '2', name: 'Feature', color: 'bg-green-500' },
    { id: '3', name: 'Enhancement', color: 'bg-blue-500' },
    { id: '4', name: 'Documentation', color: 'bg-yellow-500' },
  ];
  const members = [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'BJ' },
  ];

  return (
    <AppLayout title={board?.title || 'Board'}>
      <div className="h-full flex flex-col">
        {/* Search and Filter */}
        <div className="bg-white border-b border-gray-200 p-4">
          <SearchAndFilter
            onSearch={setSearchQuery}
            onLabelFilter={setSelectedLabels}
            labels={labels}
          />
        </div>

        {/* Kanban Board */}
        <div className="flex-1">
          <KanbanBoard 
            board={filteredBoard || board} 
            onAddList={addList}
            onAddCard={addCard}
            onDeleteList={deleteList}
          />
        </div>

        {/* Show message when no cards match filters */}
        {filteredBoard && filteredBoard.lists.every(list => list.cards.length === 0) && (
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
    </AppLayout>
  );
}
