# SmartBite API Integration Guide

**For AI Agents & Developers**  
**Version**: 2.0  
**Last Updated**: 2025-11-07

---

## 🎯 Purpose

This guide helps AI agents and developers understand how to:
1. Connect to the Supabase database
2. Query data easily
3. Understand the data structure
4. Use the pre-built service functions

---

## 📁 File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client setup
├── types/
│   └── database.ts          # TypeScript types for all tables
├── services/
│   ├── auth.service.ts      # Authentication functions
│   ├── restaurants.service.ts # Restaurant queries
│   └── orders.service.ts    # Order queries
```

---

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage
```

### 2. Configure Environment

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Import and Use

```typescript
import { supabase } from './src/lib/supabase';
import { fetchRestaurants } from './src/services/restaurants.service';
```

---

## 📊 Database Structure (Quick Reference)

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | id, email, full_name, role |
| `restaurants` | Restaurant info | id, name, category, rating, is_open |
| `dishes` | Menu items | id, restaurant_id, name, price, is_available |
| `orders` | Order records | id, order_number, user_id, status, total_amount |
| `reviews` | Restaurant reviews | id, restaurant_id, rating, comment |
| `promo_codes` | Discount codes | id, code, type, discount_value |

**See `DATABASE_SCHEMA_V2.md` for complete documentation.**

---

## 🚀 Common Queries (Copy & Paste)

### Authentication

```typescript
import { signIn, signUp, getCurrentUserProfile } from './src/services/auth.service';

// Sign up new user
const { user } = await signUp('user@example.com', 'password123', 'John Doe');

// Sign in
const { session, user } = await signIn('user@example.com', 'password123');

// Get current user
const currentUser = await getCurrentUserProfile();
```

### Fetch Restaurants

```typescript
import { fetchRestaurants, fetchRestaurantById } from './src/services/restaurants.service';

// Get all restaurants
const restaurants = await fetchRestaurants();

// Filter by category
const burgerPlaces = await fetchRestaurants('Burgers');

// Search restaurants
const results = await fetchRestaurants(undefined, 'pizza');

// Get single restaurant
const restaurant = await fetchRestaurantById('restaurant-id');
```

### Fetch Menu

```typescript
import { fetchRestaurantMenu } from './src/services/restaurants.service';

// Get restaurant menu with add-ons
const menu = await fetchRestaurantMenu('restaurant-id');

// Menu includes:
// - dish details (name, price, description, image)
// - category information
// - available add-ons
```

### Create Order

```typescript
import { createOrder } from './src/services/orders.service';

const order = await createOrder({
  user_id: 'user-id',
  restaurant_id: 'restaurant-id',
  delivery_address_id: 'address-id',
  status: 'pending',
  subtotal: 10.00,
  delivery_fee: 1.50,
  total_amount: 11.50,
  payment_method: 'card',
  payment_status: 'pending',
});

console.log('Order created:', order.order_number); // WAJ0001
```

### Fetch User Orders

```typescript
import { fetchUserOrders, fetchOrderById } from './src/services/orders.service';

// Get active orders
const activeOrders = await fetchUserOrders('user-id', 'active');

// Get past orders
const pastOrders = await fetchUserOrders('user-id', 'past');

// Get order details
const orderDetails = await fetchOrderById('order-id');
// Includes: restaurant info, items, add-ons, rider info
```

### Real-time Order Tracking

```typescript
import { subscribeToOrderUpdates } from './src/services/orders.service';

// Subscribe to order updates
const subscription = subscribeToOrderUpdates('order-id', (updatedOrder) => {
  console.log('Order status changed:', updatedOrder.status);
  // Update UI with new status
});

// Later: Unsubscribe
subscription.unsubscribe();
```

### Apply Promo Code

```typescript
// Validate promo code
const { data: promoCode, error } = await supabase
  .from('promo_codes')
  .select('*')
  .eq('code', 'SAVE20')
  .eq('is_active', true)
  .gte('valid_until', new Date().toISOString())
  .single();

if (promoCode) {
  // Calculate discount
  let discount = 0;
  if (promoCode.type === 'percentage') {
    discount = (subtotal * promoCode.discount_value) / 100;
  } else if (promoCode.type === 'fixed') {
    discount = promoCode.discount_value;
  } else if (promoCode.type === 'free_delivery') {
    discount = deliveryFee;
  }
  
  // Apply to order
  const total = subtotal + deliveryFee - discount;
}
```

### Create Review

```typescript
// Create review after order is delivered
const { data: review, error } = await supabase
  .from('reviews')
  .insert({
    user_id: 'user-id',
    restaurant_id: 'restaurant-id',
    order_id: 'order-id',
    rating: 5,
    comment: 'Great food and fast delivery!',
  })
  .select()
  .single();

// Restaurant rating updates automatically via trigger
```

---

## 🤖 For AI Agents

### Understanding the Data Flow

1. **User browses restaurants** → Query `restaurants` table
2. **User views menu** → Query `dishes` and `dish_addons` tables
3. **User adds to cart** → Store in `cart_items` table (or local state)
4. **User checks out** → Create record in `orders` table
5. **Order is placed** → `order_number` auto-generated (WAJ0001)
6. **Order tracking** → Query `order_tracking` table
7. **Order delivered** → Update `orders.status` to 'delivered'
8. **User reviews** → Create record in `reviews` table

### Key Relationships

```
User → Orders → Order Items → Dishes
User → Addresses (for delivery)
User → Favorites → Restaurants
Restaurant → Dishes → Add-ons
Order → Promo Code (optional)
Order → Rider (when assigned)
Order → Review (after delivery)
```

### Auto-Generated Fields

These fields are handled automatically by the database:

- `id` - UUID generated automatically
- `order_number` - Sequential (WAJ0001, WAJ0002...)
- `created_at` - Timestamp when record created
- `updated_at` - Timestamp when record updated
- `restaurants.rating` - Calculated from reviews
- `restaurants.total_reviews` - Count of reviews
- `promo_codes.used_count` - Incremented when used

### Security (Row Level Security)

The database has RLS enabled. Users can only:
- ✅ View their own orders, addresses, favorites
- ✅ View all active restaurants and menus
- ✅ Create orders for themselves
- ❌ View other users' data
- ❌ Modify other users' orders

Partners can:
- ✅ View and manage their own restaurants
- ✅ View orders for their restaurants
- ✅ Update order status

Admins can:
- ✅ View and manage everything

---

## 📝 Example: Complete Order Flow

```typescript
// 1. User selects restaurant
const restaurant = await fetchRestaurantById('restaurant-id');

// 2. User views menu
const menu = await fetchRestaurantMenu('restaurant-id');

// 3. User adds items to cart (local state or database)
const cartItems = [
  { dish_id: 'dish-1', quantity: 2, addons: ['addon-1'] },
  { dish_id: 'dish-2', quantity: 1, addons: [] },
];

// 4. Calculate totals
const subtotal = cartItems.reduce((sum, item) => {
  const dish = menu.find(d => d.id === item.dish_id);
  return sum + (dish.price * item.quantity);
}, 0);

const deliveryFee = restaurant.delivery_fee;
const total = subtotal + deliveryFee;

// 5. Create order
const order = await createOrder({
  user_id: currentUser.id,
  restaurant_id: restaurant.id,
  delivery_address_id: selectedAddress.id,
  status: 'pending',
  subtotal,
  delivery_fee: deliveryFee,
  total_amount: total,
  payment_method: 'card',
  payment_status: 'pending',
});

// 6. Add order items
for (const item of cartItems) {
  await supabase.from('order_items').insert({
    order_id: order.id,
    dish_id: item.dish_id,
    dish_name: menu.find(d => d.id === item.dish_id).name,
    quantity: item.quantity,
    unit_price: menu.find(d => d.id === item.dish_id).price,
    subtotal: menu.find(d => d.id === item.dish_id).price * item.quantity,
  });
  
  // Add add-ons if any
  for (const addonId of item.addons) {
    const addon = menu.find(d => d.id === item.dish_id).dish_addons.find(a => a.id === addonId);
    await supabase.from('order_item_addons').insert({
      order_item_id: orderItem.id,
      addon_id: addonId,
      addon_name: addon.name,
      addon_price: addon.price,
    });
  }
}

// 7. Subscribe to updates
const subscription = subscribeToOrderUpdates(order.id, (updated) => {
  console.log('Status:', updated.status);
});

// 8. When delivered, create review
if (order.status === 'delivered') {
  await supabase.from('reviews').insert({
    user_id: currentUser.id,
    restaurant_id: restaurant.id,
    order_id: order.id,
    rating: 5,
    comment: 'Excellent!',
  });
}
```

---

## 🔍 Debugging

### Check Connection

```typescript
const { data, error } = await supabase
  .from('restaurants')
  .select('count')
  .limit(1);

if (error) {
  console.error('Connection failed:', error);
} else {
  console.log('✅ Connected to Supabase!');
}
```

### View Current User

```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

### Test Query

```typescript
const { data, error } = await supabase
  .from('restaurants')
  .select('*')
  .limit(5);

console.log('Restaurants:', data);
console.log('Error:', error);
```

---

## 📚 Additional Resources

- **DATABASE_SCHEMA_V2.md** - Complete database documentation
- **DATABASE_SETUP_GUIDE.md** - Setup instructions
- **supabase/migrations/** - SQL migration files
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)

---

## ✅ Checklist for AI Integration

- [ ] Supabase project created
- [ ] Migrations run (001 → 012)
- [ ] `.env` file configured
- [ ] `@supabase/supabase-js` installed
- [ ] Supabase client imported
- [ ] Test connection successful
- [ ] Service functions working
- [ ] Real-time subscriptions tested
- [ ] RLS policies understood
- [ ] Error handling implemented

---

**🎉 Everything is ready for AI integration!**

The database is structured, documented, and has easy-to-use service functions. AI agents can now:
- Read data easily
- Understand relationships
- Query efficiently
- Handle real-time updates
- Respect security policies

---

**Created**: 2025-11-07  
**Version**: 2.0  
**Status**: Production-Ready ✅
