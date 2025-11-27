'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Toast } from 'primereact/toast';
import { meetingService } from '@/services/meetingService';
import { Meeting, CreateMeetingDto, UpdateMeetingDto } from '@/types/meeting';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  meeting?: Meeting | null;
  toast: React.RefObject<Toast>;
}

const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  meeting,
  toast,
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    meetingLink: '',
    attendees: [] as string[],
  });
  const [attendeeInput, setAttendeeInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (meeting) {
      // Edit mode - populate form with meeting data
      setFormData({
        title: meeting.title,
        description: meeting.description || '',
        startTime: new Date(meeting.startTime).toISOString().slice(0, 16),
        endTime: new Date(meeting.endTime).toISOString().slice(0, 16),
        meetingLink: meeting.meetingLink || '',
        attendees: meeting.attendees,
      });
    } else {
      // Create mode - reset form
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        meetingLink: '',
        attendees: [],
      });
    }
    setAttendeeInput('');
    setErrors({});
  }, [meeting, isOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    } else {
      const startDate = new Date(formData.startTime);
      if (!meeting && startDate < new Date()) {
        newErrors.startTime = 'Start time must be in the future';
      }
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (formData.meetingLink && formData.meetingLink.length > 500) {
      newErrors.meetingLink = 'Meeting link must be less than 500 characters';
    }

    if (formData.attendees.length === 0) {
      newErrors.attendees = 'At least one attendee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAttendee = () => {
    const email = attendeeInput.trim();
    
    if (!email) {
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ ...errors, attendeeInput: 'Invalid email address' });
      return;
    }

    if (formData.attendees.includes(email)) {
      setErrors({ ...errors, attendeeInput: 'Email already added' });
      return;
    }

    setFormData({
      ...formData,
      attendees: [...formData.attendees, email],
    });
    setAttendeeInput('');
    setErrors({ ...errors, attendeeInput: '' });
  };

  const handleRemoveAttendee = (email: string) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.filter((a) => a !== email),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please fix the errors in the form', 
        life: 3000 
      });
      return;
    }

    setLoading(true);

    try {
      const meetingData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        meetingLink: formData.meetingLink.trim() || undefined,
        attendees: formData.attendees,
      };

      if (meeting) {
        // Update existing meeting
        await meetingService.updateMeeting(meeting.id, meetingData as UpdateMeetingDto);
        toast.current?.show({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Meeting updated successfully', 
          life: 3000 
        });
      } else {
        // Create new meeting
        await meetingService.createMeeting(meetingData as CreateMeetingDto);
        toast.current?.show({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Meeting created successfully! Email invitations sent.', 
          life: 4000 
        });
      }

      onSubmit();
    } catch (error: any) {
      console.error('Failed to save meeting:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save meeting';
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: errorMessage, 
        life: 3000 
      });
    } finally {
      setLoading(false);
    }
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
        className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-900 border border-blue-500/20'
            : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${
          theme === 'dark' ? 'border-blue-500/20' : 'border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'
              : 'text-gray-900'
          }`}>
            {meeting ? 'Edit Meeting' : 'Create New Meeting'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
            }`}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                errors.title ? 'border-red-500' : ''
              }`}
              placeholder="Enter meeting title"
              maxLength={255}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Enter meeting description (optional)"
              rows={3}
              maxLength={2000}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
            }`}>
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                errors.startTime ? 'border-red-500' : ''
              }`}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
            }`}>
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                errors.endTime ? 'border-red-500' : ''
              }`}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
            )}
          </div>

          {/* Meeting Link */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
            }`}>
              Meeting Link
            </label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                errors.meetingLink ? 'border-red-500' : ''
              }`}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              maxLength={500}
            />
            {errors.meetingLink && (
              <p className="mt-1 text-sm text-red-500">{errors.meetingLink}</p>
            )}
          </div>

          {/* Attendees */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-gray-700'
            }`}>
              Attendees <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAttendee();
                  }
                }}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-blue-500/20 text-cyan-100 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.attendeeInput ? 'border-red-500' : ''
                }`}
                placeholder="Enter attendee email"
              />
              <button
                type="button"
                onClick={handleAddAttendee}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.attendeeInput && (
              <p className="mt-1 text-sm text-red-500">{errors.attendeeInput}</p>
            )}
            {errors.attendees && (
              <p className="mt-1 text-sm text-red-500">{errors.attendees}</p>
            )}

            {/* Attendee List */}
            {formData.attendees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.attendees.map((email) => (
                  <div
                    key={email}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                      theme === 'dark'
                        ? 'bg-blue-900/30 text-cyan-300 border border-blue-500/20'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttendee(email)}
                      className={`hover:text-red-500 transition-colors`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className={`flex justify-end gap-3 p-6 border-t ${
          theme === 'dark' ? 'border-blue-500/20' : 'border-gray-200'
        }`}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {meeting ? 'Update Meeting' : 'Create Meeting'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMeetingModal;
