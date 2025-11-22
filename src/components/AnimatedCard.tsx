'use client';
import React, { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
  glassEffect?: boolean;
}

export const AnimatedCard = React.memo<AnimatedCardProps>(({ 
  children, 
  className = '', 
  delay = 0,
  hoverEffect = true,
  glassEffect = false
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { theme } = useTheme();

  return (
    <div
      ref={ref}
      className={`
        ${isIntersecting ? 'animate-slide-in-up' : 'opacity-0'}
        ${hoverEffect ? theme === 'dark' ? 'card-hover card-hover-dark' : 'card-hover' : ''}
        ${glassEffect ? theme === 'dark' ? 'glass-morphism-dark' : 'glass-morphism' : ''}
        gpu-accelerated
        ${className}
      `}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
});

AnimatedCard.displayName = 'AnimatedCard';
