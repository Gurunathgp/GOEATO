/**
 * Centralized error handling utilities
 */

/**
 * Extract error message from various error types
 * @param {Error|Object|any} error - The error to extract message from
 * @returns {string} - A user-friendly error message
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  if (error?.toString) return error.toString();
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle API errors with user-friendly messages
 * @param {Error} error - The error object
 * @param {Function} addToast - Toast notification function
 * @param {string} fallbackMessage - Fallback message if no specific error message
 */
export function handleApiError(error, addToast, fallbackMessage = 'Operation failed. Please try again.') {
  const message = getErrorMessage(error);
  console.error('API Error:', error);
  addToast(message, 'error');
  return message;
}

/**
 * Check if error is a network error
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return (
    error?.message?.toLowerCase().includes('network') ||
    error?.message?.toLowerCase().includes('fetch') ||
    error?.code === 'ERR_NETWORK' ||
    !error?.response
  );
}

/**
 * Check if error is an authentication error
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
export function isAuthError(error) {
  return error?.response?.status === 401 || error?.response?.status === 403;
}

/**
 * Log error to console with optional context
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context information
 */
export function logError(error, context = {}) {
  console.error('Error occurred:', {
    error: error?.message || error,
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}