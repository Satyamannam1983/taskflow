'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { cardStyles, buttonStyles } from '@/components/design-system/DesignSystem';
import { getBoards, getAllCards, getTotalStats, Board } from '@/lib/data';

export default function TotalCardsPage() {
  const router = useRouter();
  const boards = getBoards();
  const allCards = getAllCards();
  const stats = getTotalStats();
  
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const filteredCards = allCards.filter(card => {
    // Filter by priority
    if (selectedPriority !== 'all' && card.priority !== selectedPriority) {
      return false;
    }
    
    // Filter by search
    if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getPriorityDot = (priority: string) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const handleCardClick = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setSelectedBoard(board);
    }
  };

  const getBoardName = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    return board?.name || 'Unknown Board';
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
    <AppLayout title="Total Cards">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Total Cards</h1>
            <p className="text-sm text-gray-500 mt-1">{stats.totalCards} cards across {stats.totalBoards} boards</p>
          </div>
        </div>

        {/* Stats Bar - Unique vertical design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cardStyles.base}>
            <div className="p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalCards}</p>
              <p className="text-xs text-gray-500 mt-1">Total Cards</p>
            </div>
          </div>
          <div className={cardStyles.base}>
            <div className="p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.avgCardsPerBoard}</p>
              <p className="text-xs text-gray-500 mt-1">Avg/Board</p>
            </div>
          </div>
          <div className={cardStyles.base}>
            <div className="p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">
                {allCards.filter(c => c.priority === 'critical' || c.priority === 'high').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">High Priority</p>
            </div>
          </div>
          <div className={cardStyles.base}>
            <div className="p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">
                {allCards.filter(c => c.dueDate && new Date(c.dueDate) < new Date()).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Overdue</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setSelectedPriority(priority)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedPriority === priority
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Table - Unique table design */}
        <div className={cardStyles.base}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Priority</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Card</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Board</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Due Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Labels</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card) => {
                  const listId = card.listId;
                  const list = boards.flatMap(b => getBoards().find(board => board.id === b.id) ? [] : []);
                  const boardId = boards.find(b => b.id === card.listId)?.id || '';
                  
                  return (
                    <tr
                      key={card.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleCardClick(card.listId)}
                    >
                      <td className="p-4">
                        <div className={`w-3 h-3 rounded-full ${getPriorityDot(card.priority)}`} />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{card.title}</p>
                          {card.description && (
                            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{card.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(card.priority)}`}>
                          {getBoardName(card.listId)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {card.dueDate ? new Date(card.dueDate).toLocaleDateString() : 'No due date'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {card.labels.map((label) => (
                            <span
                              key={label}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredCards.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">No cards found matching your filters</p>
            </div>
          )}
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
