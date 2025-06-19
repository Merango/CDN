import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { FileService, FileDeleteError } from './file-service';

describe('FileService', () => {
  const testStorageDir = './test-uploads';
  let fileService: FileService;

  beforeEach(async () => {
    // Ensure test directory exists
    await fs.mkdir(testStorageDir, { recursive: true });
    fileService = new FileService(testStorageDir);
  });

  afterEach(async () => {
    // Clean up test files and directory
    try {
      const files = await fs.readdir(testStorageDir);
      for (const file of files) {
        await fs.unlink(path.join(testStorageDir, file));
      }
      await fs.rmdir(testStorageDir);
    } catch {}
  });

  it('should successfully delete an existing file', async () => {
    const testFilename = 'test-file.txt';
    const testFilePath = path.join(testStorageDir, testFilename);
    
    // Create a test file
    await fs.writeFile(testFilePath, 'test content');

    // Attempt deletion
    await expect(fileService.deleteFile(testFilename)).resolves.not.toThrow();

    // Verify file is deleted
    await expect(fs.access(testFilePath)).rejects.toThrow();
  });

  it('should throw error when deleting non-existent file', async () => {
    await expect(fileService.deleteFile('non-existent-file.txt'))
      .rejects.toThrow(FileDeleteError);
  });

  it('should throw error for empty filename', async () => {
    await expect(fileService.deleteFile(''))
      .rejects.toThrow(FileDeleteError);
  });

  it('should throw error for null/undefined filename', async () => {
    // @ts-ignore - intentionally passing invalid input
    await expect(fileService.deleteFile(null))
      .rejects.toThrow(FileDeleteError);
    
    // @ts-ignore - intentionally passing invalid input
    await expect(fileService.deleteFile(undefined))
      .rejects.toThrow(FileDeleteError);
  });
});