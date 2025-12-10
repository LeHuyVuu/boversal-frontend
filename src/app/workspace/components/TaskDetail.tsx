'use client';
import React, { useEffect, useState, useRef } from 'react';
import { X, Calendar, User, Briefcase, Tag, MessageSquare, Paperclip, Send, Download, Clock, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Task, taskService } from '@/services/taskService';
import { useTheme } from '@/contexts/ThemeContext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onTaskDeleted?: (taskId: number) => void;
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

interface Attachment {
  id: number;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

const getStatusColor = (statusId: number, theme: string) => {
  const colors = {
    dark: {
      6: 'bg-slate-500/20 text-slate-300 border border-slate-500/40',
      7: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
      9: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      4: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      5: 'bg-red-500/20 text-red-300 border border-red-500/40',
    },
    light: {
      6: 'bg-slate-100 text-slate-700 border border-slate-300',
      7: 'bg-cyan-100 text-cyan-700 border border-cyan-300',
      9: 'bg-amber-100 text-amber-700 border border-amber-300',
      4: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
      5: 'bg-red-100 text-red-700 border border-red-300',
    }
  };
  return theme === 'dark'
    ? (colors.dark[statusId as keyof typeof colors.dark] || colors.dark[6])
    : (colors.light[statusId as keyof typeof colors.light] || colors.light[6]);
};

const getPriorityColor = (priority: string, theme: string) => {
  const colors = {
    dark: {
      'low': 'bg-green-500/20 text-green-300 border border-green-500/40',
      'medium': 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
      'high': 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
      'critical': 'bg-red-500/20 text-red-300 border border-red-500/40',
    },
    light: {
      'low': 'bg-green-100 text-green-700 border border-green-300',
      'medium': 'bg-blue-100 text-blue-700 border border-blue-300',
      'high': 'bg-orange-100 text-orange-700 border border-orange-300',
      'critical': 'bg-red-100 text-red-700 border border-red-300',
    }
  };
  return theme === 'dark'
    ? (colors.dark[priority as keyof typeof colors.dark] || colors.dark.medium)
    : (colors.light[priority as keyof typeof colors.light] || colors.light.medium);
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onTaskDeleted }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments'>('comments');
  const [commentText, setCommentText] = useState('');
  const toast = useRef<Toast>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userId: 1,
      userName: 'Phạm Đức Nghĩa',
      userAvatar: 'https://s3.ap-southeast-1.amazonaws.com/bnote/assets/avatars/owner.png',
      content: 'Tôi đã hoàn thành phần UI cho component này. Các bạn review giúp tôi nhé!',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      userId: 2,
      userName: 'Lê Huy Vũ',
      content: 'Trông có vẻ ổn. Nhưng nên thêm loading state cho các API call.',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ]);

  const [attachments, setAttachments] = useState<Attachment[]>([
    {
      id: 1,
      name: 'design-mockup.fig',
      size: '2.4 MB',
      type: 'figma',
      uploadedBy: 'Phạm Đức Nghĩa',
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      url: '#',
    },
    {
      id: 2,
      name: 'api-documentation.pdf',
      size: '1.1 MB',
      type: 'pdf',
      uploadedBy: 'Lê Huy Vũ',
      uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      url: '#',
    },
  ]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: comments.length + 1,
      userId: 2,
      userName: 'You',
      content: commentText,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  const handleDeleteTask = () => {
    confirmDialog({
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        setIsDeleting(true);
        try {
          await taskService.deleteTask(task.id);
          toast.current?.show({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Task deleted successfully',
            life: 2000,
          });
          // Đóng modal ngay lập tức và callback với taskId
          onClose();
          onTaskDeleted?.(task.id);
        } catch (error) {
          console.error('Error deleting task:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete task',
            life: 3000,
          });
          setIsDeleting(false);
        }
      },
    });
  };

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return '📄';
    if (type === 'figma') return '🎨';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`pointer-events-auto w-full max-w-7xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 flex ${theme === 'dark'
              ? 'bg-slate-900'
              : 'bg-white'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Content - Left Side */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header with close button */}
            <div className={`px-8 py-5 flex items-center justify-between border-b ${theme === 'dark'
                ? 'border-slate-800'
                : 'border-slate-200'
              }`}>
              <h2 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                Task Detail
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteTask}
                  disabled={isDeleting}
                  className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300 disabled:opacity-50'
                      : 'hover:bg-red-50 text-red-600 hover:text-red-700 disabled:opacity-50'
                  }`}
                  title="Delete task"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-all ${theme === 'dark'
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto px-8 py-6 ${theme === 'dark'
                ? 'bg-slate-900'
                : 'bg-slate-50'
              }`}>
              {/* Title */}
              <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                {task.title}
              </h1>

              {/* Status Row */}
              <div className={`grid grid-cols-4 gap-6 mb-8 pb-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                }`}>
                <div>
                  <label className={`text-xs font-medium mb-2 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${theme === 'dark'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {task.statusName || 'In Progress'}
                  </span>
                </div>

                <div>
                  <label className={`text-xs font-medium mb-2 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                    Assigned to
                  </label>
                  <div className="flex items-center gap-2">
                    {task.assignees && task.assignees.slice(0, 3).map((assignee, idx) => (
                      <div key={idx} className="relative">
                        {assignee.avatarUrl ? (
                          <img
                            src={assignee.avatarUrl}
                            alt={assignee.fullName}
                            className="w-7 h-7 rounded-full ring-2 ring-white"
                          />
                        ) : (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white ${theme === 'dark'
                              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                              : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white'
                            }`}>
                            {assignee.fullName
                              ? assignee.fullName.charAt(0).toUpperCase()
                              : "-"
                            }
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-medium mb-2 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                    Start date
                  </label>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                    {formatDate(task.createdAt)}
                  </p>
                </div>

                <div>
                  <label className={`text-xs font-medium mb-2 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                    Due date
                  </label>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                    {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>

              {/* Priority */}
              <div className="mb-8">
                <label className={`text-xs font-medium mb-2 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Priority
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${getPriorityColor(task.priority, theme)
                  }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>

              {/* Description Section */}
              {task.description && (
                <div className="mb-6">
                  <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                    Description
                  </h3>
                  <ul className={`space-y-2 list-disc list-inside ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                    {task.description.split('\n').filter(line => line.trim()).map((line, index) => (
                      <li key={index} className="text-sm leading-relaxed ml-2">{line.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tabs for Attachment and Comments */}
              <div className={`border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                }`}>
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('attachments')}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'attachments'
                        ? theme === 'dark'
                          ? 'border-cyan-400 text-cyan-400'
                          : 'border-blue-600 text-blue-600'
                        : theme === 'dark'
                          ? 'border-transparent text-slate-400 hover:text-slate-300'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    Attachment
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'comments'
                        ? theme === 'dark'
                          ? 'border-cyan-400 text-cyan-400'
                          : 'border-blue-600 text-blue-600'
                        : theme === 'dark'
                          ? 'border-transparent text-slate-400 hover:text-slate-300'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    Comments
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === 'attachments' && (
                  <div className="text-sm text-slate-400">No attachments</div>
                )}
                {activeTab === 'comments' && (
                  <div className="text-sm text-slate-400">No comments yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Project Status & Activities */}
          <div className={`w-[380px] border-l flex flex-col ${theme === 'dark'
              ? 'border-slate-800 bg-slate-900'
              : 'border-slate-200 bg-white'
            }`}>
            {/* Activities */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                  Activities
                </h3>
              </div>

              {/* Empty State */}
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No activities yet</p>
              </div>
            </div>

            {/* Created By */}
            <div className={`p-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
              }`}>
              <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Created by
              </p>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${theme === 'dark'
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                    : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white'
                  }`}>
                  {task.createdByName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                  {task.createdByName || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
