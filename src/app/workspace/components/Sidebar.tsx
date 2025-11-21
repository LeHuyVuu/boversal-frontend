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
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import { Project, ProjectListResponse } from '@/types/project';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' as const },
  { icon: FolderOpen, label: 'Projects', key: 'projects' as const },
  { icon: AlertCircle, label: 'Issues', key: 'issues' as const },
  { icon: Calendar, label: 'Calendar', key: 'calendar' as const },
  { icon: Video, label: 'Meetings', key: 'meetings' as const },
  { icon: HardDrive, label: 'Storage', key: 'storage' as const },
  { icon: FileText, label: 'Documents', key: 'documents' as const },
];

interface SidebarProps {
  activeSection:
    | 'dashboard'
    | 'projects'
    | 'issues'
    | 'calendar'
    | 'meetings'
    | 'storage'
    | 'documents';
  onSectionChange: (
    section:
      | 'dashboard'
      | 'projects'
      | 'issues'
      | 'calendar'
      | 'meetings'
      | 'storage'
      | 'documents'
  ) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const response = await apiClient.get<ProjectListResponse>(API_ENDPOINTS.PROJECTS);
        if (response.success) {
          setProjects(response.data);
        }
      } catch {
        // Silent fail - projects dropdown will show empty
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div
      className={`bg-white border-r border-slate-200 flex flex-col h-screen transition-all duration-300 
      ${isCollapsed ? 'w-16' : 'w-52'}`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between m-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer rounded px-2 py-1
             hover:bg-slate-200 hover:text-slate-900 transition-colors"
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
            <p className="font-bold text-sm text-slate-700">FoundersHub</p>
          )}
        </div>

        {/* Button toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-slate-100"
        >
          {isCollapsed ? <SidebarClose size={0} /> : <SidebarClose size={18} />}
        </button>
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors flex-1
                      ${
                        activeSection === item.key
                          ? 'bg-sky-300 text-slate-700'
                          : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                      }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                  
                  {isProjects && !isCollapsed && (
                    <button
                      onClick={() => setProjectsExpanded(!projectsExpanded)}
                      className="p-2 hover:bg-sky-50 rounded transition-colors"
                    >
                      {projectsExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  )}
                </div>

                {/* Projects Dropdown */}
                {isProjects && projectsExpanded && !isCollapsed && (
                  <div className="ml-8 mt-1 space-y-1">
                    {projectsLoading ? (
                      <div className="px-3 py-2 text-xs text-slate-400">Loading...</div>
                    ) : projects.length > 0 ? (
                      projects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/workspace/project/${project.id}`}
                          className="block px-3 py-2 text-sm text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              project.status === 'active' ? 'bg-emerald-400' :
                              project.status === 'archived' ? 'bg-slate-400' :
                              'bg-sky-400'
                            }`} />
                            <span className="truncate">{project.name}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400">No projects</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
