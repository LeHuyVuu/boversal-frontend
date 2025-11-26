'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Shield,
  LogOut
} from 'lucide-react';
import { userService } from '@/services/userService';
import type { UserProfile, UpdateUserProfileDto, ChangePasswordDto } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileModalProps {
  onClose: () => void;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function UserProfileModal({ onClose }: UserProfileModalProps) {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UpdateUserProfileDto>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  // Password form
  const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load profile
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        if (user?.id) {
          const response = await userService.getUserProfile(user.id);
          setProfile(response.data);
          // Initialize edited profile
          setEditedProfile({
            fullName: response.data.fullName,
            gender: response.data.gender as any,
            phone: response.data.phone || undefined,
            address: response.data.address || undefined,
            bio: response.data.bio || undefined,
            avatarUrl: response.data.avatarUrl || undefined,
          });
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.updateProfile(editedProfile);
      setProfile(response.data);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (password.length < 6) errors.push('At least 6 characters');
    if (!/[A-Z]/.test(password)) errors.push('At least 1 uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('At least 1 lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('At least 1 number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('At least 1 special character');
    return { valid: errors.length === 0, errors };
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setError(null);
    setSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      setPasswordLoading(false);
      return;
    }

    const validation = validatePassword(passwordForm.newPassword);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      setPasswordLoading(false);
      return;
    }

    try {
      await userService.changePassword(passwordForm);
      setSuccess('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);
  const passwordValidation = validatePassword(passwordForm.newPassword);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className={`rounded-2xl p-8 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            User Profile
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300'
                  : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
              }`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'profile'
                ? theme === 'dark'
                  ? 'border-b-2 border-cyan-500 text-cyan-400'
                  : 'border-b-2 border-blue-500 text-blue-600'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-300'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'security'
                ? theme === 'dark'
                  ? 'border-b-2 border-cyan-500 text-cyan-400'
                  : 'border-b-2 border-blue-500 text-blue-600'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-300'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Security
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: theme === 'dark' ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'
        }}>
          <div className="p-6 space-y-6">
            {/* Alerts */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-500">{success}</p>
              </div>
            )}

            {activeTab === 'profile' ? (
              <>
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
                      : 'bg-gradient-to-br from-sky-400 to-blue-500'
                  } text-white`}>
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      profile.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {profile.fullName}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      @{profile.username}
                    </p>
                  </div>
                </div>

                {/* Form Fields - 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="col-span-2">
                    <label className={`block text-xs font-medium mb-1.5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editedProfile.fullName || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="col-span-2">
                    <label className={`block text-xs font-medium mb-1.5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className={`w-full px-3 py-2 rounded-lg border text-sm cursor-not-allowed ${
                        theme === 'dark'
                          ? 'bg-slate-800/50 border-slate-700 text-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Gender
                    </label>
                    <select
                      value={editedProfile.gender || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value as any })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
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
                    <label className={`block text-xs font-medium mb-1.5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editedProfile.phone || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-span-2">
                    <label className={`block text-xs font-medium mb-1.5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Address
                    </label>
                    <input
                      type="text"
                      value={editedProfile.address || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Bio */}
                  <div className="col-span-2">
                    <label className={`block text-xs font-medium mb-1.5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Bio
                    </label>
                    <textarea
                      value={editedProfile.bio || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors resize-none ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                }`}>
                  <Shield className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'
                  }`} />
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      Password Requirements
                    </h4>
                    <ul className={`text-xs space-y-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <li className={passwordForm.newPassword.length >= 6 ? 'text-green-500' : ''}>
                        • At least 6 characters
                      </li>
                      <li className={/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-500' : ''}>
                        • At least 1 uppercase letter
                      </li>
                      <li className={/[a-z]/.test(passwordForm.newPassword) ? 'text-green-500' : ''}>
                        • At least 1 lowercase letter
                      </li>
                      <li className={/[0-9]/.test(passwordForm.newPassword) ? 'text-green-500' : ''}>
                        • At least 1 number
                      </li>
                      <li className={/[!@#$%^&*]/.test(passwordForm.newPassword) ? 'text-green-500' : ''}>
                        • At least 1 special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Current Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors pr-12 ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors pr-12 ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {passwordForm.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${
                          passwordStrength === 'weak' ? 'text-red-500' :
                          passwordStrength === 'medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {passwordStrength.toUpperCase()}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                            passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors pr-12 ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading || !passwordValidation.valid}
                  className="w-full px-5 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
