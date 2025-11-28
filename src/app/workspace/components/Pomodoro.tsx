'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Settings,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  CheckCircle2,
  ListTodo
} from 'lucide-react';

// Types
type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';
type TimerStatus = 'idle' | 'running' | 'paused';

interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

interface PomodoroSession {
  taskId?: number;
  taskTitle?: string;
  mode: PomodoroMode;
  completedAt: Date;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

export default function Pomodoro() {
  const { theme } = useTheme();
  
  // Timer state
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration * 60); // seconds
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMiniWidget, setShowMiniWidget] = useState(false);
  
  // Task selection
  const [selectedTask, setSelectedTask] = useState<{id: number, title: string} | null>(null);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  
  // History
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  
  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const pipWindowRef = useRef<Window | null>(null);
  const updatePipRef = useRef<number | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (pipWindowRef.current && !pipWindowRef.current.closed) {
        pipWindowRef.current.close();
      }
      if (updatePipRef.current) {
        cancelAnimationFrame(updatePipRef.current);
      }
    };
  }, []);

  // Auto open PiP when page becomes hidden (minimize/switch tab)  
  useEffect(() => {
    if (typeof window === 'undefined' || !('documentPictureInPicture' in window)) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const handleVisibilityChange = async () => {
      if (document.hidden && status === 'running') {
        // Show mini widget immediately
        if (!showMiniWidget) {
          setShowMiniWidget(true);
        }
        
        // Open PiP after a short delay
        timeoutId = setTimeout(async () => {
          if (!pipWindowRef.current || pipWindowRef.current.closed) {
            try {
              await openPictureInPicture();
            } catch (e) {
              console.error('Failed to auto-open PiP:', e);
            }
          }
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [status, showMiniWidget]);

  // Play notification sound using Web Audio API
  const playNotificationSound = useCallback((type: 'start' | 'end') => {
    if (!soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'start') {
      // Start sound: ascending tones
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } else {
      // End sound: bell-like tone
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1);
      
      // Second tone
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.8);
      }, 200);
    }
  }, [soundEnabled]);

  // Timer logic
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  // Update PiP window when timeLeft changes
  useEffect(() => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      const pipWindow = pipWindowRef.current;
      const timerDisplay = pipWindow.document.getElementById('timer-display');
      const progressCircle = pipWindow.document.getElementById('progress-circle');
      
      if (timerDisplay) {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      
      if (progressCircle && progressCircle instanceof SVGCircleElement) {
        const totalDuration = 
          mode === 'work' ? settings.workDuration :
          mode === 'shortBreak' ? settings.shortBreakDuration :
          settings.longBreakDuration;
        const circumference = 2 * Math.PI * 67;
        const progress = ((totalDuration * 60 - timeLeft) / (totalDuration * 60)) * 100;
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.setAttribute('stroke-dashoffset', String(offset));
      }
    }
  }, [timeLeft, mode, settings]);

  // Update PiP play/pause button when status changes
  useEffect(() => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      const playPauseBtn = pipWindowRef.current.document.getElementById('play-pause');
      if (playPauseBtn) {
        playPauseBtn.textContent = status === 'running' ? '⏸' : '▶';
      }
    }
  }, [status]);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setStatus('idle');
    playNotificationSound('end');

    // Add to history
    const newSession: PomodoroSession = {
      taskId: selectedTask?.id,
      taskTitle: selectedTask?.title,
      mode,
      completedAt: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);

    if (mode === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);

      // Auto switch to break
      if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
        switchMode('longBreak');
        toast.success('🎉 Great work! Time for a long break!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#0f172a',
            border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '600',
          },
          icon: '🧠',
        });
      } else {
        switchMode('shortBreak');
        toast.success('✨ Focus session complete! Take a short break.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#0f172a',
            border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '600',
          },
          icon: '☕',
        });
      }
    } else {
      // After break, switch to work
      switchMode('work');
      toast.success('💪 Break time over! Ready to focus?', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: theme === 'dark' ? '#1e293b' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#0f172a',
          border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600',
        },
        icon: '🎯',
      });
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Complete! 🍅', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to focus!',
        icon: '/favicon.ico',
      });
    }
  }, [mode, completedSessions, selectedTask, settings, playNotificationSound, theme]);

  // Switch mode
  const switchMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setStatus('idle');
    
    const duration = 
      newMode === 'work' ? settings.workDuration :
      newMode === 'shortBreak' ? settings.shortBreakDuration :
      settings.longBreakDuration;
    
    setTimeLeft(duration * 60);
  };

  // Start timer
  const handleStart = () => {
    if (status === 'idle' && timeLeft === 0) {
      // Reset timer if it was completed
      const duration = 
        mode === 'work' ? settings.workDuration :
        mode === 'shortBreak' ? settings.shortBreakDuration :
        settings.longBreakDuration;
      setTimeLeft(duration * 60);
    }
    
    setStatus('running');
    playNotificationSound('start');
    setShowMiniWidget(true);

    // Show toast notification
    toast(
      mode === 'work' ? '🧠 Focus mode activated!' : '☕ Break time started!',
      {
        duration: 2000,
        position: 'top-center',
        style: {
          background: theme === 'dark' ? '#1e293b' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#0f172a',
          border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: '600',
        },
      }
    );

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // Pause timer
  const handlePause = () => {
    setStatus('paused');
  };

  // Reset timer
  const handleReset = () => {
    setStatus('idle');
    const duration = 
      mode === 'work' ? settings.workDuration :
      mode === 'shortBreak' ? settings.shortBreakDuration :
      settings.longBreakDuration;
    setTimeLeft(duration * 60);
    setShowMiniWidget(false);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    const totalDuration = 
      mode === 'work' ? settings.workDuration :
      mode === 'shortBreak' ? settings.shortBreakDuration :
      settings.longBreakDuration;
    return ((totalDuration * 60 - timeLeft) / (totalDuration * 60)) * 100;
  };

  // Mock tasks for demo (in real app, fetch from API)
  const mockTasks = [
    { id: 1, title: 'Complete API Integration' },
    { id: 2, title: 'Fix UI Bugs' },
    { id: 3, title: 'Write Documentation' },
  ];

  // Open Picture-in-Picture
  const openPictureInPicture = useCallback(async () => {
    if (!('documentPictureInPicture' in window)) {
      return;
    }

    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.close();
    }

    try {
      const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
        width: 280,
        height: 180,
      });

      pipWindowRef.current = pipWindow;

      const isDark = theme === 'dark';
      const isWork = mode === 'work';
      
      pipWindow.document.head.innerHTML = `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${isDark 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
              : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            overflow: hidden;
          }
          .container {
            text-align: center;
            padding: 16px;
            position: relative;
          }
          .icon {
            font-size: 28px;
            margin-bottom: 8px;
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          .timer {
            font-size: 48px;
            font-weight: 900;
            line-height: 1;
            margin-bottom: 6px;
            font-variant-numeric: tabular-nums;
            letter-spacing: -2px;
            background: ${isWork 
              ? isDark 
                ? 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)' 
                : 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 2px 4px ${isWork ? 'rgba(6, 182, 212, 0.3)' : 'rgba(16, 185, 129, 0.3)'});
          }
          .label {
            font-size: 10px;
            font-weight: 700;
            color: ${isDark ? '#94a3b8' : '#64748b'};
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
          }
          .task {
            font-size: 11px;
            color: ${isDark ? '#64748b' : '#94a3b8'};
            max-width: 240px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 auto 12px;
            font-weight: 500;
          }
          .controls {
            display: flex;
            gap: 8px;
            justify-content: center;
          }
          .btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }
          .btn-primary {
            background: ${isWork 
              ? isDark 
                ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' 
                : 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)'
              : 'linear-gradient(135deg, #059669 0%, #10b981 100%)'};
            color: white;
            box-shadow: 0 2px 8px ${isWork ? 'rgba(8, 145, 178, 0.3)' : 'rgba(5, 150, 105, 0.3)'};
          }
          .btn-primary:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px ${isWork ? 'rgba(8, 145, 178, 0.5)' : 'rgba(5, 150, 105, 0.5)'};
          }
          .btn-secondary {
            background: ${isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.8)'};
            color: ${isDark ? '#cbd5e1' : '#475569'};
            backdrop-filter: blur(4px);
          }
          .btn-secondary:hover {
            background: ${isDark ? 'rgba(71, 85, 105, 0.8)' : 'rgba(203, 213, 225, 1)'};
            transform: scale(1.05);
          }
          .btn:active {
            transform: scale(0.95);
          }
          .progress-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 140px;
            height: 140px;
            pointer-events: none;
          }
          .progress-ring circle {
            fill: none;
            stroke-width: 2.5;
            stroke-linecap: round;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
          }
          .progress-bg {
            stroke: ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(203, 213, 225, 0.4)'};
          }
          .progress-fill {
            stroke: ${isWork 
              ? isDark ? '#22d3ee' : '#0ea5e9'
              : '#10b981'};
            filter: drop-shadow(0 0 4px ${isWork ? 'rgba(34, 211, 238, 0.5)' : 'rgba(16, 185, 129, 0.5)'});
            transition: stroke-dashoffset 0.5s linear;
          }
        </style>
      `;

      const totalDuration = 
        mode === 'work' ? settings.workDuration :
        mode === 'shortBreak' ? settings.shortBreakDuration :
        settings.longBreakDuration;
      
      const circumference = 2 * Math.PI * 67;
      const progress = ((totalDuration * 60 - timeLeft) / (totalDuration * 60)) * 100;
      const offset = circumference - (progress / 100) * circumference;

      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      pipWindow.document.body.innerHTML = `
        <svg class="progress-ring">
          <circle class="progress-bg" cx="70" cy="70" r="67"></circle>
          <circle class="progress-fill" id="progress-circle" cx="70" cy="70" r="67"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"></circle>
        </svg>
        <div class="container">
          <div class="icon">${isWork ? '🧠' : '☕'}</div>
          <div class="timer" id="timer-display">${timeStr}</div>
          <div class="label">${isWork ? 'FOCUS' : mode === 'shortBreak' ? 'BREAK' : 'LONG BREAK'}</div>
          <div class="task">${selectedTask ? selectedTask.title : 'No task'}</div>
          <div class="controls">
            <button class="btn btn-primary" id="play-pause" title="Play/Pause">${status === 'running' ? '⏸' : '▶'}</button>
            <button class="btn btn-secondary" id="reset" title="Reset">↻</button>
          </div>
        </div>
      `;

      const playPauseBtn = pipWindow.document.getElementById('play-pause');
      const resetBtn = pipWindow.document.getElementById('reset');

      playPauseBtn!.onclick = () => {
        if (status === 'running') {
          handlePause();
        } else {
          handleStart();
        }
      };

      resetBtn!.onclick = () => {
        handleReset();
        pipWindow.close();
      };

      const handleVisibilityChange = () => {
        if (!document.hidden && pipWindow && !pipWindow.closed) {
          pipWindow.close();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      pipWindow.addEventListener('pagehide', () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      });

    } catch (error) {
      console.error('Failed to open PiP:', error);
    }
  }, [theme, mode, timeLeft, status, settings, selectedTask, handlePause, handleStart, handleReset]);

  return (
    <div className="h-full flex flex-col">
      {/* Toast Container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#0f172a',
            border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: theme === 'dark' 
              ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
              : '0 10px 40px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: theme === 'dark' ? '#22d3ee' : '#0ea5e9',
              secondary: theme === 'dark' ? '#1e293b' : '#ffffff',
            },
          },
        }}
      />

      {/* Floating Mini Widget */}
      {showMiniWidget && status !== 'idle' && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-slate-700/50'
            : 'bg-gradient-to-br from-white/95 to-slate-50/95 border-slate-200/50'
        }`} style={{ width: '280px' }}>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {mode === 'work' ? '🧠 Focus Time' : '☕ Break Time'}
              </div>
              <button
                onClick={() => setShowMiniWidget(false)}
                className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                  theme === 'dark'
                    ? 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Timer Display with Progress Ring */}
            <div className="relative flex items-center justify-center mb-3">
              {/* Progress Ring Background */}
              <svg className="absolute" width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className={theme === 'dark' ? 'text-slate-700' : 'text-slate-200'}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                  strokeLinecap="round"
                  className={
                    mode === 'work'
                      ? theme === 'dark'
                        ? 'text-cyan-500'
                        : 'text-blue-500'
                      : 'text-green-500'
                  }
                  style={{ 
                    transition: 'stroke-dashoffset 1s linear',
                    filter: `drop-shadow(0 0 8px ${mode === 'work' ? '#22d3ee40' : '#10b98140'})`
                  }}
                />
              </svg>
              
              {/* Timer Text */}
              <div className="relative z-10 text-center">
                <div className={`text-3xl font-bold tabular-nums ${
                  mode === 'work'
                    ? theme === 'dark'
                      ? 'text-cyan-400'
                      : 'text-blue-600'
                    : 'text-green-500'
                }`} style={{ letterSpacing: '-1px' }}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Task Name */}
            {selectedTask && (
              <div className={`text-center mb-3 px-2 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <div className="text-xs font-medium truncate">
                  {selectedTask.title}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-2 justify-center">
              {status === 'running' ? (
                <button
                  onClick={handlePause}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                    theme === 'dark'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                  }`}
                >
                  <Pause className="w-4 h-4 inline mr-1.5" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                    mode === 'work'
                      ? theme === 'dark'
                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/20'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-1.5" />
                  Resume
                </button>
              )}
              <button
                onClick={handleReset}
                className={`py-2.5 px-4 rounded-xl font-semibold text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin gpu-accelerated">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold flex items-center gap-3 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <Timer className="w-8 h-8 text-red-500" />
                Pomodoro Timer
              </h1>
              <p className={`mt-2 text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Stay focused with the Pomodoro Technique
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={openPictureInPicture}
                className={`p-3 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-900'
                }`}
                title="Open Picture-in-Picture"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-900'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-900'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className={`flex gap-2 p-2 rounded-xl ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}>
            <button
              onClick={() => switchMode('work')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                mode === 'work'
                  ? theme === 'dark'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:bg-slate-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              Focus
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                mode === 'shortBreak'
                  ? theme === 'dark'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:bg-slate-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Coffee className="w-4 h-4 inline mr-2" />
              Short Break
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                mode === 'longBreak'
                  ? theme === 'dark'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:bg-slate-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Coffee className="w-4 h-4 inline mr-2" />
              Long Break
            </button>
          </div>

          {/* Timer Display */}
          <div className={`rounded-2xl p-8 ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}>
            {/* Circular Progress */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className={theme === 'dark' ? 'text-slate-700' : 'text-slate-200'}
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgress() / 100)}`}
                  className={
                    mode === 'work'
                      ? theme === 'dark'
                        ? 'text-cyan-500'
                        : 'text-blue-500'
                      : mode === 'shortBreak'
                      ? 'text-green-500'
                      : 'text-purple-500'
                  }
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-6xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                <div className={`text-sm mt-2 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>

            {/* Task Selection */}
            {selectedTask ? (
              <div className={`mb-6 p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-700/50 border-slate-600'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                    }`} />
                    <div>
                      <div className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Working on
                      </div>
                      <div className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {selectedTask.title}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className={`text-xs px-3 py-1.5 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-slate-600 hover:bg-slate-500 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTaskSelector(true)}
                className={`w-full mb-6 p-4 rounded-lg border-2 border-dashed transition-colors ${
                  theme === 'dark'
                    ? 'border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-400'
                    : 'border-slate-300 hover:border-blue-500 text-slate-500 hover:text-blue-600'
                }`}
              >
                <ListTodo className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Select a task to work on</div>
              </button>
            )}

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              {status === 'running' ? (
                <button
                  onClick={handlePause}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                    theme === 'dark'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/30'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
                  }`}
                >
                  <Pause className="w-5 h-5 inline mr-2" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                    mode === 'work'
                      ? theme === 'dark'
                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/30'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                      : theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/30'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/30'
                  }`}
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  {status === 'paused' ? 'Resume' : 'Start'}
                </button>
              )}
              <button
                onClick={handleReset}
                className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                Reset
              </button>
            </div>

            {/* Stats */}
            <div className="mt-6 flex justify-center gap-8">
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  {completedSessions}
                </div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Completed
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  {Math.floor(completedSessions / settings.sessionsUntilLongBreak)}
                </div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Cycles
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`rounded-2xl p-6 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Focus Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.workDuration}
                    onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value)})}
                    className={`w-full px-4 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-white border-slate-600'
                        : 'bg-white text-slate-900 border-slate-300'
                    } border outline-none focus:ring-2 focus:ring-cyan-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.shortBreakDuration}
                    onChange={(e) => setSettings({...settings, shortBreakDuration: parseInt(e.target.value)})}
                    className={`w-full px-4 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-white border-slate-600'
                        : 'bg-white text-slate-900 border-slate-300'
                    } border outline-none focus:ring-2 focus:ring-cyan-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value)})}
                    className={`w-full px-4 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-white border-slate-600'
                        : 'bg-white text-slate-900 border-slate-300'
                    } border outline-none focus:ring-2 focus:ring-cyan-500`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recent Sessions */}
          {sessions.length > 0 && (
            <div className={`rounded-2xl p-6 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Recent Sessions
              </h3>
              <div className="space-y-2">
                {sessions.slice(0, 5).map((session, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      session.mode === 'work' ? 'bg-cyan-500' :
                      session.mode === 'shortBreak' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {session.taskTitle || 'No task selected'}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {session.mode === 'work' ? 'Focus' : 'Break'} • {new Date(session.completedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Selector Modal */}
      {showTaskSelector && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowTaskSelector(false)}
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Select a Task
            </h3>
            <div className="space-y-2">
              {mockTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskSelector(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {task.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
