/**
 * Format date to readable string
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get status color based on status string
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-300 text-slate-700';
    case 'On Hold':
      return 'bg-yellow-300 text-slate-700';
    case 'Completed':
      return 'bg-sky-300 text-slate-700';
    default:
      return 'bg-slate-300 text-slate-700';
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Class names helper
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
