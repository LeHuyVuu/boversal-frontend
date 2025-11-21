'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Target,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Project, ProjectListResponse } from '@/types/project';
import { API_ENDPOINTS } from '@/lib/constants';
import { apiClient } from '@/lib/api-client';

const formatDate = (dateString?: string | null) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-emerald-300 text-slate-700';
    case 'archived':
      return 'bg-slate-300 text-slate-600';
    case 'completed':
      return 'bg-sky-300 text-slate-700';
    default:
      return 'bg-yellow-300 text-slate-700';
  }
};

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived' | 'completed'>('all');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<ProjectListResponse>(API_ENDPOINTS.PROJECTS);
        if (mounted && response.success) {
          setProjects(response.data);
        }
      } catch (e: unknown) {
        const error = e as Error;
        if (mounted) setError(error?.message || 'Failed to load projects');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortIntro.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  return (
    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Projects</h1>
            <p className="text-slate-600">Manage and track all your projects in one place.</p>
          </div>
          <button className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'archived' | 'completed')}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-sky-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Loading projects…</h3>
            <p className="text-slate-500">Fetching data from API.</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">Failed to load</h3>
            <p className="text-slate-500">{error}</p>
          </div>
        )}


        {/* Projects Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                return (
                  <div
                    key={project.id}
                    className="bg-white border border-slate-200 rounded-lg p-6 hover:border-sky-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <Link href={`/workspace/project/${project.id}`} className="block">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                            {project.name}
                          </h3>
                          <span className={`${getStatusColor(project.status)} text-xs px-2 py-1 rounded-full capitalize`}>
                            {project.status}
                          </span>
                        </div>
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4 text-slate-500" />
                          </a>
                        )}
                      </div>

                      {/* Short Intro */}
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{project.shortIntro}</p>

                      {/* Highlight */}
                      {project.highlight && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-800 font-medium">✨ {project.highlight}</p>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{project.description}</p>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-sky-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-slate-800">{formatDate(project.startDate)}</div>
                          <div className="text-xs text-slate-500">Start Date</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-slate-800">{formatDate(project.endDate)}</div>
                          <div className="text-xs text-slate-500">End Date</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            Created {formatDate(project.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          ID: {project.id}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No projects found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
