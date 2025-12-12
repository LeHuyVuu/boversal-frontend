'use client';
import React, { useState, useEffect } from 'react';
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
  AlignLeft,
  Trash2,
  Check
} from 'lucide-react';
import mockCalendarEvents from '@/mocks/mockCalendarEvents.json';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar as PrimeCalendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import 'primereact/resources/themes/lara-dark-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { reminderService, ReminderDto, localToUTC, utcToLocal, formatLocalDateTime } from '@/services/reminderService';

export const Calendar: React.FC = () => {
  const { theme } = useTheme();
  const toast = React.useRef<Toast>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [reminders, setReminders] = useState<ReminderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    note: ''
  });

  // Fetch reminders from API
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderService.getReminders(false, false);
      setReminders(data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to load reminders',
        life: 3000 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.title) return;
    
    try {
      // Combine date and time into one Date object
      const combinedDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      
      // Convert to UTC for API
      const reminderTimeUTC = localToUTC(combinedDateTime);
      
      await reminderService.createReminder({
        title: formData.title,
        note: formData.note || undefined,
        reminderTime: reminderTimeUTC
      });
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Reminder created successfully',
        life: 3000 
      });
      
      // Reset form
      setFormData({ title: '', note: '' });
      setSelectedTime(null);
      
      // Refresh list
      await fetchReminders();
    } catch (error: any) {
      console.error('Failed to create reminder:', error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.message || 'Failed to create reminder',
        life: 3000 
      });
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await reminderService.deleteReminder(id);
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Reminder deleted',
        life: 3000 
      });
      await fetchReminders();
    } catch (error) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to delete reminder',
        life: 3000 
      });
    }
  };

  const handleToggleComplete = async (reminder: ReminderDto) => {
    try {
      await reminderService.updateReminder(reminder.id, {
        title: reminder.title,
        note: reminder.note || undefined,
        reminderTime: reminder.reminderTime,
        isCompleted: !reminder.isCompleted
      });
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: reminder.isCompleted ? 'Marked as incomplete' : 'Marked as complete',
        life: 3000 
      });
      await fetchReminders();
    } catch (error) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to update reminder',
        life: 3000 
      });
    }
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
    return reminders.filter(reminder => {
      const reminderDate = utcToLocal(reminder.reminderTime);
      const reminderDateString = reminderDate.toISOString().split('T')[0];
      return reminderDateString === dateString;
    });
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
      <Toast ref={toast} />
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
                        {events.slice(0, 2).map((reminder) => {
                          const reminderDate = utcToLocal(reminder.reminderTime);
                          const tooltipId = `reminder-${reminder.id}`;
                          
                          return (
                            <React.Fragment key={reminder.id}>
                              <Tooltip 
                                target={`.${tooltipId}`}
                                position="top"
                                className="text-sm"
                              >
                                <div className="space-y-1.5">
                                  <div className="font-semibold">{reminder.title}</div>
                                  <div className="flex items-center gap-1.5 text-xs opacity-90">
                                    <Clock className="w-3 h-3" />
                                    {reminderDate.toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: false
                                    })}
                                  </div>
                                  {reminder.note && (
                                    <div className="text-xs opacity-80 border-t border-white/20 pt-1.5 mt-1.5">
                                      {reminder.note}
                                    </div>
                                  )}
                                  <div className="text-xs opacity-75 italic">
                                    {reminder.isCompleted ? '✓ Completed' : 'Pending'}
                                  </div>
                                </div>
                              </Tooltip>
                              <div
                                className={`${tooltipId} text-xs p-1 rounded truncate cursor-pointer transition-transform hover:scale-105 ${
                                  reminder.isCompleted ? 'bg-green-300' : 'bg-cyan-300'
                                } text-slate-700`}
                              >
                                <div className="flex items-center space-x-1">
                                  <Bell className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{reminder.title}</span>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                        {events.length > 2 && (
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                          }`}>
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
                {selectedDate ? 'Create Reminder' : 'Select a date'}
              </h3>

              <form onSubmit={handleCreateReminder} className="space-y-3">
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
                  <div className="prime-time-picker">
                    <PrimeCalendar
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.value as Date)}
                      timeOnly
                      hourFormat="24"
                      stepMinute={1}
                      disabled={!selectedDate}
                      showIcon
                      icon="pi pi-clock"
                      placeholder="Select time"
                      className={`w-full ${
                        theme === 'dark' ? 'p-calendar-dark' : ''
                      }`}
                      inputClassName={`w-full px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500 disabled:opacity-50'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 disabled:opacity-50'
                      }`}
                    />
                  </div>
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
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
                  <span>Create Reminder</span>
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
              }`}>Today&apos;s Reminders</h3>
              <div className="space-y-2">
                {loading ? (
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                  }`}>Loading...</p>
                ) : (
                  <>
                    {reminders
                      .filter(reminder => {
                        const reminderDate = utcToLocal(reminder.reminderTime);
                        return reminderDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
                      })
                      .map((reminder) => {
                        const reminderDate = utcToLocal(reminder.reminderTime);
                        return (
                          <div key={reminder.id} className={`flex items-start space-x-2 p-2 rounded-lg group ${
                            theme === 'dark' ? 'bg-blue-900/20' : 'bg-sky-50'
                          } ${
                            reminder.isCompleted ? 'opacity-60' : ''
                          }`}>
                            <div className={`p-1.5 rounded-lg ${
                              reminder.isCompleted ? 'bg-green-300' : 'bg-cyan-300'
                            } text-slate-700`}>
                              <Bell className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-xs font-medium truncate ${
                                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                              } ${
                                reminder.isCompleted ? 'line-through' : ''
                              }`}>{reminder.title}</h4>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                              }`}>
                                {reminderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                              </p>
                              {reminder.note && (
                                <p className={`text-xs mt-0.5 ${
                                  theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                                }`}>{reminder.note}</p>
                              )}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleToggleComplete(reminder)}
                                className={`p-1 rounded hover:bg-green-500/20 ${
                                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`}
                                title={reminder.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteReminder(reminder.id)}
                                className={`p-1 rounded hover:bg-rose-500/20 ${
                                  theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
                                }`}
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    {reminders.filter(reminder => {
                      const reminderDate = utcToLocal(reminder.reminderTime);
                      return reminderDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
                    }).length === 0 && (
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                      }`}>No reminders today</p>
                    )}
                  </>
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
              }`}>Upcoming Reminders</h3>
              <div className="space-y-2">
                {loading ? (
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                  }`}>Loading...</p>
                ) : (
                  <>
                    {reminders
                      .filter(reminder => {
                        const reminderDate = utcToLocal(reminder.reminderTime);
                        return reminderDate > today;
                      })
                      .sort((a, b) => {
                        const dateA = utcToLocal(a.reminderTime);
                        const dateB = utcToLocal(b.reminderTime);
                        return dateA.getTime() - dateB.getTime();
                      })
                      .slice(0, 5)
                      .map((reminder) => {
                        const reminderDate = utcToLocal(reminder.reminderTime);
                        return (
                          <div key={reminder.id} className={`flex items-start space-x-2 p-2 rounded-lg transition-colors group ${
                            theme === 'dark'
                              ? 'bg-blue-900/20 hover:bg-blue-900/30'
                              : 'bg-sky-50 hover:bg-sky-100'
                          } ${
                            reminder.isCompleted ? 'opacity-60' : ''
                          }`}>
                            <div className={`p-1.5 rounded-lg ${
                              reminder.isCompleted ? 'bg-green-300' : 'bg-cyan-300'
                            } text-slate-700`}>
                              <Bell className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-xs font-medium truncate ${
                                theme === 'dark' ? 'text-cyan-100' : 'text-slate-800'
                              } ${
                                reminder.isCompleted ? 'line-through' : ''
                              }`}>{reminder.title}</h4>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-cyan-300' : 'text-slate-600'
                              }`}>
                                {reminderDate.toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })} • {reminderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                              </p>
                              {reminder.note && (
                                <p className={`text-xs mt-0.5 ${
                                  theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                                }`}>{reminder.note}</p>
                              )}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleToggleComplete(reminder)}
                                className={`p-1 rounded hover:bg-green-500/20 ${
                                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`}
                                title={reminder.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteReminder(reminder.id)}
                                className={`p-1 rounded hover:bg-rose-500/20 ${
                                  theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
                                }`}
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    {reminders.filter(reminder => {
                      const reminderDate = utcToLocal(reminder.reminderTime);
                      return reminderDate > today;
                    }).length === 0 && (
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-slate-600'
                      }`}>No upcoming reminders</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
