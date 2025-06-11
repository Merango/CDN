const path = require('path');

/**
 * Middleware to sanitize file paths and prevent directory traversal attacks
 * @param {string} cdnBasePath - Base directory for serving files
 * @returns {Function} Express middleware function
 */
function createPathSanitizerMiddleware(cdnBasePath) {
  if (!cdnBasePath) {
    throw new Error('CDN base path must be provided');
  }

  return (req, res, next) => {
    try {
      // Normalize the requested path (remove any .. or . segments)
      const requestedPath = path.normalize(req.path);

      // Resolve the full path, ensuring it's within the CDN base directory
      const fullPath = path.resolve(cdnBasePath, requestedPath.replace(/^\//, ''));

      // Check if the resolved path is within the base directory
      const isWithinBaseDir = fullPath.startsWith(path.resolve(cdnBasePath));

      if (!isWithinBaseDir) {
        return res.status(403).json({ 
          error: 'Access denied', 
          message: 'Requested file is outside the permitted directory' 
        });
      }

      // Attach the sanitized path to the request for further processing
      req.sanitizedPath = fullPath;
      next();
    } catch (error) {
      res.status(500).json({ 
        error: 'Path sanitization failed', 
        message: 'An error occurred while processing the file path' 
      });
    }
  };
}

module.exports = createPathSanitizerMiddleware;