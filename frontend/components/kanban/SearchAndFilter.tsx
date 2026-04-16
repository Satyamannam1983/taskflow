'use client';

import { useState } from 'react';

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface DueDateOption {
  id: string;
  name: string;
}

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onLabelFilter: (labelIds: string[]) => void;
  onDueDateFilter: (dueDates: string[]) => void;
  onMemberFilter: (memberIds: string[]) => void;
}

export default function SearchAndFilter({ 
  onSearch, 
  onLabelFilter, 
  onDueDateFilter, 
  onMemberFilter 
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedDueDates, setSelectedDueDates] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const labels: Label[] = [
    { id: 'bug', name: 'Bug', color: 'bg-red-500' },
    { id: 'feature', name: 'Feature', color: 'bg-green-500' },
    { id: 'enhancement', name: 'Enhancement', color: 'bg-blue-500' },
    { id: 'documentation', name: 'Documentation', color: 'bg-yellow-500' },
  ];

  const members: Member[] = [
    { id: 'john', name: 'John Doe', avatar: 'JD' },
    { id: 'jane', name: 'Jane Smith', avatar: 'JS' },
    { id: 'bob', name: 'Bob Johnson', avatar: 'BJ' },
  ];

  const dueDateOptions: DueDateOption[] = [
    { id: 'overdue', name: 'Overdue' },
    { id: 'today', name: 'Due Today' },
    { id: 'week', name: 'Due This Week' },
    { id: 'month', name: 'Due This Month' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleLabel = (labelId: string) => {
    const newLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter(id => id !== labelId)
      : [...selectedLabels, labelId];
    
    setSelectedLabels(newLabels);
    onLabelFilter(newLabels);
  };

  const toggleDueDate = (dueDateId: string) => {
    const newDueDates = selectedDueDates.includes(dueDateId)
      ? selectedDueDates.filter(id => id !== dueDateId)
      : [...selectedDueDates, dueDateId];
    
    setSelectedDueDates(newDueDates);
    onDueDateFilter(newDueDates);
  };

  const toggleMember = (memberId: string) => {
    const newMembers = selectedMembers.includes(memberId)
      ? selectedMembers.filter(id => id !== memberId)
      : [...selectedMembers, memberId];
    
    setSelectedMembers(newMembers);
    onMemberFilter(newMembers);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedLabels([]);
    setSelectedDueDates([]);
    setSelectedMembers([]);
    onSearch('');
    onLabelFilter([]);
    onDueDateFilter([]);
    onMemberFilter([]);
  };

  const hasActiveFilters = searchQuery || selectedLabels.length > 0 || selectedDueDates.length > 0 || selectedMembers.length > 0;
  const activeFilterCount = selectedLabels.length + selectedDueDates.length + selectedMembers.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
              onChange={handleSearchChange}
              placeholder="Search cards by title..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Filter Button */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium transition-all ${
              showFilters 
                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors"
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
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Label Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Labels</h3>
              <div className="space-y-2">
                {labels.map(label => (
                  <label key={label.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedLabels.includes(label.id)}
                      onChange={() => toggleLabel(label.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                  <label key={option.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedDueDates.includes(option.id)}
                      onChange={() => toggleDueDate(option.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Member Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Members</h3>
              <div className="space-y-2">
                {members.map(member => (
                  <label key={member.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold mr-2">
                        {member.avatar}
                      </div>
                      {member.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
