'use client';

import React from 'react';
import { Edit3, Download, Mail, Phone } from 'lucide-react';

const ProjectDetail = () => {
  const project = {
    name: 'Website Redesign',
    status: 'In Progress',
    progress: 65,
    description:
      'This project involves redesigning the company website to improve user experience and update the brand identity.',
    startDate: '2025-08-01',
    endDate: '2025-12-15',
    managerId: {
      avatarUrl:
        'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff',
      fullName: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 123-4567',
    },
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="items-center gap-3">
            <div className='flex justify-between'>
              <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
              <span className="px-3 py-1 ml-3 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                ● {project.status}
              </span>
            </div>
            <div className='flex items-center gap-2 mt-2'>
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="w-45 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-blue-600">{project.progress}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={project.managerId.avatarUrl}
              alt={project.managerId.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-900">{project.managerId.fullName}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-blue-600" /> {project.managerId.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-green-600" /> {project.managerId.phone}
              </div>
            </div>
          </div>

          <div className="flex-wrap items-center gap-6 text-sm">
            <div>
              <span className="text-gray-500 text-xs">Start:</span>{' '}
              <span className="font-semibold">{project.startDate}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs">End:</span>{' '}
              <span className="font-semibold">{project.endDate}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              <Edit3 size={14} /> Edit
            </button>
            <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
export { ProjectDetail };
