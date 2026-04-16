'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface Card {
  id: string | number;
  title: string;
  description?: string;
  position: number;
  dueDate?: string;
  listId: number;
  labels?: string[];
  members?: string[];
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

export default function KanbanBoard() {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedDueDates, setSelectedDueDates] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [showAddList, setShowAddList] = useState(false);
  
  // Drag and Drop State
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragOverList, setDragOverList] = useState<number | null>(null);
  
  // Card Modal State
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardModalMode, setCardModalMode] = useState<'view' | 'edit'>('view');

  const labels = [
    { id: 'bug', name: 'Bug', color: 'bg-red-500' },
    { id: 'feature', name: 'Feature', color: 'bg-green-500' },
    { id: 'enhancement', name: 'Enhancement', color: 'bg-blue-500' },
    { id: 'documentation', name: 'Documentation', color: 'bg-yellow-500' },
  ];

  const members = [
    { id: 'john', name: 'John Doe', avatar: 'JD' },
    { id: 'jane', name: 'Jane Smith', avatar: 'JS' },
    { id: 'bob', name: 'Bob Johnson', avatar: 'BJ' },
  ];

  const dueDateOptions = [
    { id: 'overdue', name: 'Overdue' },
    { id: 'today', name: 'Due Today' },
    { id: 'week', name: 'Due This Week' },
    { id: 'month', name: 'Due This Month' },
  ];

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    try {
      // Simulate API call - in real app, this would fetch from backend
      const mockBoard: BoardData = {
        id: 1,
        title: 'Sprint Board',
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
                description: 'Mobile login not responsive on small screens',
                position: 0,
                listId: 1,
                dueDate: '2026-04-22',
                labels: ['bug'],
                members: ['john']
              },
              {
                id: 'c2',
                title: 'Add dark mode',
                description: 'Implement dark theme for better night usage',
                position: 0,
                listId: 1,
                dueDate: '2026-04-18',
                labels: ['enhancement'],
                members: ['jane']
              },
              {
                id: 'c3',
                title: 'Optimize search',
                description: 'Reduce API response time under 500ms',
                position: 0,
                listId: 1,
                dueDate: '2026-04-17',
                labels: ['enhancement'],
                members: ['bob']
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
                id: '4',
                title: 'Documentation: Update API docs',
                description: 'Add new endpoints and update existing documentation',
                position: 1,
                listId: 2,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                labels: ['documentation'],
                members: ['john', 'jane']
              },
              {
                id: '5',
                title: 'Bug: Memory leak fix',
                description: 'Investigate and fix memory leak in dashboard charts',
                position: 1,
                listId: 2,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                labels: ['bug'],
                members: ['bob']
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
                id: '6',
                title: 'Feature: User profile page',
                description: 'Create comprehensive user profile management system',
                position: 2,
                listId: 3,
                dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                labels: ['feature'],
                members: ['john']
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
  }, [board, searchQuery, selectedLabels, selectedDueDates]);

  const filteredBoard = useMemo(() => {
    if (!board) return null;
    
    const filteredLists = board.lists.map(list => ({
      ...list,
      cards: list.cards.filter(card => 
        filteredCards.some(filteredCard => filteredCard.id === card.id)
      )
    })).filter(list => list.cards.length > 0 || searchQuery || selectedLabels.length > 0 || selectedDueDates.length > 0);
    
    return {
      ...board,
      lists: filteredLists
    };
  }, [board, filteredCards]);

  const addList = () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login first to add lists');
      return;
    }

    if (!newListTitle.trim()) return;
    
    // In real app, this would call API
    const newList: List = {
      id: Date.now(),
      title: newListTitle,
      position: board?.lists.length || 0,
      boardId: 1,
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
    if (!confirm('Are you sure you want to delete this list?')) return;
    
    // In real app, this would call API
    setBoard(prev => prev ? {
      ...prev,
      lists: prev.lists.filter(list => list.id !== listId)
    } : null);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedLabels([]);
    setSelectedDueDates([]);
    setSelectedMembers([]);
  };

  const hasActiveFilters = searchQuery || selectedLabels.length > 0 || selectedDueDates.length > 0 || selectedMembers.length > 0;

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, card: Card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverList(null);
  };

  const handleDragOver = (e: React.DragEvent, listId: number) => {
    e.preventDefault();
    setDragOverList(listId);
  };

  const handleDragLeave = () => {
    setDragOverList(null);
  };

  const handleDrop = (e: React.DragEvent, targetListId: number) => {
    e.preventDefault();
    if (!draggedCard || !board) return;

    // Move card to new list
    const updatedBoard = {
      ...board,
      lists: board.lists.map(list => {
        if (list.id === targetListId) {
          return {
            ...list,
            cards: [...list.cards, { ...draggedCard, listId: targetListId }]
          };
        } else if (list.id === draggedCard.listId) {
          return {
            ...list,
            cards: list.cards.filter(card => card.id !== draggedCard.id)
          };
        }
        return list;
      })
    };

    setBoard(updatedBoard);
    setDraggedCard(null);
    setDragOverList(null);
  };

  // Card Modal Handlers
  const openCardModal = (card: Card, mode: 'view' | 'edit' = 'view') => {
    setSelectedCard(card);
    setCardModalMode(mode);
    setShowCardModal(true);
  };

  const closeCardModal = () => {
    setShowCardModal(false);
    setSelectedCard(null);
    setCardModalMode('view');
  };

  const updateCard = (updatedCard: Card) => {
    if (!board) return;

    const updatedBoard = {
      ...board,
      lists: board.lists.map(list => ({
        ...list,
        cards: list.cards.map(card => 
          card.id === updatedCard.id ? updatedCard : card
        )
      }))
    };

    setBoard(updatedBoard);
    closeCardModal();
  };

  const getListColor = (position: number) => {
    switch(position) {
      case 0: return 'border-red-500 bg-red-50';
      case 1: return 'border-yellow-500 bg-yellow-50';
      case 2: return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getListHeaderColor = (position: number) => {
    switch(position) {
      case 0: return 'text-red-600 bg-red-100';
      case 1: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <Navigation />

      {/* Board Title Section */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{board?.title || 'Board'}</h1>
            <p className="text-gray-400">Last updated: 2 hours ago</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cards by title..."
                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-white/10 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-2 border border-white/10 rounded-lg shadow-sm text-sm font-medium transition-all ${
                    showFilters 
                      ? 'bg-blue-500 border-blue-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {[selectedLabels.length, selectedDueDates.length, selectedMembers.length].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-2 border border-white/10 rounded-lg shadow-sm text-sm font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Label Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Labels</h3>
                  <div className="space-y-2">
                    {labels.map(label => (
                      <label key={label.id} className="flex items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedLabels.includes(label.id)}
                          onChange={() => {
                            setSelectedLabels(prev => 
                              prev.includes(label.id) 
                                ? prev.filter(id => id !== label.id)
                                : [...prev, label.id]
                            );
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/10 rounded"
                        />
                        <span className="ml-3 flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full ${label.color} mr-2`}></span>
                          {label.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Due Date Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Due Dates</h3>
                  <div className="space-y-2">
                    {dueDateOptions.map(option => (
                      <label key={option.id} className="flex items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedDueDates.includes(option.id)}
                          onChange={() => {
                            setSelectedDueDates(prev => 
                              prev.includes(option.id) 
                                ? prev.filter(id => id !== option.id)
                                : [...prev, option.id]
                            );
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/10 rounded"
                        />
                        <span className="ml-3 text-gray-300">{option.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Member Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Members</h3>
                  <div className="space-y-2">
                    {members.map(member => (
                      <label key={member.id} className="flex items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => {
                            setSelectedMembers(prev => 
                              prev.includes(member.id) 
                                ? prev.filter(id => id !== member.id)
                                : [...prev, member.id]
                            );
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/10 rounded"
                        />
                        <span className="ml-3 flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold mr-2 text-white">
                            {member.avatar}
                          </div>
                          <span className="text-gray-300">{member.name}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Board Content */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {/* Lists */}
            {filteredBoard?.lists.map((list) => (
              <div 
                key={list.id} 
                className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3 w-80 flex-shrink-0 shadow-sm ${
                  dragOverList === list.id ? 'border-blue-500 bg-blue-50' : getListColor(list.position)
                }`}
                onDragOver={(e) => handleDragOver(e, list.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, list.id)}
              >
                {/* List Header */}
                <div className={`flex justify-between items-center mb-3 px-3 py-2 rounded-lg ${getListHeaderColor(list.position)}`}>
                  <h2 className="text-sm font-semibold text-white">
                    {list.position === 0 && '🔴 '}{list.position === 1 && '🟡 '}{list.position === 2 && '🟢 '}{list.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white bg-white/20 px-2 py-1 rounded-full">
                      {list.cards.length}
                    </span>
                    <button
                      onClick={() => deleteList(list.id)}
                      className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/20"
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
                      draggable
                      onDragStart={(e) => handleDragStart(e, card)}
                      onDragEnd={handleDragEnd}
                      className="bg-white p-3 rounded-lg shadow-sm border border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                      onClick={() => openCardModal(card, 'view')}
                    >
                      <h3 className="text-sm font-medium text-gray-800 mb-2">{card.title}</h3>
                      {card.description && (
                        <p className="text-xs text-gray-600 line-clamp-3 mb-2">{card.description}</p>
                      )}
                      
                      {/* Labels */}
                      {card.labels && card.labels.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {card.labels.map(labelId => {
                            const label = labels.find(l => l.id === labelId);
                            return label ? (
                              <span key={labelId} className={`px-2 py-1 rounded-full text-xs text-white ${label.color}`}>
                                {label.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                      
                      {/* Members */}
                      {card.members && card.members.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {card.members.map(memberId => {
                            const member = members.find(m => m.id === memberId);
                            return member ? (
                              <div key={memberId} className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                {member.avatar}
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                      
                      {card.dueDate && (
                        <div className="text-xs text-gray-500 mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(card.dueDate).toLocaleDateString()}
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
                  className="mt-3 w-full text-left text-sm text-gray-400 hover:text-gray-600 hover:bg-white/20 p-2 rounded-lg transition-colors border-2 border-dashed border-white/20 hover:border-white/30"
                >
                  + Add card
                </button>
              </div>
            ))}

            {/* Add List Button */}
            {!showAddList ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3 w-80 flex-shrink-0 shadow-sm">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  className="w-full p-3 border border-white/10 rounded-lg mb-3 text-sm bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Add list
                  </button>
                  <button
                    onClick={() => {
                      setShowAddList(false);
                      setNewListTitle('');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddList(true)}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3 w-80 flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-white/20 transition-colors border-2 border-dashed border-white/20 flex items-center justify-center"
              >
                <span className="text-lg font-medium">+ Add another list</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Modal */}
      {showCardModal && selectedCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {cardModalMode === 'edit' ? 'Edit Card' : 'Card Details'}
              </h2>
              <button
                onClick={closeCardModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {cardModalMode === 'edit' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={selectedCard.title}
                      onChange={(e) => setSelectedCard({...selectedCard, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={selectedCard.description || ''}
                      onChange={(e) => setSelectedCard({...selectedCard, description: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={selectedCard.dueDate || ''}
                      onChange={(e) => setSelectedCard({...selectedCard, dueDate: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedCard.title}</h3>
                    {selectedCard.description && (
                      <p className="text-gray-600 mb-4">{selectedCard.description}</p>
                    )}
                  </div>
                  {selectedCard.dueDate && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {new Date(selectedCard.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  {/* Labels */}
                  {selectedCard.labels && selectedCard.labels.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Labels</h4>
                      <div className="flex gap-2">
                        {selectedCard.labels.map(labelId => {
                          const label = labels.find(l => l.id === labelId);
                          return label ? (
                            <span key={labelId} className={`px-3 py-1 rounded-full text-xs text-white ${label.color}`}>
                              {label.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Members */}
                  {selectedCard.members && selectedCard.members.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Members</h4>
                      <div className="flex gap-2">
                        {selectedCard.members.map(memberId => {
                          const member = members.find(m => m.id === memberId);
                          return member ? (
                            <div key={memberId} className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold text-white">
                                {member.avatar}
                              </div>
                              <span className="text-gray-700">{member.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeCardModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {cardModalMode === 'edit' && (
                <button
                  onClick={() => updateCard(selectedCard)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
