import React from 'react';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusClassName = (status: string): string => {
  switch (status) {
    case 'To Do':
      return 'bg-slate-100 text-slate-600';
    case 'In Progress':
      return 'bg-sky-100 text-sky-700';
    case 'Review':
      return 'bg-yellow-100 text-yellow-700';
    case 'Done':
      return 'bg-emerald-100 text-emerald-700';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div
      onClick={() => onClick(task)}
      className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-sky-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
          Priority: {task.priority}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusClassName(task.status)}`}>
          {task.status}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-slate-800 mb-2 leading-relaxed group-hover:text-sky-600 transition-colors">
        {task.name}
      </h3>

      {task.description && (
        <p className="text-xs text-slate-600 mb-3 line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Due: {formatDate(task.dueDate)}</span>
        {task.createdBy?.fullName && (
          <span className="italic">Created by: {task.createdBy.fullName}</span>
        )}
      </div>
    </div>
  );
};
