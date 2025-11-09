# Wajba (SmartBite) - Database Schema

**Last Updated**: 2025-10-07  
**Version**: 1.0  
**Status**: Complete Core Features

---

## 📊 Database Overview

This document contains the complete database schema for the Wajba food delivery application. All tables, relationships, and indexes are designed to support the full user journey from browsing to order completion and review.

---

## 🗂️ Table of Contents

1. [Users & Authentication](#users--authentication)
2. [Restaurants & Menu](#restaurants--menu)
3. [Orders & Cart](#orders--cart)
4. [Delivery & Tracking](#delivery--tracking)
5. [Reviews & Ratings](#reviews--ratings)
6. [Payments](#payments)
7. [Relationships Diagram](#relationships-diagram)
8. [Indexes & Performance](#indexes--performance)

---

## 1. Users & Authentication

### `users`
Primary user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password |
| `phone` | VARCHAR(20) | UNIQUE | Phone number |
| `full_name` | VARCHAR(100) | NOT NULL | User's full name |
| `profile_image` | TEXT | | Profile photo URL |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `email_verified` | BOOLEAN | DEFAULT FALSE | Email verification status |
| `phone_verified` | BOOLEAN | DEFAULT FALSE | Phone verification status |

**Indexes**: `email`, `phone`, `created_at`

---

### `user_addresses`
Saved delivery addresses for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Address identifier |
| `user_id` | UUID | FOREIGN KEY → users(id) | Owner of address |
| `label` | VARCHAR(50) | | Address label (Home, Work, etc.) |
| `address_line1` | VARCHAR(255) | NOT NULL | Building/Street address |
| `address_line2` | VARCHAR(255) | | Additional address info |
| `city` | VARCHAR(100) | NOT NULL | City name |
| `area` | VARCHAR(100) | | Area/District |
| `postal_code` | VARCHAR(20) | | Postal/ZIP code |
| `latitude` | DECIMAL(10,8) | | GPS latitude |
| `longitude` | DECIMAL(11,8) | | GPS longitude |
| `is_default` | BOOLEAN | DEFAULT FALSE | Default address flag |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes**: `user_id`, `is_default`

---

## 2. Restaurants & Menu

### `restaurants`
Restaurant information and metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Restaurant identifier |
| `name` | VARCHAR(200) | NOT NULL | Restaurant name |
| `logo` | TEXT | | Logo image URL |
| `banner_image` | TEXT | | Banner/cover image |
| `description` | TEXT | | Restaurant description |
| `cuisine_type` | VARCHAR(100) | | Cuisine category |
| `address` | VARCHAR(255) | NOT NULL | Restaurant address |
| `latitude` | DECIMAL(10,8) | | GPS latitude |
| `longitude` | DECIMAL(11,8) | | GPS longitude |
| `phone` | VARCHAR(20) | | Contact phone |
| `email` | VARCHAR(255) | | Contact email |
| `rating` | DECIMAL(3,2) | DEFAULT 0.0 | Average rating (0-5) |
| `total_reviews` | INTEGER | DEFAULT 0 | Total review count |
| `delivery_time` | VARCHAR(50) | | Estimated delivery time |
| `delivery_fee` | DECIMAL(10,2) | DEFAULT 0.0 | Delivery charge |
| `minimum_order` | DECIMAL(10,2) | DEFAULT 0.0 | Minimum order amount |
| `is_open` | BOOLEAN | DEFAULT TRUE | Currently accepting orders |
| `is_active` | BOOLEAN | DEFAULT TRUE | Restaurant active status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Registration date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes**: `name`, `cuisine_type`, `rating`, `is_open`, `is_active`

---

### `menu_categories`
Menu organization categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Category identifier |
| `restaurant_id` | UUID | FOREIGN KEY → restaurants(id) | Parent restaurant |
| `name` | VARCHAR(100) | NOT NULL | Category name |
| `description` | TEXT | | Category description |
| `display_order` | INTEGER | DEFAULT 0 | Sort order |
| `is_active` | BOOLEAN | DEFAULT TRUE | Visibility status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation date |

**Indexes**: `restaurant_id`, `display_order`

---

### `dishes`
Individual menu items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Dish identifier |
| `restaurant_id` | UUID | FOREIGN KEY → restaurants(id) | Parent restaurant |
| `category_id` | UUID | FOREIGN KEY → menu_categories(id) | Menu category |
| `name` | VARCHAR(200) | NOT NULL | Dish name |
| `description` | TEXT | | Dish description |
| `image` | TEXT | | Dish image URL |
| `price` | DECIMAL(10,2) | NOT NULL | Base price |
| `calories` | INTEGER | | Calorie count |
| `preparation_time` | INTEGER | | Prep time (minutes) |
| `is_vegetarian` | BOOLEAN | DEFAULT FALSE | Vegetarian flag |
| `is_vegan` | BOOLEAN | DEFAULT FALSE | Vegan flag |
| `is_spicy` | BOOLEAN | DEFAULT FALSE | Spicy indicator |
| `is_available` | BOOLEAN | DEFAULT TRUE | Current availability |
| `is_popular` | BOOLEAN | DEFAULT FALSE | Popular item flag |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes**: `restaurant_id`, `category_id`, `is_available`, `is_popular`

---

### `dish_addons`
Optional add-ons for dishes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Add-on identifier |
| `dish_id` | UUID | FOREIGN KEY → dishes(id) | Parent dish |
| `name` | VARCHAR(100) | NOT NULL | Add-on name |
| `price` | DECIMAL(10,2) | NOT NULL | Additional cost |
| `is_available` | BOOLEAN | DEFAULT TRUE | Availability status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation date |

**Indexes**: `dish_id`, `is_available`

---

## 3. Orders & Cart

### `orders`
Complete order records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Order identifier |
| `order_number` | VARCHAR(20) | UNIQUE, NOT NULL | Human-readable order # |
| `user_id` | UUID | FOREIGN KEY → users(id) | Customer |
| `restaurant_id` | UUID | FOREIGN KEY → restaurants(id) | Restaurant |
| `delivery_address_id` | UUID | FOREIGN KEY → user_addresses(id) | Delivery location |
| `status` | ENUM | NOT NULL | Order status (see below) |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Items total |
| `delivery_fee` | DECIMAL(10,2) | DEFAULT 0.0 | Delivery charge |
| `discount_amount` | DECIMAL(10,2) | DEFAULT 0.0 | Discount applied |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Final total |
| `payment_method` | ENUM | NOT NULL | Payment type (see below) |
| `payment_status` | ENUM | NOT NULL | Payment state |
| `promo_code` | VARCHAR(50) | | Applied promo code |
| `delivery_notes` | TEXT | | Special instructions |
| `estimated_delivery_time` | TIMESTAMP | | Expected delivery |
| `actual_delivery_time` | TIMESTAMP | | Actual delivery |
| `rider_id` | UUID | FOREIGN KEY → riders(id) | Assigned rider |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Order placed time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last status update |

**Order Status ENUM**: 
- `pending`
- `confirmed`
- `preparing`
- `ready_for_pickup`
- `out_for_delivery`
- `delivered`
- `cancelled`

**Payment Method ENUM**:
- `apple_pay`
- `paypal`
- `card`
- `cash`

**Payment Status ENUM**:
- `pending`
- `completed`
- `failed`
- `refunded`

**Indexes**: `order_number`, `user_id`, `restaurant_id`, `status`, `created_at`

---

### `order_items`
Individual items within an order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Item identifier |
| `order_id` | UUID | FOREIGN KEY → orders(id) | Parent order |
| `dish_id` | UUID | FOREIGN KEY → dishes(id) | Ordered dish |
| `quantity` | INTEGER | NOT NULL | Item quantity |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Price per unit |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Item total |
| `special_request` | TEXT | | Custom instructions |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes**: `order_id`, `dish_id`

---

### `order_item_addons`
Add-ons selected for order items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Record identifier |
| `order_item_id` | UUID | FOREIGN KEY → order_items(id) | Parent item |
| `addon_id` | UUID | FOREIGN KEY → dish_addons(id) | Selected add-on |
| `addon_name` | VARCHAR(100) | NOT NULL | Add-on name (snapshot) |
| `addon_price` | DECIMAL(10,2) | NOT NULL | Add-on price (snapshot) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes**: `order_item_id`

---

### `cart_items`
Temporary cart storage (optional - can use client-side).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Cart item identifier |
| `user_id` | UUID | FOREIGN KEY → users(id) | Cart owner |
| `dish_id` | UUID | FOREIGN KEY → dishes(id) | Selected dish |
| `quantity` | INTEGER | NOT NULL | Item quantity |
| `special_request` | TEXT | | Custom instructions |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Added to cart time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last modification |

**Indexes**: `user_id`, `dish_id`

---

### `cart_item_addons`
Add-ons for cart items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Record identifier |
| `cart_item_id` | UUID | FOREIGN KEY → cart_items(id) | Parent cart item |
| `addon_id` | UUID | FOREIGN KEY → dish_addons(id) | Selected add-on |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes**: `cart_item_id`

---

## 4. Delivery & Tracking

### `riders`
Delivery personnel information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Rider identifier |
| `full_name` | VARCHAR(100) | NOT NULL | Rider name |
| `phone` | VARCHAR(20) | UNIQUE, NOT NULL | Contact phone |
| `email` | VARCHAR(255) | UNIQUE | Email address |
| `profile_image` | TEXT | | Profile photo |
| `vehicle_type` | VARCHAR(50) | | Vehicle (bike, car, etc.) |
| `vehicle_number` | VARCHAR(50) | | License plate |
| `rating` | DECIMAL(3,2) | DEFAULT 0.0 | Average rating |
| `total_deliveries` | INTEGER | DEFAULT 0 | Completed deliveries |
| `is_available` | BOOLEAN | DEFAULT TRUE | Currently available |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Registration date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes**: `phone`, `is_available`, `rating`

---

### `order_tracking`
Real-time order status updates.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Tracking identifier |
| `order_id` | UUID | FOREIGN KEY → orders(id) | Tracked order |
| `status` | ENUM | NOT NULL | Status (same as orders) |
| `latitude` | DECIMAL(10,8) | | Current GPS latitude |
| `longitude` | DECIMAL(11,8) | | Current GPS longitude |
| `notes` | TEXT | | Status notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Status change time |

**Indexes**: `order_id`, `created_at`

---

## 5. Reviews & Ratings

### `reviews`
User reviews for restaurants and orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Review identifier |
| `user_id` | UUID | FOREIGN KEY → users(id) | Reviewer |
| `restaurant_id` | UUID | FOREIGN KEY → restaurants(id) | Reviewed restaurant |
| `order_id` | UUID | FOREIGN KEY → orders(id) | Related order |
| `rating` | INTEGER | NOT NULL, CHECK (1-5) | Star rating (1-5) |
| `comment` | TEXT | | Review text |
| `photo_url` | TEXT | | Review photo |
| `is_visible` | BOOLEAN | DEFAULT TRUE | Visibility status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Review date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last edit |

**Indexes**: `user_id`, `restaurant_id`, `order_id`, `rating`, `created_at`

---

### `review_tags`
Quick feedback tags for reviews.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Tag identifier |
| `review_id` | UUID | FOREIGN KEY → reviews(id) | Parent review |
| `tag` | VARCHAR(50) | NOT NULL | Tag name |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |

**Available Tags**:
- `Delicious`
- `Fast Delivery`
- `Hot & Fresh`
- `Great Packaging`
- `Good Portions`
- `Value for Money`

**Indexes**: `review_id`, `tag`

---

## 6. Payments

### `payment_methods`
Saved payment methods for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Payment method ID |
| `user_id` | UUID | FOREIGN KEY → users(id) | Owner |
| `type` | ENUM | NOT NULL | Payment type |
| `card_last4` | VARCHAR(4) | | Last 4 digits (for cards) |
| `card_brand` | VARCHAR(50) | | Card brand (Visa, etc.) |
| `is_default` | BOOLEAN | DEFAULT FALSE | Default payment flag |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Added date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Payment Type ENUM**: Same as orders (`apple_pay`, `paypal`, `card`, `cash`)

**Indexes**: `user_id`, `is_default`

---

### `transactions`
Payment transaction records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Transaction ID |
| `order_id` | UUID | FOREIGN KEY → orders(id) | Related order |
| `user_id` | UUID | FOREIGN KEY → users(id) | Payer |
| `amount` | DECIMAL(10,2) | NOT NULL | Transaction amount |
| `payment_method` | ENUM | NOT NULL | Payment type |
| `status` | ENUM | NOT NULL | Transaction status |
| `gateway_transaction_id` | VARCHAR(255) | | External gateway ID |
| `gateway_response` | JSONB | | Gateway response data |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Transaction time |

**Transaction Status ENUM**:
- `pending`
- `processing`
- `completed`
- `failed`
- `refunded`

**Indexes**: `order_id`, `user_id`, `status`, `created_at`

---

### `promo_codes`
Discount and promotional codes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Promo code ID |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Promo code string |
| `description` | TEXT | | Code description |
| `discount_type` | ENUM | NOT NULL | Discount type |
| `discount_value` | DECIMAL(10,2) | NOT NULL | Discount amount/% |
| `minimum_order` | DECIMAL(10,2) | DEFAULT 0.0 | Minimum order value |
| `max_uses` | INTEGER | | Maximum total uses |
| `used_count` | INTEGER | DEFAULT 0 | Current use count |
| `valid_from` | TIMESTAMP | NOT NULL | Start date |
| `valid_until` | TIMESTAMP | NOT NULL | End date |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation date |

**Discount Type ENUM**:
- `percentage`
- `fixed_amount`
- `free_delivery`

**Indexes**: `code`, `is_active`, `valid_from`, `valid_until`

---

## 7. Relationships Diagram

```
users
  ├── user_addresses (1:N)
  ├── orders (1:N)
  ├── reviews (1:N)
  ├── payment_methods (1:N)
  ├── transactions (1:N)
  └── cart_items (1:N)

restaurants
  ├── menu_categories (1:N)
  ├── dishes (1:N)
  ├── orders (1:N)
  └── reviews (1:N)

menu_categories
  └── dishes (1:N)

dishes
  ├── dish_addons (1:N)
  ├── order_items (1:N)
  └── cart_items (1:N)

orders
  ├── order_items (1:N)
  ├── order_tracking (1:N)
  ├── reviews (1:1)
  ├── transactions (1:N)
  ├── rider (N:1)
  └── delivery_address (N:1)

order_items
  └── order_item_addons (1:N)

reviews
  └── review_tags (1:N)

riders
  └── orders (1:N)
```

---

## 8. Indexes & Performance

### Primary Indexes (Already Listed Above)
All foreign keys and frequently queried columns are indexed.

### Additional Composite Indexes

```sql
-- User order history
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Restaurant menu lookup
CREATE INDEX idx_dishes_restaurant_category ON dishes(restaurant_id, category_id);

-- Active orders for riders
CREATE INDEX idx_orders_rider_status ON orders(rider_id, status) WHERE status IN ('out_for_delivery');

-- Review search
CREATE INDEX idx_reviews_restaurant_rating ON reviews(restaurant_id, rating DESC, created_at DESC);

-- Cart cleanup
CREATE INDEX idx_cart_updated ON cart_items(updated_at) WHERE updated_at < NOW() - INTERVAL '7 days';
```

---

## 9. Data Integrity Rules

### Constraints
1. **Order Total Calculation**: `total_amount = subtotal + delivery_fee - discount_amount`
2. **Rating Range**: All ratings must be between 1-5
3. **Order Status Flow**: Must follow logical progression (can't skip from `pending` to `delivered`)
4. **Payment Validation**: Order cannot be `confirmed` without successful payment (except `cash`)
5. **Promo Code Validation**: Check `valid_from`, `valid_until`, `max_uses`, `minimum_order`

### Triggers (Recommended)
1. **Update Restaurant Rating**: Recalculate when new review added
2. **Update Order Total**: Recalculate when items/addons change
3. **Increment Promo Usage**: When promo code applied to order
4. **Update Timestamps**: Auto-update `updated_at` on record modification

---

## 10. Future Enhancements (Planned)

- [ ] `notifications` table for push notifications
- [ ] `favorites` table for saved restaurants/dishes
- [ ] `order_chat` table for customer-rider messaging
- [ ] `loyalty_points` table for rewards program
- [ ] `restaurant_hours` table for operating hours
- [ ] `delivery_zones` table for service area management
- [ ] `rider_locations` table for real-time GPS tracking
- [ ] `support_tickets` table for customer service

---

## 📝 Notes

- All `id` fields use UUID for security and scalability
- All monetary values use `DECIMAL(10,2)` for precision
- Timestamps use UTC timezone
- Soft deletes can be implemented with `deleted_at` column
- JSONB columns for flexible data (e.g., `gateway_response`)
- Enum types ensure data consistency

---

**Database Type Recommendation**: PostgreSQL (supports UUID, JSONB, ENUM, advanced indexing)

**Alternative**: MySQL 8.0+ (with UUID binary storage and JSON columns)

---

*This schema supports all features implemented in the Wajba mobile app as of 2025-10-07.*
