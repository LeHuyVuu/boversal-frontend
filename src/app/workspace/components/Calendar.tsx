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

export const Calendar: React.FC = () => {
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Calendar</h1>
            <p className="text-slate-600">Schedule and track important events and deadlines.</p>
          </div>
          <button className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {(['month', 'week', 'day'] as const).map((viewType) => (
                    <button
                      key={viewType}
                      onClick={() => setView(viewType)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        view === viewType
                          ? 'bg-sky-400 text-white'
                          : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                      }`}
                    >
                      {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Week day headers */}
                {weekDays.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-slate-600">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const events = getEventsForDate(day.fullDate);
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-24 p-2 border border-slate-200 hover:bg-sky-50 transition-colors cursor-pointer ${
                        !day.isCurrentMonth ? 'bg-slate-50 text-slate-400' : 'bg-white'
                      } ${day.isToday ? 'ring-2 ring-sky-400' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        day.isToday ? 'text-sky-700' : day.isCurrentMonth ? 'text-slate-700' : 'text-slate-400'
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
