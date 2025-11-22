// Performance monitoring utilities
export const measureRenderTime = (componentName: string) => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return { start: () => {}, end: () => {} };
  }

  let startTime: number;

  return {
    start: () => {
      startTime = performance.now();
    },
    end: () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than 1 frame at 60fps
        console.warn(
          `⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      } else {
        console.log(
          `✅ ${componentName} rendered in ${renderTime.toFixed(2)}ms`
        );
      }
    }
  };
};

export const logComponentMount = (componentName: string) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`🔵 ${componentName} mounted`);
  }
};

export const logComponentUnmount = (componentName: string) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`🔴 ${componentName} unmounted`);
  }
};

// Check if browser supports IntersectionObserver
export const supportsIntersectionObserver = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  );
};

// Lazy load images
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  placeholder?: string
) => {
  if (!supportsIntersectionObserver()) {
    img.src = src;
    return;
  }

  if (placeholder) {
    img.src = placeholder;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  observer.observe(img);
};

// Debounce function for performance
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll/resize events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
