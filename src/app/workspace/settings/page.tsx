'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { userService } from '@/services/userService';
import type { UserProfile, UpdateUserProfileDto } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordForm from '@/app/workspace/components/ChangePasswordForm';

export default function SettingsPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Load profile
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        if (user?.userId) {
          const response = await userService.getUserProfile(user.userId);
          setProfile(response.data);
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);

  const handleUpdateField = async (updates: UpdateUserProfileDto) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.updateProfile(updates);
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`h-full flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <Loader2 className={`w-8 h-8 animate-spin ${
          theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
        }`} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`h-full flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="text-red-500">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-y-auto ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Settings
          </h1>
          <p className={`mt-2 text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className={`flex items-start gap-3 p-4 rounded-lg border ${
            theme === 'dark'
              ? 'bg-red-900/20 border-red-800 text-red-400'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">{error}</div>
          </div>
        )}

        {success && (
          <div className={`flex items-start gap-3 p-4 rounded-lg border ${
            theme === 'dark'
              ? 'bg-green-900/20 border-green-800 text-green-400'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">{success}</div>
          </div>
        )}

        {/* Tabs */}
        <div className={`flex gap-2 p-2 rounded-xl ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        }`}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'profile'
                ? theme === 'dark'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : theme === 'dark'
                ? 'text-slate-400 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'security'
                ? theme === 'dark'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : theme === 'dark'
                ? 'text-slate-400 hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🔒 Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className={`rounded-2xl p-6 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Personal Information
              </h2>

              <div className="space-y-6">
                {/* Avatar & Email (Read-only) */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName}
                        className="w-24 h-24 rounded-full"
                      />
                    ) : (
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                          : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white'
                      }`}>
                        {profile.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email (Cannot be changed)
                      </label>
                      <div className={`px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-700 text-slate-400'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        {profile.email}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Username (Cannot be changed)
                      </label>
                      <div className={`px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-700 text-slate-400'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        @{profile.username}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={profile.fullName}
                    onBlur={(e) => {
                      if (e.target.value !== profile.fullName && e.target.value.trim()) {
                        handleUpdateField({ fullName: e.target.value });
                      }
                    }}
                    maxLength={200}
                    disabled={saving}
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Gender
                  </label>
                  <select
                    value={profile.gender || ''}
                    onChange={(e) => handleUpdateField({ 
                      gender: e.target.value as 'male' | 'female' | 'other' || undefined 
                    })}
                    disabled={saving}
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Not specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={profile.phone || ''}
                    onBlur={(e) => {
                      if (e.target.value !== profile.phone) {
                        handleUpdateField({ phone: e.target.value || undefined });
                      }
                    }}
                    maxLength={20}
                    pattern="[\d\s\+\-\(\)]+"
                    disabled={saving}
                    placeholder="+84 912 345 678"
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address
                  </label>
                  <input
                    type="text"
                    defaultValue={profile.address || ''}
                    onBlur={(e) => {
                      if (e.target.value !== profile.address) {
                        handleUpdateField({ address: e.target.value || undefined });
                      }
                    }}
                    maxLength={500}
                    disabled={saving}
                    placeholder="City, Country"
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <FileText className="w-4 h-4 inline mr-1" />
                    Bio
                  </label>
                  <textarea
                    defaultValue={profile.bio || ''}
                    onBlur={(e) => {
                      if (e.target.value !== profile.bio) {
                        handleUpdateField({ bio: e.target.value || undefined });
                      }
                    }}
                    maxLength={1000}
                    rows={4}
                    disabled={saving}
                    placeholder="Tell us about yourself..."
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors resize-none ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    defaultValue={profile.avatarUrl || ''}
                    onBlur={(e) => {
                      if (e.target.value !== profile.avatarUrl) {
                        handleUpdateField({ avatarUrl: e.target.value || undefined });
                      }
                    }}
                    maxLength={1000}
                    disabled={saving}
                    placeholder="https://example.com/avatar.jpg"
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              {saving && (
                <div className="mt-4 flex items-center gap-2 text-sm text-cyan-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving changes...
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className={`rounded-2xl p-6 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Account Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`text-xs font-semibold mb-1 uppercase tracking-wide ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Created At
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {formatDate(profile.createdAt)}
                  </div>
                </div>
                <div>
                  <div className={`text-xs font-semibold mb-1 uppercase tracking-wide ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    Last Login
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {profile.lastLoginAt ? formatDate(profile.lastLoginAt) : 'Never'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div>
            <ChangePasswordForm />
          </div>
        )}
      </div>
    </div>
  );
}
