'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { userService } from '@/services/userService';
import type { ChangePasswordDto } from '@/types/user';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function ChangePasswordForm() {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState<ChangePasswordDto>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const getPasswordStrength = (password: string): PasswordStrength => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;
    
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
    if (!/[!@#$%^&*]/.test(password)) errors.push('At least 1 special character (!@#$%^&*)');
    return { valid: errors.length === 0, errors };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const validation = validatePassword(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Client-side validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match');
      setLoading(false);
      return;
    }

    if (!validation.valid) {
      setError(`Password requirements:\n${validation.errors.join('\n')}`);
      setLoading(false);
      return;
    }

    try {
      await userService.changePassword(formData);
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'weak') return theme === 'dark' ? 'bg-red-500' : 'bg-red-500';
    if (passwordStrength === 'medium') return theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500';
    return theme === 'dark' ? 'bg-green-500' : 'bg-green-500';
  };

  const getStrengthWidth = () => {
    if (passwordStrength === 'weak') return 'w-1/3';
    if (passwordStrength === 'medium') return 'w-2/3';
    return 'w-full';
  };

  return (
    <div className={`rounded-2xl p-6 ${
      theme === 'dark' ? 'bg-slate-800' : 'bg-white'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
        }`}>
          <Shield className={`w-6 h-6 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
          }`} />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Change Password
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Keep your account secure with a strong password
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className={`mb-6 flex items-start gap-3 p-4 rounded-lg border ${
          theme === 'dark'
            ? 'bg-red-900/20 border-red-800 text-red-400'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm whitespace-pre-line">{error}</div>
        </div>
      )}

      {success && (
        <div className={`mb-6 flex items-start gap-3 p-4 rounded-lg border ${
          theme === 'dark'
            ? 'bg-green-900/20 border-green-800 text-green-400'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">Password changed successfully!</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <Lock className="w-4 h-4 inline mr-1" />
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
              disabled={loading}
              className={`w-full px-4 py-3 pr-12 rounded-lg border outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded ${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              disabled={loading}
              className={`w-full px-4 py-3 pr-12 rounded-lg border outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded ${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Password Strength
                </span>
                <span className={`text-xs font-bold ${
                  passwordStrength === 'weak' ? 'text-red-500' :
                  passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {passwordStrength.toUpperCase()}
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
              }`}>
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
                />
              </div>
            </div>
          )}

          {/* Password Requirements */}
          <ul className="mt-3 space-y-2">
            {[
              { check: formData.newPassword.length >= 6, text: '✓ At least 6 characters' },
              { check: /[A-Z]/.test(formData.newPassword), text: '✓ At least 1 uppercase letter' },
              { check: /[a-z]/.test(formData.newPassword), text: '✓ At least 1 lowercase letter' },
              { check: /[0-9]/.test(formData.newPassword), text: '✓ At least 1 number' },
              { check: /[!@#$%^&*]/.test(formData.newPassword), text: '✓ At least 1 special character' }
            ].map((req, idx) => (
              <li
                key={idx}
                className={`text-xs flex items-center gap-2 transition-colors ${
                  req.check
                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <span className={`w-4 h-4 flex items-center justify-center rounded-full text-xs ${
                  req.check
                    ? theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
                    : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                  {req.check ? '✓' : '○'}
                </span>
                {req.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Confirm Password */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
              className={`w-full px-4 py-3 pr-12 rounded-lg border outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded ${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <p className="mt-2 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !validation.valid || formData.newPassword !== formData.confirmPassword}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
            loading || !validation.valid || formData.newPassword !== formData.confirmPassword
              ? theme === 'dark'
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : theme === 'dark'
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/30'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
          }`}
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
