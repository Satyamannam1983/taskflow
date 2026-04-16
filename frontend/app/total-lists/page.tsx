'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { cardStyles, buttonStyles } from '@/components/design-system/DesignSystem';
import { getBoards, getAllLists, getTotalStats, Board } from '@/lib/data';

export default function TotalListsPage() {
  const router = useRouter();
  const boards = getBoards();
  const allLists = getAllLists();
  const stats = getTotalStats();
  
  const [expandedBoards, setExpandedBoards] = useState<Set<string>>(new Set(['board-1']));
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const toggleBoard = (boardId: string) => {
    setExpandedBoards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(boardId)) {
        newSet.delete(boardId);
      } else {
        newSet.add(boardId);
      }
      return newSet;
    });
  };

  const handleBoardClick = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setSelectedBoard(board);
    }
  };

  const getListColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-700 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
    <AppLayout title="Total Lists">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Total Lists</h1>
            <p className="text-sm text-gray-500 mt-1">{stats.totalLists} lists across {stats.totalBoards} boards</p>
          </div>
        </div>

        {/* Stats Bar - Unique horizontal design */}
        <div className={cardStyles.base}>
          <div className="flex items-center justify-around p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalLists}</p>
              <p className="text-sm text-gray-500 mt-1">Total Lists</p>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalCards}</p>
              <p className="text-sm text-gray-500 mt-1">Total Cards</p>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.avgListsPerBoard}</p>
              <p className="text-sm text-gray-500 mt-1">Avg Lists/Board</p>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalBoards}</p>
              <p className="text-sm text-gray-500 mt-1">Boards</p>
            </div>
          </div>
        </div>

        {/* Boards with Expandable Lists - Unique accordion design */}
        <div className="space-y-4">
          {boards.map((board) => {
            const boardLists = allLists.filter(list => list.boardId === board.id);
            const isExpanded = expandedBoards.has(board.id);
            
            return (
              <div key={board.id} className={cardStyles.base}>
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleBoard(board.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Expand/Collapse Icon */}
                    <div className="flex-shrink-0">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* Color indicator */}
                    <div className={`w-3 h-12 rounded-full ${getBoardColor(board.color)}`} />

                    {/* Board info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">{board.name}</h3>
                      <p className="text-sm text-gray-500">{board.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{boardLists.length}</p>
                        <p className="text-xs text-gray-500">lists</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{board.cards}</p>
                        <p className="text-xs text-gray-500">cards</p>
                      </div>
                    </div>

                    {/* View Board button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBoardClick(board.id);
                      }}
                      className={buttonStyles.secondary}
                    >
                      View Board
                    </button>
                  </div>
                </div>

                {/* Expandable Lists */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {boardLists.map((list) => (
                        <div
                          key={list.id}
                          className={`p-4 rounded-lg border ${getListColor(list.color)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{list.title}</h4>
                            <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full">
                              {list.cards.length} cards
                            </span>
                          </div>
                          <div className="text-xs opacity-75">
                            Position: {list.position}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
    </AppLayout>
  );
}
