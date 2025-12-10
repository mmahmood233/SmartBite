# Logger Service Usage Guide

## Overview
The Logger Service writes all logs to a file (`app.log`) in the app's document directory instead of cluttering the terminal.

## Features
- ✅ Writes logs to file
- ✅ Automatic log rotation (when file exceeds 5MB)
- ✅ Multiple log levels (DEBUG, INFO, WARN, ERROR)
- ✅ View logs in-app
- ✅ Export logs
- ✅ Clear logs
- ✅ Still shows logs in terminal during development

## Basic Usage

### Import the logger
```typescript
import { logger } from './services/logger.service';
```

### Log messages
```typescript
// Info logs
await logger.info('User logged in', { userId: '123' });

// Warning logs
await logger.warn('API rate limit approaching', { remaining: 10 });

// Error logs
await logger.error('Failed to fetch data', { error: error.message });

// Debug logs (only in development)
await logger.debug('Debug info', { data: someData });
```

### View logs
```typescript
// Get all logs
const allLogs = await logger.getLogs();

// Get recent 100 lines
const recentLogs = await logger.getRecentLogs(100);

// Get log file path
const logPath = logger.getLogFilePath();
```

### Manage logs
```typescript
// Clear all logs
await logger.clearLogs();

// Export logs to a file
const exportPath = await logger.exportLogs();
```

## Override Console (Optional)

To automatically capture all `console.log`, `console.error`, etc. calls:

```typescript
import { enableConsoleOverride } from './services/logger.service';

// In your App.tsx or index.js
enableConsoleOverride();

// Now all console calls will also be written to the log file
console.log('This will be logged to file');
console.error('This error will be logged to file');
```

## Example Usage in Your App

### In a service
```typescript
import { logger } from '../services/logger.service';

export const fetchRestaurants = async () => {
  try {
    await logger.info('Fetching restaurants');
    const response = await supabase.from('restaurants').select('*');
    await logger.info('Restaurants fetched successfully', { count: response.data?.length });
    return response;
  } catch (error) {
    await logger.error('Failed to fetch restaurants', { error: error.message });
    throw error;
  }
};
```

### In a screen
```typescript
import { logger } from '../services/logger.service';

const LoginScreen = () => {
  const handleLogin = async () => {
    try {
      await logger.info('Login attempt', { email });
      const result = await signIn(email, password);
      await logger.info('Login successful', { userId: result.user.id });
    } catch (error) {
      await logger.error('Login failed', { error: error.message });
    }
  };
};
```

## Log File Location

The log file is stored at:
```
{DocumentDirectory}/app.log
```

On iOS: `/var/mobile/Containers/Data/Application/{UUID}/Documents/app.log`

## Log Format

Each log entry follows this format:
```
[2025-12-10T21:03:45.123Z] [INFO] User logged in | {"userId":"123"}
[2025-12-10T21:03:46.456Z] [ERROR] Failed to fetch data | {"error":"Network error"}
```

## Viewing Logs in App

A LogViewer screen is included that allows users to:
- View recent logs
- Search logs
- Export logs
- Clear logs
- Refresh logs

Access it from the Admin Dashboard or Settings screen.
