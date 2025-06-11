const { describe, it, expect } = require('vitest');
const path = require('path');
const cdnConfig = require('../src/config/cdn.js');

describe('CDN Path Validation', () => {
  it('should validate paths within the CDN directory', () => {
    const validPath = path.join(cdnConfig.BASE_CDN_DIR, 'test.txt');
    expect(cdnConfig.isValidCdnPath(validPath)).toBe(true);
  });

  it('should reject paths outside the CDN directory', () => {
    const invalidPath1 = path.resolve('/etc/passwd');
    const invalidPath2 = path.join(cdnConfig.BASE_CDN_DIR, '../outside.txt');

    expect(cdnConfig.isValidCdnPath(invalidPath1)).toBe(false);
    expect(cdnConfig.isValidCdnPath(invalidPath2)).toBe(false);
  });

  it('should handle nested directory paths', () => {
    const nestedValidPath = path.join(cdnConfig.BASE_CDN_DIR, 'nested/folder/file.txt');
    expect(cdnConfig.isValidCdnPath(nestedValidPath)).toBe(true);
  });
});