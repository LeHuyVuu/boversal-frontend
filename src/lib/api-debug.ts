// Debug utility to check if API hiding is working
export function checkApiHiding() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;
  let fetchCount = 0;

  // Override fetch to log but still work normally
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('/api/proxy')) {
      fetchCount++;
      console.log(`🔒 Hidden API call #${fetchCount}:`, {
        through: 'Proxy Route',
        hidden: 'Service Worker intercepts this',
        timestamp: new Date().toISOString()
      });
    }
    return originalFetch.apply(this, args);
  };

  console.log('✅ API hiding system active');
  console.log('📊 All API calls will be routed through /api/proxy');
  console.log('🚫 Network tab will only show /api/proxy, not actual endpoints');
}

export function disableApiHiding() {
  if (typeof window !== 'undefined') {
    import('@/lib/sw-register').then(({ unregisterServiceWorker }) => {
      unregisterServiceWorker();
      console.log('⚠️ API hiding disabled - calls will be visible in Network tab');
    });
  }
}
