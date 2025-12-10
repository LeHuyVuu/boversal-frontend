'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Video, Calendar, Users, Plus, Clock, Loader2, Trash2, Edit2, Link as LinkIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Toast } from 'primereact/toast';
import { meetingService } from '@/services/meetingService';
import type { Meeting } from '@/types/meeting';
import CreateMeetingModal from './CreateMeetingModal';

const Meetings: React.FC = () => {
  const { theme } = useTheme();
  const toast = useRef<Toast>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch meetings on mount
  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading meetings...');
      const data = await meetingService.getMeetings();
      console.log('✅ Meetings loaded:', data);
      setMeetings(data || []);
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to load meetings';
      setError(errorMsg);
      console.error('❌ Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      await meetingService.deleteMeeting(id);
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Meeting deleted successfully', 
        life: 3000 
      });
      loadMeetings();
    } catch (err: any) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err?.message || 'Failed to delete meeting', 
        life: 3000 
      });
      console.error('Failed to delete meeting:', err);
    }
  };

  const handleEdit = (meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedMeeting(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleMeetingSubmit = () => {
    loadMeetings();
    handleCloseModal();
  };

  const getMeetingStatus = (startTime: string, endTime: string): 'upcoming' | 'ongoing' | 'completed' => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'ongoing':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredMeetings = filter === 'all' 
    ? meetings 
    : meetings.filter((m) => getMeetingStatus(m.startTime, m.endTime) === filter);

  // Pagination
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMeetings = filteredMeetings.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'
          }`} />
          <p className={theme === 'dark' ? 'text-cyan-300' : 'text-gray-600'}>
            Loading meetings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className={`text-lg mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
            Error loading meetings
          </p>
          <p className={theme === 'dark' ? 'text-cyan-400' : 'text-gray-500'}>{error}</p>
          <button
            onClick={loadMeetings}
            className={`mt-4 px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-blue-500'
            }`}>
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-cyan-100' : 'text-gray-900'
              }`}>Meetings</h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-cyan-400' : 'text-gray-600'
              }`}>Your upcoming and past meetings</p>
            </div>
          </div>
          <button 
            onClick={handleCreate}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Meeting
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          {['all', 'upcoming', 'ongoing', 'completed'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as 'all' | 'upcoming' | 'ongoing' | 'completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                filter === type
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-500 shadow-lg shadow-blue-500/50'
                    : 'bg-blue-600 text-white border-blue-600'
                  : theme === 'dark'
                    ? 'bg-slate-900/60 text-cyan-200 border-blue-500/20 hover:bg-blue-900/30'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Meeting Grid */}
        {filteredMeetings.length > 0 ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMeetings.map((meeting) => {
              const status = getMeetingStatus(meeting.startTime, meeting.endTime);
              return (
                <div
                  key={meeting.id}
                  className={`rounded-xl p-6 shadow-sm border transition relative ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-blue-500/20 hover:shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50 backdrop-blur-sm'
                      : 'bg-white border-gray-200 hover:shadow-md'
                  }`}
                >
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => handleEdit(meeting, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-blue-900/30 text-blue-400'
                          : 'hover:bg-blue-50 text-blue-600'
                      }`}
                      title="Edit meeting"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteMeeting(meeting.id, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-red-900/30 text-red-400'
                          : 'hover:bg-red-50 text-red-600'
                      }`}
                      title="Delete meeting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-start mb-4 pr-16">
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-cyan-100' : 'text-gray-900'
                    }`}>
                      {meeting.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  {meeting.description && (
                    <p className={`text-sm mb-3 line-clamp-2 ${
                      theme === 'dark' ? 'text-cyan-300' : 'text-gray-600'
                    }`}>
                      {meeting.description}
                    </p>
                  )}

                  <div className={`space-y-2 text-sm ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(meeting.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{meeting.attendees.length} attendees</span>
                    </div>
                    {meeting.meetingLink && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        <a 
                          href={meeting.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`text-xs truncate hover:underline ${
                            theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                          }`}
                        >
                          {meeting.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>

                  <p className={`mt-3 text-xs line-clamp-1 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-gray-500'
                  }`}>
                    {meeting.attendees.join(', ')}
                  </p>

                  <div className="mt-4">
                    {status === 'ongoing' && meeting.meetingLink ? (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Join Now
                      </a>
                    ) : status === 'upcoming' && meeting.meetingLink ? (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full py-2 rounded-lg text-sm font-medium transition-colors text-center ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        Join Meeting
                      </a>
                    ) : (
                      <button className={`w-full py-2 rounded-lg text-sm font-medium cursor-default ${
                        theme === 'dark'
                          ? 'bg-slate-800 text-cyan-400'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? theme === 'dark'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-slate-900/60 text-cyan-300 border border-blue-500/20 hover:bg-blue-900/30'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                          : 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-900/60 text-cyan-300 border border-blue-500/20 hover:bg-blue-900/30'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? theme === 'dark'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-slate-900/60 text-cyan-300 border border-blue-500/20 hover:bg-blue-900/30'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          )}
          </>
        ) : (
          <div className={`text-center py-12 ${
            theme === 'dark' ? 'text-cyan-300' : 'text-gray-600'
          }`}>
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-lg font-medium mb-2 ${
              theme === 'dark' ? 'text-cyan-100' : 'text-gray-900'
            }`}>
              No {filter !== 'all' ? filter : ''} meetings found
            </h3>
            <p className="text-sm opacity-75">
              {filter === 'all' ? 'Create a new meeting to get started.' : `You have no ${filter} meetings.`}
            </p>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <Toast ref={toast} />

      {/* Create/Edit Meeting Modal */}
      <CreateMeetingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleMeetingSubmit}
        meeting={selectedMeeting}
        toast={toast}
      />
    </div>
  );
};

export default Meetings;
export { Meetings };
