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
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { AnimatedCard } from '@/components/AnimatedCard';
import { AnimatedButton } from '@/components/AnimatedButton';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { projectService } from '@/services/projectService';
import type { ProjectDto } from '@/types/project';
import CreateProjectModal from './CreateProjectModal';
import { EditProjectModal } from './EditProjectModal';
import { DeleteProjectModal } from './DeleteProjectModal';

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

const getStatusColor = (statusId: number, isDark: boolean) => {
  switch (statusId) {
    case 1: // Active
      return isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 2: // Completed
      return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
    case 3: // On Hold
      return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200';
    case 4: // Cancelled
      return isDark ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-sky-100 text-sky-700 border-sky-200';
  }
};

const ProjectCard = React.memo<{ 
  project: ProjectDto; 
  index: number;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}>(({ project, index, onEdit, onDelete }) => {
  const { theme } = useTheme();
  
  return (
    <AnimatedCard
      delay={0}
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
              theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}>
              {project.status || 'Active'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(project);
            }}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'hover:bg-blue-900/30 text-cyan-400 hover:text-cyan-300'
                : 'hover:bg-sky-50 text-sky-600 hover:text-sky-700'
            }`}
            title="Edit project"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(project);
            }}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                : 'hover:bg-red-50 text-red-600 hover:text-red-700'
            }`}
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            href={`/workspace/project/${project.id}`}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'hover:bg-blue-900/30 text-cyan-400'
                : 'hover:bg-sky-50 text-sky-600'
            }`}
            title="View project details"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <p className={`text-sm mb-4 line-clamp-2 ${
        theme === 'dark' ? 'text-cyan-400/70' : 'text-slate-500'
      }`}>
        {project.description || project.shortIntro || 'No description'}
      </p>

      <div className={`flex items-center justify-between pt-4 border-t ${
        theme === 'dark' ? 'border-blue-500/20' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-4 text-sm">
          <div className={`flex items-center gap-1 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(project.startDate)}</span>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
});

ProjectCard.displayName = 'ProjectCard';

export function Projects() {
  const { theme } = useTheme();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectService.getProjects(pageNumber, pageSize, debouncedSearch);
        
        if (mounted) {
          setProjects(response.data || []);
          setTotalPages(response.totalPages || 1);
        }
      } catch (e: any) {
        if (mounted) {
          setError(e?.message || 'Failed to load projects');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [pageNumber, debouncedSearch]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // API trả về status dạng string như "active", không có statusId
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 1 && p.status === 'active') ||
        (statusFilter === 2 && p.status === 'completed') ||
        (statusFilter === 3 && p.status === 'on_hold') ||
        (statusFilter === 4 && p.status === 'cancelled');
      return matchesStatus;
    });
  }, [projects, statusFilter]);

  const handleCreateSuccess = async (projectId: number) => {
    setShowCreateModal(false);
    // Refresh project list immediately
    try {
      setLoading(true);
      const response = await projectService.getProjects(1, pageSize, debouncedSearch);
      setProjects(response.data || []);
      setTotalPages(response.totalPages || 1);
      setPageNumber(1); // Reset to first page to see new project
    } catch (e) {
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: 'Failed to refresh project list', life: 3000 });
      console.error('Failed to refresh projects');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: ProjectDto) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleDelete = (project: ProjectDto) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleEditSuccess = async () => {
    setShowEditModal(false);
    setSelectedProject(null);
    // Refresh project list
    try {
      const response = await projectService.getProjects(pageNumber, pageSize, debouncedSearch);
      setProjects(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (e) {
      console.error('Failed to refresh projects');
    }
  };

  const handleDeleteSuccess = async () => {
    setShowDeleteModal(false);
    setSelectedProject(null);
    // Refresh project list
    try {
      const response = await projectService.getProjects(pageNumber, pageSize, debouncedSearch);
      setProjects(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (e) {
      console.error('Failed to refresh projects');
    }
  };

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
          <button
            onClick={() => setShowCreateModal(true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:shadow-cyan-500/50'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-blue-500/50'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
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
              onChange={(e) => setStatusFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className={`rounded-xl px-4 py-2.5 text-sm transition-all focus-ring ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border border-blue-500/30 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border border-slate-300 text-slate-700 focus:border-sky-400'
              } focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="1">Active</option>
              <option value="2">Completed</option>
              <option value="3">On Hold</option>
              <option value="4">Cancelled</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[500px]">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className={`text-center py-16 rounded-xl min-h-[500px] flex flex-col items-center justify-center ${
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
          <div className="min-h-[500px]">
            {filteredProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      index={index}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                      disabled={pageNumber === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-900/80 text-cyan-100 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30'
                          : 'bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-300'
                      }`}
                    >
                      Previous
                    </button>
                    <span className={`px-4 py-2 ${
                      theme === 'dark' ? 'text-cyan-100' : 'text-slate-700'
                    }`}>
                      Page {pageNumber} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                      disabled={pageNumber === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-900/80 text-cyan-100 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30'
                          : 'bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-300'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={`text-center py-16 rounded-xl min-h-[500px] flex flex-col items-center justify-center ${
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
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          onSuccess={handleEditSuccess}
          project={selectedProject}
        />
      )}

      {/* Delete Project Modal */}
      {showDeleteModal && selectedProject && (
        <DeleteProjectModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProject(null);
          }}
          onSuccess={handleDeleteSuccess}
          project={selectedProject}
        />
      )}
    </div>
  );
}
