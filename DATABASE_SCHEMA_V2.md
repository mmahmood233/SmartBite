# SmartBite (Wajba) - Complete Database Schema v2.0

**Last Updated**: 2025-11-07  
**Version**: 2.0  
**Status**: Production-Ready - Supports All 3 Portals (User, Partner, Admin)

---

## 📊 Overview

This schema supports the complete SmartBite application with:
- ✅ **User Portal** - Browse, order, track, review
- ✅ **Partner Portal** - Restaurant management, live orders, analytics
- ✅ **Admin Portal** - Platform management, restaurants, categories, promotions

**Database**: PostgreSQL (Supabase)  
**Features**: UUID primary keys, Row Level Security (RLS), Real-time subscriptions, JSONB for flexibility

---

## 🗂️ Table of Contents

1. [Authentication & Users](#1-authentication--users)
2. [Restaurants & Menu](#2-restaurants--menu)
3. [Orders & Cart](#3-orders--cart)
4. [Delivery & Tracking](#4-delivery--tracking)
5. [Reviews & Ratings](#5-reviews--ratings)
6. [Payments](#6-payments)
7. [Admin Features](#7-admin-features)
8. [Relationships](#8-relationships)
9. [Indexes & Performance](#9-indexes--performance)
10. [Row Level Security](#10-row-level-security)

---

## 1. Authentication & Users

### `users`
Core user accounts (extends Supabase auth.users)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | References auth.users(id) |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| `full_name` | VARCHAR(100) | NOT NULL | Full name |
| `phone` | VARCHAR(20) | UNIQUE | Phone number |
| `profile_image` | TEXT | | Profile photo URL |
| `role` | ENUM | DEFAULT 'customer' | user, partner, admin |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `email_verified` | BOOLEAN | DEFAULT FALSE | Email verification |
| `phone_verified` | BOOLEAN | DEFAULT FALSE | Phone verification |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Registration date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Indexes**: `email`, `phone`, `role`, `created_at`

**Role ENUM**: `customer`, `partner`, `admin`

---

### `user_addresses`
Saved delivery addresses

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Address ID |
| `user_id` | UUID | FK → users(id) ON DELETE CASCADE | Owner |
| `label` | VARCHAR(50) | | Home, Work, Other |
| `building` | VARCHAR(100) | | Building/Flat number |
| `road` | VARCHAR(100) | | Road number |
| `block` | VARCHAR(100) | | Block number |
| `area` | VARCHAR(100) | NOT NULL | Area/District |
| `city` | VARCHAR(100) | DEFAULT 'Manama' | City |
| `postal_code` | VARCHAR(20) | | Postal code |
| `latitude` | DECIMAL(10,8) | | GPS latitude |
| `longitude` | DECIMAL(11,8) | | GPS longitude |
| `contact_number` | VARCHAR(20) | | Delivery contact |
| `notes` | TEXT | | Delivery instructions |
| `is_default` | BOOLEAN | DEFAULT FALSE | Default address |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Indexes**: `user_id`, `is_default`

---

### `user_favorites`
Saved favorite restaurants

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Favorite ID |
| `user_id` | UUID | FK → users(id) ON DELETE CASCADE | User |
| `restaurant_id` | UUID | FK → restaurants(id) ON DELETE CASCADE | Restaurant |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Added date |

**Unique Constraint**: `(user_id, restaurant_id)`  
**Indexes**: `user_id`, `restaurant_id`

---

## 2. Restaurants & Menu

### `restaurants`
Restaurant information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Restaurant ID |
| `partner_id` | UUID | FK → users(id) | Partner/Owner |
| `name` | VARCHAR(200) | NOT NULL | Restaurant name |
| `category` | VARCHAR(100) | NOT NULL | Primary category |
| `description` | TEXT | | Description |
| `logo` | TEXT | | Logo URL |
| `banner_image` | TEXT | | Banner image URL |
| `address` | VARCHAR(255) | NOT NULL | Full address |
| `latitude` | DECIMAL(10,8) | | GPS latitude |
| `longitude` | DECIMAL(11,8) | | GPS longitude |
| `phone` | VARCHAR(20) | NOT NULL | Contact phone |
| `email` | VARCHAR(255) | | Contact email |
| `rating` | DECIMAL(3,2) | DEFAULT 0.0 | Average rating (0-5) |
| `total_reviews` | INTEGER | DEFAULT 0 | Review count |
| `total_orders` | INTEGER | DEFAULT 0 | Total orders |
| `delivery_fee` | DECIMAL(10,2) | DEFAULT 0.0 | Delivery charge (BD) |
| `min_order` | DECIMAL(10,2) | DEFAULT 0.0 | Minimum order (BD) |
| `avg_prep_time` | VARCHAR(50) | | e.g., "25-30 min" |
| `is_open` | BOOLEAN | DEFAULT TRUE | Currently open |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Registration date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Indexes**: `partner_id`, `category`, `rating DESC`, `is_open`, `is_active`, `created_at`

---

### `restaurant_categories`
Platform-wide restaurant categories (Admin managed)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Category ID |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| `icon` | VARCHAR(10) | | Emoji icon |
| `restaurant_count` | INTEGER | DEFAULT 0 | Number of restaurants |
| `display_order` | INTEGER | DEFAULT 0 | Sort order |
| `is_active` | BOOLEAN | DEFAULT TRUE | Visibility |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Indexes**: `name`, `display_order`, `is_active`

---

### `menu_categories`
Menu sections within a restaurant

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Category ID |
| `restaurant_id` | UUID | FK → restaurants(id) ON DELETE CASCADE | Parent restaurant |
| `name` | VARCHAR(100) | NOT NULL | Category name |
| `description` | TEXT | | Description |
| `display_order` | INTEGER | DEFAULT 0 | Sort order |
| `is_active` | BOOLEAN | DEFAULT TRUE | Visibility |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Indexes**: `restaurant_id`, `display_order`

---

### `dishes`
Menu items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Dish ID |
| `restaurant_id` | UUID | FK → restaurants(id) ON DELETE CASCADE | Restaurant |
| `category_id` | UUID | FK → menu_categories(id) ON DELETE SET NULL | Menu category |
| `name` | VARCHAR(200) | NOT NULL | Dish name |
| `description` | TEXT | | Description |
| `image` | TEXT | | Image URL |
| `price` | DECIMAL(10,2) | NOT NULL | Price (BD) |
| `calories` | INTEGER | | Calorie count |
| `preparation_time` | INTEGER | | Prep time (minutes) |
| `is_vegetarian` | BOOLEAN | DEFAULT FALSE | Vegetarian |
| `is_vegan` | BOOLEAN | DEFAULT FALSE | Vegan |
| `is_spicy` | BOOLEAN | DEFAULT FALSE | Spicy |
| `is_popular` | BOOLEAN | DEFAULT FALSE | Popular item |
| `is_available` | BOOLEAN | DEFAULT TRUE | Currently available |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Indexes**: `restaurant_id`, `category_id`, `is_available`, `is_popular`, `price`

---

### `dish_addons`
Optional add-ons for dishes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Add-on ID |
| `dish_id` | UUID | FK → dishes(id) ON DELETE CASCADE | Parent dish |
| `name` | VARCHAR(100) | NOT NULL | Add-on name |
| `price` | DECIMAL(10,2) | NOT NULL | Additional cost |
| `is_available` | BOOLEAN | DEFAULT TRUE | Availability |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation date |

**Indexes**: `dish_id`, `is_available`

---

## 3. Orders & Cart

### `orders`
Complete order records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Order ID |
| `order_number` | VARCHAR(20) | UNIQUE, NOT NULL | e.g., "WAJ1234" |
| `user_id` | UUID | FK → users(id) | Customer |
| `restaurant_id` | UUID | FK → restaurants(id) | Restaurant |
| `delivery_address_id` | UUID | FK → user_addresses(id) | Delivery location |
| `status` | ENUM | NOT NULL | Order status |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Items total |
| `delivery_fee` | DECIMAL(10,2) | DEFAULT 0.0 | Delivery charge |
| `discount_amount` | DECIMAL(10,2) | DEFAULT 0.0 | Discount applied |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Final total |
| `payment_method` | ENUM | NOT NULL | Payment type |
| `payment_status` | ENUM | NOT NULL | Payment state |
| `promo_code_id` | UUID | FK → promo_codes(id) | Applied promo |
| `delivery_notes` | TEXT | | Special instructions |
| `estimated_delivery_time` | TIMESTAMPTZ | | Expected delivery |
| `actual_delivery_time` | TIMESTAMPTZ | | Actual delivery |
| `rider_id` | UUID | FK → riders(id) | Assigned rider |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Order placed |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last status update |

**Order Status ENUM**:
- `pending` - Waiting for restaurant
- `confirmed` - Restaurant accepted
- `preparing` - Being prepared
- `ready_for_pickup` - Ready for rider
- `out_for_delivery` - On the way
- `delivered` - Completed
- `cancelled` - Cancelled

**Payment Method ENUM**: `card`, `benefitpay`, `cash`, `apple_pay`

**Payment Status ENUM**: `pending`, `completed`, `failed`, `refunded`

**Indexes**: `order_number`, `user_id`, `restaurant_id`, `status`, `created_at DESC`

---

### `order_items`
Items within an order

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Item ID |
| `order_id` | UUID | FK → orders(id) ON DELETE CASCADE | Parent order |
| `dish_id` | UUID | FK → dishes(id) | Ordered dish |
| `dish_name` | VARCHAR(200) | NOT NULL | Dish name (snapshot) |
| `quantity` | INTEGER | NOT NULL | Quantity |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Price per unit |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Item total |
| `special_request` | TEXT | | Custom instructions |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation time |

**Indexes**: `order_id`, `dish_id`

---

### `order_item_addons`
Add-ons for order items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Record ID |
| `order_item_id` | UUID | FK → order_items(id) ON DELETE CASCADE | Parent item |
| `addon_id` | UUID | FK → dish_addons(id) | Add-on |
| `addon_name` | VARCHAR(100) | NOT NULL | Name (snapshot) |
| `addon_price` | DECIMAL(10,2) | NOT NULL | Price (snapshot) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation time |

**Indexes**: `order_item_id`

---

### `cart_items`
Temporary cart storage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Cart item ID |
| `user_id` | UUID | FK → users(id) ON DELETE CASCADE | Cart owner |
| `restaurant_id` | UUID | FK → restaurants(id) ON DELETE CASCADE | Restaurant |
| `dish_id` | UUID | FK → dishes(id) ON DELETE CASCADE | Selected dish |
| `quantity` | INTEGER | NOT NULL | Quantity |
| `special_request` | TEXT | | Custom instructions |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Added to cart |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last modification |

**Indexes**: `user_id`, `restaurant_id`, `dish_id`, `updated_at`

---

### `cart_item_addons`
Add-ons for cart items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Record ID |
| `cart_item_id` | UUID | FK → cart_items(id) ON DELETE CASCADE | Parent cart item |
| `addon_id` | UUID | FK → dish_addons(id) ON DELETE CASCADE | Selected add-on |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation time |

**Indexes**: `cart_item_id`

---

## 4. Delivery & Tracking

### `riders`
Delivery personnel

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Rider ID |
| `user_id` | UUID | FK → users(id) | User account |
| `full_name` | VARCHAR(100) | NOT NULL | Rider name |
| `phone` | VARCHAR(20) | UNIQUE, NOT NULL | Contact phone |
| `email` | VARCHAR(255) | UNIQUE | Email |
| `profile_image` | TEXT | | Profile photo |
| `vehicle_type` | VARCHAR(50) | | bike, car, motorcycle |
| `vehicle_number` | VARCHAR(50) | | License plate |
| `rating` | DECIMAL(3,2) | DEFAULT 0.0 | Average rating |
| `total_deliveries` | INTEGER | DEFAULT 0 | Completed deliveries |
| `is_available` | BOOLEAN | DEFAULT TRUE | Currently available |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Registration date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Indexes**: `user_id`, `phone`, `is_available`, `rating DESC`

---

### `order_tracking`
Real-time order status updates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Tracking ID |
| `order_id` | UUID | FK → orders(id) ON DELETE CASCADE | Tracked order |
| `status` | ENUM | NOT NULL | Status (same as orders) |
| `latitude` | DECIMAL(10,8) | | Current GPS latitude |
| `longitude` | DECIMAL(11,8) | | Current GPS longitude |
| `notes` | TEXT | | Status notes |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Status change time |

**Indexes**: `order_id`, `created_at DESC`

---

## 5. Reviews & Ratings

### `reviews`
User reviews for restaurants

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Review ID |
| `user_id` | UUID | FK → users(id) | Reviewer |
| `restaurant_id` | UUID | FK → restaurants(id) | Reviewed restaurant |
| `order_id` | UUID | FK → orders(id) | Related order |
| `rating` | INTEGER | NOT NULL, CHECK (1-5) | Star rating (1-5) |
| `comment` | TEXT | | Review text |
| `photo_url` | TEXT | | Review photo |
| `is_visible` | BOOLEAN | DEFAULT TRUE | Visibility |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Review date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last edit |

**Unique Constraint**: `(user_id, order_id)` - One review per order  
**Indexes**: `user_id`, `restaurant_id`, `order_id`, `rating`, `created_at DESC`

---

### `review_tags`
Quick feedback tags

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Tag ID |
| `review_id` | UUID | FK → reviews(id) ON DELETE CASCADE | Parent review |
| `tag` | VARCHAR(50) | NOT NULL | Tag name |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation time |

**Available Tags**: `Delicious`, `Fast Delivery`, `Hot & Fresh`, `Great Packaging`, `Good Portions`, `Value for Money`

**Indexes**: `review_id`, `tag`

---

## 6. Payments

### `payment_methods`
Saved payment methods

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Payment method ID |
| `user_id` | UUID | FK → users(id) ON DELETE CASCADE | Owner |
| `type` | ENUM | NOT NULL | Payment type |
| `card_type` | VARCHAR(50) | | visa, mastercard, etc. |
| `card_last4` | VARCHAR(4) | | Last 4 digits |
| `expiry_date` | VARCHAR(7) | | MM/YY format |
| `is_default` | BOOLEAN | DEFAULT FALSE | Default payment |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Added date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Payment Type ENUM**: `card`, `benefitpay`, `cash`, `apple_pay`

**Indexes**: `user_id`, `is_default`

---

### `transactions`
Payment transaction records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Transaction ID |
| `order_id` | UUID | FK → orders(id) | Related order |
| `user_id` | UUID | FK → users(id) | Payer |
| `amount` | DECIMAL(10,2) | NOT NULL | Transaction amount |
| `payment_method` | ENUM | NOT NULL | Payment type |
| `status` | ENUM | NOT NULL | Transaction status |
| `gateway_transaction_id` | VARCHAR(255) | | External gateway ID |
| `gateway_response` | JSONB | | Gateway response data |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Transaction time |

**Transaction Status ENUM**: `pending`, `processing`, `completed`, `failed`, `refunded`

**Indexes**: `order_id`, `user_id`, `status`, `created_at DESC`

---

## 7. Admin Features

### `promo_codes`
Discount and promotional codes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Promo code ID |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Promo code string |
| `title` | VARCHAR(200) | NOT NULL | Display title |
| `description` | TEXT | | Description |
| `type` | ENUM | NOT NULL | Discount type |
| `discount_value` | DECIMAL(10,2) | NOT NULL | Discount amount/% |
| `min_order_amount` | DECIMAL(10,2) | DEFAULT 0.0 | Minimum order value |
| `max_usage` | INTEGER | | Maximum total uses |
| `used_count` | INTEGER | DEFAULT 0 | Current use count |
| `valid_from` | TIMESTAMPTZ | NOT NULL | Start date |
| `valid_until` | TIMESTAMPTZ | NOT NULL | End date |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation date |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Discount Type ENUM**: `percentage`, `fixed`, `free_delivery`

**Indexes**: `code`, `is_active`, `valid_from`, `valid_until`

---

### `admin_settings`
Platform-wide settings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Setting ID |
| `key` | VARCHAR(100) | UNIQUE, NOT NULL | Setting key |
| `value` | TEXT | NOT NULL | Setting value |
| `description` | TEXT | | Description |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |
| `updated_by` | UUID | FK → users(id) | Admin who updated |

**Example Keys**: `default_delivery_fee`, `platform_commission`, `app_version`, `maintenance_mode`

**Indexes**: `key`

---

## 8. Relationships

```
users (customer/partner/admin)
  ├── user_addresses (1:N)
  ├── user_favorites (1:N)
  ├── orders (1:N)
  ├── reviews (1:N)
  ├── payment_methods (1:N)
  ├── transactions (1:N)
  ├── cart_items (1:N)
  └── restaurants (1:N) [if partner]

restaurants
  ├── menu_categories (1:N)
  ├── dishes (1:N)
  ├── orders (1:N)
  ├── reviews (1:N)
  └── partner (N:1) → users

menu_categories
  └── dishes (1:N)

dishes
  ├── dish_addons (1:N)
  ├── order_items (1:N)
  └── cart_items (1:N)

orders
  ├── order_items (1:N)
  ├── order_tracking (1:N)
  ├── review (1:1)
  ├── transactions (1:N)
  ├── rider (N:1)
  ├── delivery_address (N:1)
  └── promo_code (N:1)

order_items
  └── order_item_addons (1:N)

cart_items
  └── cart_item_addons (1:N)

reviews
  └── review_tags (1:N)

riders
  └── orders (1:N)

promo_codes
  └── orders (1:N)
```

---

## 9. Indexes & Performance

### Composite Indexes

```sql
-- User order history
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Restaurant menu lookup
CREATE INDEX idx_dishes_restaurant_category ON dishes(restaurant_id, category_id);

-- Active orders for partners
CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status) 
WHERE status IN ('pending', 'confirmed', 'preparing', 'ready_for_pickup');

-- Active orders for riders
CREATE INDEX idx_orders_rider_status ON orders(rider_id, status) 
WHERE status = 'out_for_delivery';

-- Review search
CREATE INDEX idx_reviews_restaurant_rating ON reviews(restaurant_id, rating DESC, created_at DESC);

-- Cart cleanup (old items)
CREATE INDEX idx_cart_updated ON cart_items(updated_at) 
WHERE updated_at < NOW() - INTERVAL '7 days';

-- Promo code validation
CREATE INDEX idx_promo_active_dates ON promo_codes(is_active, valid_from, valid_until)
WHERE is_active = TRUE;
```

---

## 10. Row Level Security (RLS)

### Enable RLS on all tables

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ... (enable for all tables)
```

### Sample RLS Policies

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can only manage their own addresses
CREATE POLICY "Users can manage own addresses" ON user_addresses
  FOR ALL USING (auth.uid() = user_id);

-- Partners can only manage their own restaurants
CREATE POLICY "Partners can manage own restaurants" ON restaurants
  FOR ALL USING (auth.uid() = partner_id);

-- Users can view all active restaurants
CREATE POLICY "Anyone can view active restaurants" ON restaurants
  FOR SELECT USING (is_active = TRUE AND is_open = TRUE);

-- Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Partners can see orders for their restaurants
CREATE POLICY "Partners can view restaurant orders" ON orders
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE partner_id = auth.uid()
    )
  );

-- Admins can see everything
CREATE POLICY "Admins can view all data" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 11. Triggers & Functions

### Auto-update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (repeat for all tables)
```

### Update restaurant rating

```sql
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET 
    rating = (SELECT AVG(rating) FROM reviews WHERE restaurant_id = NEW.restaurant_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE restaurant_id = NEW.restaurant_id)
  WHERE id = NEW.restaurant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurant_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();
```

### Increment promo code usage

```sql
CREATE OR REPLACE FUNCTION increment_promo_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.promo_code_id IS NOT NULL THEN
    UPDATE promo_codes
    SET used_count = used_count + 1
    WHERE id = NEW.promo_code_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_promo_usage_trigger
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION increment_promo_usage();
```

---

## 12. Data Validation

### Check Constraints

```sql
-- Rating must be between 1 and 5
ALTER TABLE reviews ADD CONSTRAINT check_rating_range 
  CHECK (rating >= 1 AND rating <= 5);

-- Prices must be positive
ALTER TABLE dishes ADD CONSTRAINT check_price_positive 
  CHECK (price >= 0);

ALTER TABLE orders ADD CONSTRAINT check_total_positive 
  CHECK (total_amount >= 0);

-- Quantity must be positive
ALTER TABLE order_items ADD CONSTRAINT check_quantity_positive 
  CHECK (quantity > 0);

-- Promo code dates must be valid
ALTER TABLE promo_codes ADD CONSTRAINT check_promo_dates 
  CHECK (valid_until > valid_from);
```

---

## 13. Future Enhancements

- [ ] `notifications` - Push notifications
- [ ] `support_tickets` - Customer support
- [ ] `loyalty_points` - Rewards program
- [ ] `restaurant_hours` - Operating hours
- [ ] `delivery_zones` - Service area management
- [ ] `rider_locations` - Real-time GPS tracking
- [ ] `order_chat` - Customer-rider messaging
- [ ] `analytics_events` - User behavior tracking

---

## 📝 Notes

- All `id` fields use UUID for security and scalability
- All monetary values use `DECIMAL(10,2)` for precision
- Timestamps use `TIMESTAMPTZ` (UTC timezone)
- JSONB columns for flexible data (e.g., `gateway_response`)
- Enum types ensure data consistency
- Soft deletes can be implemented with `deleted_at` column
- All foreign keys have ON DELETE actions specified

---

**Database**: PostgreSQL 15+ (Supabase)  
**Compatible with**: Supabase, AWS RDS, Google Cloud SQL, Azure Database

---

*This schema supports all features implemented in SmartBite v2.0 as of 2025-11-07.*
