'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { cardStyles, buttonStyles } from '@/components/design-system/DesignSystem';
import { getBoards, searchBoards, filterBoardsByColor, sortBoards, Board } from '@/lib/data';

export default function BoardsPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  
  console.log('=== BOARDS PAGE MOUNTED ===');
  
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        console.log('Fetching boards from backend...');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/boards`);
        if (response.ok) {
          const data = await response.json();
          console.log('Boards fetched from backend:', data.length);
          
          // If backend returns empty array, use mock data
          if (data.length === 0) {
            console.log('Backend returned empty array, using mock data');
            setBoards(getBoards());
          } else {
            // Transform backend data to match Board interface
            const transformedBoards = data.map((board: any) => ({
              id: board.id,
              name: board.title,
              description: board.description || '',
              color: board.color || 'blue',
              lists: board.lists?.length || 0,
              cards: board.lists?.reduce((acc: number, list: any) => acc + (list.cards?.length || 0), 0) || 0,
              lastActivity: 'Just now',
              progress: 0,
              createdAt: board.createdAt || new Date().toISOString(),
              updatedAt: board.updatedAt || new Date().toISOString()
            }));
            
            setBoards(transformedBoards);
          }
        } else {
          console.error('Failed to fetch boards from backend, using mock data');
          setBoards(getBoards());
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
        console.log('Using mock data as fallback');
        setBoards(getBoards());
      } finally {
        setLoading(false);
      }
    };
    
    fetchBoards();
  }, []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColor, setFilterColor] = useState<'all' | 'blue' | 'green' | 'red' | 'purple' | 'orange'>('all');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'name' | 'cards' | 'progress'>('updatedAt');
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [newBoardColor, setNewBoardColor] = useState<'blue' | 'green' | 'red' | 'purple' | 'orange'>('blue');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const filteredBoards = useMemo(() => {
    let result = boards;
    result = searchBoards(result, searchQuery);
    result = filterBoardsByColor(result, filterColor);
    result = sortBoards(result, sortBy);
    return result;
  }, [boards, filterColor, searchQuery, sortBy]);

  useEffect(() => {
    console.log('=== RENDERING BOARDS PAGE ===');
    console.log('Filtered boards count:', filteredBoards.length);
    console.log('Search query:', searchQuery);
    console.log('Filter color:', filterColor);
    console.log('Sort by:', sortBy);
  }, [filteredBoards, searchQuery, filterColor, sortBy]);

  const handleBoardClick = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setSelectedBoard(board);
    }
  };

  const handleCreateBoard = async () => {
    console.log('=== CREATE BOARD CLICKED ===');
    console.log('Board name:', newBoardName);
    console.log('Board description:', newBoardDescription);
    console.log('Board color:', newBoardColor);
    
    if (!newBoardName.trim()) {
      console.error('ERROR: Board name is empty');
      alert('Please enter a board name');
      return;
    }
    
    try {
      const requestBody = {
        title: newBoardName,
        description: newBoardDescription,
        color: newBoardColor
      };
      console.log('Sending request to backend:', requestBody);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response received');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('✓ Board created successfully');
        // Add new board to state
        const newBoard: Board = {
          id: data.id,
          name: data.title,
          description: data.description || newBoardDescription,
          color: data.color || newBoardColor,
          lists: 0,
          cards: 0,
          lastActivity: 'Just now',
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setBoards((prev: Board[]) => [...prev, newBoard]);
        
        setNewBoardName('');
        setNewBoardDescription('');
        setNewBoardColor('blue');
        setShowCreateBoard(false);
      } else {
        console.error('✗ Backend returned error:', data);
        alert('Failed to create board: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('✗ Network error:', error);
      alert('Error creating board: ' + (error as Error).message);
    }
  };

  const getBoardColor = (color?: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBoardTextColor = (color?: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <AppLayout title="Boards">
      <div className="flex gap-6 text-black" style={{ color: 'black' }}>
        {/* Sidebar Filters */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className={cardStyles.base}>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Filter Boards</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Color</label>
                  <div className="space-y-2">
                    {['all', 'blue', 'green', 'red', 'purple', 'orange'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setFilterColor(color as any)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          filterColor === color 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {color === 'all' ? 'All Colors' : color.charAt(0).toUpperCase() + color.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="space-y-2">
                    {[
                      { value: 'updatedAt', label: 'Last Updated' },
                      { value: 'createdAt', label: 'Created Date' },
                      { value: 'name', label: 'Name' },
                      { value: 'cards', label: 'Most Cards' },
                      { value: 'progress', label: 'Progress' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as any)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          sortBy === option.value 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading boards...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Boards</h1>
                    <p className="text-gray-600 mt-1">{filteredBoards.length} boards</p>
                  </div>
                  <button
                    onClick={() => setShowCreateBoard(true)}
                    className={buttonStyles.primary}
                  >
                    Create Board
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search boards..."
                    style={{ color: 'black' }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Boards List - Unique horizontal layout */}
          {!loading && (
            <div className="space-y-3">
              {filteredBoards.length === 0 ? (
                <div className={cardStyles.base}>
                  <div className="p-12 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No boards found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                </div>
              ) : (
                filteredBoards.map((board) => (
                  <div
                  key={board.id}
                  className={`${cardStyles.base} cursor-pointer hover:bg-gray-50 transition-colors`}
                  onClick={() => handleBoardClick(board.id)}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Color indicator */}
                    <div className={`w-3 h-12 rounded-full ${getBoardColor(board.color)}`} />
                    
                    {/* Board info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{board.name}</h3>
                        {typeof board.progress === 'number' && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {board.progress}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{board.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <span className="font-medium text-gray-700">{board.lists}</span>
                        <span className="text-gray-500">lists</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-medium text-gray-700">{board.cards}</span>
                        <span className="text-gray-500">cards</span>
                      </div>
                      <span className="text-gray-500">{board.lastActivity}</span>
                    </div>

                    {/* Arrow */}
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                ))
              )}

              {/* Create Board Button */}
              <button
                onClick={() => setShowCreateBoard(true)}
                className={`
                  ${cardStyles.base}
                  border-2 border-dashed border-gray-300
                  hover:border-blue-400 hover:bg-blue-50
                  p-4 text-left transition-colors
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Create new board</h3>
                    <p className="text-sm text-gray-500">Add a board for a new project</p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Board Modal */}
      {showCreateBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardStyles.base} w-full max-w-lg`}>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Board</h3>
              <p className="text-sm text-gray-500 mb-6">Set up a new board for your project</p>
              
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Board name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                autoFocus
              />

              <textarea
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 min-h-[100px]"
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-3">
                  {(['blue','green','red','purple','orange'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewBoardColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        newBoardColor === color 
                          ? 'ring-2 ring-blue-500 ring-offset-2 border-gray-900' 
                          : 'border-gray-300'
                      } ${getBoardColor(color)}`}
                      aria-label={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCreateBoard(false);
                    setNewBoardName('');
                    setNewBoardDescription('');
                  }}
                  className={buttonStyles.secondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBoard}
                  disabled={!newBoardName.trim()}
                  className={buttonStyles.primary}
                >
                  Create Board
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Board Detail Modal */}
      {selectedBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardStyles.base} w-full max-w-2xl max-h-[80vh] overflow-y-auto`}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getBoardColor(selectedBoard?.color)}`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedBoard?.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Board ID: {selectedBoard?.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBoard(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedBoard?.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedBoard?.lists}</p>
                    <p className="text-sm text-gray-600">Lists</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedBoard?.cards}</p>
                    <p className="text-sm text-gray-600">Cards</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedBoard?.progress || 0}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{new Date(selectedBoard?.createdAt || new Date()).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-900">{new Date(selectedBoard?.updatedAt || new Date()).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Activity</p>
                    <p className="font-medium text-gray-900">{selectedBoard?.lastActivity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedBoard?.color}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedBoard(null)}
                    className={buttonStyles.secondary}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
