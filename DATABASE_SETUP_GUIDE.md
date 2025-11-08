# SmartBite Database Setup Guide

**Version**: 2.0  
**Date**: 2025-11-07  
**Status**: ✅ Ready for Implementation

---

## 🎯 Overview

This guide will help you set up the complete SmartBite database in Supabase. The database supports all three portals:
- 👥 **User Portal** - Browse, order, track, review
- 🏪 **Partner Portal** - Restaurant management, live orders
- 👨‍💼 **Admin Portal** - Platform management, analytics

---

## 📋 What Was Created

### 1. **DATABASE_SCHEMA_V2.md**
- Complete database schema documentation
- 21 tables with full specifications
- Relationships and constraints
- Indexes for performance
- Row Level Security policies

### 2. **Migration Files** (12 files)
Located in `supabase/migrations/`:

| # | File | What It Does |
|---|------|--------------|
| 001 | `enable_extensions.sql` | Enable UUID and text search |
| 002 | `create_enums.sql` | Create enum types (status, roles, etc.) |
| 003 | `create_users_tables.sql` | Users, addresses, favorites |
| 004 | `create_restaurants_tables.sql` | Restaurants, categories, menu, dishes |
| 005 | `create_orders_tables.sql` | Orders, order items, cart |
| 006 | `create_delivery_tables.sql` | Riders, order tracking |
| 007 | `create_reviews_tables.sql` | Reviews and ratings |
| 008 | `create_payment_tables.sql` | Payment methods, transactions |
| 009 | `create_admin_tables.sql` | Promo codes, settings |
| 010 | `create_functions_triggers.sql` | Auto-updates, calculations |
| 011 | `enable_rls.sql` | Row Level Security policies |
| 012 | `seed_data.sql` | Sample data (optional) |

---

## 🚀 Quick Start

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Choose a region (closest to Bahrain)
4. Set a strong database password
5. Wait for project to be ready (~2 minutes)

### Step 2: Run Migrations

**Option A: Supabase Dashboard (Easiest)**

1. Open your Supabase project
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy contents of `001_enable_extensions.sql`
5. Paste and click **Run**
6. Repeat for files 002 through 012 **in order**

**Option B: Run All at Once**

1. Open SQL Editor
2. Create a new query
3. Copy and paste ALL 12 files in order (001 → 012)
4. Click **Run**
5. Wait for completion

### Step 3: Verify Setup

Run this query to check everything is created:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should see 21 tables:
-- admin_settings, cart_item_addons, cart_items, dish_addons, dishes,
-- menu_categories, order_item_addons, order_items, order_tracking, orders,
-- payment_methods, promo_codes, restaurant_categories, restaurants,
-- review_tags, reviews, riders, transactions, user_addresses, 
-- user_favorites, users
```

### Step 4: Test Connection

In your React Native app:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase
    .from('restaurant_categories')
    .select('*')
    .limit(5);
    
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connected! Categories:', data);
  }
};
```

---

## 📊 Database Structure

### Core Tables

```
Authentication & Users
├── users (customer/partner/admin)
├── user_addresses (delivery addresses)
└── user_favorites (saved restaurants)

Restaurants & Menu
├── restaurant_categories (platform-wide)
├── restaurants (restaurant info)
├── menu_categories (menu sections)
├── dishes (menu items)
└── dish_addons (extras)

Orders & Cart
├── orders (order records)
├── order_items (items in order)
├── order_item_addons (item extras)
├── cart_items (temporary cart)
└── cart_item_addons (cart extras)

Delivery & Tracking
├── riders (delivery personnel)
└── order_tracking (status history)

Reviews & Ratings
├── reviews (restaurant reviews)
└── review_tags (quick feedback)

Payments
├── payment_methods (saved cards)
└── transactions (payment records)

Admin Features
├── promo_codes (discounts)
└── admin_settings (platform config)
```

---

## 🔐 Security (Row Level Security)

RLS is enabled on all tables with policies for:

### Customers
- ✅ Can view their own data (orders, addresses, favorites)
- ✅ Can view all active restaurants and menus
- ✅ Can create orders and reviews
- ❌ Cannot see other users' data

### Partners
- ✅ Can manage their own restaurants
- ✅ Can view orders for their restaurants
- ✅ Can update order status
- ❌ Cannot see other restaurants' data

### Admins
- ✅ Can view and manage everything
- ✅ Can create/edit categories and promo codes
- ✅ Can manage all restaurants
- ✅ Full platform access

---

## 🎨 Key Features

### 1. Auto-Generated Order Numbers
```sql
-- Orders automatically get numbers like: WAJ0001, WAJ0002, etc.
INSERT INTO orders (...) VALUES (...);
-- order_number is auto-generated
```

### 2. Auto-Updated Ratings
```sql
-- Restaurant rating updates automatically when review is added
INSERT INTO reviews (restaurant_id, rating, ...) VALUES (...);
-- restaurants.rating and total_reviews update automatically
```

### 3. Order Tracking History
```sql
-- Status changes are automatically logged
UPDATE orders SET status = 'preparing' WHERE id = '...';
-- order_tracking entry created automatically
```

### 4. Promo Code Usage Tracking
```sql
-- Usage count increments automatically
INSERT INTO orders (promo_code_id, ...) VALUES (...);
-- promo_codes.used_count increments automatically
```

### 5. Cart Cleanup
```sql
-- Old cart items can be cleaned up
DELETE FROM cart_items 
WHERE updated_at < NOW() - INTERVAL '7 days';
```

---

## 🧪 Testing

### Create Test Data

```sql
-- 1. Create test user (do this via Supabase Auth first)
-- Then insert into users table:
INSERT INTO users (id, email, full_name, role)
VALUES (
  '<auth_user_id>',
  'test@example.com',
  'Test User',
  'customer'
);

-- 2. Create test address
INSERT INTO user_addresses (user_id, area, building, is_default)
VALUES (
  '<user_id>',
  'Manama',
  'Building 123',
  TRUE
);

-- 3. Create test restaurant (as partner)
INSERT INTO restaurants (
  partner_id, name, category, address, phone,
  delivery_fee, min_order, avg_prep_time
) VALUES (
  '<partner_user_id>',
  'Test Restaurant',
  'Burgers',
  'Test Address, Manama',
  '+973 1234 5678',
  1.5,
  5.0,
  '25-30 min'
);

-- 4. Create test dish
INSERT INTO dishes (
  restaurant_id, name, description, price, is_available
) VALUES (
  '<restaurant_id>',
  'Test Burger',
  'Delicious test burger',
  5.50,
  TRUE
);

-- 5. Create test order
INSERT INTO orders (
  user_id, restaurant_id, delivery_address_id,
  status, subtotal, total_amount,
  payment_method, payment_status
) VALUES (
  '<user_id>',
  '<restaurant_id>',
  '<address_id>',
  'pending',
  10.00,
  11.50,
  'card',
  'pending'
);
```

---

## 📱 Integration with React Native

### Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Setup Supabase Client

```typescript
// src/lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### Example Queries

```typescript
// Fetch restaurants
const { data: restaurants, error } = await supabase
  .from('restaurants')
  .select('*')
  .eq('is_active', true)
  .order('rating', { ascending: false });

// Fetch menu for restaurant
const { data: dishes } = await supabase
  .from('dishes')
  .select(`
    *,
    menu_categories (name),
    dish_addons (*)
  `)
  .eq('restaurant_id', restaurantId)
  .eq('is_available', true);

// Create order
const { data: order, error } = await supabase
  .from('orders')
  .insert({
    user_id: userId,
    restaurant_id: restaurantId,
    delivery_address_id: addressId,
    status: 'pending',
    subtotal: 10.00,
    delivery_fee: 1.50,
    total_amount: 11.50,
    payment_method: 'card',
    payment_status: 'pending',
  })
  .select()
  .single();

// Real-time order tracking
const subscription = supabase
  .channel('order-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `id=eq.${orderId}`,
    },
    (payload) => {
      console.log('Order updated:', payload.new);
      // Update UI with new status
    }
  )
  .subscribe();
```

---

## 🔧 Maintenance

### Regular Tasks

```sql
-- Clean old cart items (run daily)
DELETE FROM cart_items 
WHERE updated_at < NOW() - INTERVAL '7 days';

-- Check database size
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as size;

-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::text)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;
```

### Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Restore
supabase db reset
psql -f backup.sql
```

---

## 🆘 Troubleshooting

### Issue: "permission denied for table"
**Solution**: Check RLS policies are correct. Test with service role key for debugging.

### Issue: "foreign key constraint violated"
**Solution**: Ensure referenced records exist. Check cascade rules.

### Issue: "duplicate key value"
**Solution**: Check unique constraints. Use `ON CONFLICT` clause if needed.

### Issue: "function does not exist"
**Solution**: Run migration 010 (functions and triggers).

---

## 📚 Next Steps

1. ✅ **Database is ready!**
2. 🔄 **Integrate with React Native app**
   - Install `@supabase/supabase-js`
   - Setup Supabase client
   - Replace mock data with real queries
3. 🔐 **Setup Authentication**
   - Configure Supabase Auth
   - Add social providers (Apple, Google)
   - Implement signup/login flows
4. 📊 **Test All Features**
   - User registration
   - Restaurant browsing
   - Order placement
   - Order tracking
   - Reviews and ratings
5. 🚀 **Deploy**
   - Test in production
   - Monitor performance
   - Setup backups

---

## 📖 Additional Resources

- **DATABASE_SCHEMA_V2.md** - Complete schema documentation
- **supabase/README.md** - Migration instructions
- **supabase/migrations/** - All SQL migration files
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**🎉 Your database is ready! Start building your app!** 🚀

---

**Created**: 2025-11-07  
**Version**: 2.0  
**Author**: SmartBite Team  
**Status**: Production-Ready ✅
