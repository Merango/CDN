const path = require('path');

/**
 * Configuration for CDN file serving
 */
const cdnConfig = {
  /**
   * Base directory for serving files
   * Ensures files can only be served from this directory
   */
  BASE_CDN_DIR: path.resolve(__dirname, '../../cdn_files'),

  /**
   * Validate if the requested file path is within the allowed CDN directory
   * @param {string} filePath - Path to the file being requested
   * @returns {boolean} Whether the file path is allowed
   */
  isValidCdnPath: function(filePath) {
    // Normalize paths to resolve any '..' or '.' 
    const normalizedRequestPath = path.normalize(filePath);
    const normalizedBasePath = path.normalize(this.BASE_CDN_DIR);

    // Check if the file path is within the base CDN directory
    const isWithinBaseDir = normalizedRequestPath.startsWith(normalizedBasePath);

    return isWithinBaseDir;
  }
};

module.exports = cdnConfig;