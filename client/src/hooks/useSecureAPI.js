import { useState, useCallback } from 'react';

export const useSecureAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = useCallback(async (apiCall, successCallback = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      if (successCallback) {
        successCallback(result);
      }
      return { success: true, data: result };
    } catch (err) {
      const message = err.message || 'An error occurred';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { callAPI, loading, error, clearError };
};