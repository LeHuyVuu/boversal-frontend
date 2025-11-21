import React from 'react';
import { Search, Bell } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="bg-sky-50 border-b border-sky-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search people, projects or tasks"
              className="w-full bg-white border border-sky-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-sky-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="User"
              className="w-8 h-8 rounded-full ring-2 ring-sky-200"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700">Sarah Chen</p>
              <p className="text-xs text-slate-500">Product Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
