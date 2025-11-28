'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Calendar, User, Tag, Loader2, Search, AlertCircle } from 'lucide-react';
import { Task, UpdateTaskDto, taskService } from '@/services/taskService';
import { userService } from '@/services/userService';
import type { SearchUserDto } from '@/types/user';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditTaskModal({ task, onClose, onSuccess }: EditTaskModalProps) {
  const { theme } = useTheme();
  
  // Form state - normalize priority to lowercase
  const [formData, setFormData] = useState<UpdateTaskDto>({
    id: task.id,
    projectId: task.projectId,
    statusId: task.statusId,
    title: task.title,
    description: task.description || '',
    priority: (task.priority?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high' | 'emergency',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : null,
    orderIndex: task.orderIndex,
    assigneeIds: task.assignees?.map(a => a.userId) || []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUserDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SearchUserDto[]>([]);
  const [searching, setSearching] = useState(false);

  // Load selected users info
  useEffect(() => {
    async function loadSelectedUsers() {
      try {
        const users = await Promise.all(
          formData.assigneeIds.map(async (id) => {
            try {
              const response = await userService.getUserProfile(id);
              return {
                id: response.data.id,
                email: response.data.email,
                fullName: response.data.fullName,
                avatarUrl: response.data.avatarUrl
              };
            } catch {
              return null;
            }
          })
        );
        setSelectedUsers(users.filter(u => u !== null) as SearchUserDto[]);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    }
    
    if (formData.assigneeIds.length > 0) {
      loadSelectedUsers();
    } else {
      setSelectedUsers([]);
    }
  }, [formData.assigneeIds]);

  // Debounced user search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await userService.searchUsers(searchQuery, 10);
        setSearchResults(response.data || []);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAddAssignee = (user: SearchUserDto) => {
    if (!formData.assigneeIds.includes(user.id)) {
      setFormData({
        ...formData,
        assigneeIds: [...formData.assigneeIds, user.id]
      });
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleRemoveAssignee = (userId: number) => {
    setFormData({
      ...formData,
      assigneeIds: formData.assigneeIds.filter(id => id !== userId)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Ensure data format is correct
      const updateData: UpdateTaskDto = {
        id: formData.id,
        projectId: formData.projectId,
        statusId: formData.statusId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate,
        orderIndex: formData.orderIndex,
        assigneeIds: formData.assigneeIds
      };

      console.log('=== UPDATE TASK DEBUG ===');
      console.log('Task ID:', formData.id);
      console.log('Update Data:', JSON.stringify(updateData, null, 2));
      
      const result = await taskService.updateTaskFull(formData.id, updateData);
      console.log('Update Result:', result);
      
      (window as any).toast?.show({ severity: 'success', summary: 'Thành công', detail: '✅ Task updated successfully!', life: 3000 });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('=== UPDATE ERROR ===');
      console.error('Error object:', err);
      console.error('Error message:', err instanceof Error ? err.message : 'Unknown error');
      
      // Extract errors from error response
      const apiErrors = err?.response?.data?.errors;
      const errorMsg = apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0
        ? apiErrors.join('\n')
        : err?.response?.data?.message || (err instanceof Error ? err.message : 'Failed to update task');
      
      setError(errorMsg);
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: errorMsg, life: 4000 });
    } finally {
      setLoading(false);
    }
  };

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Edit Task
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
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
        <form 
          onSubmit={handleSubmit} 
          className="overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: theme === 'dark' ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'
          }}
        >
          <div className="p-6 space-y-5">
            {/* Error Alert */}
            {error && (
              <div className={`flex items-start gap-3 p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-red-900/20 border-red-800 text-red-400'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">{error}</div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                required
                maxLength={500}
                className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
              <div className={`text-xs mt-1 text-right ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {formData.title.length}/500
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                maxLength={5000}
                rows={5}
                className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors resize-none ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
              <div className={`text-xs mt-1 text-right ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {formData.description.length}/5000
              </div>
            </div>

            {/* Priority & Due Date Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['low', 'medium', 'high', 'emergency'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        formData.priority === p
                          ? p === 'low'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                            : p === 'medium'
                            ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                            : p === 'high'
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {p === 'low' ? '🟢' : p === 'medium' ? '🟡' : p === 'high' ? '🟠' : '🔴'} {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    dueDate: e.target.value || null 
                  })}
                  className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Assignees */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <User className="w-4 h-4 inline mr-1" />
                Assignees
              </label>

              {/* Search Input */}
              <div className="relative mb-3">
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-300'
                }`}>
                  <Search className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name or email..."
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      theme === 'dark'
                        ? 'text-white placeholder-slate-500'
                        : 'text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {searching && <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <ul className={`absolute z-10 w-full mt-2 rounded-lg border shadow-xl max-h-60 overflow-y-auto ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}>
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => handleAddAssignee(user)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-slate-700'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            theme === 'dark'
                              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                              : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white'
                          }`}>
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold truncate ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {user.fullName}
                          </div>
                          <div className={`text-xs truncate ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {user.email}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Selected Assignees */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700'
                          : 'bg-slate-100 border-slate-200'
                      }`}
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                            : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white'
                        }`}>
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {user.fullName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAssignee(user.id)}
                        className={`ml-1 p-0.5 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                            : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex justify-end gap-3 ${
            theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
              }`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
