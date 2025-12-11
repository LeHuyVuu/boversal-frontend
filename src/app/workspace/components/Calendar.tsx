'use client';
import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Target,
  Bell,
  Type,
  AlignLeft
} from 'lucide-react';
import mockCalendarEvents from '@/mocks/mockCalendarEvents.json';
import { useTheme } from '@/contexts/ThemeContext';

export const Calendar: React.FC = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    type: 'reminder' as 'meeting' | 'deadline' | 'milestone' | 'review' | 'reminder',
    description: ''
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    console.log('New event:', {
      ...formData,
      date: selectedDate.toISOString().split('T')[0]
    });
    
    // Reset form
    setFormData({
      title: '',
      time: '',
      type: 'reminder',
      description: ''
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar - 2 columns */}
          <div className="lg:col-span-2">
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
                      onClick={() => handleDateClick(day.fullDate)}
                      className={`min-h-16 sm:min-h-24 p-1 sm:p-2 transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? !day.isCurrentMonth 
                            ? 'bg-slate-900/30 text-cyan-400/50'
                            : 'bg-slate-900/60 hover:bg-blue-900/30'
                          : !day.isCurrentMonth 
                            ? 'bg-slate-50 text-slate-400' 
                            : 'bg-white hover:bg-sky-50'
                      } ${day.isToday ? theme === 'dark' ? 'ring-2 ring-cyan-400' : 'ring-2 ring-sky-400' : ''} ${
                        selectedDate?.toDateString() === day.fullDate.toDateString()
                          ? theme === 'dark'
                            ? 'ring-2 ring-blue-500 bg-blue-900/40'
                            : 'ring-2 ring-blue-500 bg-blue-50'
                          : ''
                      }`}
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

          {/* Right Sidebar - Event Creator & List */}
          <div className="space-y-6">
            {/* Event Creator */}
            <div className={`rounded-lg p-4 border ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-blue-500/20 backdrop-blur-sm'
                : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-base font-semibold mb-3 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>
                {selectedDate ? 'Create Event' : 'Select a date'}
              </h3>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                {/* Selected Date Display */}
                {selectedDate && (
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3 h-3" />
                        <span>Date</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-slate-800/50 border-blue-500/20 text-cyan-100'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Type className="w-3 h-3" />
                      <span>Title</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!selectedDate}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Nộp bài ASM"
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-blue-500/20 text-cyan-100 placeholder-cyan-400/50 focus:border-cyan-500 disabled:opacity-50'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 disabled:opacity-50'
                    }`}
                  />
                </div>

                {/* Time */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>Time</span>
                    </div>
                  </label>
                  <select
                    required
                    disabled={!selectedDate}
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500 disabled:opacity-50'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 disabled:opacity-50'
                    }`}
                  >
                    <option value="">Select time</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <React.Fragment key={i}>
                          <option value={`${hour}:00`}>{`${hour}:00`}</option>
                          <option value={`${hour}:30`}>{`${hour}:30`}</option>
                        </React.Fragment>
                      );
                    })}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <AlignLeft className="w-3 h-3" />
                      <span>Note</span>
                    </div>
                  </label>
                  <textarea
                    disabled={!selectedDate}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add notes..."
                    rows={2}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border transition-colors resize-none ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-blue-500/20 text-cyan-100 placeholder-cyan-400/50 focus:border-cyan-500 disabled:opacity-50'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 disabled:opacity-50'
                    }`}
                  />
                </div>

                {/* Create Button */}
                <button
                  type="submit"
                  disabled={!selectedDate}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm text-white transition-colors flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </form>
            </div>

            {/* Today's Events */}
            <div className={`rounded-lg p-4 border ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-blue-500/20 backdrop-blur-sm'
                : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-base font-semibold mb-3 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>Today&apos;s Events</h3>
              <div className="space-y-2">
                {mockCalendarEvents
                  .filter(event => event.date === today.toISOString().split('T')[0])
                  .map((event) => {
                    const EventIcon = getEventTypeIcon(event.type);
                    return (
                      <div key={event.id} className={`flex items-start space-x-2 p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-blue-900/20' : 'bg-sky-50'
                      }`}>
                        <div className={`p-1.5 rounded-lg ${getEventTypeColor(event.type)}`}>
                          <EventIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-medium truncate ${
                            theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                          }`}>{event.title}</h4>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                          }`}>{event.startTime} - {event.endTime}</p>
                          {event.project && (
                            <p className={`text-xs mt-0.5 ${
                              theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                            }`}>{event.project}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {mockCalendarEvents.filter(event => event.date === today.toISOString().split('T')[0]).length === 0 && (
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                  }`}>No events today</p>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className={`rounded-lg p-4 border ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-blue-500/20 backdrop-blur-sm'
                : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-base font-semibold mb-3 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
              }`}>Upcoming</h3>
              <div className="space-y-2">
                {mockCalendarEvents
                  .filter(event => new Date(event.date) > today)
                  .slice(0, 5)
                  .map((event) => {
                    const EventIcon = getEventTypeIcon(event.type);
                    return (
                      <div key={event.id} className={`flex items-start space-x-2 p-2 rounded-lg transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-blue-900/20 hover:bg-blue-900/30'
                          : 'bg-sky-50 hover:bg-sky-100'
                      }`}>
                        <div className={`p-1.5 rounded-lg ${getEventTypeColor(event.type)}`}>
                          <EventIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-medium truncate ${
                            theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                          }`}>{event.title}</h4>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                          }`}>
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {event.startTime}
                          </p>
                          {event.project && (
                            <p className={`text-xs mt-0.5 ${
                              theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                            }`}>{event.project}</p>
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
