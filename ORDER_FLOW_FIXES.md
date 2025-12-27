# Order Flow Fixes - Complete Guide

## What Was Fixed

### 1. Rider Can Now See Ready Orders
**Problem:** Riders couldn't see orders when restaurant marked them as `ready_for_pickup`
**Fix:** Updated `getAvailableOrders()` to include `'ready_for_pickup'` status
**File:** `src/services/delivery.service.ts` line 73

### 2. Pickup Validation Added
**Problem:** Rider could pick up order before restaurant marked it ready
**Fix:** Added validation in `updateDeliveryStatus()` to check order status before allowing pickup
**File:** `src/services/delivery.service.ts` lines 228-234
**Error Message:** "Order is not ready for pickup yet. Please wait for restaurant to mark it as ready."

## Complete Order Flow

### Status Progression:

1. **Customer places order** → Status: `pending`
   - Order appears in restaurant "New Orders" tab

2. **Restaurant accepts order** → Status: `confirmed`
   - Restaurant calls `acceptOrder(orderId)`
   - Order moves to restaurant "Active Orders" tab
   - Order becomes visible to riders in "Available Orders"

3. **Restaurant preparing** → Status: `preparing`
   - Restaurant updates status via `updateOrderStatus(orderId, 'preparing')`
   - Still visible to riders

4. **Restaurant marks ready** → Status: `ready_for_pickup`
   - Restaurant updates status via `updateOrderStatus(orderId, 'ready_for_pickup')`
   - Shows "Waiting for Driver" in restaurant dashboard
   - Still visible to riders in "Available Orders"

5. **Rider accepts order** → Status: `ready_for_pickup` (unchanged)
   - Rider calls `acceptOrder(orderId, riderId)`
   - Creates delivery record with status `assigned`
   - Order gets `rider_id` assigned
   - Order disappears from "Available Orders" (has rider_id now)
   - Rider sees it in "Active Delivery"

6. **Rider heading to restaurant** → Delivery status: `heading_to_restaurant`
   - Rider updates via `updateDeliveryStatus(deliveryId, 'heading_to_restaurant')`

7. **Rider arrives at restaurant** → Delivery status: `arrived_at_restaurant`
   - Rider updates via `updateDeliveryStatus(deliveryId, 'arrived_at_restaurant')`

8. **Rider picks up order** → Order status: `ready_for_pickup` → Delivery status: `picked_up`
   - Rider tries to update via `updateDeliveryStatus(deliveryId, 'picked_up')`
   - **VALIDATION:** System checks if order status is `ready_for_pickup`
   - If NOT ready: Shows error "Order is not ready for pickup yet"
   - If ready: Updates delivery status to `picked_up`
   - Restaurant sees "Order Picked Up" - their work is done

9. **Rider heading to customer** → Delivery status: `heading_to_customer`
   - Rider updates via `updateDeliveryStatus(deliveryId, 'heading_to_customer')`

10. **Rider arrives at customer** → Delivery status: `arrived_at_customer`
    - Rider updates via `updateDeliveryStatus(deliveryId, 'arrived_at_customer')`

11. **Rider completes delivery** → Order status: `delivered`, Delivery status: `delivered`
    - Rider updates via `updateDeliveryStatus(deliveryId, 'delivered')`
    - Order status changes to `delivered`
    - Customer sees "Delivered"
    - Rider status changes back to `online`

## Real-Time Updates

### Current Implementation:
- **Restaurant Dashboard:** Uses real-time subscription on `orders` table filtered by `restaurant_id`
- **Rider Available Orders:** Uses real-time subscription on `orders` table filtered by `rider_id IS NULL`
- **Rider Active Delivery:** Uses real-time subscription on `deliveries` table filtered by `rider_id`
- **Customer Order Tracking:** Should subscribe to `orders` table filtered by `user_id` and `deliveries` table for status updates

### What Needs Real-Time Subscriptions:

1. **Restaurant sees:**
   - New orders coming in (status: `pending`)
   - Order status changes when rider picks up (delivery_status: `picked_up`)

2. **Rider sees:**
   - New available orders (status: `confirmed`, `preparing`, `ready_for_pickup`, rider_id: null)
   - Own delivery status updates

3. **Customer sees:**
   - Order status changes (confirmed, preparing, ready_for_pickup, delivered)
   - Delivery status changes (assigned, heading_to_restaurant, picked_up, heading_to_customer, delivered)

## Key Points

1. **Restaurant cannot mark order as delivered** - Only rider can
2. **Rider cannot pick up until restaurant marks ready** - Validation prevents this
3. **Order status vs Delivery status:**
   - Order status: `pending`, `confirmed`, `preparing`, `ready_for_pickup`, `delivered`, `cancelled`
   - Delivery status: `assigned`, `heading_to_restaurant`, `arrived_at_restaurant`, `picked_up`, `heading_to_customer`, `arrived_at_customer`, `delivered`

4. **When order has rider_id:**
   - It disappears from "Available Orders" for all riders
   - Only that specific rider sees it in "Active Delivery"

## Testing the Flow

1. Place order as customer
2. Accept as restaurant → Should show in rider available orders
3. Mark preparing as restaurant → Still in rider available orders
4. Mark ready as restaurant → Still in rider available orders, shows "Waiting for Driver"
5. Accept as rider → Disappears from available, shows in active delivery
6. Try to pick up before restaurant marks ready → Should show error
7. Restaurant marks ready → Rider can now pick up
8. Rider picks up → Restaurant sees "Order Picked Up"
9. Rider completes delivery → Customer sees "Delivered", order disappears from restaurant active orders
