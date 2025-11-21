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

export const Issues: React.FC = () => {
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Issues</h1>
            <p className="text-slate-600">Track and resolve bugs, features, and tasks.</p>
          </div>
          <button className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Issue</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'All' | 'Low' | 'Medium' | 'High' | 'Critical')}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-sky-400"
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
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-sky-400"
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
              <div key={issue.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-sky-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="flex items-start space-x-4">
                  {/* Type Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                      <TypeIcon className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-slate-600">{issue.code}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span className="text-xs text-slate-500">{issue.type}</span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                      {issue.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {issue.description}
                    </p>

                    {/* Labels */}
                    {issue.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {issue.labels.map((label) => (
                          <span key={label} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
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
                          <span className="text-sm text-slate-700">{issue.assignee.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600">{formatDate(issue.updatedAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(issue.status)}`} />
                        <span className="text-sm text-slate-600">{issue.status}</span>
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
