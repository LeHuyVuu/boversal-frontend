import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  circle = false
}) => {
  const { theme } = useTheme();
  
  return (
    <div
      className={`${circle ? 'rounded-full' : 'rounded-lg'} ${width} ${height} ${
        theme === 'dark' ? 'skeleton' : 'skeleton-light'
      } ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-xl p-6 border ${
      theme === 'dark' 
        ? 'bg-slate-900/60 border-blue-500/20' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton circle width="w-12" height="h-12" />
        <div className="flex-1">
          <Skeleton width="w-3/4" height="h-4" className="mb-2" />
          <Skeleton width="w-1/2" height="h-3" />
        </div>
      </div>
      <Skeleton width="w-full" height="h-20" className="mb-3" />
      <div className="flex gap-2">
        <Skeleton width="w-16" height="h-6" />
        <Skeleton width="w-16" height="h-6" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-xl border ${
      theme === 'dark' 
        ? 'bg-slate-900/60 border-blue-500/20' 
        : 'bg-white border-slate-200'
    }`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-200/10">
          <Skeleton circle width="w-10" height="h-10" />
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/5" height="h-4" />
          <Skeleton width="w-1/6" height="h-4" />
          <Skeleton width="w-20" height="h-8" />
        </div>
      ))}
    </div>
  );
};
