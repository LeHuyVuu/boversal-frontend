'use client';
import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, AlertCircle, Flag, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { taskService } from '@/services/taskService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  statusId: number;
  statusName: string;
  orderIndex: number;
  onTaskCreated?: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  dueDate: string;
  assigneeIds: number[];
}

interface ValidationErrors {
  title?: string;
  projectId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  projectId,
  statusId,
  statusName,
  orderIndex,
  onTaskCreated
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assigneeIds: []
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assigneeIds: []
      });
      setErrors({});
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title không được để trống';
    } else if (formData.title.length > 500) {
      newErrors.title = 'Title không được vượt quá 500 ký tự';
    }

    if (!projectId || projectId <= 0) {
      newErrors.projectId = 'Project ID không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create request matching backend schema
      const requestData: any = {
        projectId,
        statusId,
        title: formData.title.trim(),
        priority: formData.priority,
        orderIndex: orderIndex,
        assigneeIds: [] // Empty array to satisfy backend validation
      };

      // Add optional fields only if they have values
      if (formData.description.trim()) {
        requestData.description = formData.description.trim();
      }

      if (formData.dueDate) {
        requestData.dueDate = formData.dueDate;
      }

      const response = await taskService.createTask(requestData);

      if (response.success) {
        (window as any).toast?.show({ severity: 'success', summary: 'Thành công', detail: '✅ Task created successfully!', life: 3000 });
        setLoading(false);
        onClose();
        onTaskCreated?.();
      } else {
        // Extract errors from response
        const errorMsg = response.errors && Array.isArray(response.errors) && response.errors.length > 0
          ? response.errors.join('\n')
          : response.message || 'Tạo task thất bại';
        setErrors({ title: errorMsg });
        (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: errorMsg, life: 4000 });
        setLoading(false);
      }
    } catch (error: any) {
      // Extract errors from error response
      const apiErrors = error?.response?.data?.errors;
      const errorMessage = apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0
        ? apiErrors.join('\n')
        : error?.response?.data?.message || error?.message || 'Lỗi kết nối server';
      setErrors({ title: errorMessage });
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: errorMessage, life: 4000 });
      setLoading(false);
    }
  };

  const getPriorityId = (priority: string): number => {
    const priorityMap: Record<string, number> = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'emergency': 4
    };
    return priorityMap[priority] || 2;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-500 hover:bg-green-600',
      'medium': 'bg-blue-500 hover:bg-blue-600',
      'high': 'bg-orange-500 hover:bg-orange-600',
      'emergency': 'bg-red-500 hover:bg-red-600',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ${
            theme === 'dark'
              ? 'bg-slate-900 border border-cyan-500/20'
              : 'bg-white border border-slate-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b ${
            theme === 'dark'
              ? 'border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900'
              : 'border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-cyan-100' : 'text-slate-900'
                }`}>
                  Create New Task
                </h2>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
                }`}>
                  Add task to <span className="font-semibold">{statusName}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`overflow-y-auto max-h-[calc(90vh-180px)] ${
            theme === 'dark'
              ? 'scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-slate-800/50'
              : 'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'
          }`}>
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                }`}>
                  <FileText className="w-4 h-4 inline mr-2" />
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title..."
                  autoFocus
                  maxLength={500}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    errors.title
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                      : theme === 'dark'
                      ? 'bg-slate-800 border-cyan-500/20 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'
                  } outline-none`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {formData.title.length}/500 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                }`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add description (optional)..."
                  rows={4}
                  maxLength={5000}
                  className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-cyan-500/20 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'
                  } outline-none`}
                />
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {formData.description.length}/5000 characters
                </p>
              </div>

              {/* Priority & Due Date - Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                  }`}>
                    <Flag className="w-4 h-4 inline mr-2" />
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high', 'emergency'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority })}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold uppercase transition-all ${
                          formData.priority === priority
                            ? `${getPriorityColor(priority)} text-white shadow-lg transform scale-105`
                            : theme === 'dark'
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
                  }`}>
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-cyan-500/20 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'
                    } outline-none`}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-cyan-500/10 border-cyan-500/30'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-blue-700'
                }`}>
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Task will be created in <strong>{statusName}</strong> column at position <strong>{orderIndex + 1}</strong>
                </p>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
            theme === 'dark'
              ? 'border-cyan-500/20 bg-slate-900/50'
              : 'border-slate-200 bg-slate-50'
          }`}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !formData.title.trim()}
              className={`px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
