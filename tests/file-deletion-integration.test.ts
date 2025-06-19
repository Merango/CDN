import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { FileStorageService } from '../src/services/file-storage.service';

describe('File Deletion Integration', () => {
  const uploadDirectory = path.join(process.cwd(), 'test-uploads');
  const fileStorageService = new FileStorageService(uploadDirectory);

  beforeEach(async () => {
    // Ensure upload directory exists
    await fs.mkdir(uploadDirectory, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test files
    try {
      const files = await fs.readdir(uploadDirectory);
      for (const file of files) {
        await fs.unlink(path.join(uploadDirectory, file));
      }
      await fs.rmdir(uploadDirectory);
    } catch {}
  });

  it('should successfully delete an existing file', async () => {
    // Create a test file
    const testFilename = 'test-delete-file.txt';
    const testFilePath = path.join(uploadDirectory, testFilename);
    await fs.writeFile(testFilePath, 'Test content');

    // Verify file exists before deletion
    expect(await fileStorageService.fileExists(testFilename)).toBe(true);

    // Delete the file
    const deleteResult = await fileStorageService.deleteFile(testFilename);
    
    // Check deletion result and file existence
    expect(deleteResult).toBe(true);
    expect(await fileStorageService.fileExists(testFilename)).toBe(false);
  });

  it('should handle deletion of non-existent file', async () => {
    const nonExistentFilename = 'non-existent-file.txt';

    // Attempt to delete non-existent file
    const deleteResult = await fileStorageService.deleteFile(nonExistentFilename);
    
    // Should return false for non-existent file
    expect(deleteResult).toBe(false);
  });

  it('should throw error for invalid file path', async () => {
    // This test ensures that invalid paths (like those with path traversal) are handled
    await expect(fileStorageService.deleteFile('../sensitive-file.txt'))
      .rejects
      .toThrow();
  });
});