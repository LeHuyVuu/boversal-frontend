/**
 * API Hiding Test Component
 * Add this to any page to test if API hiding is working
 */

'use client';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { disableApiHiding } from '@/lib/api-debug';

export function ApiHidingTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHiddenCall = async () => {
    setLoading(true);
    try {
      // This will be hidden from Network tab
      const response = await apiClient.get('/test-endpoint');
      setResult('✅ Hidden call successful! Check Network tab - you should only see /api/proxy');
      console.log('Hidden API response:', response);
    } catch (error) {
      setResult('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const testVisibleCall = async () => {
    setLoading(true);
    try {
      // This will be visible in Network tab - using apiClient directly
      const response = await apiClient.get('/test-endpoint');
      setResult('✅ Direct call successful! Check Network tab - you should see the actual endpoint');
      console.log('Direct API response:', response);
    } catch (error) {
      setResult('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-blue-500/20 max-w-md z-50">
      <h3 className="font-bold mb-3 text-slate-800 dark:text-cyan-100">
        🔒 API Hiding Test
      </h3>
      
      <div className="space-y-2">
        <button
          onClick={testHiddenCall}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          Test Hidden API Call
        </button>
        
        <button
          onClick={testVisibleCall}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          Test Visible API Call
        </button>
        
        <button
          onClick={() => {
            disableApiHiding();
            setResult('⚠️ API hiding disabled. Refresh page to re-enable.');
          }}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Disable API Hiding
        </button>
      </div>

      {result && (
        <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-900 rounded text-sm text-slate-700 dark:text-cyan-300">
          {result}
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500 dark:text-cyan-400">
        💡 Open DevTools (F12) → Network tab to see the difference
      </div>
    </div>
  );
}
