import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Target
} from 'lucide-react';

import mockTasks from '@/mocks/mockTasks.json';
import mockProjects from '@/mocks/mockProjects.json';
import dashboardStats from '@/mocks/dashboardStats.json';

export const Dashboard = () => {
  const recentTasks = mockTasks.slice(0, 5);
  const activeProjects = mockProjects.filter(p => p.status === 'Active').slice(0, 3);

  const stats = [
    {
      title: 'Total Tasks',
      value: dashboardStats.totalTasks,
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-sky-600'
    },
    {
      title: 'Active Projects',
      value: dashboardStats.activeProjects,
      change: '+2',
      trend: 'up',
      icon: Target,
      color: 'text-emerald-600'
    },
    {
      title: 'Open Issues',
      value: dashboardStats.openIssues,
      change: '-3',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-amber-600'
    },
    {
      title: 'Team Members',
      value: 12,
      change: '+1',
      trend: 'up',
      icon: Users,
      color: 'text-violet-600'
    }
  ] as const;

  return (
    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-sky-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp
                  className={`w-4 h-4 mr-1 ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-slate-500 text-sm ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Tasks */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Recent Tasks</h2>
              <BarChart3 className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-4 p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      task.status === 'Done'
                        ? 'bg-emerald-400'
                        : task.status === 'In Progress'
                        ? 'bg-sky-400'
                        : task.status === 'Review'
                        ? 'bg-amber-400'
                        : 'bg-slate-300'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                    <p className="text-xs text-slate-600">
                      {task.code} • {task.team}
                    </p>
                  </div>
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Active Projects</h2>
              <Target className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-800">{project.name}</h3>
                    <span className="text-xs text-slate-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-sky-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{project.team}</span>
                    <div className="flex -space-x-1">
                      {project.members.slice(0, 3).map((member) => (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          className="w-5 h-5 rounded-full border border-white shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
