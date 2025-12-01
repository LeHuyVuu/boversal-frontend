'use client';

import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  AlertCircle,
  Calendar,
  HardDrive,
  FileText,
  SidebarClose,
  Video,
  ChevronDown,
  ChevronRight,
  Timer
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { projectService } from '@/services/projectService';
import { ProjectDto } from '@/types/project';
import { useTheme } from '@/contexts/ThemeContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' as const },
  { icon: FolderOpen, label: 'Projects', key: 'projects' as const },
  // { icon: AlertCircle, label: 'Issues', key: 'issues' as const },
    { icon: Timer, label: 'Pomodoro', key: 'pomodoro' as const },
  { icon: Calendar, label: 'Calendar', key: 'calendar' as const },
  // { icon: Video, label: 'Meetings', key: 'meetings' as const },
  // { icon: HardDrive, label: 'Storage', key: 'storage' as const },
  // { icon: FileText, label: 'Documents', key: 'documents' as const },
];

interface SidebarProps {
  activeSection:
  | 'dashboard'
  | 'projects'
  | 'issues'
  | 'calendar'
  | 'meetings'
  | 'pomodoro'
  | 'storage'
  | 'documents';
  onSectionChange: (
    section:
      | 'dashboard'
      | 'projects'
      | 'issues'
      | 'calendar'
      | 'meetings'
      | 'pomodoro'
      | 'storage'
      | 'documents'
  ) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar = ({ activeSection, onSectionChange, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await projectService.getProjects(1, 20);
      setProjects(response.data || []);
    } catch (error) {
      // Silently fail - will show empty projects list
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProjects();

    // Listen for project changes
    const handleProjectsChange = () => {
      fetchProjects();
    };

    window.addEventListener('projectsChanged', handleProjectsChange);

    return () => {
      window.removeEventListener('projectsChanged', handleProjectsChange);
    };
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`border-r flex flex-col h-screen transition-all duration-300 ${theme === 'dark'
            ? 'bg-black/80 border-blue-500/20 backdrop-blur-md'
            : 'bg-white border-slate-200'
          } ${isCollapsed ? 'w-16' : 'w-52'
          } ${
          // Mobile: fixed position, slide in/out
          isMobileMenuOpen
            ? 'fixed left-0 top-0 z-50 translate-x-0'
            : 'fixed left-0 top-0 z-50 -translate-x-full lg:translate-x-0 lg:relative lg:z-auto'
          }`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between m-4">
          {/* Logo */}
          <div
            className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 transition-colors ${theme === 'dark'
                ? 'hover:bg-blue-900/30 hover:text-cyan-100'
                : 'hover:bg-slate-200 hover:text-slate-900'
              }`}
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
            }}
          >
            <Image
              src="/globe.svg"
              alt="Avatar"
              width={20}
              height={20}
              className="flex-shrink-0"
            />
            {!isCollapsed && (
              <p
                className={`font-bold text-xl ${theme === 'dark' ? 'text-cyan-100' : 'text-slate-700'
                  } bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-[pulse_3s_ease-in-out_infinite]`}
              >
                BTask
              </p>

            )}
          </div>

          {/* Button toggle */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1 rounded transition-colors ${theme === 'dark'
                  ? 'hover:bg-blue-900/30'
                  : 'hover:bg-slate-100'
                }`}
            >
              <SidebarClose size={18} className={theme === 'dark' ? 'text-cyan-300' : ''} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isProjects = item.key === 'projects';

              return (
                <div key={item.label}>
                  <div className="flex items-center">
                    <Link
                      href={`/workspace/${item.key}`}
                      onClick={() => onSectionChange(item.key)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all flex-1 ${activeSection === item.key
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                            : 'bg-sky-300 text-slate-700'
                          : theme === 'dark'
                            ? 'text-cyan-200 hover:text-cyan-50 hover:bg-blue-900/30'
                            : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                        }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </Link>

                    {isProjects && !isCollapsed && (
                      <button
                        onClick={() => setProjectsExpanded(!projectsExpanded)}
                        className={`p-2 rounded transition-colors ${theme === 'dark'
                            ? 'hover:bg-blue-900/30'
                            : 'hover:bg-sky-50'
                          }`}
                      >
                        {projectsExpanded ? (
                          <ChevronDown className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-500'}`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-300' : 'text-slate-500'}`} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Projects Dropdown */}
                  {isProjects && projectsExpanded && !isCollapsed && (
                    <div className="ml-8 mt-1 space-y-1">
                      {projectsLoading ? (
                        <div className={`px-3 py-2 text-xs ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'
                          }`}>Loading...</div>
                      ) : projects.length > 0 ? (
                        projects.map((project) => (
                          <React.Fragment key={project.id}>
                            <Link
                              href={`/workspace/project/${project.id}`}
                              onClick={() => onSectionChange('projects')}
                              className={`block px-3 py-2 text-sm rounded-lg transition-all ${theme === 'dark'
                                  ? 'text-white hover:text-cyan-300 hover:bg-blue-900/50'
                                  : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${project.status === 'active' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                                    project.status === 'completed' ? 'bg-blue-400 shadow-lg shadow-blue-400/50' :
                                      project.status === 'cancelled' ? 'bg-slate-400' :
                                        'bg-amber-400 shadow-lg shadow-amber-400/50'
                                  }`} />
                                <span className="truncate font-medium">{project.name}</span>
                              </div>
                            </Link>
                          </React.Fragment>
                        ))
                      ) : (
                        <div className={`px-3 py-2 text-xs ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'
                          }`}>No projects</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};
