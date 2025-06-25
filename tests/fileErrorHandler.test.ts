import fs from 'fs/promises';
import { checkFileAccess, FileAccessError } from '../src/fileErrorHandler';

describe('File Error Handling', () => {
  it('should throw FileAccessError when file cannot be accessed', async () => {
    // Mock fs.access to simulate permission denied
    jest.spyOn(fs, 'access').mockRejectedValue(new Error('Permission denied'));
    
    await expect(checkFileAccess('/path/to/nonexistent/file')).rejects.toThrow(FileAccessError);
  });

  it('should successfully check file access when file exists', async () => {
    // Create mock for successful file access
    jest.spyOn(fs, 'access').mockResolvedValue(undefined);
    jest.spyOn(fs, 'stat').mockResolvedValue({} as unknown as NodeJS.ErrnoException);

    await expect(checkFileAccess('/path/to/valid/file')).resolves.not.toThrow();
  });

  it('should handle unknown errors during file access', async () => {
    // Simulate an unknown error
    jest.spyOn(fs, 'access').mockRejectedValue(new Error());
    
    await expect(checkFileAccess('/path/to/file')).rejects.toThrow(FileAccessError);
  });
});