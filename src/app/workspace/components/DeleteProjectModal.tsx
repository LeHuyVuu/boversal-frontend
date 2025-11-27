'use client';

import React, { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { projectService } from '@/services/projectService';
import type { ProjectDto } from '@/types/project';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: ProjectDto;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== project.name) {
      if ((window as any).toast) {
        (window as any).toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please type the project name to confirm deletion',
          life: 3000
        });
      }
      return;
    }

    setLoading(true);

    try {
      const response = await projectService.deleteProject(project.id);
      
      if (response.success) {
        if ((window as any).toast) {
          (window as any).toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Project deleted successfully',
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
        : error?.response?.data?.message || error?.message || 'Failed to delete project';
      
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-md my-4 sm:my-8 rounded-2xl shadow-2xl ${
          theme === 'dark'
            ? 'bg-slate-900 border border-red-500/20'
            : 'bg-white border border-red-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${
          theme === 'dark' ? 'border-red-500/20' : 'border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
            }`}>
              <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <h2 className={`text-lg sm:text-xl font-bold ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>
              Delete Project
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-slate-800 text-slate-400 hover:text-red-400'
                : 'hover:bg-slate-100 text-slate-600 hover:text-red-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className={`p-3 sm:p-4 rounded-lg ${
            theme === 'dark' ? 'bg-red-900/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-red-300' : 'text-red-700'
            }`}>
              <span className="font-semibold">Warning:</span> This action cannot be undone. 
              This will permanently delete the project and all associated data.
            </p>
          </div>

          <div>
            <p className={`text-sm mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              You are about to delete:
            </p>
            <div className={`p-4 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-slate-800/50 border-cyan-500/30' 
                : 'bg-slate-50 border-slate-300'
            }`}>
              <p className={`font-bold text-lg ${
                theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
              }`}>
                {project.name}
              </p>
              {project.shortIntro && (
                <p className={`text-sm mt-2 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {project.shortIntro}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Type <span className={`font-bold px-2 py-0.5 rounded ${
                theme === 'dark' 
                  ? 'bg-cyan-500/20 text-cyan-300' 
                  : 'bg-blue-100 text-blue-700'
              }`}>{project.name}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-red-500/20 text-cyan-100 focus:border-red-400'
                  : 'bg-white border-red-300 text-slate-900 focus:border-red-500'
              } focus:outline-none focus:ring-2 focus:ring-red-400/20`}
              placeholder="Type project name"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t ${
          theme === 'dark' ? 'border-red-500/20' : 'border-red-200'
        }`}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={`px-4 sm:px-6 py-2 text-sm rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== project.name}
            className={`px-4 sm:px-6 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Project'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
