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
3. ✅ **Direct OpenAI Integration** - Using OpenAI API directly (no n8n)
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

---

## AI Inference Rules (Maximize Existing Schema)

These rules enable the AI to make **intelligent inferences** from existing database fields without requiring new columns. This allows handling complex queries using only current schema.

### Restaurant Field Inferences

#### From `ambiance` Array:
```javascript
['romantic', 'cozy'] → Infer: Date-friendly, conversation-friendly, intimate
['casual', 'family-friendly'] → Infer: Kids welcome, relaxed, shareable food
['sports-bar', 'lively'] → Infer: Game day, loud, group-friendly
['fine-dining', 'upscale'] → Infer: Special occasions, instagram-worthy
['modern', 'trendy'] → Infer: Instagram-worthy, younger crowd
['cozy', 'warm'] → Infer: Comfort food, good for bad weather
['quiet'] → Infer: Business meetings, conversation-friendly
```

#### From `price_range`:
```javascript
'budget' → Infer: Quick bites, students, value-focused, casual
'mid-range' → Infer: Everyday dining, balanced quality/price
'premium' → Infer: Special occasions, impressive, high quality
'luxury' → Infer: Celebrations, exceptional service, instagram-worthy
```

#### From `cuisine_types` Array:
```javascript
['fast-food'] → Infer: Quick service (<15 min), grab-and-go
['italian', 'mediterranean'] → Infer: Date-friendly, wine pairing
['japanese', 'sushi'] → Infer: Fresh, light, sophisticated
['american', 'bbq'] → Infer: Hearty, comfort food, filling
['healthy', 'fitness'] → Infer: Post-workout, calorie-conscious
['cafe', 'bakery'] → Infer: Morning, coffee, work-friendly
```

#### From `features` Array:
```javascript
['outdoor-seating'] → Infer: Weather-dependent, romantic evenings
['live-sports'] → Infer: Game day, loud, group-friendly
['wifi'] → Infer: Work-friendly, study spot, solo dining OK
['kids-menu'] → Infer: Family-friendly, patient staff
['late-night'] → Infer: Night owls, comfort food
```

#### From `suitable_for` Array:
```javascript
['date-night'] → Infer: Romantic, not messy food, shareable desserts
['business-meeting'] → Infer: Professional, quiet, clean food
['family-gathering'] → Infer: Large tables, shareable platters
['sports-watching'] → Infer: TVs, wings/beer, casual
['celebration'] → Infer: Special, impressive, desserts
```

---

### Dish Field Inferences

#### From `dietary_tags` Array:
```javascript
['high-protein'] → Infer: Post-workout, muscle building, satisfying
['low-calorie'] → Infer: Weight loss, light, guilt-free
['keto-friendly'] → Infer: Low-carb, high-fat, diet-specific
['vegan', 'vegetarian'] → Infer: Plant-based, ethical, healthy
```

#### From `flavor_profile` Array:
```javascript
['rich', 'creamy'] → Infer: Comfort food, indulgent, heavy
['light', 'fresh'] → Infer: Healthy, refreshing, summer-appropriate
['spicy', 'hot'] → Infer: Adventurous, warming
['sweet'] → Infer: Dessert, treat, kids-friendly
['savory', 'umami'] → Infer: Satisfying, main course
['smoky'] → Infer: BBQ, grilled, hearty
```

#### From `preparation_time`:
```javascript
Under 10 min → Infer: Grab-and-go, urgent hunger
10-20 min → Infer: Quick service, lunch-appropriate
20-30 min → Infer: Standard dining, made-to-order
30+ min → Infer: Fine dining, complex dishes
```

#### From `calories`:
```javascript
Under 300 → Infer: Light meal, snack, appetizer
300-500 → Infer: Moderate meal, balanced
500-800 → Infer: Full meal, satisfying
800+ → Infer: Heavy meal, indulgent, sharing
```

---

### Contextual Inference Rules

#### Weather Context:
**Hot Weather:**
- Recommend: Salads, cold drinks, ice cream, light meals
- Prefer: Outdoor seating, refreshing cuisines
- Avoid: Heavy soups, hot dishes

**Cold Weather:**
- Recommend: Soups, hot meals, comfort food
- Prefer: Cozy ambiance, hearty dishes
- Avoid: Salads only, cold dishes

#### Time of Day Context:
**Morning (6-11 AM):**
- Recommend: Breakfast items, coffee, pastries
- Prefer: Cafes, bakeries
- Avoid: Heavy dinners, late-night food

**Afternoon (11 AM-5 PM):**
- Recommend: Lunch items, moderate portions
- Prefer: Casual dining, quick service
- Avoid: Breakfast-only items

**Evening (5-10 PM):**
- Recommend: Dinner items, full meals
- Prefer: Full-service restaurants
- Avoid: Breakfast items

**Late Night (10 PM+):**
- Recommend: Comfort food, quick bites
- Prefer: Late-night features, delivery
- Avoid: Fine dining (likely closed)

#### Social Context Inference:
**First Date:**
- Combine: Romantic ambiance + mid-range price + conversation-friendly
- Prefer: NOT messy food (no ribs, wings, spaghetti)
- Include: Shareable desserts
- Avoid: Fast food, loud venues, very expensive

**Family with Kids:**
- Combine: Family-friendly + kids menu + casual
- Prefer: Shareable platters, familiar foods
- Avoid: Fine dining, quiet venues, exotic foods

**Solo Dining:**
- Combine: Wifi + counter seating + quick service
- Prefer: Casual, individual portions
- Avoid: Romantic settings, sharing-only menus

**Business Meeting:**
- Combine: Professional + quiet + clean food + mid-range
- Prefer: Table service, no-mess dishes
- Avoid: Messy food, loud venues, very casual

#### Mood-Based Inference:
**"Comfort Me" (bad day, stress):**
- Combine: Comfort food + cozy ambiance + familiar flavors
- Prefer: Rich, creamy, sweet flavors
- Examples: Mac & cheese, pizza, ice cream, burgers

**"Celebrate" (achievement, birthday):**
- Combine: Premium/luxury + impressive + instagram-worthy
- Prefer: Special dishes, desserts, fine dining
- Examples: Steaks, seafood, fancy desserts

**"Healthy Kick" (fitness, diet):**
- Combine: Healthy tags + low-calorie + high-protein
- Prefer: Grilled, fresh, light
- Examples: Salads, grilled chicken, smoothies

**"Adventure" (try something new):**
- Combine: Exotic cuisines + unique dishes + high spice
- Prefer: Unfamiliar flavors, fusion
- Examples: Sushi, Thai curry, fusion dishes

---

### Complex Query Examples

#### Query: "Romantic but not expensive"
```sql
WHERE 'date-night' = ANY(r.suitable_for)
  AND r.ambiance && ARRAY['romantic', 'cozy']
  AND r.price_range IN ('budget', 'mid-range')
  AND r.noise_level IN ('quiet', 'moderate')
ORDER BY r.rating DESC
```
**Inference:** Date-friendly + affordable + conversation-friendly

#### Query: "Quick healthy lunch"
```sql
WHERE 'lunch' = ANY(d.meal_types)
  AND d.preparation_time <= 20
  AND d.calories < 500
  AND ('low-calorie' = ANY(d.dietary_tags) OR 'high-protein' = ANY(d.dietary_tags))
ORDER BY d.health_score DESC
```
**Inference:** Fast + nutritious + appropriate timing

#### Query: "Comfort food after bad day"
```sql
WHERE d.flavor_profile && ARRAY['rich', 'creamy', 'sweet']
  AND r.ambiance && ARRAY['cozy', 'warm']
  AND d.calories > 500
ORDER BY r.rating DESC
```
**Inference:** Indulgent + comforting + satisfying

#### Query: "First date, impressive but affordable"
```sql
WHERE 'date-night' = ANY(r.suitable_for)
  AND r.price_range = 'mid-range'
  AND r.ambiance && ARRAY['romantic']
  AND d.category IN ('Main Course', 'Dessert')
  AND NOT (d.name ILIKE '%ribs%' OR d.name ILIKE '%wings%')
ORDER BY r.rating DESC
```
**Inference:** Romantic + affordable + not messy + impressive

#### Query: "Group watching game"
```sql
WHERE 'sports-watching' = ANY(r.suitable_for)
  OR 'live-sports' = ANY(r.features)
  AND r.ambiance && ARRAY['lively', 'sports-bar']
  AND d.is_shareable = TRUE
ORDER BY r.rating DESC
```
**Inference:** Sports venue + shareable food + lively atmosphere

---

### Implementation Guidelines

**1. Always Combine Multiple Signals:**
- Don't rely on single field
- Cross-reference ambiance + price + cuisine + features
- Build complete picture from available data

**2. Use Probabilistic Reasoning:**
- "Romantic ambiance" → Likely good for dates (90% confidence)
- "Budget price" → Likely casual (80% confidence)
- "Outdoor seating" → Weather-dependent (100% confidence)

**3. Handle Edge Cases:**
- If no exact match, find closest alternatives
- Explain why recommendation fits (transparency)
- Offer multiple options with different trade-offs

**4. Learn from Context:**
- Time of day affects recommendations
- Weather influences outdoor seating preference
- User history suggests preferences

**5. Be Proactive:**
- Anticipate unstated needs
- Suggest complementary items
- Warn about potential issues (messy food on date)

---

### Key Takeaway

**You DON'T need new database columns to be smart!**

By intelligently combining existing fields (`ambiance`, `price_range`, `cuisine_types`, `features`, `dietary_tags`, `flavor_profile`, etc.), the AI can:
- ✅ Handle complex queries
- ✅ Understand social context
- ✅ Match mood and occasion
- ✅ Consider time and weather
- ✅ Make personalized recommendations

**The secret is INFERENCE, not more data!**
