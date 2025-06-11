const path = require('path');
const cdnConfig = require('../config/cdn.js');

/**
 * Middleware to validate CDN file paths
 * Prevents directory traversal and ensures files are served only from the CDN directory
 */
const cdnPathValidator = (req, res, next) => {
  const requestedFilePath = req.path;

  // Construct the full file path
  const fullFilePath = path.join(cdnConfig.BASE_CDN_DIR, requestedFilePath);

  // Validate the file path
  if (!cdnConfig.isValidCdnPath(fullFilePath)) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Requested file is outside the allowed CDN directory'
    });
  }

  // If path is valid, attach the full file path to the request for use in subsequent middleware
  req.fullFilePath = fullFilePath;
  next();
};

module.exports = cdnPathValidator;