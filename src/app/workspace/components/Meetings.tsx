'use client';
import React, { useState } from 'react';
import { Video, Calendar, Users, Plus, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

const Meetings: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Project Alpha Kickoff',
      date: '2024-12-20',
      time: '10:00 AM',
      participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Design Review',
      date: '2024-12-19',
      time: '03:30 PM',
      participants: ['Design Team', 'Stakeholders'],
      status: 'ongoing',
    },
    {
      id: '3',
      title: 'Weekly Stand-up',
      date: '2024-12-21',
      time: '02:00 PM',
      participants: ['Team Alpha', 'Sarah Wilson'],
      status: 'completed',
    },
    {
      id: '4',
      title: 'Project Alpha Kickoff',
      date: '2024-12-20',
      time: '10:00 AM',
      participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      status: 'upcoming',
    },
    {
      id: '5',
      title: 'Design Review',
      date: '2024-12-19',
      time: '03:30 PM',
      participants: ['Design Team', 'Stakeholders'],
      status: 'ongoing',
    },
    {
      id: '6',
      title: 'Weekly Stand-up',
      date: '2024-12-21',
      time: '02:00 PM',
      participants: ['Team Alpha', 'Sarah Wilson'],
      status: 'completed',
    },
  ];

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

  const filteredMeetings =
    filter === 'all' ? meetings : meetings.filter((m) => m.status === filter);

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
          <button className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
            <Plus className="w-4 h-4" />
            Schedule Meeting
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className={`rounded-xl p-6 shadow-sm border transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border-blue-500/20 hover:shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50 backdrop-blur-sm'
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-gray-900'
                  }`}>
                    {meeting.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      meeting.status
                    )}`}
                  >
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                  </span>
                </div>

                <div className={`space-y-2 text-sm ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{meeting.participants.length} participants</span>
                  </div>
                </div>

                <p className={`mt-3 text-xs ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  {meeting.participants.join(', ')}
                </p>

                <div className="mt-4">
                  {meeting.status === 'ongoing' ? (
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                      Join Now
                    </button>
                  ) : meeting.status === 'upcoming' ? (
                    <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      Join Meeting
                    </button>
                  ) : (
                    <button className={`w-full py-2 rounded-lg text-sm font-medium cursor-default ${
                      theme === 'dark'
                        ? 'bg-slate-800 text-cyan-400'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings</h3>
            <p className="text-gray-500 mb-6">Schedule your first meeting</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Schedule Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
export { Meetings };
