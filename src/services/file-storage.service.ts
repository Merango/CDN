import fs from 'fs/promises';
import path from 'path';

export class FileStorageService {
  private uploadDirectory: string;

  constructor(uploadDirectory: string = path.join(process.cwd(), 'uploads')) {
    this.uploadDirectory = uploadDirectory;
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
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
      const filePath = path.join(this.uploadDirectory, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}