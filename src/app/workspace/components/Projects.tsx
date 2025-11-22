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
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedCard } from '@/components/AnimatedCard';
import { AnimatedButton } from '@/components/AnimatedButton';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import { useDebounce } from '@/hooks/useDebounce';

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

const getStatusColor = (status: string, isDark: boolean) => {
  switch (status.toLowerCase()) {
    case 'active':
      return isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'archived':
      return isDark ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : 'bg-slate-100 text-slate-600 border-slate-200';
    case 'completed':
      return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200';
  }
};

const ProjectCard = React.memo<{ project: Project; index: number }>(({ project, index }) => {
  const { theme } = useTheme();
  
  return (
    <AnimatedCard
      delay={index * 0.05}
      className={`rounded-xl p-6 border transition-all ${
        theme === 'dark'
          ? 'bg-slate-900/60 border-blue-500/20 hover:border-blue-500/40'
          : 'bg-white border-slate-200 hover:shadow-xl hover:border-sky-300'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>{project.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              getStatusColor(project.status, theme === 'dark')
            }`}>
              {project.status}
            </span>
          </div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-cyan-300/80' : 'text-slate-600'
          }`}>{project.shortIntro}</p>
        </div>
        <Link
          href={`/workspace/project/${project.id}`}
          className={`p-2 rounded-lg transition-all ${
            theme === 'dark'
              ? 'hover:bg-blue-900/30 text-cyan-400'
              : 'hover:bg-sky-50 text-sky-600'
          }`}
        >
          <ExternalLink className="w-5 h-5" />
        </Link>
      </div>

      <p className={`text-sm mb-4 line-clamp-2 ${
        theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
      }`}>
        {project.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t ${
        theme === 'dark' ? 'border-blue-500/20' : 'border-slate-200'
      }">
        <div className="flex items-center gap-4 text-sm">
          <div className={`flex items-center gap-1 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(project.startDate)}</span>
          </div>
          <div className={`flex items-center gap-1 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
          }`}>
            <Users className="w-4 h-4" />
            <span>{project.members?.length || 0}</span>
          </div>
        </div>
        <div className={`text-sm font-medium ${
          theme === 'dark' ? 'text-cyan-300' : 'text-slate-700'
        }`}>
          {project.progress}% complete
        </div>
      </div>

      <div className={`mt-3 w-full rounded-full h-2 overflow-hidden ${
        theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
      }`}>
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700"
          style={{ 
            width: `${project.progress}%`,
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 3s ease infinite'
          }}
        />
      </div>
    </AnimatedCard>
  );
});

ProjectCard.displayName = 'ProjectCard';

export const Projects = React.memo(() => {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
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
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.shortIntro.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, debouncedSearch, statusFilter]);

  return (
    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin gpu-accelerated">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'gradient-text-cyan' : 'text-slate-800'
            }`}>Projects</h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
            }`}>Manage and track all your projects in one place.</p>
          </div>
          <AnimatedButton
            variant="primary"
            className="whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </AnimatedButton>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="flex-1 max-w-md relative group">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
              theme === 'dark' ? 'text-cyan-400 group-focus-within:text-cyan-300' : 'text-slate-400 group-focus-within:text-sky-500'
            }`} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all focus-ring ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border border-blue-500/30 text-cyan-100 placeholder-cyan-400/60 focus:border-cyan-400'
                  : 'bg-white border border-slate-300 text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:shadow-lg'
              } focus:outline-none`}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className={`w-4 h-4 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
            }`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'archived' | 'completed')}
              className={`rounded-xl px-4 py-2.5 text-sm transition-all focus-ring ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border border-blue-500/30 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border border-slate-300 text-slate-700 focus:border-sky-400'
              } focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className={`text-center py-16 rounded-xl ${
            theme === 'dark' ? 'bg-slate-900/60 border border-blue-500/20' : 'bg-white border border-slate-200'
          }`}>
            <Target className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-rose-400' : 'text-rose-300'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-700'
            }`}>Failed to load</h3>
            <p className={`${
              theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
            }`}>{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 rounded-xl ${
                theme === 'dark' ? 'bg-slate-900/60 border border-blue-500/20' : 'bg-white border border-slate-200'
              }`}>
                <Target className={`w-16 h-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-cyan-400/50' : 'text-slate-300'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-cyan-100' : 'text-slate-600'
                }`}>No projects found</h3>
                <p className={`${
                  theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                }`}>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

Projects.displayName = 'Projects';;
