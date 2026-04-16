'use client';

interface CardProps {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  listId: number;
  onClick?: () => void;
}

export default function Card({ id, title, description, dueDate, listId, onClick }: CardProps) {
  const isOverdue = dueDate ? new Date(dueDate) < new Date() : false;
  const isToday = dueDate ? new Date(dueDate).toDateString() === new Date().toDateString() : false;

  return (
    <div
      onClick={onClick}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <h3 className="text-sm font-medium text-gray-800 mb-2">{title}</h3>
      {description && (
        <p className="text-xs text-gray-600 line-clamp-3 mb-2">{description}</p>
      )}
      {dueDate && (
        <div className={`text-xs flex items-center mt-2 ${
          isOverdue ? 'text-red-600' : isToday ? 'text-orange-600' : 'text-gray-500'
        }`}>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(dueDate).toLocaleDateString()}
          {isOverdue && <span className="ml-1 text-red-600 font-medium"> (Overdue)</span>}
          {isToday && <span className="ml-1 text-orange-600 font-medium"> (Today)</span>}
        </div>
      )}
    </div>
  );
}
