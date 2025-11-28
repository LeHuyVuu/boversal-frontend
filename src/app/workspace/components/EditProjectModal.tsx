'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { projectService } from '@/services/projectService';
import type { ProjectDto, UpdateProjectDto } from '@/types/project';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: ProjectDto;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateProjectDto>({
    id: project.id,
    ownerId: project.ownerId,
    name: project.name,
    demoUrl: project.demoUrl || '',
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    shortIntro: project.shortIntro || '',
    highlight: project.highlight || '',
    description: project.description || ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: project.id,
        ownerId: project.ownerId,
        name: project.name,
        demoUrl: project.demoUrl || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        shortIntro: project.shortIntro || '',
        highlight: project.highlight || '',
        description: project.description || ''
      });
    }
  }, [isOpen, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: UpdateProjectDto = {
        ...formData,
        demoUrl: formData.demoUrl || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        shortIntro: formData.shortIntro || null,
        highlight: formData.highlight || null,
        description: formData.description || null
      };

      const response = await projectService.updateProject(project.id, updateData);
      
      if (response.success) {
        if ((window as any).toast) {
          (window as any).toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Project updated successfully',
            life: 3000
          });
        }
        onSuccess();
        onClose();
      } else {
        const errorMessage = response.errors 
          ? Object.values(response.errors).flat().join('\n')
          : response.message;
        
        if ((window as any).toast) {
          (window as any).toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 4000
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join('\n')
        : error?.response?.data?.message || error?.message || 'Failed to update project';
      
      if ((window as any).toast) {
        (window as any).toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 4000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg max-h-[95vh] rounded-2xl shadow-2xl ${
          theme === 'dark'
            ? 'bg-slate-900 border border-blue-500/20'
            : 'bg-white border border-slate-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-3 sm:p-4 border-b ${
          theme === 'dark' ? 'bg-slate-900 border-blue-500/20' : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-lg sm:text-xl font-bold ${
            theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
          }`}>
            Edit Project
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-slate-800 text-slate-400 hover:text-cyan-400'
                : 'hover:bg-slate-100 text-slate-600 hover:text-blue-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-[calc(95vh-140px)] overflow-y-auto">
          {/* Project Name */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
            }`}>
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-cyan-400/20`}
              placeholder="Enter project name"
            />
          </div>

          {/* Demo URL */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
            }`}>
              Demo URL
            </label>
            <input
              type="url"
              value={formData.demoUrl || ''}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-cyan-400/20`}
              placeholder="https://example.com"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
              }`}>
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-400'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-400/20`}
                />
                <Calendar className={`absolute right-2 top-2.5 w-4 h-4 pointer-events-none ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'
                }`} />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${
                theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
              }`}>
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-400'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-400/20`}
                />
                <Calendar className={`absolute right-2 top-2.5 w-4 h-4 pointer-events-none ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'
                }`} />
              </div>
            </div>
          </div>

          {/* Short Intro */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
            }`}>
              Short Introduction
            </label>
            <input
              type="text"
              value={formData.shortIntro || ''}
              onChange={(e) => setFormData({ ...formData, shortIntro: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-cyan-400/20`}
              placeholder="Brief project summary"
            />
          </div>

          {/* Highlight */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
            }`}>
              Highlight
            </label>
            <input
              type="text"
              value={formData.highlight || ''}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-cyan-400/20`}
              placeholder="Key highlights or achievements"
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors resize-none ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-cyan-400/20`}
              placeholder="Detailed project description"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
