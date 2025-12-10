/**
 * Logger Service
 * 
 * Writes logs to a file instead of terminal
 */

import * as FileSystem from 'expo-file-system/legacy';

const LOG_FILE_PATH = `${FileSystem.documentDirectory}app.log`;
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Check if log file exists
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      
      if (fileInfo.exists && fileInfo.size && fileInfo.size > MAX_LOG_SIZE) {
        // Rotate log file if too large
        await this.rotateLogFile();
      } else if (!fileInfo.exists) {
        // Create log file if it doesn't exist
        await FileSystem.writeAsStringAsync(LOG_FILE_PATH, '');
      }

      this.isInitialized = true;
      await this.log(LogLevel.INFO, 'Wajba Logger initialized successfully');
      await this.log(LogLevel.INFO, 'Welcome to Wajba! Logs will appear here.');
    } catch (error) {
      console.error('Failed to initialize logger:', error);
    }
  }

  private async rotateLogFile() {
    try {
      const backupPath = `${FileSystem.documentDirectory}app.log.old`;
      
      // Delete old backup if exists
      const backupInfo = await FileSystem.getInfoAsync(backupPath);
      if (backupInfo.exists) {
        await FileSystem.deleteAsync(backupPath);
      }

      // Rename current log to backup
      await FileSystem.moveAsync({
        from: LOG_FILE_PATH,
        to: backupPath,
      });
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  private async log(level: LogLevel, message: string, data?: any) {
    try {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data,
      };

      const logLine = this.formatLogEntry(entry);

      // Append to log file
      // Read existing content first
      let existingContent = '';
      try {
        const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
        if (fileInfo.exists) {
          existingContent = await FileSystem.readAsStringAsync(LOG_FILE_PATH);
        }
      } catch (readError) {
        // File doesn't exist yet, that's okay
      }
      
      // Write existing content + new log line
      await FileSystem.writeAsStringAsync(LOG_FILE_PATH, existingContent + logLine + '\n');

      // Also log to console in development
      if (__DEV__) {
        this.consoleLog(level, message, data);
      }
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  private formatLogEntry(entry: LogEntry): string {
    const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
    return `[${entry.timestamp}] [${entry.level}] ${entry.message}${dataStr}`;
  }

  private consoleLog(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [${level}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, data || '');
        break;
    }
  }

  async debug(message: string, data?: any) {
    await this.log(LogLevel.DEBUG, message, data);
  }

  async info(message: string, data?: any) {
    await this.log(LogLevel.INFO, message, data);
  }

  async warn(message: string, data?: any) {
    await this.log(LogLevel.WARN, message, data);
  }

  async error(message: string, data?: any) {
    await this.log(LogLevel.ERROR, message, data);
  }

  async getLogs(): Promise<string> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
      
      if (!fileInfo.exists) {
        // Create empty log file
        await FileSystem.writeAsStringAsync(LOG_FILE_PATH, '');
        return 'No logs available yet. Logs will appear here as you use the app.';
      }

      const logs = await FileSystem.readAsStringAsync(LOG_FILE_PATH);

      return logs || 'No logs available yet. Logs will appear here as you use the app.';
    } catch (error) {
      console.error('Failed to read logs:', error);
      // Create the file if there's an error
      try {
        await FileSystem.writeAsStringAsync(LOG_FILE_PATH, '');
        return 'No logs available yet. Logs will appear here as you use the app.';
      } catch (createError) {
        return 'Error accessing log file. Please try again.';
      }
    }
  }

  async getRecentLogs(lines: number = 100): Promise<string> {
    try {
      const allLogs = await this.getLogs();
      const logLines = allLogs.split('\n');
      const recentLines = logLines.slice(-lines);
      return recentLines.join('\n');
    } catch (error) {
      console.error('Failed to get recent logs:', error);
      return 'Error reading logs';
    }
  }

  async clearLogs() {
    try {
      await FileSystem.deleteAsync(LOG_FILE_PATH, { idempotent: true });
      await this.log(LogLevel.INFO, 'Logs cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  async exportLogs(): Promise<string> {
    try {
      const logs = await this.getLogs();
      const exportPath = `${FileSystem.cacheDirectory}wajba_logs_${Date.now()}.txt`;
      
      await FileSystem.writeAsStringAsync(exportPath, logs);

      return exportPath;
    } catch (error) {
      console.error('Failed to export logs:', error);
      throw error;
    }
  }

  getLogFilePath(): string {
    return LOG_FILE_PATH;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Initialize logger
logger.initialize();

// Override console methods to use logger (optional)
export const enableConsoleOverride = () => {
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  console.log = (...args) => {
    logger.info(args.join(' '));
    originalConsole.log(...args);
  };

  console.info = (...args) => {
    logger.info(args.join(' '));
    originalConsole.info(...args);
  };

  console.warn = (...args) => {
    logger.warn(args.join(' '));
    originalConsole.warn(...args);
  };

  console.error = (...args) => {
    logger.error(args.join(' '));
    originalConsole.error(...args);
  };

  console.debug = (...args) => {
    logger.debug(args.join(' '));
    originalConsole.debug(...args);
  };
};
