'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { cardStyles, buttonStyles } from '@/components/design-system/DesignSystem';
import { getBoards, getTotalStats, Board } from '@/lib/data';

export default function ActiveBoardsPage() {
  const router = useRouter();
  const boards = getBoards();
  const stats = getTotalStats();
  
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const handleBoardClick = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setSelectedBoard(board);
    }
  };

  const getProgressColor = (progress?: number) => {
    if (!progress) return 'bg-gray-300';
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressWidth = (progress?: number) => {
    if (!progress) return 0;
    return Math.min(progress, 100);
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
    <AppLayout title="Active Boards">
      <div className="space-y-8">
        {/* Stats Overview - Unique compact design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cardStyles.base}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBoards}</p>
                  <p className="text-xs text-gray-500">Total Boards</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cardStyles.base}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
                  <p className="text-xs text-gray-500">Total Cards</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cardStyles.base}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLists}</p>
                  <p className="text-xs text-gray-500">Total Lists</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cardStyles.base}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.boardsWithRecentActivity}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Active Boards</h1>
            <p className="text-sm text-gray-500 mt-1">Boards with recent activity</p>
          </div>
          <button className={buttonStyles.primary}>
            Create Board
          </button>
        </div>

        {/* Boards Grid - Unique card design with progress bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board.id}
              className={`${cardStyles.base} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handleBoardClick(board.id)}
            >
              <div className="p-6">
                {/* Board Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    board.color === 'blue' ? 'bg-blue-100' :
                    board.color === 'green' ? 'bg-green-100' :
                    board.color === 'red' ? 'bg-red-100' :
                    board.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{board.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{board.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {typeof board.progress === 'number' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{board.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(board.progress)}`}
                        style={{ width: `${getProgressWidth(board.progress)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      <span className="text-gray-600">{board.lists}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-gray-600">{board.cards}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{board.lastActivity}</span>
                </div>
              </div>
            </div>
          ))}
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
