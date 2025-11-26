'use client';
import React, { useEffect, useState } from 'react';
import { X, Calendar, User, Briefcase, Tag, MessageSquare, Paperclip, Send, MoreVertical, Edit, Trash, Download } from 'lucide-react';
import { Task } from '@/services/taskService';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
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

const getStatusColor = (statusId: number) => {
  const colors = {
    6: 'bg-slate-500 text-white',
    7: 'bg-cyan-500 text-white',
    9: 'bg-amber-500 text-white',
    4: 'bg-emerald-500 text-white',
  };
  return colors[statusId as keyof typeof colors] || 'bg-slate-500 text-white';
};

const getPriorityColor = (priority: string) => {
  const colors = {
    'low': 'bg-green-500 text-white',
    'medium': 'bg-blue-500 text-white',
    'high': 'bg-orange-500 text-white',
    'critical': 'bg-red-500 text-white',
  };
  return colors[priority as keyof typeof colors] || 'bg-blue-500 text-white';
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

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments'>('comments');
  const [commentText, setCommentText] = useState('');
  
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

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return '📄';
    if (type === 'figma') return '🎨';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full max-w-5xl h-[85vh] overflow-hidden rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 flex ${
            theme === 'dark'
              ? 'bg-slate-900'
              : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Content - Left Side */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className={`px-5 py-3 border-b ${
              theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      theme === 'dark'
                        ? 'bg-slate-800 text-cyan-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      TASK-{task.id}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(task.statusId)}`}>
                      {task.statusName || 'Unknown'}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <h1 className={`text-xl font-bold leading-tight truncate ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {task.title}
                  </h1>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                    theme === 'dark'
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                      : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              theme === 'dark'
                ? 'bg-slate-900/50'
                : 'bg-slate-50/50'
            }`}>
              {/* Description */}
              {task.description && (
                <div>
                  <h3 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Description
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {task.description}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                }`}>
                  <div className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    Due Date
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {formatDate(task.dueDate)}
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                }`}>
                  <div className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    <Briefcase className="w-3 h-3" />
                    Project
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Project #{task.projectId}
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                }`}>
                  <div className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    <User className="w-3 h-3" />
                    Created By
                  </div>
                  <div className={`text-sm font-medium truncate ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {task.createdByName || 'Unknown'}
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                }`}>
                  <div className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    <Tag className="w-3 h-3" />
                    Order
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {task.orderIndex}
                  </div>
                </div>
              </div>

              {/* Assignees */}
              {task.assignees && task.assignees.length > 0 && (
                <div>
                  <h3 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Assignees
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.assignees.map((assignee, idx) => (
                      <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                      }`}>
                        {assignee.avatarUrl ? (
                          <img
                            src={assignee.avatarUrl}
                            alt={assignee.fullName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            theme === 'dark'
                              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                              : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white'
                          }`}>
                            {assignee.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className={`text-sm font-semibold truncate ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {assignee.fullName}
                          </div>
                          <div className={`text-xs truncate ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {assignee.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={`w-80 border-l flex flex-col ${
            theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
          }`}>
            {/* Tabs */}
            <div className={`flex border-b ${
              theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors relative ${
                  activeTab === 'comments'
                    ? theme === 'dark'
                      ? 'text-cyan-400'
                      : 'text-blue-600'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                Comments ({comments.length})
                {activeTab === 'comments' && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    theme === 'dark' ? 'bg-cyan-400' : 'bg-blue-600'
                  }`} />
                )}
              </button>
              <button
                onClick={() => setActiveTab('attachments')}
                className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors relative ${
                  activeTab === 'attachments'
                    ? theme === 'dark'
                      ? 'text-cyan-400'
                      : 'text-blue-600'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5 inline mr-1" />
                Files ({attachments.length})
                {activeTab === 'attachments' && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    theme === 'dark' ? 'bg-cyan-400' : 'bg-blue-600'
                  }`} />
                )}
              </button>
            </div>

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      {comment.userAvatar ? (
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-7 h-7 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                            : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white'
                        }`}>
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className={`text-xs font-semibold truncate ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {comment.userName}
                          </span>
                          <span className={`text-xs flex-shrink-0 ${
                            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {formatTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className={`p-3 border-t ${
                  theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <div className={`flex gap-2 p-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                      placeholder="Write a comment..."
                      className={`flex-1 bg-transparent outline-none text-xs ${
                        theme === 'dark'
                          ? 'text-white placeholder-slate-500'
                          : 'text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      onClick={handleSendComment}
                      disabled={!commentText.trim()}
                      className={`p-1.5 rounded-md transition-colors ${
                        commentText.trim()
                          ? theme === 'dark'
                            ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                          : theme === 'dark'
                          ? 'bg-slate-700 text-slate-500'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Attachments Tab */}
            {activeTab === 'attachments' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="text-xl">{getFileIcon(file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold truncate ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {file.name}
                        </div>
                        <div className={`text-xs mt-0.5 truncate ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {file.size} • {file.uploadedBy}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {formatTime(file.uploadedAt)}
                        </div>
                      </div>
                      <button
                        className={`p-1.5 rounded-md transition-colors flex-shrink-0 ${
                          theme === 'dark'
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                            : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Upload Button */}
                <button className={`w-full p-3 rounded-lg border-2 border-dashed transition-colors ${
                  theme === 'dark'
                    ? 'border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-400'
                    : 'border-slate-300 hover:border-blue-500 text-slate-500 hover:text-blue-600'
                }`}>
                  <Paperclip className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs font-medium">Upload file</div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
