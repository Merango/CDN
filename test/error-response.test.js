const { createErrorResponse, createErrorLog } = require('../src/utils/error-response.js');

describe('Error Response Utility', () => {
  // Mock Express response object
  const createMockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  });

  describe('createErrorResponse', () => {
    it('should create a 404 error response', () => {
      const res = createMockResponse();
      createErrorResponse(res, 'NOT_FOUND');

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'NOT_FOUND',
          message: 'Resource not found'
        }
      });
    });

    it('should create a 403 error response with custom message', () => {
      const res = createMockResponse();
      createErrorResponse(res, 'FORBIDDEN', 'Custom forbidden message');

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'FORBIDDEN',
          message: 'Custom forbidden message'
        }
      });
    });

    it('should handle invalid error type by defaulting to INTERNAL_SERVER_ERROR', () => {
      const res = createMockResponse();
      createErrorResponse(res, 'INVALID_TYPE');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    });

    it('should support additional details', () => {
      const res = createMockResponse();
      createErrorResponse(res, 'BAD_REQUEST', 'Invalid input', { details: 'Specific error' });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'BAD_REQUEST',
          message: 'Invalid input',
          details: 'Specific error'
        }
      });
    });
  });

  describe('createErrorLog', () => {
    it('should create a structured error log', () => {
      const errorLog = createErrorLog('VALIDATION_ERROR', 'Invalid input', { field: 'username' });

      expect(errorLog).toHaveProperty('timestamp');
      expect(errorLog.type).toBe('VALIDATION_ERROR');
      expect(errorLog.message).toBe('Invalid input');
      expect(errorLog.context).toEqual({ field: 'username' });
    });

    it('should create a log with minimal information', () => {
      const errorLog = createErrorLog('SYSTEM_ERROR', 'Critical failure');

      expect(errorLog).toHaveProperty('timestamp');
      expect(errorLog.type).toBe('SYSTEM_ERROR');
      expect(errorLog.message).toBe('Critical failure');
      expect(errorLog.context).toEqual({});
    });
  });
});