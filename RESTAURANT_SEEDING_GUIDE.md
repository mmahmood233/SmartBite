# Restaurant Seeding Guide for SmartBite

This document provides complete instructions for seeding restaurant data into the SmartBite database.

## Table of Contents
1. [Database Schema Overview](#database-schema-overview)
2. [Required Tables](#required-tables)
3. [Field Specifications](#field-specifications)
4. [Step-by-Step Seeding Process](#step-by-step-seeding-process)
5. [Complete Example](#complete-example)
6. [Important Rules](#important-rules)

---

## Database Schema Overview

The restaurant seeding process involves 3 main tables:
1. **restaurants** - Main restaurant information
2. **menu_categories** - Categories for organizing dishes (e.g., Breakfast, Burgers, Desserts)
3. **dishes** - Individual menu items

---

## Required Tables

### 1. Restaurants Table
Stores all restaurant information including location, contact, ratings, and AI-enhanced metadata.

### 2. Menu Categories Table
Organizes dishes into categories. Each category belongs to a restaurant.

### 3. Dishes Table
Individual menu items with nutrition info, pricing, and AI-enhanced metadata.

---

## Field Specifications

### RESTAURANTS TABLE

#### Basic Information (Required)
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | UUID | Unique identifier | `'11111111-1111-1111-1111-111111111111'::uuid` |
| `partner_id` | UUID | Reference to partner user | `(SELECT id FROM users WHERE role = 'partner' LIMIT 1)` |
| `name` | VARCHAR | Restaurant name | `'McDonald''s Bahrain'` |
| `category` | VARCHAR | Main cuisine category | `'Fast Food'` |
| `description` | TEXT | Detailed description | `'World-famous burgers...'` |

#### Images (Optional - Set to NULL)
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `logo` | TEXT | Logo image URL | `NULL` (add later) |
| `banner_image` | TEXT | Banner image URL | `NULL` (add later) |

#### Location (Required)
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `address` | VARCHAR | Full street address | `'Building 1456, Road 2825, Seef District, Manama'` |
| `latitude` | NUMERIC | GPS latitude | `26.2285` |
| `longitude` | NUMERIC | GPS longitude | `50.5860` |
| `city` | VARCHAR | City name | `'Manama'` |
| `country` | VARCHAR | Country name | `'Bahrain'` |
| `nearby_landmark` | VARCHAR | Nearby landmark | `'Near Seef Mall, opposite City Centre Bahrain'` |
| `neighborhoods` | TEXT[] | Nearby areas | `ARRAY['seef', 'manama', 'diplomatic-area']` |

#### Contact (Required)
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `phone` | VARCHAR | Phone number | `'+973 1758 8888'` |
| `email` | VARCHAR | Email address | `'mcdonalds.bahrain@bh.mcd.com'` |

#### Ratings & Orders (Set to 0 for new restaurants)
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `rating` | NUMERIC | Average rating (0-5) | `0.0` |
| `total_reviews` | INTEGER | Number of reviews | `0` |
| `total_orders` | INTEGER | Total orders completed | `0` |

#### Pricing & Delivery
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `delivery_fee` | NUMERIC | Delivery fee in BHD | `0.500` |
| `min_order` | NUMERIC | Minimum order in BHD | `3.000` |
| `avg_prep_time` | VARCHAR | Preparation time (minutes only) | `'20'` |
| `delivery_radius` | NUMERIC | Delivery radius in km | `10.0` |

#### Status & Hours
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `is_active` | BOOLEAN | Restaurant is active | `TRUE` |
| `status` | ENUM | Current status | `'open'` (open/closed/busy) |
| `opening_time` | TIME | Opening time | `'00:00:00'::time` (24/7) |
| `closing_time` | TIME | Closing time | `'23:59:59'::time` (24/7) |
| `auto_status_update` | BOOLEAN | Auto-update status | `TRUE` |
| `operating_hours` | JSONB | Detailed hours | `'{"sunday": "24 hours", "monday": "24 hours", ...}'::jsonb` |

#### AI-Enhanced Metadata (Required for AI recommendations)

**Price Range**
| Field | Type | Description | Options |
|-------|------|-------------|---------|
| `price_range` | VARCHAR | Price category | `'budget'`, `'mid-range'`, `'premium'`, `'luxury'` |

**Ambiance** (TEXT[])
Examples: `ARRAY['casual', 'family-friendly', 'lively']`
- romantic, casual, family-friendly, sports-bar, fine-dining, cozy, modern, traditional

**Cuisine Types** (TEXT[])
Examples: `ARRAY['american', 'fast-food', 'burgers']`
- italian, chinese, indian, american, mediterranean, fusion, seafood, steakhouse

**Dietary Options** (TEXT[])
Examples: `ARRAY['halal', 'vegetarian']`
- vegetarian, vegan, gluten-free, halal, keto, low-carb, high-protein

**Suitable For** (TEXT[])
Examples: `ARRAY['quick-bite', 'family-gathering', 'casual-dining', 'kids-meal', 'late-night']`
- date-night, business-meeting, family-gathering, sports-watching, quick-bite, celebration, casual-dining

**Features** (TEXT[])
Examples: `ARRAY['drive-thru', 'wifi', 'parking', 'kids-menu', 'late-night', 'breakfast', 'takeaway', 'indoor-seating', 'air-conditioned']`
- outdoor-seating, live-sports, wifi, parking, kids-menu, late-night, breakfast, delivery-only

**Peak Hours** (JSONB)
```json
{
  "breakfast": "07:00-11:00",
  "lunch": "12:00-15:00",
  "dinner": "18:00-22:00"
}
```

**Signature Dishes** (TEXT[])
Examples: `ARRAY['Big Mac', 'McChicken', 'French Fries', 'McFlurry', 'Egg McMuffin']`

**Additional Metadata**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `seating_capacity` | INTEGER | Number of seats | `80` |
| `noise_level` | VARCHAR | Noise level | `'moderate'` (quiet/moderate/loud) |
| `dress_code` | VARCHAR | Dress code | `'casual'` (casual/smart-casual/formal) |
| `reservation_required` | BOOLEAN | Reservation needed | `FALSE` |
| `avg_meal_duration` | INTEGER | Average meal time (min) | `30` |
| `popular_times` | TEXT[] | Popular time slots | `ARRAY['lunch-weekday', 'dinner-weekend', 'breakfast-weekend']` |
| `good_for_groups` | BOOLEAN | Good for groups | `TRUE` |
| `service_options` | TEXT[] | Service types | `ARRAY['dine-in', 'takeout', 'delivery', 'drive-thru']` |

#### Timestamps
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `created_at` | TIMESTAMP | Creation date | `NOW() - INTERVAL '2 years'` |
| `updated_at` | TIMESTAMP | Last update | `NOW()` |

---

### MENU CATEGORIES TABLE

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | UUID | Unique identifier | `'22222222-2222-2222-2222-222222222221'::uuid` |
| `restaurant_id` | UUID | Parent restaurant | `'11111111-1111-1111-1111-111111111111'::uuid` |
| `name` | VARCHAR | Category name | `'Breakfast'` |
| `description` | TEXT | Category description | `'Start your day right with our breakfast menu'` |
| `display_order` | INTEGER | Sort order | `1` |
| `is_active` | BOOLEAN | Category is active | `TRUE` |
| `created_at` | TIMESTAMP | Creation date | `NOW()` |
| `updated_at` | TIMESTAMP | Last update | `NOW()` |

**Common Categories:**
- Breakfast
- Burgers
- Chicken & Fish
- Sides
- Beverages
- Desserts

---

### DISHES TABLE

#### Basic Information (Required)
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | UUID | Unique identifier | `'33333333-3333-3333-3333-333333333301'::uuid` |
| `restaurant_id` | UUID | Parent restaurant | `'11111111-1111-1111-1111-111111111111'::uuid` |
| `category_id` | UUID | Menu category | `'22222222-2222-2222-2222-222222222221'::uuid` |
| `name` | VARCHAR | Dish name | `'Egg McMuffin'` |
| `description` | TEXT | Detailed description | `'Freshly cracked egg, Canadian bacon...'` |
| `price` | NUMERIC | Price in BHD | `1.800` |
| `category` | VARCHAR | Category name (string) | `'Breakfast'` |

#### Images (Optional - Set to NULL)
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `image` | TEXT | Main image URL | `NULL` |
| `image_url` | TEXT | Alternative image URL | `NULL` |

#### Availability
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `is_available` | BOOLEAN | Currently available | `TRUE` |
| `is_featured` | BOOLEAN | Featured dish | `TRUE` |
| `is_vegetarian` | BOOLEAN | Vegetarian option | `FALSE` |
| `is_vegan` | BOOLEAN | Vegan option | `FALSE` |
| `is_gluten_free` | BOOLEAN | Gluten-free option | `FALSE` |
| `spice_level` | INTEGER | Spice level (0-5) | `0` |

#### Nutrition Information (Required)
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `calories` | INTEGER | Total calories | `300` |
| `protein` | NUMERIC | Protein (grams) | `18.0` |
| `carbs` | NUMERIC | Carbohydrates (grams) | `30.0` |
| `fat` | NUMERIC | Fat (grams) | `13.0` |
| `fiber` | NUMERIC | Fiber (grams) | `2.0` |
| `sugar` | NUMERIC | Sugar (grams) | `3.0` |
| `sodium` | NUMERIC | Sodium (mg) | `820.0` |

#### AI-Enhanced Metadata

**Portion Size**
| Field | Type | Description | Options |
|-------|------|-------------|---------|
| `portion_size` | VARCHAR | Size category | `'small'`, `'regular'`, `'large'` |

**Meal Times** (TEXT[])
Examples: `ARRAY['breakfast', 'brunch']`
- breakfast, brunch, lunch, dinner, snack, dessert

**Dietary Tags** (TEXT[])
Examples: `ARRAY['high-protein']`
- high-protein, low-carb, high-carb, low-calorie, keto-friendly, paleo, gluten-free, dairy-free

**Allergens** (TEXT[])
Examples: `ARRAY['eggs', 'dairy', 'gluten', 'wheat']`
- eggs, dairy, gluten, wheat, soy, nuts, peanuts, fish, shellfish, sesame

**Occasion Tags** (TEXT[])
Examples: `ARRAY['quick-breakfast', 'on-the-go']`
- quick-breakfast, post-workout, comfort-food, healthy-choice, indulgent, celebration, kids-favorite, sharing-plate, game-day, light-meal, casual-dining

**Flavor Profile** (TEXT[])
Examples: `ARRAY['savory', 'rich']`
- savory, sweet, spicy, tangy, rich, creamy, crispy, fresh

**Cooking Methods** (TEXT[])
Examples: `ARRAY['grilled', 'fried']`
- grilled, fried, baked, steamed, raw, roasted

**Temperature**
| Field | Type | Description | Options |
|-------|------|-------------|---------|
| `serving_temp` | VARCHAR | Serving temperature | `'hot'`, `'cold'`, `'room-temp'` |

**Pairing Suggestions** (TEXT[])
Examples: `ARRAY['coffee', 'orange-juice']`
- coffee, tea, juice, cola, fries, salad, etc.

**Additional Flags**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `is_seasonal` | BOOLEAN | Seasonal item | `FALSE` |
| `is_new` | BOOLEAN | New item | `TRUE` |
| `is_popular` | BOOLEAN | Popular item | `TRUE` |
| `is_customizable` | BOOLEAN | Can be customized | `TRUE` |
| `meal_prep_friendly` | BOOLEAN | Good for meal prep | `FALSE` |
| `is_kid_friendly` | BOOLEAN | Kid-friendly | `TRUE` |
| `contains_alcohol` | BOOLEAN | Contains alcohol | `FALSE` |
| `contains_caffeine` | BOOLEAN | Contains caffeine | `FALSE` |

#### Timestamps
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `created_at` | TIMESTAMP | Creation date | `NOW() - INTERVAL '1 year'` |
| `updated_at` | TIMESTAMP | Last update | `NOW()` |

---

## Step-by-Step Seeding Process

### Step 1: Create Migration File
Create a new migration file: `0XX_seed_[restaurant_name].sql`

### Step 2: Wrap in DO Block
```sql
DO $$
DECLARE
  restaurant_count INTEGER;
  category_count INTEGER;
  dish_count INTEGER;
  r_name VARCHAR;
  r_city VARCHAR;
  r_latitude DECIMAL;
  r_longitude DECIMAL;
  r_rating DECIMAL;
  r_reviews INTEGER;
  r_signature TEXT[];
BEGIN
  -- Your INSERT statements here
END $$;
```

### Step 3: Insert Restaurant
Use a fixed UUID for the restaurant (e.g., `11111111-1111-1111-1111-111111111111`)

### Step 4: Insert Menu Categories
- Use sequential UUIDs (e.g., `22222222-2222-2222-2222-222222222221`, `...222`, etc.)
- Reference the restaurant UUID
- Set `display_order` for sorting

### Step 5: Insert Dishes
- Use sequential UUIDs (e.g., `33333333-3333-3333-3333-333333333301`, `...302`, etc.)
- Reference both restaurant UUID and category UUID
- Include all nutrition and metadata

### Step 6: Add Verification
```sql
-- Get counts
SELECT COUNT(*) INTO restaurant_count FROM restaurants WHERE id = '[restaurant_uuid]'::uuid;
SELECT COUNT(*) INTO dish_count FROM dishes WHERE restaurant_id = '[restaurant_uuid]'::uuid;
SELECT COUNT(*) INTO category_count FROM menu_categories WHERE restaurant_id = '[restaurant_uuid]'::uuid;

-- Get restaurant details dynamically
SELECT name, city, latitude, longitude, rating, total_reviews, signature_dishes
INTO r_name, r_city, r_latitude, r_longitude, r_rating, r_reviews, r_signature
FROM restaurants 
WHERE id = '[restaurant_uuid]'::uuid;

-- Display results
RAISE NOTICE '========================================';
RAISE NOTICE '✅ % Seed Complete!', r_name;
RAISE NOTICE '========================================';
RAISE NOTICE 'Restaurant inserted: %', restaurant_count;
RAISE NOTICE 'Menu categories: %', category_count;
RAISE NOTICE 'Dishes inserted: %', dish_count;
RAISE NOTICE '📍 Location: %, % (%, %)', r_city, 'Country', r_latitude, r_longitude;
RAISE NOTICE '⭐ Rating: % (% reviews)', r_rating, r_reviews;
RAISE NOTICE '🍔 Signature dishes: %', array_to_string(r_signature, ', ');
RAISE NOTICE '========================================';
```

---

## Complete Example

See the file: `/supabase/migrations/038_seed_mcdonalds_complete.sql`

This file contains a complete example of McDonald's Bahrain with:
- 1 Restaurant
- 6 Menu Categories (Breakfast, Burgers, Chicken & Fish, Sides, Beverages, Desserts)
- 13 Dishes with full metadata

---

## Important Rules

### 1. Data Consistency
- ✅ **DO**: Use consistent UUIDs across related records
- ❌ **DON'T**: Mix up restaurant_id references

### 2. Images
- ✅ **DO**: Set images to `NULL` initially
- ❌ **DON'T**: Use placeholder URLs that may break

### 3. Arrays
- ✅ **DO**: Cast empty arrays: `ARRAY[]::text[]`
- ❌ **DON'T**: Use untyped empty arrays: `ARRAY[]`

### 4. Ratings for New Restaurants
- ✅ **DO**: Set `rating = 0.0`, `total_reviews = 0`, `total_orders = 0`
- ❌ **DON'T**: Use fake ratings without actual review records

### 5. Preparation Time
- ✅ **DO**: Store only prep time in minutes: `'20'`
- ❌ **DON'T**: Store delivery time ranges: `'15-25 mins'`
- **Why**: Delivery time is calculated dynamically based on user location

### 6. Location Data
- ✅ **DO**: Use accurate GPS coordinates
- ✅ **DO**: Include city, country, and landmarks
- ❌ **DON'T**: Use fake or approximate coordinates

### 7. AI Metadata
- ✅ **DO**: Fill all AI-enhanced fields for better recommendations
- ✅ **DO**: Use consistent tag naming (lowercase, hyphenated)
- ❌ **DON'T**: Leave AI fields empty or use inconsistent tags

### 8. Nutrition Information
- ✅ **DO**: Provide accurate nutrition data
- ✅ **DO**: Use realistic calorie counts
- ❌ **DON'T**: Use placeholder or estimated values

### 9. SQL Syntax
- ✅ **DO**: Escape single quotes in strings: `'McDonald''s'`
- ✅ **DO**: Use explicit type casting: `::uuid`, `::time`, `::jsonb`
- ❌ **DON'T**: Forget to escape quotes in names

### 10. Migration Order
Always run migrations in this order:
1. Schema migrations (if needed)
2. Delete/cleanup migrations (e.g., `039_force_delete_all_restaurants.sql`)
3. Seed migrations (e.g., `038_seed_mcdonalds_complete.sql`)

---

## Quick Reference: Column Order

### Restaurant INSERT Order
```sql
id, partner_id, name, category, description, logo, banner_image, address, 
latitude, longitude, phone, email, rating, total_reviews, total_orders, 
delivery_fee, min_order, avg_prep_time, is_active, status, opening_time, 
closing_time, auto_status_update, created_at, updated_at, price_range, 
ambiance, cuisine_types, dietary_options, suitable_for, features, peak_hours, 
signature_dishes, seating_capacity, noise_level, dress_code, 
reservation_required, avg_meal_duration, operating_hours, popular_times, 
good_for_groups, service_options, delivery_radius, neighborhoods, city, 
country, nearby_landmark
```

### Menu Category INSERT Order
```sql
id, restaurant_id, name, description, display_order, is_active, 
created_at, updated_at
```

### Dish INSERT Order
```sql
id, restaurant_id, category_id, name, description, price, image, category, 
is_available, is_featured, is_vegetarian, is_vegan, is_gluten_free, 
spice_level, calories, image_url, protein, carbs, fat, fiber, sugar, sodium, 
portion_size, meal_times, dietary_tags, allergens, occasion_tags, 
flavor_profile, cooking_methods, serving_temp, is_seasonal, 
pairing_suggestions, is_new, is_popular, is_customizable, 
meal_prep_friendly, is_kid_friendly, contains_alcohol, contains_caffeine, 
created_at, updated_at
```

---

## Tips for AI-Enhanced Recommendations

The AI recommendation system uses the metadata to match user queries like:
- "Find me a romantic dinner spot" → Uses `suitable_for`, `ambiance`
- "I need a quick breakfast" → Uses `meal_times`, `occasion_tags`, `avg_prep_time`
- "Show me vegan options" → Uses `dietary_options`, `is_vegan`
- "What's good for a family gathering?" → Uses `suitable_for`, `good_for_groups`, `features`
- "I want something healthy after the gym" → Uses `dietary_tags`, `occasion_tags`, `calories`, `protein`

**Make sure to fill these fields accurately for better AI recommendations!**

---

## Example UUID Patterns

Use these patterns for consistency:

**Restaurants:**
- `11111111-1111-1111-1111-111111111111`
- `11111111-1111-1111-1111-111111111112`
- `11111111-1111-1111-1111-111111111113`

**Menu Categories:**
- `22222222-2222-2222-2222-222222222221`
- `22222222-2222-2222-2222-222222222222`
- `22222222-2222-2222-2222-222222222223`

**Dishes:**
- `33333333-3333-3333-3333-333333333301`
- `33333333-3333-3333-3333-333333333302`
- `33333333-3333-3333-3333-333333333303`

---

## Contact & Support

For questions or issues with restaurant seeding, refer to:
- Migration example: `/supabase/migrations/038_seed_mcdonalds_complete.sql`
- Schema definitions: `/supabase/migrations/004_create_restaurants_tables.sql`
- AI enhancements: `/supabase/migrations/035_enhance_ai_context_metadata.sql`

---

**Last Updated**: November 30, 2025
**Version**: 1.0
