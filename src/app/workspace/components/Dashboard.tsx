'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Target,
  Loader2,
  Activity,
  PieChart,
  TrendingDown
} from 'lucide-react';

import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedCard } from '@/components/AnimatedCard';
import { dashboardService, type DashboardData } from '@/services/dashboardService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardService.getDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || 'Failed to load dashboard');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'Total Tasks',
        value: dashboardData.stats.totalTasks,
        change: `${dashboardData.stats.taskChangeVsLastMonth > 0 ? '+' : ''}${dashboardData.stats.taskChangeVsLastMonth}`,
        trend: (dashboardData.stats.taskChangeVsLastMonth >= 0 ? 'up' : 'down') as const,
        icon: CheckCircle,
        color: 'text-sky-600'
      },
      {
        title: 'Active Projects',
        value: dashboardData.stats.activeProjects,
        change: `${dashboardData.stats.projectChangeVsLastMonth > 0 ? '+' : ''}${dashboardData.stats.projectChangeVsLastMonth}`,
        trend: (dashboardData.stats.projectChangeVsLastMonth >= 0 ? 'up' : 'down') as const,
        icon: Target,
        color: 'text-emerald-600'
      },
      {
        title: 'Open Issues',
        value: dashboardData.stats.openIssues,
        change: `${dashboardData.stats.issueChangeVsLastMonth > 0 ? '+' : ''}${dashboardData.stats.issueChangeVsLastMonth}`,
        trend: (dashboardData.stats.issueChangeVsLastMonth >= 0 ? 'up' : 'down') as const,
        icon: AlertTriangle,
        color: 'text-amber-600'
      },
      {
        title: 'Team Members',
        value: dashboardData.stats.teamMembers,
        change: '+0',
        trend: 'up' as const,
        icon: Users,
        color: 'text-violet-600'
      }
    ];
  }, [dashboardData]);

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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-12 h-12 animate-spin ${
              theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
            }`} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={`text-center py-16 rounded-xl ${
            theme === 'dark' ? 'bg-slate-900/60 border border-red-500/20' : 'bg-white border border-red-200'
          }`}>
            <AlertTriangle className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`} />
            <p className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && dashboardData && (
          <>
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
                  {dashboardData.recentTasks.length === 0 ? (
                    <p className={`text-center py-8 ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>No recent tasks</p>
                  ) : (
                    dashboardData.recentTasks.map((task) => (
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
                            task.statusName === 'Done' || task.statusName === 'Completed'
                              ? 'bg-emerald-400'
                              : task.statusName === 'In Progress'
                              ? 'bg-sky-400'
                              : task.statusName === 'Review'
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
                            {task.projectCode} • {task.statusName}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          task.priority === 'high' || task.priority === 'emergency'
                            ? 'bg-red-500/20 text-red-400'
                            : task.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))
                  )}
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
                  {dashboardData.activeProjects.length === 0 ? (
                    <p className={`text-center py-8 ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>No active projects</p>
                  ) : (
                    dashboardData.activeProjects.map((project) => (
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
                          }`}>{project.progressPercentage}%</span>
                        </div>
                        <div className={`w-full rounded-full h-2.5 mb-3 overflow-hidden ${
                          theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                        }`}>
                          <div
                            className={`h-2.5 rounded-full transition-all duration-700 ease-out animate-pulse-glow ${
                              theme === 'dark' ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500' : 'bg-gradient-to-r from-sky-400 to-cyan-400'
                            }`}
                            style={{ 
                              width: `${project.progressPercentage}%`,
                              backgroundSize: '200% 100%',
                              animation: 'gradient-shift 3s ease infinite'
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                          }`}>{project.code}</span>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}>{project.completedTasks}/{project.totalTasks} tasks</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </AnimatedCard>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Completion Trend Chart */}
              <AnimatedCard 
                delay={0.1}
                className={`rounded-xl p-6 ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-cyan-100 neon-glow' : 'text-slate-800'
                  }`}>Monthly Completion Trend</h2>
                  <Activity className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`} />
                </div>
                <div className="h-[300px]">
                  <Line
                    data={{
                      labels: dashboardData.productivityChart.monthlyCompletion.map(m => m.month),
                      datasets: [
                        {
                          label: 'Created Tasks',
                          data: dashboardData.productivityChart.monthlyCompletion.map(m => m.createdTasks),
                          borderColor: theme === 'dark' ? 'rgb(34, 211, 238)' : 'rgb(59, 130, 246)',
                          backgroundColor: theme === 'dark' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                          fill: true,
                          pointRadius: 5,
                          pointHoverRadius: 7,
                          borderWidth: 2
                        },
                        {
                          label: 'Completed Tasks',
                          data: dashboardData.productivityChart.monthlyCompletion.map(m => m.completedTasks),
                          borderColor: theme === 'dark' ? 'rgb(16, 185, 129)' : 'rgb(34, 197, 94)',
                          backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          tension: 0.4,
                          fill: true,
                          pointRadius: 5,
                          pointHoverRadius: 7,
                          borderWidth: 2
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: theme === 'dark' ? '#e0f2fe' : '#1e293b',
                            usePointStyle: true,
                            padding: 15,
                            font: {
                              size: 12,
                              weight: '600'
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          titleColor: theme === 'dark' ? '#22d3ee' : '#0369a1',
                          bodyColor: theme === 'dark' ? '#e0f2fe' : '#1e293b',
                          borderColor: theme === 'dark' ? '#22d3ee' : '#0369a1',
                          borderWidth: 1,
                          padding: 12,
                          displayColors: true,
                          boxPadding: 6
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: theme === 'dark' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(148, 163, 184, 0.2)'
                          },
                          ticks: {
                            color: theme === 'dark' ? '#94a3b8' : '#64748b',
                            font: {
                              size: 11
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: theme === 'dark' ? '#94a3b8' : '#64748b',
                            font: {
                              size: 11
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </AnimatedCard>

              {/* Tasks by Priority Chart */}
              <AnimatedCard 
                delay={0.2}
                className={`rounded-xl p-6 ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-cyan-100 neon-glow' : 'text-slate-800'
                  }`}>Tasks by Priority</h2>
                  <BarChart3 className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`} />
                </div>
                <div className="h-[300px]">
                  <Bar
                    data={{
                      labels: ['Low', 'Medium', 'High', 'Emergency'],
                      datasets: [
                        {
                          label: 'Number of Tasks',
                          data: [
                            dashboardData.productivityChart.tasksByPriority.low,
                            dashboardData.productivityChart.tasksByPriority.medium,
                            dashboardData.productivityChart.tasksByPriority.high,
                            dashboardData.productivityChart.tasksByPriority.emergency
                          ],
                          backgroundColor: [
                            theme === 'dark' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.8)',
                            theme === 'dark' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(234, 179, 8, 0.8)',
                            theme === 'dark' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 0.8)',
                            theme === 'dark' ? 'rgba(147, 51, 234, 0.7)' : 'rgba(147, 51, 234, 0.8)'
                          ],
                          borderColor: [
                            'rgb(34, 197, 94)',
                            'rgb(234, 179, 8)',
                            'rgb(239, 68, 68)',
                            'rgb(147, 51, 234)'
                          ],
                          borderWidth: 2,
                          borderRadius: 8,
                          barThickness: 60
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          titleColor: theme === 'dark' ? '#22d3ee' : '#0369a1',
                          bodyColor: theme === 'dark' ? '#e0f2fe' : '#1e293b',
                          borderColor: theme === 'dark' ? '#22d3ee' : '#0369a1',
                          borderWidth: 1,
                          padding: 12
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: theme === 'dark' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(148, 163, 184, 0.2)'
                          },
                          ticks: {
                            color: theme === 'dark' ? '#94a3b8' : '#64748b',
                            font: {
                              size: 11
                            },
                            stepSize: 1
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: theme === 'dark' ? '#94a3b8' : '#64748b',
                            font: {
                              size: 11,
                              weight: '600'
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </AnimatedCard>
            </div>

            {/* Second Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Tasks by Status Doughnut Chart */}
              <AnimatedCard 
                delay={0.3}
                className={`rounded-xl p-6 ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-cyan-100 neon-glow' : 'text-slate-800'
                  }`}>Tasks by Status</h2>
                  <PieChart className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`} />
                </div>
                <div className="h-[300px] flex items-center justify-center">
                  <Doughnut
                    data={{
                      labels: dashboardData.productivityChart.tasksByStatus.map(s => s.statusName),
                      datasets: [
                        {
                          data: dashboardData.productivityChart.tasksByStatus.map(s => s.count),
                          backgroundColor: [
                            theme === 'dark' ? 'rgba(148, 163, 184, 0.7)' : 'rgba(148, 163, 184, 0.8)',
                            theme === 'dark' ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.8)',
                            theme === 'dark' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(234, 179, 8, 0.8)',
                            theme === 'dark' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.8)'
                          ],
                          borderColor: [
                            'rgb(148, 163, 184)',
                            'rgb(59, 130, 246)',
                            'rgb(234, 179, 8)',
                            'rgb(34, 197, 94)'
                          ],
                          borderWidth: 2,
                          hoverOffset: 15
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            color: theme === 'dark' ? '#e0f2fe' : '#1e293b',
                            usePointStyle: true,
                            padding: 15,
                            font: {
                              size: 12,
                              weight: '600'
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          titleColor: theme === 'dark' ? '#22d3ee' : '#0369a1',
                          bodyColor: theme === 'dark' ? '#e0f2fe' : '#1e293b',
                          borderColor: theme === 'dark' ? '#22d3ee' : '#0369a1',
                          borderWidth: 1,
                          padding: 12,
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              const status = dashboardData.productivityChart.tasksByStatus.find(s => s.statusName === label);
                              const percentage = status ? status.percentage : 0;
                              return `${label}: ${value} tasks (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </AnimatedCard>

              {/* Completion Rate Stats */}
              <AnimatedCard 
                delay={0.4}
                className={`rounded-xl p-6 ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-cyan-100 neon-glow' : 'text-slate-800'
                  }`}>Completion Rate</h2>
                  <CheckCircle className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`} />
                </div>
                <div className="space-y-6">
                  {/* Circular Progress */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="transform -rotate-90 w-48 h-48">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke={theme === 'dark' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(148, 163, 184, 0.3)'}
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="url(#gradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 88}`}
                          strokeDashoffset={`${2 * Math.PI * 88 * (1 - dashboardData.productivityChart.completionRate.completionPercentage / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={theme === 'dark' ? '#22d3ee' : '#0ea5e9'} />
                            <stop offset="100%" stopColor={theme === 'dark' ? '#3b82f6' : '#0369a1'} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className={`text-4xl font-bold ${
                          theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                        }`}>
                          {dashboardData.productivityChart.completionRate.completionPercentage}%
                        </span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>Complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                    }`}>
                      <p className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                      }`}>Total Tasks</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                      }`}>{dashboardData.productivityChart.completionRate.totalTasks}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                    }`}>
                      <p className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-emerald-400' : 'text-green-600'
                      }`}>Completed</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        theme === 'dark' ? 'text-emerald-100' : 'text-slate-800'
                      }`}>{dashboardData.productivityChart.completionRate.completedTasks}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'
                    }`}>
                      <p className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-amber-400' : 'text-yellow-600'
                      }`}>In Progress</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        theme === 'dark' ? 'text-amber-100' : 'text-slate-800'
                      }`}>{dashboardData.productivityChart.completionRate.inProgressTasks}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'
                    }`}>
                      <p className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>To Do</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                      }`}>{dashboardData.productivityChart.completionRate.todoTasks}</p>
                    </div>
                  </div>

                  {/* Average Days */}
                  <div className={`p-4 rounded-xl text-center ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/20' 
                      : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'
                  }`}>
                    <p className={`text-xs font-medium mb-2 ${
                      theme === 'dark' ? 'text-cyan-300' : 'text-blue-700'
                    }`}>Average Days to Complete</p>
                    <p className={`text-3xl font-bold ${
                      theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                    }`}>{dashboardData.productivityChart.completionRate.averageDaysToComplete} <span className="text-lg">days</span></p>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';
