'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cardStyles, buttonStyles } from '@/components/design-system/DesignSystem';
import { getBoards, Board } from '@/lib/data';

export default function RecentBoards() {
  const router = useRouter();
  const boards = getBoards();
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      console.log('Creating board with:', { title: newBoardName, description: '', color: 'blue' });
      const response = await fetch('http://localhost:5000/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newBoardName,
          description: '',
          color: 'blue'
        }),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('Board created successfully:', data);
        setNewBoardName('');
        setShowCreateBoard(false);
        // Refresh the page to show the new board
        window.location.reload();
      } else {
        console.error('Failed to create board:', data);
        alert('Failed to create board: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Error creating board: ' + (error as Error).message);
    }
  };

  const handleBoardClick = (board: Board) => {
    setSelectedBoard(board);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Boards</h2>
        <button
          onClick={() => setShowCreateBoard(true)}
          className={buttonStyles.primary}
        >
          Create Board
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => handleBoardClick(board)}
            className={`
              ${cardStyles.base}
              ${cardStyles.interactive}
              p-6
              text-left
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {board.lists} lists
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
              {board.name}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {board.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {board.cards} cards
              </span>
              <span>{board.lastActivity}</span>
            </div>
          </button>
        ))}

        {/* Create new board card */}
        <button
          onClick={() => setShowCreateBoard(true)}
          className={`
            ${cardStyles.base}
            ${cardStyles.interactive}
            p-6
            border-2 border-dashed border-gray-300
            hover:border-gray-400
            flex flex-col items-center justify-center
            min-h-[200px]
          `}
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Create Board</h3>
          <p className="text-sm text-gray-500">Start a new project</p>
        </button>
      </div>

      {/* Create Board Modal */}
      {showCreateBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`
            ${cardStyles.base}
            w-full max-w-md p-6
          `}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Board
            </h3>
            
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Enter board name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              autoFocus
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateBoard(false);
                  setNewBoardName('');
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
      )}

      {/* Board Detail Modal */}
      {selectedBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardStyles.base} w-full max-w-2xl max-h-[80vh] overflow-y-auto`}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getBoardColor(selectedBoard.color)}`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedBoard.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Board ID: {selectedBoard.id}</p>
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
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedBoard.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedBoard.lists}</p>
                    <p className="text-sm text-gray-600">Lists</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedBoard.cards}</p>
                    <p className="text-sm text-gray-600">Cards</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedBoard.progress || 0}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{new Date(selectedBoard.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-900">{new Date(selectedBoard.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Activity</p>
                    <p className="font-medium text-gray-900">{selectedBoard.lastActivity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedBoard.color}</p>
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
    </div>
  );
}
