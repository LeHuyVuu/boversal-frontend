'use client';
import React from 'react';
import { Task } from '@/services/taskService';
import { useTheme } from '@/contexts/ThemeContext';
import { Edit2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onEdit?: (task: Task, e: React.MouseEvent) => void;
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

const getStatusClassName = (statusId: number, theme: string): string => {
  const styles = {
    dark: {
      6: 'bg-slate-500/20 text-slate-300 border border-slate-500/30', // To Do
      7: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30', // In Progress
      9: 'bg-amber-500/20 text-amber-300 border border-amber-500/30', // Review
      4: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', // Done
      5: 'bg-red-500/20 text-red-300 border border-red-500/30', // Cancelled
    },
    light: {
      6: 'bg-slate-100 text-slate-600',
      7: 'bg-sky-100 text-sky-700',
      9: 'bg-yellow-100 text-yellow-700',
      4: 'bg-emerald-100 text-emerald-700',
      5: 'bg-red-100 text-red-700',
    }
  };
  return theme === 'dark' 
    ? (styles.dark[statusId as keyof typeof styles.dark] || styles.dark[6])
    : (styles.light[statusId as keyof typeof styles.light] || styles.light[6]);
};

const getPriorityClassName = (priority: string, theme: string): string => {
  const styles = {
    dark: {
      'low': 'bg-green-500/20 text-green-300 border border-green-500/30',
      'medium': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      'high': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
      'critical': 'bg-red-500/20 text-red-300 border border-red-500/30',
    },
    light: {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-blue-100 text-blue-700',
      'high': 'bg-orange-100 text-orange-700',
      'critical': 'bg-red-100 text-red-700',
    }
  };
  return theme === 'dark'
    ? (styles.dark[priority as keyof typeof styles.dark] || styles.dark.medium)
    : (styles.light[priority as keyof typeof styles.light] || styles.light.medium);
};

const getStatusLabel = (statusId: number): string => {
  const labels: Record<number, string> = {
    6: 'To Do',
    7: 'In Progress',
    9: 'Review',
    4: 'Done',
    5: 'Cancelled',
  };
  return labels[statusId] || 'Unknown';
};

const getPriorityLabel = (priority: string): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onEdit }) => {
  const { theme } = useTheme();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onEdit?.(task, e);
  };
  
  return (
    <div
      onClick={() => onClick(task)}
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 group relative ${
        theme === 'dark'
          ? 'bg-slate-800/60 border-blue-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10'
          : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
      }`}
    >
      {/* Edit Button */}
      {onEdit && (
        <button
          onClick={handleEditClick}
          className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
            theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600 text-cyan-400'
              : 'bg-slate-100 hover:bg-slate-200 text-blue-600'
          }`}
          title="Edit task"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded ${getPriorityClassName(task.priority, theme)}`}>
          {getPriorityLabel(task.priority)}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusClassName(task.statusId, theme)}`}>
          {getStatusLabel(task.statusId)}
        </span>
      </div>

      <h3 className={`text-sm font-semibold mb-2 leading-relaxed transition-colors ${
        theme === 'dark'
          ? 'text-cyan-100 group-hover:text-cyan-300'
          : 'text-slate-800 group-hover:text-sky-600'
      }`}>
        {task.title}
      </h3>

      {task.description && (
        <p className={`text-xs mb-3 line-clamp-3 ${
          theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
        }`}>
          {task.description}
        </p>
      )}

      <div className={`flex items-center justify-between text-xs ${
        theme === 'dark' ? 'text-cyan-400/60' : 'text-slate-500'
      }`}>
        <span>Due: {formatDate(task.dueDate)}</span>
        {task.assignees && task.assignees.length > 0 && (
          <span className="italic">{task.assignees[0].fullName}</span>
        )}
      </div>
    </div>
  );
};
