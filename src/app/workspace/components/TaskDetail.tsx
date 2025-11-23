'use client';
import React from 'react';
import { X, Calendar, Clock, User, Briefcase } from 'lucide-react';
import { Task } from '@/services/taskService';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

const getStatusColor = (statusId: number, theme: string) => {
  const styles = {
    dark: {
      6: 'bg-slate-500/30 text-slate-200', // To Do
      7: 'bg-cyan-500/30 text-cyan-200', // In Progress
      8: 'bg-red-500/30 text-red-200', // Blocked
      9: 'bg-amber-500/30 text-amber-200', // Review
      10: 'bg-emerald-500/30 text-emerald-200', // Done
      4: 'bg-emerald-500/30 text-emerald-200', // Done (alt)
    },
    light: {
      6: 'bg-slate-300 text-slate-700',
      7: 'bg-sky-300 text-slate-700',
      8: 'bg-red-300 text-slate-700',
      9: 'bg-yellow-300 text-slate-700',
      10: 'bg-emerald-300 text-slate-700',
      4: 'bg-emerald-300 text-slate-700',
    }
  };
  return theme === 'dark'
    ? (styles.dark[statusId as keyof typeof styles.dark] || styles.dark[6])
    : (styles.light[statusId as keyof typeof styles.light] || styles.light[6]);
};

const getStatusLabel = (task: Task): string => {
  return task.statusName || 'Unknown';
};

const getPriorityLabel = (priority: string): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`w-96 border-l flex flex-col h-screen ${
      theme === 'dark'
        ? 'bg-slate-900 border-blue-500/20'
        : 'bg-white border-slate-200'
    }`}>
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'border-blue-500/20' : 'border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            theme === 'dark'
              ? 'text-cyan-300 bg-blue-500/20 border border-cyan-500/30'
              : 'text-slate-600 bg-slate-100'
          }`}>
            Task #{task.id}
          </span>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              theme === 'dark'
                ? 'text-cyan-400 hover:text-cyan-300 hover:bg-blue-900/30'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
        }`}>
          {task.title}
        </h2>

        <div className="mb-4">
          <label className={`text-xs font-medium uppercase tracking-wide ${
            theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
          }`}>
            Status
          </label>
          <div className="mt-1">
            <span className={`${getStatusColor(task.statusId, theme)} text-xs px-2 py-1 rounded-full`}>
              {getStatusLabel(task)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className={`text-xs font-medium uppercase tracking-wide ${
            theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
          }`}>
            Priority
          </label>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
          }`}>
            {getPriorityLabel(task.priority)}
          </p>
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div>
            <label className={`text-xs font-medium uppercase tracking-wide flex items-center ${
              theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
            }`}>
              <User className="w-3 h-3 mr-1" />
              Assigned To
            </label>
            <div className="flex items-center space-x-2 mt-2">
              {task.assignees[0].avatarUrl ? (
                <img
                  src={task.assignees[0].avatarUrl}
                  alt={task.assignees[0].fullName}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-sky-100 text-sky-600'
                }`}>
                  {task.assignees[0].fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={`text-sm ${
                theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
              }`}>
                {task.assignees[0].fullName}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-blue-500/20' : 'border-slate-200'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className={`flex items-center ${
                theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
              }`}>
                <Calendar className="w-4 h-4 mr-2" />
                Due Date
              </span>
              <span className={theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'}>
                {formatDateTime(task.dueDate)}
              </span>
            </div>
            {task.projectId && (
              <div className="flex items-center justify-between text-sm">
                <span className={`flex items-center ${
                  theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
                }`}>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Project ID
                </span>
                <span className={theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'}>
                  #{task.projectId}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className={`text-sm font-medium mb-3 ${
            theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
          }`}>
            Description
          </h3>
          <p className={`text-sm leading-relaxed ${
            theme === 'dark' ? 'text-cyan-200/70' : 'text-slate-500'
          }`}>
            {task.description || 'No description provided'}
          </p>
        </div>
      </div>
    </div>
  );
};
