# Logger Integration Guide

## ✅ What's Been Created

1. **Logger Service** (`src/services/logger.service.ts`)
   - Writes logs to file instead of terminal
   - Auto-rotation when file exceeds 5MB
   - Multiple log levels (DEBUG, INFO, WARN, ERROR)

2. **Log Viewer Screen** (`src/screens/admin/LogViewerScreen.tsx`)
   - View logs in-app
   - Search and filter logs
   - Export and clear logs

3. **Documentation** (`LOGGER_USAGE.md`)
   - Complete usage guide

## 🚀 Quick Start

### Step 1: Import and Use Logger

Replace `console.log` with `logger` in your code:

**Before:**
```typescript
console.log('User logged in');
console.error('Failed to fetch data', error);
```

**After:**
```typescript
import { logger } from './services/logger.service';

await logger.info('User logged in');
await logger.error('Failed to fetch data', { error: error.message });
```

### Step 2: Add Log Viewer to Navigation

Add the LogViewerScreen to your Admin navigation stack:

```typescript
// In AdminDashboardStack.tsx
import LogViewerScreen from '../screens/admin/LogViewerScreen';

// Add to Stack.Navigator
<Stack.Screen 
  name="LogViewer" 
  component={LogViewerScreen}
  options={{ headerShown: false }}
/>
```

### Step 3: Add Button to Admin Dashboard

Add a button to access logs from the Admin Dashboard:

```typescript
// In AdminDashboardScreen.tsx
<TouchableOpacity
  style={styles.actionCard}
  onPress={() => navigation.navigate('LogViewer')}
>
  <Icon name="file-text" size={24} color={colors.primary} />
  <Text style={styles.actionCardText}>View Logs</Text>
</TouchableOpacity>
```

## 📝 Example Usage in Your App

### In Authentication
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

### In Order Service
```typescript
// src/services/order.service.ts
import { logger } from './logger.service';

export const createOrder = async (orderData: any) => {
  try {
    await logger.info('Creating order', { restaurantId: orderData.restaurant_id });
    const result = await supabase.from('orders').insert(orderData);
    await logger.info('Order created successfully', { orderId: result.data[0].id });
    return result;
  } catch (error) {
    await logger.error('Failed to create order', { error: error.message });
    throw error;
  }
};
```

### In API Calls
```typescript
// src/services/restaurant.service.ts
import { logger } from './logger.service';

export const fetchRestaurants = async () => {
  try {
    await logger.debug('Fetching restaurants');
    const { data, error } = await supabase.from('restaurants').select('*');
    
    if (error) throw error;
    
    await logger.info('Restaurants fetched', { count: data.length });
    return data;
  } catch (error) {
    await logger.error('Failed to fetch restaurants', { error: error.message });
    throw error;
  }
};
```

## 🎯 Optional: Auto-Capture Console Logs

To automatically capture ALL console.log calls:

```typescript
// In App.tsx or your root file
import { enableConsoleOverride } from './services/logger.service';

// Enable console override
enableConsoleOverride();

// Now all console calls are automatically logged to file
console.log('This goes to file too!');
```

## 📱 Accessing Logs

### In Development
- Logs still appear in terminal (when `__DEV__` is true)
- Plus they're written to file

### In Production
- Logs only go to file
- Access via LogViewer screen in Admin Dashboard
- Export and share logs for debugging

## 🔍 Log File Location

**iOS:** `/var/mobile/Containers/Data/Application/{UUID}/Documents/app.log`

**Android:** `/data/user/0/{package}/files/app.log`

## 🎨 Log Viewer Features

- ✅ Search logs by keyword
- ✅ Filter by log level (DEBUG, INFO, WARN, ERROR)
- ✅ Refresh logs
- ✅ Export logs (share via email, etc.)
- ✅ Clear all logs
- ✅ Shows log count

## 📊 Log Format

```
[2025-12-10T21:03:45.123Z] [INFO] User logged in | {"userId":"123"}
[2025-12-10T21:03:46.456Z] [ERROR] Failed to fetch | {"error":"Network error"}
[2025-12-10T21:03:47.789Z] [WARN] API rate limit | {"remaining":10}
```

## 🚨 Best Practices

1. **Use appropriate log levels:**
   - `DEBUG` - Detailed info for debugging
   - `INFO` - General information
   - `WARN` - Warning messages
   - `ERROR` - Error messages

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

4. **Log important events:**
   - User authentication
   - Order creation/updates
   - Payment processing
   - API errors
   - Data sync operations

## 🎉 You're All Set!

Your app now has professional logging that writes to files instead of cluttering the terminal!
