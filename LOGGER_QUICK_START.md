# 🚀 Logger Quick Start - You're All Set!

## ✅ What's Been Done

1. ✅ **Logger Service Created** - Logs now go to file instead of terminal
2. ✅ **Log Viewer Screen Created** - View logs in-app
3. ✅ **Navigation Added** - LogViewer added to Admin navigation stack
4. ✅ **Settings Button Added** - "View Logs" button in Admin Settings screen

## 📱 How to Access Logs

### From Admin Dashboard:
1. Open the app as Admin
2. Go to **Settings** tab (bottom navigation)
3. Scroll to **"OTHER"** section
4. Tap **"View Logs"** 📄

### Features Available:
- 🔍 Search logs by keyword
- 🎯 Filter by level (DEBUG, INFO, WARN, ERROR)
- 🔄 Refresh logs
- 📤 Export logs (share via email)
- 🗑️ Clear all logs

## 💻 Start Using Logger in Your Code

### Replace console.log with logger:

**Before:**
```typescript
console.log('User logged in');
console.error('Failed to fetch', error);
```

**After:**
```typescript
import { logger } from '../services/logger.service';

await logger.info('User logged in', { userId: '123' });
await logger.error('Failed to fetch', { error: error.message });
```

### Example in Auth Service:
```typescript
// src/services/auth.service.ts
import { logger } from './logger.service';

export const signIn = async (email: string, password: string) => {
  try {
    await logger.info('Login attempt', { email });
    const result = await supabase.auth.signInWithPassword({ email, password });
    await logger.info('Login successful', { userId: result.data.user?.id });
    return result;
  } catch (error) {
    await logger.error('Login failed', { email, error: error.message });
    throw error;
  }
};
```

## 🎯 Log Levels

- **DEBUG** - Detailed debugging info (only in development)
- **INFO** - General information (user actions, API calls)
- **WARN** - Warning messages (rate limits, deprecations)
- **ERROR** - Error messages (failures, exceptions)

## 📂 Log File Location

Logs are stored at:
```
{DocumentDirectory}/app.log
```

## 🎨 Log Format

```
[2025-12-10T21:08:45.123Z] [INFO] User logged in | {"userId":"123"}
[2025-12-10T21:08:46.456Z] [ERROR] Failed to fetch | {"error":"Network error"}
```

## 🔥 Pro Tips

1. **Log important events:**
   - User authentication
   - Order creation/updates
   - Payment processing
   - API errors

2. **Include context:**
   ```typescript
   await logger.error('Order failed', { 
     orderId: '123',
     userId: '456',
     error: error.message 
   });
   ```

3. **Don't log sensitive data:**
   ```typescript
   // ❌ Bad
   await logger.info('Login', { password: '123456' });
   
   // ✅ Good
   await logger.info('Login', { email: user.email });
   ```

## 🎉 You're Ready!

Everything is set up! Just start using `logger` instead of `console.log` and view your logs in the Admin Settings screen.

**Navigation Path:**
Admin Dashboard → Settings Tab → View Logs
