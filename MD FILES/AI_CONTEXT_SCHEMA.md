# AI Context Schema - Enhanced Database for Smart Recommendations

## Overview
This document describes the enhanced database schema designed to enable accurate AI recommendations for various scenarios like date nights, sports events, gym meals, and more.

---

## Restaurant Enhancements

### Price Range
**Column:** `price_range` (VARCHAR)
**Values:** `budget`, `mid-range`, `premium`, `luxury`
**Purpose:** Help AI match user budget expectations

**Guidelines:**
- **budget**: Average meal < 5 BD per person
- **mid-range**: 5-15 BD per person
- **premium**: 15-30 BD per person
- **luxury**: > 30 BD per person

---

### Ambiance Tags
**Column:** `ambiance` (TEXT[])
**Purpose:** Match restaurant atmosphere to user needs

**Common Tags:**
- `romantic` - Dim lighting, intimate seating, quiet
- `casual` - Relaxed, everyday dining
- `family-friendly` - Kids welcome, high chairs, kids menu
- `sports-bar` - TVs, lively atmosphere, game-day vibes
- `fine-dining` - Upscale, elegant, formal service
- `cozy` - Warm, comfortable, homey feel
- `modern` - Contemporary design, trendy
- `traditional` - Classic decor, heritage
- `lively` - Energetic, bustling atmosphere
- `quiet` - Peaceful, conversation-friendly

**Example:**
```sql
ambiance = ['romantic', 'cozy', 'fine-dining']
```

---

### Cuisine Types
**Column:** `cuisine_types` (TEXT[])
**Purpose:** Multiple cuisine classifications

**Common Types:**
- `italian`, `chinese`, `indian`, `american`, `mexican`
- `mediterranean`, `japanese`, `thai`, `korean`, `french`
- `fusion`, `seafood`, `steakhouse`, `bbq`, `middle-eastern`
- `fast-food`, `cafe`, `bakery`, `dessert`

**Example:**
```sql
cuisine_types = ['italian', 'mediterranean', 'fusion']
```

---

### Dietary Options
**Column:** `dietary_options` (TEXT[])
**Purpose:** Special dietary accommodations

**Options:**
- `vegetarian` - Has vegetarian options
- `vegan` - Has vegan options
- `gluten-free` - Gluten-free menu available
- `halal` - Halal certified
- `keto` - Keto-friendly options
- `low-carb` - Low-carb dishes available
- `high-protein` - High-protein meals
- `dairy-free` - Dairy-free options
- `nut-free` - Nut-free kitchen or options

---

### Suitable For (Occasions)
**Column:** `suitable_for` (TEXT[])
**Purpose:** Match restaurants to specific occasions

**Occasions:**
- `date-night` - Romantic dinners
- `business-meeting` - Professional setting
- `family-gathering` - Large groups, kids
- `sports-watching` - Game day, sports fans
- `quick-bite` - Fast service, grab-and-go
- `celebration` - Birthdays, anniversaries
- `casual-dining` - Everyday meals
- `brunch` - Weekend brunch spot
- `late-night` - Open late, night owls
- `solo-dining` - Comfortable for one person

**Example:**
```sql
suitable_for = ['date-night', 'celebration', 'romantic']
```

---

### Features
**Column:** `features` (TEXT[])
**Purpose:** Special amenities and services

**Features:**
- `outdoor-seating` - Patio/terrace available
- `live-sports` - TVs showing sports
- `wifi` - Free WiFi
- `parking` - Parking available
- `kids-menu` - Special kids menu
- `late-night` - Open past midnight
- `breakfast` - Serves breakfast
- `delivery-only` - No dine-in
- `takeaway` - Takeout available
- `reservations` - Accepts reservations
- `live-music` - Live entertainment
- `bar` - Full bar service
- `pet-friendly` - Pets allowed

---

### Additional Restaurant Fields

**Noise Level:** `quiet`, `moderate`, `lively`, `loud`
- Helps match conversation needs

**Dress Code:** `casual`, `smart-casual`, `business-casual`, `formal`
- Sets expectations for attire

**Seating Capacity:** Integer
- For group size planning

**Average Meal Duration:** Integer (minutes)
- For time-constrained users

**Signature Dishes:** TEXT[]
- Quick reference to popular items

---

## Dish Enhancements

### Nutritional Information

**Protein:** `protein_grams` (DECIMAL)
**Carbs:** `carbs_grams` (DECIMAL)
**Fat:** `fat_grams` (DECIMAL)
**Fiber:** `fiber_grams` (DECIMAL)
**Calories:** Already exists

**Purpose:** Enable fitness/health-focused recommendations

**Example Use Cases:**
- "I need high protein after gym" → Filter `protein_grams >= 30`
- "Low carb options" → Filter `carbs_grams < 20`
- "Light meal under 500 calories" → Filter `calories < 500`

---

### Spice Level
**Column:** `spice_level` (INTEGER 0-5)
**Purpose:** Accurate spice matching

**Scale:**
- `0` - No spice
- `1` - Mild (slight warmth)
- `2` - Medium (noticeable heat)
- `3` - Hot (spicy, sweating)
- `4` - Very Hot (intense heat)
- `5` - Extreme (challenge level)

---

### Portion Size
**Column:** `portion_size` (VARCHAR)
**Values:** `small`, `regular`, `large`, `sharing`

**Purpose:** Help users choose appropriate portions

---

### Meal Types
**Column:** `meal_types` (TEXT[])
**Purpose:** When is this dish appropriate?

**Types:**
- `breakfast` - Morning meals
- `brunch` - Late morning/early afternoon
- `lunch` - Midday meals
- `dinner` - Evening meals
- `snack` - Light bites
- `dessert` - Sweet treats
- `late-night` - After hours

**Example:**
```sql
meal_types = ['lunch', 'dinner']
```

---

### Dietary Tags
**Column:** `dietary_tags` (TEXT[])
**Purpose:** Specific dietary classifications

**Tags:**
- `high-protein` - 20g+ protein
- `low-carb` - <20g carbs
- `keto-friendly` - Very low carb, high fat
- `gluten-free` - No gluten
- `dairy-free` - No dairy
- `nut-free` - No nuts
- `paleo` - Paleo diet compliant
- `whole30` - Whole30 approved
- `low-calorie` - <400 calories
- `high-fiber` - 5g+ fiber

---

### Allergens
**Column:** `allergens` (TEXT[])
**Purpose:** Safety and dietary restrictions

**Common Allergens:**
- `nuts`, `peanuts`, `tree-nuts`
- `dairy`, `milk`, `cheese`
- `eggs`
- `soy`
- `wheat`, `gluten`
- `shellfish`, `fish`
- `sesame`
- `mustard`

---

### Suitable Occasions
**Column:** `suitable_occasions` (TEXT[])
**Purpose:** Match dishes to specific needs

**Occasions:**
- `date-night` - Impressive, shareable
- `post-workout` - High protein, recovery
- `comfort-food` - Hearty, satisfying
- `hangover-cure` - Greasy, filling
- `kids-favorite` - Kid-friendly
- `sharing-plate` - For groups
- `game-day` - Sports watching
- `light-meal` - Not too heavy
- `indulgent` - Treat yourself
- `healthy-choice` - Nutritious

**Example:**
```sql
suitable_occasions = ['post-workout', 'healthy-choice']
```

---

### Flavor Profile
**Column:** `flavor_profile` (TEXT[])
**Purpose:** Describe taste characteristics

**Flavors:**
- `savory` - Umami, salty
- `sweet` - Sugary, dessert-like
- `spicy` - Hot, peppery
- `tangy` - Sour, acidic
- `rich` - Heavy, decadent
- `light` - Refreshing, not heavy
- `creamy` - Smooth, dairy-based
- `crispy` - Crunchy texture
- `smoky` - Grilled, BBQ flavor
- `fresh` - Raw, vibrant

---

### Cooking Method
**Column:** `cooking_method` (TEXT[])
**Purpose:** How is it prepared?

**Methods:**
- `grilled` - Charcoal/gas grill
- `fried` - Deep or pan fried
- `baked` - Oven baked
- `steamed` - Steamed
- `raw` - Uncooked (sushi, salads)
- `roasted` - Oven roasted
- `sauteed` - Pan sautéed
- `boiled` - Boiled
- `smoked` - Smoked

---

### Health Score
**Column:** `health_score` (INTEGER 1-10)
**Purpose:** Quick healthiness indicator

**Scale:**
- `1-3` - Indulgent, unhealthy
- `4-6` - Moderate, balanced
- `7-8` - Healthy, nutritious
- `9-10` - Very healthy, superfood

**Factors:**
- Calorie density
- Protein content
- Vegetable content
- Processing level
- Fat type (good vs bad)

---

## AI Query Examples

### Example 1: Date Night
```sql
SELECT r.*, d.*
FROM restaurants r
JOIN dishes d ON d.restaurant_id = r.id
WHERE 'date-night' = ANY(r.suitable_for)
  AND r.ambiance && ARRAY['romantic', 'cozy']
  AND r.noise_level IN ('quiet', 'moderate')
  AND d.is_shareable = TRUE
ORDER BY r.rating DESC
LIMIT 5;
```

### Example 2: Post-Gym High Protein
```sql
SELECT d.*, r.name as restaurant_name
FROM dishes d
JOIN restaurants r ON d.restaurant_id = r.id
WHERE d.protein_grams >= 30
  AND d.calories < 600
  AND 'post-workout' = ANY(d.suitable_occasions)
  AND d.is_available = TRUE
ORDER BY d.protein_grams DESC
LIMIT 10;
```

### Example 3: Sports Watching
```sql
SELECT r.*, d.*
FROM restaurants r
JOIN dishes d ON d.restaurant_id = r.id
WHERE 'sports-watching' = ANY(r.suitable_for)
  OR 'live-sports' = ANY(r.features)
  AND 'game-day' = ANY(d.suitable_occasions)
  AND d.is_shareable = TRUE
ORDER BY r.rating DESC;
```

### Example 4: Light Healthy Lunch
```sql
SELECT d.*, r.name as restaurant_name
FROM dishes d
JOIN restaurants r ON d.restaurant_id = r.id
WHERE 'lunch' = ANY(d.meal_types)
  AND d.health_score >= 7
  AND d.calories < 500
  AND d.preparation_time <= 20
ORDER BY d.health_score DESC, d.calories ASC
LIMIT 10;
```

### Example 5: Vegetarian Date Night
```sql
SELECT r.*, d.*
FROM restaurants r
JOIN dishes d ON d.restaurant_id = r.id
WHERE 'date-night' = ANY(r.suitable_for)
  AND 'vegetarian' = ANY(r.dietary_options)
  AND d.is_vegetarian = TRUE
  AND r.ambiance && ARRAY['romantic', 'cozy']
ORDER BY r.rating DESC;
```

---

## Helper Views Created

The migration creates these views for common queries:

1. **high_protein_dishes** - Dishes with 20g+ protein
2. **date_night_restaurants** - Romantic venues
3. **sports_venues** - Sports watching locations
4. **healthy_dishes** - Health score 7+
5. **quick_meals** - Prep time ≤ 15 minutes

**Usage:**
```sql
SELECT * FROM high_protein_dishes LIMIT 10;
SELECT * FROM date_night_restaurants WHERE price_range = 'mid-range';
```

---

## Next Steps

1. ✅ **Migration Created** - Run migration to add columns
2. ⏳ **Seed Data** - Populate with realistic data
3. ⏳ **Update n8n Workflow** - Use new fields for AI context
4. ⏳ **Update TypeScript Types** - Reflect new schema
5. ⏳ **Test AI Queries** - Verify accuracy

---

## Benefits

✅ **Accurate Recommendations** - AI can match exact user needs
✅ **Rich Context** - Multiple dimensions for matching
✅ **Flexible Queries** - Array fields enable complex filtering
✅ **Scalable** - Easy to add new tags/categories
✅ **Performance** - GIN indexes for array queries
✅ **User-Friendly** - Natural language maps to tags
