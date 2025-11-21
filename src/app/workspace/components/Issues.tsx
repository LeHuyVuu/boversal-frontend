'use client';
import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Bug,
  Zap,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import mockIssues from '@/mocks/mockIssues.json';
import { useTheme } from '@/contexts/ThemeContext';

export const Issues: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Low' | 'Medium' | 'High' | 'Critical'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved' | 'Closed'>('All');

  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-300 text-slate-700';
      case 'High':
        return 'bg-orange-300 text-slate-700';
      case 'Medium':
        return 'bg-yellow-300 text-slate-700';
      case 'Low':
        return 'bg-emerald-300 text-slate-700';
      default:
        return 'bg-slate-300 text-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-rose-300';
      case 'In Progress':
        return 'bg-sky-300';
      case 'Resolved':
        return 'bg-emerald-300';
      case 'Closed':
        return 'bg-slate-300';
      default:
        return 'bg-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Bug':     return Bug;
      case 'Feature': return Zap;
      case 'Task':    return CheckCircle;
      case 'Story':   return User;
      default:        return AlertTriangle;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>Issues</h1>
            <p className={theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'}>
              Track and resolve bugs, features, and tasks.
            </p>
          </div>
          <button className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50'
              : 'bg-sky-400 hover:bg-sky-500 text-white'
          }`}>
            <Plus className="w-4 h-4" />
            <span>Create Issue</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 max-w-md relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border border-blue-500/30 text-cyan-100 placeholder-cyan-400/60 focus:border-cyan-400 focus:ring-cyan-400'
                  : 'bg-white border border-slate-300 text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:ring-sky-400'
              }`}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'All' | 'Low' | 'Medium' | 'High' | 'Critical')}
              className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border border-blue-500/30 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border border-slate-300 text-slate-700 focus:border-sky-400'
              }`}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Open' | 'In Progress' | 'Resolved' | 'Closed')}
              className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border border-blue-500/30 text-cyan-100 focus:border-cyan-400'
                  : 'bg-white border border-slate-300 text-slate-700 focus:border-sky-400'
              }`}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const TypeIcon = getTypeIcon(issue.type);
            
            return (
              <div key={issue.id} className={`rounded-lg p-6 transition-all duration-200 cursor-pointer group ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border border-blue-500/20 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                  : 'bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md'
              }`}>
                <div className="flex items-start space-x-4">
                  {/* Type Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-900/30 group-hover:bg-blue-900/50'
                        : 'bg-sky-50 group-hover:bg-sky-100'
                    }`}>
                      <TypeIcon className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                      }`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                      }`}>{issue.code}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                      }`}>{issue.type}</span>
                    </div>
                    
                    <h3 className={`text-lg font-medium mb-2 transition-colors ${
                      theme === 'dark'
                        ? 'text-cyan-100 group-hover:text-cyan-300'
                        : 'text-slate-800 group-hover:text-sky-600'
                    }`}>
                      {issue.title}
                    </h3>
                    
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      theme === 'dark' ? 'text-cyan-300/70' : 'text-slate-600'
                    }`}>
                      {issue.description}
                    </p>

                    {/* Labels */}
                    {issue.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {issue.labels.map((label) => (
                          <span key={label} className={`text-xs px-2 py-1 rounded ${
                            theme === 'dark'
                              ? 'bg-blue-900/30 text-cyan-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <img
                            src={issue.assignee.avatar}
                            alt={issue.assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-cyan-200' : 'text-slate-700'
                          }`}>{issue.assignee.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className={`w-4 h-4 ${
                            theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                          }`} />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                          }`}>{formatDate(issue.updatedAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(issue.status)}`} />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                        }`}>{issue.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No issues found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
