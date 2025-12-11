# ⏰ Auto-Cancel Orders Feature

## 📋 Overview
Orders that are not accepted by the restaurant within **5 minutes** will be automatically cancelled.

## 🔧 How It Works

### **1. Database Migration**
File: `/supabase/migrations/045_auto_cancel_orders.sql`

**Run this SQL in Supabase Dashboard:**
```sql
-- Auto-cancel orders that haven't been accepted within 5 minutes
CREATE OR REPLACE FUNCTION auto_cancel_expired_orders()
RETURNS void AS $$
BEGIN
  UPDATE public.orders
  SET 
    status = 'cancelled',
    delivery_notes = 'Order automatically cancelled - Restaurant did not respond within 5 minutes',
    updated_at = NOW()
  WHERE 
    status = 'pending'
    AND created_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION auto_cancel_expired_orders() TO authenticated;
```

### **2. App-Side Monitoring**
File: `/src/services/order-timeout.service.ts`

**Features:**
- ✅ Checks every 60 seconds for expired orders
- ✅ Automatically cancels orders older than 5 minutes with status 'pending'
- ✅ Updates order status to 'cancelled'
- ✅ Adds cancellation reason
- ✅ Starts when app loads
- ✅ Stops when app closes

### **3. Real-Time Updates**
- ✅ Users see order status change to "Cancelled" immediately
- ✅ Restaurant dashboard updates in real-time
- ✅ Order moves from "Active" to "Past" tab automatically

## 🎯 User Flow

### **Scenario 1: Restaurant Accepts in Time**
1. User places order → Status: `pending`
2. Restaurant sees order in dashboard
3. Restaurant accepts within 5 minutes → Status: `confirmed`
4. ✅ Order proceeds normally

### **Scenario 2: Restaurant Doesn't Respond**
1. User places order → Status: `pending`
2. Restaurant doesn't respond
3. After 5 minutes → Status: `cancelled` (automatic)
4. User sees "Cancelled" in their orders
5. Cancellation reason: "Restaurant did not respond within 5 minutes"

## 📊 Technical Details

### **Monitoring Interval**
- Checks every: **60 seconds**
- Timeout duration: **5 minutes**
- Precision: ±1 minute

### **Order States**
- `pending` → Can be auto-cancelled
- `confirmed` → Safe from auto-cancellation
- `preparing` → Safe from auto-cancellation
- `cancelled` → Already cancelled

### **Cancellation Message**
```
"Order automatically cancelled - Restaurant did not respond within 5 minutes"
```

## 🔍 Helper Functions

### **Get Time Remaining**
```typescript
import { getOrderTimeRemaining } from './services/order-timeout.service';

const remaining = getOrderTimeRemaining(order.created_at);
console.log(`${remaining} minutes remaining`);
```

### **Check if Expired**
```typescript
import { isOrderExpired } from './services/order-timeout.service';

if (isOrderExpired(order.created_at)) {
  console.log('Order has expired');
}
```

## 🚀 Deployment Steps

1. **Run SQL Migration**
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration from `045_auto_cancel_orders.sql`

2. **Deploy App**
   - The monitoring starts automatically when app loads
   - No additional configuration needed

3. **Verify**
   - Place a test order
   - Wait 5 minutes without accepting
   - Order should auto-cancel

## ⚙️ Configuration

To change the timeout duration, update:

**In SQL:**
```sql
-- Change '5 minutes' to desired duration
AND created_at < NOW() - INTERVAL '5 minutes'
```

**In App:**
```typescript
// In order-timeout.service.ts
const ORDER_TIMEOUT_MINUTES = 5; // Change this value
```

## 📝 Notes

- ✅ Monitoring runs in background
- ✅ Minimal performance impact (checks once per minute)
- ✅ Works even if app is closed (database function can be called by cron)
- ✅ Real-time updates notify users immediately
- ✅ Restaurant can still manually cancel before timeout

## 🎉 Benefits

1. **Better User Experience** - Users don't wait indefinitely
2. **Restaurant Accountability** - Encourages quick response
3. **System Efficiency** - Clears stale orders automatically
4. **Transparency** - Clear cancellation reason provided

---

**Auto-cancel feature is ready to use!** ⏰✅
