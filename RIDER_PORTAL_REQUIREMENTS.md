# 🏍️ RIDER PORTAL - FULL FUNCTIONALITY REQUIREMENTS

## 📋 **CURRENT STATE ANALYSIS:**

### **✅ What's Already Done:**
- UI Screens (4 screens)
- Database Tables (4 tables)
- Backend Services (3 services)
- Translations (English/Arabic)
- Navigation & Routing

### **❌ What's Missing:**
- Real-time subscriptions
- Connect screens to real data (currently using mock data)
- Order assignment flow
- Status update flow
- Earnings calculation
- Cross-portal integrations

---

## 🎯 **REQUIREMENTS BREAKDOWN:**

### **A. RIDER PORTAL - REAL-TIME FEATURES**

#### **1. RiderHomeScreen - Available Orders**
**Status:** ❌ Using mock data

**Needs:**
- ✅ Real-time subscription to `orders` table
- ✅ Filter: `rider_id IS NULL` (unassigned orders)
- ✅ Listen for INSERT (new orders)
- ✅ Listen for UPDATE (order status changes)
- ✅ Listen for DELETE (order cancelled)
- ✅ Accept order functionality
- ✅ Calculate distance from rider location
- ✅ Calculate estimated earnings

**Real-time Channel:**
```typescript
supabase
  .channel('rider-available-orders')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'orders',
    filter: 'rider_id=is.null'
  })
```

---

#### **2. RiderActiveDeliveryScreen - Active Delivery**
**Status:** ❌ Using mock data

**Needs:**
- ✅ Real-time subscription to `deliveries` table
- ✅ Filter: `rider_id=eq.RIDER_ID AND status!=delivered`
- ✅ Listen for UPDATE (status changes from restaurant/customer)
- ✅ Update delivery status buttons
- ✅ Location tracking (manual updates)
- ✅ Insert location points to `rider_locations`
- ✅ Complete delivery functionality

**Real-time Channel:**
```typescript
supabase
  .channel('rider-active-delivery')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'deliveries',
    filter: `rider_id=eq.${riderId}`
  })
```

---

#### **3. RiderHistoryScreen - Delivery History**
**Status:** ❌ Using mock data

**Needs:**
- ✅ Real-time subscription to `deliveries` table
- ✅ Filter: `rider_id=eq.RIDER_ID AND status=delivered`
- ✅ Listen for INSERT (new completed delivery)
- ✅ Filter by date range (today, week, month)
- ✅ Show customer ratings

**Real-time Channel:**
```typescript
supabase
  .channel('rider-delivery-history')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'deliveries',
    filter: `rider_id=eq.${riderId}`
  })
```

---

#### **4. RiderEarningsScreen - Earnings & Payouts**
**Status:** ❌ Using mock data

**Needs:**
- ✅ Real-time subscription to `rider_earnings` table
- ✅ Filter: `rider_id=eq.RIDER_ID`
- ✅ Listen for INSERT (new earnings)
- ✅ Listen for UPDATE (payout status changes)
- ✅ Calculate totals (today, week, month)
- ✅ Request payout functionality
- ✅ Show payment history

**Real-time Channel:**
```typescript
supabase
  .channel('rider-earnings-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'rider_earnings',
    filter: `rider_id=eq.${riderId}`
  })
```

---

### **B. USER PORTAL - RIDER INTEGRATION**

#### **5. OrderTrackingScreen - Track Rider**
**Status:** ❌ No rider tracking

**Needs:**
- ✅ Real-time subscription to `rider_locations` table
- ✅ Filter: `order_id=eq.ORDER_ID`
- ✅ Listen for INSERT (new location points)
- ✅ Show rider on map
- ✅ Update rider location in real-time
- ✅ Show rider info (name, vehicle, rating)
- ✅ Call rider button

**Real-time Channel:**
```typescript
supabase
  .channel('customer-rider-tracking')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'rider_locations',
    filter: `order_id=eq.${orderId}`
  })
```

---

#### **6. OrderDetailsScreen - Rider Info**
**Status:** ❌ No rider info shown

**Needs:**
- ✅ Show rider details when assigned
- ✅ Real-time subscription to `orders` table
- ✅ Listen for UPDATE (rider_id changes)
- ✅ Show rider name, vehicle, rating
- ✅ Call rider button
- ✅ Track rider button

**Real-time Channel:**
```typescript
supabase
  .channel('customer-order-rider-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `id=eq.${orderId}`
  })
```

---

### **C. PARTNER PORTAL - RIDER INTEGRATION**

#### **7. LiveOrdersScreen - Rider Assignment**
**Status:** ✅ Has real-time for orders, ❌ No rider info

**Needs:**
- ✅ Show when rider is assigned
- ✅ Show rider details (name, vehicle, rating)
- ✅ Real-time update when rider accepts
- ✅ Real-time update on delivery status
- ✅ Show "Waiting for rider" status

**Enhancement:**
```typescript
// Already has real-time for orders
// Just need to show rider info when rider_id is not null
```

---

#### **8. PartnerOrderDetailsScreen - Rider Tracking**
**Status:** ❌ No rider tracking

**Needs:**
- ✅ Show rider details when assigned
- ✅ Show delivery status
- ✅ Real-time subscription to `deliveries` table
- ✅ Track rider location
- ✅ Call rider button

**Real-time Channel:**
```typescript
supabase
  .channel('partner-order-delivery-tracking')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'deliveries',
    filter: `order_id=eq.${orderId}`
  })
```

---

## 🔄 **CROSS-PORTAL WORKFLOWS:**

### **Workflow 1: Order Placement → Rider Assignment**

1. **Customer places order** (User Portal)
   - Order created with `rider_id = NULL`
   - Status: `pending_rider`

2. **Order appears for riders** (Rider Portal)
   - Real-time INSERT event
   - Shows in RiderHomeScreen

3. **Rider accepts order** (Rider Portal)
   - Update `orders.rider_id`
   - Create `deliveries` record
   - Status: `rider_assigned`

4. **Partner sees rider assigned** (Partner Portal)
   - Real-time UPDATE event
   - Shows rider info in LiveOrdersScreen

5. **Customer sees rider assigned** (User Portal)
   - Real-time UPDATE event
   - Shows rider info in OrderTrackingScreen

---

### **Workflow 2: Delivery Status Updates**

1. **Rider updates status** (Rider Portal)
   - Updates `deliveries.status`
   - Inserts `rider_locations` point

2. **Customer sees update** (User Portal)
   - Real-time UPDATE event
   - Updates OrderTrackingScreen
   - Shows rider location on map

3. **Partner sees update** (Partner Portal)
   - Real-time UPDATE event
   - Updates order status

4. **Rider completes delivery** (Rider Portal)
   - Status: `delivered`
   - Trigger creates `rider_earnings` record

5. **Earnings appear** (Rider Portal)
   - Real-time INSERT event
   - Updates RiderEarningsScreen

---

## 📊 **DATABASE TRIGGERS (Already Created):**

✅ `update_rider_stats_on_delivery` - Updates rider stats when delivery completed
✅ `create_earning_on_delivery` - Creates earning record when delivery completed
✅ `update_riders_updated_at` - Updates timestamp on rider changes
✅ `update_deliveries_updated_at` - Updates timestamp on delivery changes

---

## 🛠️ **IMPLEMENTATION PRIORITY:**

### **Phase 1: Core Rider Functionality** (HIGH PRIORITY)
1. ✅ RiderHomeScreen - Connect to real orders
2. ✅ RiderHomeScreen - Accept order functionality
3. ✅ RiderActiveDeliveryScreen - Connect to real delivery
4. ✅ RiderActiveDeliveryScreen - Status update buttons
5. ✅ RiderHistoryScreen - Connect to real history
6. ✅ RiderEarningsScreen - Connect to real earnings

### **Phase 2: Real-time Subscriptions** (HIGH PRIORITY)
1. ✅ Add real-time to RiderHomeScreen (available orders)
2. ✅ Add real-time to RiderActiveDeliveryScreen (delivery updates)
3. ✅ Add real-time to RiderHistoryScreen (new completions)
4. ✅ Add real-time to RiderEarningsScreen (new earnings)

### **Phase 3: User Portal Integration** (MEDIUM PRIORITY)
1. ✅ OrderTrackingScreen - Show rider info
2. ✅ OrderTrackingScreen - Track rider location
3. ✅ OrderDetailsScreen - Show rider details

### **Phase 4: Partner Portal Integration** (MEDIUM PRIORITY)
1. ✅ LiveOrdersScreen - Show rider info
2. ✅ PartnerOrderDetailsScreen - Show delivery status

### **Phase 5: Location Tracking** (LOW PRIORITY)
1. ✅ Manual location updates (Option B - already planned)
2. ⏳ Automatic GPS simulation (Optional - Option A)

---

## 🔧 **TECHNICAL REQUIREMENTS:**

### **Services to Update:**
1. ✅ `rider.service.ts` - Add real-time helpers
2. ✅ `delivery.service.ts` - Add real-time helpers
3. ✅ `earnings.service.ts` - Add real-time helpers
4. ❌ `orders.service.ts` - Add rider-related queries
5. ❌ `location.service.ts` - Add rider location tracking

### **New Hooks to Create:**
1. ❌ `useRiderOrders()` - Hook for available orders with real-time
2. ❌ `useActiveDelivery()` - Hook for active delivery with real-time
3. ❌ `useRiderEarnings()` - Hook for earnings with real-time
4. ❌ `useRiderLocation()` - Hook for location tracking

### **Screens to Update:**
**Rider Portal:**
1. ❌ RiderHomeScreen.tsx
2. ❌ RiderActiveDeliveryScreen.tsx
3. ❌ RiderHistoryScreen.tsx
4. ❌ RiderEarningsScreen.tsx

**User Portal:**
5. ❌ OrderTrackingScreen.tsx
6. ❌ OrderDetailsScreen.tsx

**Partner Portal:**
7. ❌ LiveOrdersScreen.tsx (minor update)
8. ❌ PartnerOrderDetailsScreen.tsx

---

## 📝 **ESTIMATED TIME:**

| Task | Time | Priority |
|------|------|----------|
| Phase 1: Core Rider Functionality | 4-6 hours | HIGH |
| Phase 2: Real-time Subscriptions | 3-4 hours | HIGH |
| Phase 3: User Portal Integration | 3-4 hours | MEDIUM |
| Phase 4: Partner Portal Integration | 2-3 hours | MEDIUM |
| Phase 5: Location Tracking | 2-3 hours | LOW |
| **TOTAL** | **14-20 hours** | |

---

## 🎯 **SUCCESS CRITERIA:**

✅ Rider can see available orders in real-time
✅ Rider can accept orders
✅ Rider can update delivery status
✅ Rider can see earnings update in real-time
✅ Customer can see rider location in real-time
✅ Customer can see delivery status updates
✅ Partner can see when rider is assigned
✅ Partner can see delivery progress
✅ All portals update in real-time without refresh

---

## 🚀 **READY TO START?**

Let me know and we'll begin with **Phase 1: Core Rider Functionality**! 

We'll start by:
1. Creating custom hooks for real-time data
2. Updating RiderHomeScreen to show real orders
3. Implementing accept order functionality
4. Adding real-time subscriptions

**Yalla?** 🔥
