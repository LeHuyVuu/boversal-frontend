import React from 'react';
import { X, Calendar, Clock, User } from 'lucide-react';
import { Task } from '@/types/task';
import { formatDateTime } from '@/lib/utils';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'To Do':
      return 'bg-slate-300 text-slate-700';
    case 'In Progress':
      return 'bg-sky-300 text-slate-700';
    case 'Review':
      return 'bg-yellow-300 text-slate-700';
    case 'Done':
      return 'bg-emerald-300 text-slate-700';
    default:
      return 'bg-slate-300 text-slate-700';
  }
};

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-screen">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
            Task #{task.id}
          </span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-4">{task.name}</h2>

        <div className="mb-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Status
          </label>
          <div className="mt-1">
            <span className={`${getStatusColor(task.status)} text-xs px-2 py-1 rounded-full`}>
              {task.status}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Priority
          </label>
          <p className="text-sm text-slate-700 mt-1">{task.priority}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center">
            <User className="w-3 h-3 mr-1" />
            Created By
          </label>
          <div className="flex items-center space-x-2 mt-2">
            <img
              src={task.createdBy.avatar}
              alt={task.createdBy.fullName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-slate-700">{task.createdBy.fullName}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-6 border-b border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Due Date
              </span>
              <span className="text-slate-700">{formatDateTime(task.dueDate)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Project
              </span>
              <span className="text-slate-700">{task.projectId.name}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Description</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{task.description}</p>
        </div>
      </div>
    </div>
  );
};
