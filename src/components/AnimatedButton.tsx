'use client';
import React, { ReactNode, MouseEvent, useCallback } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const AnimatedButton = React.memo<AnimatedButtonProps>(({ 
  children, 
  onClick, 
  className = '',
  disabled = false,
  variant = 'primary'
}) => {
  const createRipple = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }, []);

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      createRipple(e);
      onClick?.();
    }
  }, [disabled, onClick, createRipple]);

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    ghost: 'bg-transparent hover:bg-slate-700/10 text-slate-700 dark:text-cyan-300'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        btn-hover ripple-container
        transition-smooth
        px-6 py-3 rounded-lg font-medium
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-ring focus-ring-dark
        gpu-accelerated
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
});

AnimatedButton.displayName = 'AnimatedButton';
