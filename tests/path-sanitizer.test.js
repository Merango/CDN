import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import createPathSanitizerMiddleware from '../src/middleware/path-sanitizer';

describe('Path Sanitizer Middleware', () => {
  const mockCdnBasePath = '/var/cdn';

  it('should throw an error if no base path is provided', () => {
    expect(() => createPathSanitizerMiddleware()).toThrow('CDN base path must be provided');
  });

  it('should allow access to files within the base directory', () => {
    const middleware = createPathSanitizerMiddleware(mockCdnBasePath);
    
    const mockReq = { path: '/valid-file.txt' };
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const mockNext = vi.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.sanitizedPath).toBe(path.resolve(mockCdnBasePath, 'valid-file.txt'));
  });

  it('should block directory traversal attempts', () => {
    const middleware = createPathSanitizerMiddleware(mockCdnBasePath);
    
    const mockReq = { path: '/../etc/passwd' };
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const mockNext = vi.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Access denied'
    }));
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle nested directory traversal attempts', () => {
    const middleware = createPathSanitizerMiddleware(mockCdnBasePath);
    
    const mockReq = { path: '/some/nested/../../../etc/passwd' };
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const mockNext = vi.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Access denied'
    }));
    expect(mockNext).not.toHaveBeenCalled();
  });
});