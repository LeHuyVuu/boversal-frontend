'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Bell, Type, AlignLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'reminder' as 'meeting' | 'deadline' | 'milestone' | 'review' | 'reminder',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'reminder',
      description: '',
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-900 border border-blue-500/20'
            : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b ${
            theme === 'dark' ? 'border-blue-500/20' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-2xl font-bold ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}
          >
            Create New Event
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-slate-800 text-cyan-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <span>Event Title *</span>
              </div>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Nộp bài ASM"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 placeholder-cyan-400/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
            />
          </div>

          {/* Event Type */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Event Type</span>
              </div>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as any,
                })
              }
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
            >
              <option value="reminder">Reminder</option>
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="milestone">Milestone</option>
              <option value="review">Review</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date *</span>
              </div>
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Start Time *</span>
                </div>
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>End Time *</span>
                </div>
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlignLeft className="w-4 h-4" />
                <span>Description</span>
              </div>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes or details..."
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 placeholder-cyan-400/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/50'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
