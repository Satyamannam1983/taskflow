'use client';

import { useState } from 'react';

interface CardProps {
  id: number;
  title: string;
  description?: string;
  position: number;
  dueDate?: string;
  listId: number;
}

interface Label {
  id: string;
  name: string;
  color: string;
}

interface ChecklistItem {
  id: string;
  content: string;
  isCompleted: boolean;
}

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  listId: number;
}

function Modal({ isOpen, onClose, id, title, description, dueDate, listId }: ModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || '');
  const [editDueDate, setEditDueDate] = useState(dueDate || '');
  const [labels] = useState<Label[]>([
    { id: '1', name: 'Bug', color: 'bg-red-500' },
    { id: '2', name: 'Feature', color: 'bg-green-500' },
    { id: '3', name: 'Enhancement', color: 'bg-blue-500' },
    { id: '4', name: 'Documentation', color: 'bg-yellow-500' },
  ]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['1', '3']);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', content: 'Research requirements', isCompleted: true },
    { id: '2', content: 'Create design mockups', isCompleted: true },
    { id: '3', content: 'Implement functionality', isCompleted: false },
    { id: '4', content: 'Write tests', isCompleted: false },
  ]);
  const [members] = useState<Member[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'BJ' },
  ]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['1']);

  if (!isOpen) return null;

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    );
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const completedChecklistItems = checklistItems.filter(item => item.isCompleted).length;
  const checklistProgress = checklistItems.length > 0 ? (completedChecklistItems / checklistItems.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-xl font-bold text-gray-800 flex-1 mr-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800 flex-1 mr-4">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Labels */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Labels</h3>
            <div className="flex flex-wrap gap-2">
              {labels.map(label => (
                <button
                  key={label.id}
                  onClick={() => toggleLabel(label.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white transition-all ${
                    selectedLabels.includes(label.id) 
                      ? `${label.color} ring-2 ring-offset-2 ring-gray-400` 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Description</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                placeholder="Add a more detailed description..."
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">
                {description || 'Click "Edit" to add a description...'}
              </p>
            )}
          </div>

          {/* Checklist */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Checklist ({completedChecklistItems}/{checklistItems.length})
            </h3>
            <div className="bg-gray-50 rounded p-3">
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${checklistProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{Math.round(checklistProgress)}% complete</span>
              </div>
              <div className="space-y-2">
                {checklistItems.map(item => (
                  <div key={item.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className={`text-sm ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {item.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Members</h3>
            <div className="flex flex-wrap gap-2">
              {members.map(member => (
                <button
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedMembers.includes(member.id)
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold mr-2">
                    {member.avatar}
                  </div>
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Due Date</h3>
            {isEditing ? (
              <input
                type="date"
                value={editDueDate ? new Date(editDueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dueDate ? new Date(dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'No due date set'}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Card ID: #{id.toString().padStart(3, '0')}</span>
              <div className="flex gap-2">
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Card({ id, title, description, position, dueDate, listId }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
      >
        <h3 className="text-sm font-medium text-gray-800 mb-2">{title}</h3>
        {description && (
          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{description}</p>
        )}
        {dueDate && (
          <div className="text-xs text-gray-500 mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(dueDate).toLocaleDateString()}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        id={id}
        title={title}
        description={description}
        dueDate={dueDate}
        listId={listId}
      />
    </>
  );
}
