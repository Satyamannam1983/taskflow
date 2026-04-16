'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface Card {
  id: string | number;
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

interface BoardData {
  id: number;
  title: string;
  lists: List[];
}

export default function CustomBoardPage() {
  const params = useParams();
  const boardId = params?.id as string;
  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState('');
  const [showAddList, setShowAddList] = useState(false);

  useEffect(() => {
    // Simulate loading custom board
    const mockBoard: BoardData = {
      id: parseInt(boardId),
      title: `Custom Board ${boardId}`,
      lists: [
        {
          id: 1,
          title: 'To Do',
          position: 0,
          boardId: 1,
          cards: [
            {
              id: 'c1',
              title: 'Fix login bug',
              description: 'Mobile login not responsive',
              dueDate: '2026-04-22',
              position: 0,
              listId: 1,
            },
            {
              id: 'c2',
              title: 'Add dark mode',
              description: 'Improve UX for night usage',
              dueDate: '2026-04-18',
              position: 1,
              listId: 1,
            },
            {
              id: 'c3',
              title: 'Optimize search',
              description: 'Reduce response time < 500ms',
              dueDate: '2026-04-17',
              position: 2,
              listId: 1,
            }
          ]
        },
        {
          id: 2,
          title: 'In Progress',
          position: 1,
          boardId: 1,
          cards: [
            {
              id: 'c4',
              title: 'Set up development environment',
              description: 'Configure tools and dependencies for project',
              position: 0,
              listId: 2,
            }
          ]
        },
        {
          id: 3,
          title: 'Done',
          position: 2,
          boardId: 1,
          cards: [
            {
              id: 'c5',
              title: 'Deploy initial version',
              description: 'First deployment to staging environment',
              position: 0,
              listId: 3,
            }
          ]
        }
      ]
    };
    
    setTimeout(() => {
      setBoard(mockBoard);
      setLoading(false);
    }, 500);
  }, [boardId]);

  const addList = () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login first to add lists');
      return;
    }

    if (!newListTitle.trim()) return;
    
    const newList: List = {
      id: Date.now(),
      title: newListTitle,
      position: board?.lists.length || 0,
      boardId: board?.id || 1,
      cards: []
    };
    
    setBoard(prev => prev ? {
      ...prev,
      lists: [...prev.lists, newList]
    } : null);
    
    setNewListTitle('');
    setShowAddList(false);
  };

  const addCard = (listId: number) => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login first to add cards');
      return;
    }

    const title = prompt('Enter card title:');
    if (!title?.trim()) return;
    
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
    if (!confirm('Are you sure you want to delete this list?')) return;
    
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

      {/* Board Header */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-gray-800">{board.title}</h1>
          <p className="text-gray-600 mt-1">Custom board with dynamic content</p>
        </div>
      </div>

      {/* Board Content */}
      <div className="px-6 py-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* Lists */}
          {board.lists.map((list) => (
            <div key={list.id} className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0 shadow-sm">
              {/* List Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-gray-700">{list.title}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {list.cards.length}
                  </span>
                  <button
                    onClick={() => deleteList(list.id)}
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
                {list.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                    onClick={() => {
                      alert(`Card: ${card.title}\n\n${card.description || 'No description'}${card.dueDate ? `\n\nDue: ${card.dueDate}` : ''}`);
                    }}
                  >
                    <h3 className="text-sm font-medium text-gray-800 mb-2">{card.title}</h3>
                    {card.description && (
                      <p className="text-xs text-gray-600 line-clamp-3 mb-2">{card.description}</p>
                    )}
                    {card.dueDate && (
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {card.dueDate}
                      </div>
                    )}
                  </div>
                ))}
                
                {list.cards.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No cards in this list
                  </div>
                )}
              </div>

              {/* Add Card Button */}
              <button
                onClick={() => addCard(list.id)}
                className="mt-3 w-full text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
              >
                + Add card
              </button>
            </div>
          ))}

          {/* Add List Button */}
          {!showAddList ? (
            <div className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0 shadow-sm border border-gray-200">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addList();
                  } else if (e.key === 'Escape') {
                    setShowAddList(false);
                    setNewListTitle('');
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={addList}
                  disabled={!newListTitle.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add list
                </button>
                <button
                  onClick={() => {
                    setShowAddList(false);
                    setNewListTitle('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddList(true)}
              className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 w-72 flex-shrink-0 text-gray-600 hover:text-gray-800 transition-colors border-2 border-dashed border-gray-400 flex items-center justify-center"
            >
              <span className="text-lg font-medium">+ Add another list</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
