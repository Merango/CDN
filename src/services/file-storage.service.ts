import fs from 'fs/promises';
import path from 'path';

export class FileStorageService {
  private uploadDirectory: string;

  constructor(uploadDirectory: string = path.join(process.cwd(), 'uploads')) {
    this.uploadDirectory = path.resolve(uploadDirectory);
  }

  private validateFilePath(filename: string): void {
    const resolvedFilePath = path.resolve(path.join(this.uploadDirectory, filename));
    
    // Ensure the resolved file path is within the upload directory
    if (!resolvedFilePath.startsWith(this.uploadDirectory)) {
      throw new Error('Invalid file path: File must be within upload directory');
    }
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
      // Validate the file path first
      this.validateFilePath(filename);

      const filePath = path.join(this.uploadDirectory, filename);
      await fs.access(filePath);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    try {
      // Validate the file path first
      this.validateFilePath(filename);

      const filePath = path.join(this.uploadDirectory, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}