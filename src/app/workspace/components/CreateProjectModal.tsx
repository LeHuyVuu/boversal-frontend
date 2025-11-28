'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { X, Loader2, CheckCircle2, AlertCircle, Calendar, Link as LinkIcon } from 'lucide-react';
import { useCreateProject } from '@/hooks/useCreateProject';
import type { CreateProjectDto } from '@/types/project';

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: (projectId: number) => void;
}

export default function CreateProjectModal({ onClose, onSuccess }: CreateProjectModalProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { createProject, loading, error } = useCreateProject();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState<CreateProjectDto>({
    ownerId: user?.id || 0,
    name: '',
    demoUrl: '',
    startDate: '',
    endDate: '',
    shortIntro: '',
    highlight: '',
    description: ''
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!formData.name.trim()) {
      setValidationError('Project name is required');
      return;
    }

    if (formData.name.length > 255) {
      setValidationError('Project name must be less than 255 characters');
      return;
    }

    // Clean up optional fields
    const cleanedData: CreateProjectDto = {
      ownerId: formData.ownerId,
      name: formData.name.trim(),
      demoUrl: formData.demoUrl?.trim() || null,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      shortIntro: formData.shortIntro?.trim() || null,
      highlight: formData.highlight?.trim() || null,
      description: formData.description?.trim() || null
    };

    const projectId = await createProject(cleanedData);

    if (projectId) {
      onSuccess(projectId);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Create New Project
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: theme === 'dark' ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'
        }}>
          <div className="p-6 space-y-5">
            {/* Error Alert */}
            {(error || validationError) && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error || validationError}</p>
              </div>
            )}

            {/* Project Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                required
                maxLength={255}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Demo URL */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <LinkIcon className="w-4 h-4 inline mr-1" />
                Demo URL
              </label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://demo.yourproject.com"
                maxLength={500}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Short Intro */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Short Introduction
              </label>
              <input
                type="text"
                value={formData.shortIntro}
                onChange={(e) => setFormData({ ...formData, shortIntro: e.target.value })}
                placeholder="A brief introduction to your project"
                maxLength={500}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Highlights */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Highlights
              </label>
              <input
                type="text"
                value={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                placeholder="Key features or highlights"
                maxLength={500}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of your project"
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors resize-none ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
            theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
