import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { logFileRetrieval, logFileRetrievalError } from '../src/utils/logger';

describe('Logger Utility', () => {
    it('should create logs directory if it does not exist', () => {
        const logsPath = path.join(process.cwd(), 'logs');
        expect(fs.existsSync(logsPath)).toBeTruthy();
    });

    it('should log file retrieval successfully', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        
        logFileRetrieval({
            filePath: '/test/file.txt',
            clientIp: '127.0.0.1',
            success: true
        });

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('/test/file.txt'));
        consoleSpy.mockRestore();
    });

    it('should log file retrieval error', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error');
        const testError = new Error('Test error');

        logFileRetrievalError(testError, '/test/file.txt');

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Test error'));
        consoleErrorSpy.mockRestore();
    });

    it('should create log files', () => {
        const combinedLogPath = path.join(process.cwd(), 'logs', 'combined.log');
        const errorLogPath = path.join(process.cwd(), 'logs', 'error.log');

        expect(fs.existsSync(combinedLogPath)).toBeTruthy();
        expect(fs.existsSync(errorLogPath)).toBeTruthy();
    });
});