'use client';

import React, { useEffect, useState } from 'react';
import { Edit3, Download, Mail, Phone, Loader2 } from 'lucide-react';
import { projectService } from '@/services/projectService';
import type { ProjectDto } from '@/types/project';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectDetailProps {
  projectId?: number;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const { theme } = useTheme();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await projectService.getProject(projectId);
        
        if (response.success) {
          setProject(response.data);
        } else {
          setError(response.message || 'Failed to load project');
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className={`p-6 flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-900/30' : 'bg-white'
      }`}>
        <Loader2 className={`w-8 h-8 animate-spin ${
          theme === 'dark' ? 'text-cyan-400' : 'text-sky-500'
        }`} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={`p-6 ${
        theme === 'dark' ? 'bg-slate-900/30' : 'bg-white'
      }`}>
        <p className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
          {error || 'Project not found'}
        </p>
      </div>
    );
  }

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      'active': 'Active',
      'completed': 'Completed',
      'on-hold': 'On Hold',
      'cancelled': 'Cancelled',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string): string => {
    if (theme === 'dark') {
      return status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
             status === 'completed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
             status === 'on-hold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
             'bg-red-500/20 text-red-300 border border-red-500/30';
    }
    return status === 'active' ? 'bg-emerald-50 text-emerald-700' :
           status === 'completed' ? 'bg-blue-50 text-blue-700' :
           status === 'on-hold' ? 'bg-amber-50 text-amber-700' :
           'bg-red-50 text-red-700';
  };

  return (
    <div className={`p-4 ${
      theme === 'dark' ? 'bg-black/50' : 'bg-slate-50'
    }`}>
      <div className={`rounded-xl border p-5 shadow-sm ${
        theme === 'dark'
          ? 'bg-slate-900/60 border-blue-500/20'
          : 'bg-white border-gray-200'
      }`}>
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className='flex items-center gap-3 mb-2'>
              <h1 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-cyan-100' : 'text-gray-900'
              }`}>{project.name}</h1>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className='flex items-center gap-3'>
              <div className={`flex-1 max-w-xs rounded-full h-2 ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              }`}>
                <div
                  className={theme === 'dark' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all' : 'bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full transition-all'}
                  style={{ width: `0%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
              }`}>0%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-blue-900/30 text-cyan-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Edit3 className="w-4 h-4" />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-blue-900/30 text-cyan-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Timeline */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <p className={`text-xs font-medium mb-1 ${
              theme === 'dark' ? 'text-cyan-400/70' : 'text-gray-500'
            }`}>Timeline</p>
            <div className="flex items-center gap-2 text-sm">
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-cyan-100' : 'text-gray-900'
              }`}>
                {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }) : 'N/A'}
              </p>
              <span className={theme === 'dark' ? 'text-cyan-400/60' : 'text-gray-400'}>→</span>
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-cyan-100' : 'text-gray-900'
              }`}>
                {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Project Manager - Commented out as managerId not in ProjectDto */}
          {/* {project.managerId && (
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              <p className={`text-xs font-medium mb-1 ${
                theme === 'dark' ? 'text-cyan-400/70' : 'text-gray-500'
              }`}>Project Manager</p>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {project.managerId.fullName?.charAt(0).toUpperCase() || 'M'}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-gray-900'
                  }`}>{project.managerId.fullName || 'Unknown'}</p>
                </div>
              </div>
            </div>
          )} */}

          {/* Contact - Commented out as managerId not in ProjectDto */}
          {/* {project.managerId && (project.managerId.email || project.managerId.phone) && (
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              <p className={`text-xs font-medium mb-1 ${
                theme === 'dark' ? 'text-cyan-400/70' : 'text-gray-500'
              }`}>Contact</p>
              <div className="flex items-center gap-2">
                {project.managerId.email && (
                  <a
                    href={`mailto:${project.managerId.email}`}
                    className={`p-1.5 rounded-md transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-blue-900/30 text-cyan-400'
                        : 'hover:bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {project.managerId.phone && (
                  <a
                    href={`tel:${project.managerId.phone}`}
                    className={`p-1.5 rounded-md transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-blue-900/30 text-cyan-400'
                        : 'hover:bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )} */}
        </div>

        {/* Description */}
        {project.description && (
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <h3 className={`text-xs font-semibold mb-1.5 uppercase tracking-wide ${
              theme === 'dark' ? 'text-cyan-400/70' : 'text-gray-500'
            }`}>Description</h3>
            <p className={`text-sm leading-relaxed ${
              theme === 'dark' ? 'text-cyan-200/70' : 'text-gray-600'
            }`}>
              {project.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
