'use client';
import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Target
} from 'lucide-react';
import mockCalendarEvents from '@/mocks/mockCalendarEvents.json';
import { useTheme } from '@/contexts/ThemeContext';

export const Calendar: React.FC = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays: Array<{
    date: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    fullDate: Date;
  }> = [];
  
  // Previous month days
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonth.getDate() - i,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i)
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    calendarDays.push({
      date: day,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      fullDate: date
    });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(currentYear, currentMonth + 1, day)
    });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return mockCalendarEvents.filter(event => event.date === dateString);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-sky-300 text-slate-700';
      case 'deadline':
        return 'bg-rose-300 text-slate-700';
      case 'milestone':
        return 'bg-violet-300 text-slate-700';
      case 'review':
        return 'bg-emerald-300 text-slate-700';
      default:
        return 'bg-slate-300 text-slate-700';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return Users;
      case 'deadline': return Clock;
      case 'milestone': return Target;
      case 'review': return CalendarIcon;
      default: return CalendarIcon;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
            }`}>Calendar</h1>
            <p className={theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'}>
              Schedule and track important events and deadlines.
            </p>
          </div>
          <button className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50'
              : 'bg-sky-400 hover:bg-sky-500 text-white'
          }`}>
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className={`rounded-lg p-6 ${
              theme === 'dark'
                ? 'bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm'
                : 'bg-white border border-slate-200'
            }`}>
              {/* Calendar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                  <h2 className={`text-lg sm:text-xl font-semibold ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                  }`}>
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'text-cyan-300 hover:text-cyan-100 hover:bg-blue-900/30'
                          : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'text-cyan-300 hover:text-cyan-100 hover:bg-blue-900/30'
                          : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(['month', 'week', 'day'] as const).map((viewType) => (
                    <button
                      key={viewType}
                      onClick={() => setView(viewType)}
                      className={`px-4 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                        view === viewType
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                            : 'bg-sky-400 text-white'
                          : theme === 'dark'
                            ? 'text-cyan-300 hover:text-cyan-100 hover:bg-blue-900/30'
                            : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                      }`}
                    >
                      {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-slate-200">
                {/* Week day headers */}
                {weekDays.map((day, idx) => (
                  <div key={day} className={`p-2 sm:p-3 text-center text-xs sm:text-sm font-medium ${
                    theme === 'dark' ? 'bg-slate-800/60 text-cyan-300' : 'bg-slate-50 text-slate-600'
                  }`}>
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 1)}</span>
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const events = getEventsForDate(day.fullDate);
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-16 sm:min-h-24 p-1 sm:p-2 transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? !day.isCurrentMonth 
                            ? 'bg-slate-900/30 text-cyan-400/50'
                            : 'bg-slate-900/60 hover:bg-blue-900/30'
                          : !day.isCurrentMonth 
                            ? 'bg-slate-50 text-slate-400' 
                            : 'bg-white hover:bg-sky-50'
                      } ${day.isToday ? theme === 'dark' ? 'ring-2 ring-cyan-400' : 'ring-2 ring-sky-400' : ''}`}
                    >
                      <div className={`text-xs sm:text-sm font-medium mb-1 ${
                        day.isToday 
                          ? theme === 'dark' ? 'text-cyan-400' : 'text-sky-700'
                          : day.isCurrentMonth 
                            ? theme === 'dark' ? 'text-cyan-100' : 'text-slate-700'
                            : theme === 'dark' ? 'text-cyan-400/50' : 'text-slate-400'
                      }`}>
                        {day.date}
                      </div>
                      
                      <div className="space-y-1">
                        {events.slice(0, 2).map((event) => {
                          const EventIcon = getEventTypeIcon(event.type);
                          return (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                              title={event.title}
                            >
                              <div className="flex items-center space-x-1">
                                <EventIcon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          );
                        })}
                        {events.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Today&apos;s Events</h3>
              <div className="space-y-3">
                {mockCalendarEvents
                  .filter(event => event.date === today.toISOString().split('T')[0])
                  .map((event) => {
                    const EventIcon = getEventTypeIcon(event.type);
                    return (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-sky-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                          <EventIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-800 truncate">{event.title}</h4>
                          <p className="text-xs text-slate-600">{event.startTime} - {event.endTime}</p>
                          {event.project && (
                            <p className="text-xs text-slate-500 mt-1">{event.project}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {mockCalendarEvents.filter(event => event.date === today.toISOString().split('T')[0]).length === 0 && (
                  <p className="text-sm text-slate-600">No events today</p>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Upcoming</h3>
              <div className="space-y-3">
                {mockCalendarEvents
                  .filter(event => new Date(event.date) > today)
                  .slice(0, 5)
                  .map((event) => {
                    const EventIcon = getEventTypeIcon(event.type);
                    return (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer">
                        <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                          <EventIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-800 truncate">{event.title}</h4>
                          <p className="text-xs text-slate-600">
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {event.startTime}
                          </p>
                          {event.project && (
                            <p className="text-xs text-slate-500 mt-1">{event.project}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
