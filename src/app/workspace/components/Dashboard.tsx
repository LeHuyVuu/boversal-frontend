'use client';

import React, { useMemo } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedCard } from '@/components/AnimatedCard';

const StatCard = React.memo<{
  stat: {
    title: string;
    value: number;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
  index: number;
}>(({ stat, index }) => {
  const { theme } = useTheme();
  
  return (
    <AnimatedCard 
      delay={0}
      className={`rounded-xl p-6 transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40'
          : 'bg-white border border-slate-200 hover:shadow-xl'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
          }`}>{stat.title}</p>
          <p className={`text-3xl font-bold mt-2 gradient-text-cyan`}>
            {stat.value}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-blue-900/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50'
        } ${stat.color}`}>
          <stat.icon className="w-7 h-7" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        <TrendingUp
          className={`w-4 h-4 mr-1 transition-transform hover:scale-110 ${
            stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600 rotate-180'
          }`}
        />
        <span
          className={`text-sm font-medium ${
            stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {stat.change}
        </span>
        <span className={`text-sm ml-1 ${
          theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
        }`}>
          vs last month
        </span>
      </div>
    </AnimatedCard>
  );
});

StatCard.displayName = 'StatCard';

export const Dashboard = React.memo(() => {
  const { theme } = useTheme();
  
  const recentTasks = useMemo(() => mockTasks.slice(0, 5), []);
  const activeProjects = useMemo(
    () => mockProjects.filter(p => p.status === 'Active').slice(0, 3),
    []
  );

  const stats = useMemo(() => [
    {
      title: 'Total Tasks',
      value: dashboardStats.totalTasks,
      change: '+12%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'text-sky-600'
    },
    {
      title: 'Active Projects',
      value: dashboardStats.activeProjects,
      change: '+2',
      trend: 'up' as const,
      icon: Target,
      color: 'text-emerald-600'
    },
    {
      title: 'Open Issues',
      value: dashboardStats.openIssues,
      change: '-3',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'text-amber-600'
    },
    {
      title: 'Team Members',
      value: 12,
      change: '+1',
      trend: 'up' as const,
      icon: Users,
      color: 'text-violet-600'
    }
  ], []);

  return (
    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin gpu-accelerated">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className={`text-4xl font-bold mb-3 ${
            theme === 'dark' ? 'gradient-text-cyan' : 'text-slate-800'
          }`}>Dashboard</h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'}`}>
            Welcome back! Here&apos;s what&apos;s happening with your projects.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} stat={stat} index={index} />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Tasks */}
          <AnimatedCard 
            delay={0}
            className={`rounded-xl p-6 ${
              theme === 'dark'
                ? 'bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm'
                : 'bg-white border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-cyan-100 neon-glow' : 'text-slate-800'
              }`}>Recent Tasks</h2>
              <BarChart3 className={`w-6 h-6 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
              }`} />
            </div>
            <div className="space-y-3">
              {recentTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-blue-900/20 hover:bg-blue-900/40 hover:scale-105'
                      : 'bg-sky-50 hover:bg-sky-100 hover:shadow-md'
                  }`}
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
                    <p className={`text-sm font-medium truncate ${
                      theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                    }`}>{task.title}</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                    }`}>
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
          </AnimatedCard>

          {/* Active Projects */}
          <AnimatedCard 
            delay={0}
            className={`rounded-xl p-6 ${
              theme === 'dark'
                ? 'bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm'
                : 'bg-white border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-cyan-100 neon-glow' : 'text-slate-800'
              }`}>Active Projects</h2>
              <Target className={`w-6 h-6 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
              }`} />
            </div>
            <div className="space-y-3">
              {activeProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-xl transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-blue-900/20 hover:bg-blue-900/40 hover:scale-105'
                      : 'bg-sky-50 hover:bg-sky-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                    }`}>{project.name}</h3>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                    }`}>{project.progress}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2.5 mb-3 overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                  }`}>
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ease-out animate-pulse-glow ${
                        theme === 'dark' ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500' : 'bg-gradient-to-r from-sky-400 to-cyan-400'
                      }`}
                      style={{ 
                        width: `${project.progress}%`,
                        backgroundSize: '200% 100%',
                        animation: 'gradient-shift 3s ease infinite'
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                    }`}>{project.team}</span>
                    <div className="flex -space-x-1">
                      {project.members.slice(0, 3).map((member) => (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          className={`w-6 h-6 rounded-full shadow-sm transition-transform hover:scale-125 hover:z-10 ${
                            theme === 'dark' ? 'border-2 border-slate-800' : 'border-2 border-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';
