/**
 * Centralized error response utility for CDN file retrieval service
 * 
 * @module ErrorResponse
 */

/**
 * Error types with corresponding HTTP status codes and default messages
 * @enum {Object}
 */
const ERROR_TYPES = {
  NOT_FOUND: {
    status: 404,
    message: 'Resource not found'
  },
  FORBIDDEN: {
    status: 403,
    message: 'Access to the requested resource is forbidden'
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: 'An unexpected error occurred'
  },
  BAD_REQUEST: {
    status: 400,
    message: 'Invalid request'
  }
};

/**
 * Create a standardized error response
 * 
 * @param {Object} res - Express response object
 * @param {string} type - Error type from ERROR_TYPES
 * @param {string} [customMessage] - Optional custom error message
 * @param {Object} [additionalDetails] - Optional additional error details
 * @returns {Object} HTTP response with error details
 */
function createErrorResponse(res, type, customMessage, additionalDetails = {}) {
  // Validate input
  if (!ERROR_TYPES[type]) {
    type = 'INTERNAL_SERVER_ERROR';
  }

  const { status, message } = ERROR_TYPES[type];
  
  return res.status(status).json({
    error: {
      type,
      message: customMessage || message,
      ...additionalDetails
    }
  });
}

/**
 * Create a log-friendly error object
 * 
 * @param {string} type - Error type
 * @param {string} message - Error message
 * @param {Object} [context] - Additional context for logging
 * @returns {Object} Structured error object
 */
function createErrorLog(type, message, context = {}) {
  return {
    timestamp: new Date().toISOString(),
    type,
    message,
    context
  };
}

module.exports = {
  createErrorResponse,
  createErrorLog,
  ERROR_TYPES
};