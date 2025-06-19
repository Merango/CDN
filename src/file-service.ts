import fs from 'fs/promises';
import path from 'path';

export class FileDeleteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileDeleteError';
  }
}

export class FileService {
  private storageDirectory: string;

  constructor(storageDirectory: string = './uploads') {
    this.storageDirectory = storageDirectory;
  }

  /**
   * Delete a file from the storage directory
   * @param filename - Name of the file to delete
   * @throws {FileDeleteError} When file cannot be deleted
   */
  async deleteFile(filename: string): Promise<void> {
    // Validate input
    if (!filename || filename.trim() === '') {
      throw new FileDeleteError('Invalid filename provided');
    }

    const filePath = path.join(this.storageDirectory, filename);

    try {
      // Check if file exists before attempting deletion
      await fs.access(filePath);

      // Attempt to delete the file
      await fs.unlink(filePath);
    } catch (error) {
      if (error instanceof Error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new FileDeleteError(`File not found: ${filename}`);
        }
        if ((error as NodeJS.ErrnoException).code === 'EACCES') {
          throw new FileDeleteError(`Permission denied: Cannot delete ${filename}`);
        }
      }

      // Catch-all for other potential errors
      throw new FileDeleteError(`Failed to delete file ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}