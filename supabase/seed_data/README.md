# 🍽️ How to Add Restaurant Data to SmartBite

## 📋 Quick Start (2 Steps) - EASIEST METHOD

### Step 1: Run Complete Setup
```sql
-- Just open complete_setup_with_partners.sql and run it!
-- No need to replace anything - it creates everything automatically
```

### Step 2: Done! ✅
That's it! You now have:
- ✅ 3 Partner users (restaurant owners)
- ✅ 3 Restaurants (each with different owner)
- ✅ 24 Dishes (8 per restaurant)

---

## 📋 Alternative: Manual Setup (3 Steps)

### Step 1: Get Your User ID
```sql
SELECT id, email FROM users;
```
Copy the `id` (it looks like: `550e8400-e29b-41d4-a716-446655440000`)

### Step 2: Choose Your Script
- **Single Restaurant**: Use `quick_add_restaurant.sql`
- **Multiple Restaurants**: Use `add_multiple_restaurants.sql`
- **Custom Restaurant**: Use `example_restaurant_data.sql` as a template

### Step 3: Run in Supabase
1. Open Supabase SQL Editor
2. Replace `YOUR_USER_ID` with your actual ID from Step 1
3. Paste the script
4. Click "Run"
5. Done! ✅

---

## 📁 Files Explained

### 1. `complete_setup_with_partners.sql` ⭐ RECOMMENDED
**Best for**: Complete setup with everything

**What it adds**:
- 3 Partner users (restaurant owners)
  - Ahmed Al-Khalifa (Al Qariah owner)
  - Fatima Hassan (Mama's Kitchen owner)
  - Marco Rossi (Pizza Palace owner)
- 3 Restaurants (each with different owner)
  - Al Qariah (Bahraini) - 8 dishes
  - Mama's Kitchen (Home Cooking) - 8 dishes
  - Pizza Palace (Italian) - 8 dishes
- 24 Total dishes with images

**How to use**:
```sql
-- Just run it! No replacements needed!
-- Opens in Supabase SQL Editor → Run
```

---

### 2. `create_partner_users.sql`
**Best for**: Creating partner accounts separately

**What it adds**:
- Partner user accounts
- Can be used before adding restaurants

**How to use**:
```sql
-- Run to create partner users
-- Then use their IDs in restaurant scripts
```

---

### 3. `quick_add_restaurant.sql`
**Best for**: Adding one restaurant to existing partner

**What it adds**:
- 1 Restaurant (Al Qariah)
- 8 Dishes with images

**How to use**:
```sql
-- 1. Get your user ID
SELECT id FROM users WHERE email = 'your-email@example.com';

-- 2. Replace 'YOUR_USER_ID' in the script
-- 3. Run
```

---

### 4. `add_multiple_restaurants.sql`
**Best for**: Adding multiple restaurants to one partner

**What it adds**:
- 3 Restaurants under one owner
- 16+ dishes total

**How to use**:
```sql
-- Replace YOUR_USER_ID and run
```

---

### 5. `example_restaurant_data.sql`
**Best for**: Learning and creating custom restaurants

**What it contains**:
- Detailed examples with comments
- Step-by-step instructions
- Tips for finding images
- Complete reference guide

---

## 🖼️ Finding Images

### Free Image Sources:
1. **Unsplash** (Recommended)
   - Go to: https://unsplash.com
   - Search: "kabsa", "biryani", "pizza", etc.
   - Right-click image → Copy image URL
   - Add `?w=800` at the end

2. **Example URLs**:
   ```
   https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800
   https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800
   ```

---

## 📊 Database Structure

### Restaurant Fields:
```sql
partner_id          -- Your user ID (UUID)
name               -- Restaurant name
description        -- Short description
cuisine_type       -- Bahraini, Italian, Indian, etc.
address            -- Full address
phone              -- Contact number
email              -- Contact email
rating             -- 0.0 to 5.0
total_reviews      -- Number of reviews
delivery_time      -- "25-35 min"
minimum_order      -- Minimum order amount (BD)
delivery_fee       -- Delivery charge (BD)
is_active          -- true/false
opening_time       -- "10:00:00"
closing_time       -- "23:00:00"
image_url          -- Restaurant logo
cover_image_url    -- Cover/banner image
```

### Dish Fields:
```sql
restaurant_id      -- Links to restaurant
name               -- Dish name
description        -- Dish description
category           -- Main Course, Appetizer, Dessert, Beverage, etc.
price              -- Price in BD
image_url          -- Dish image
is_available       -- true/false
preparation_time   -- Minutes
calories           -- Optional
is_vegetarian      -- true/false
is_spicy           -- true/false
rating             -- 0.0 to 5.0
total_reviews      -- Number of reviews
```

---

## 🎯 Categories Reference

### Dish Categories:
- Main Course
- Appetizer
- Dessert
- Beverage
- Bread
- Salad
- Soup

### Cuisine Types:
- Bahraini
- Arabic
- Indian
- Italian
- Chinese
- Japanese
- Fast Food
- Healthy
- Home Cooking

---

## ✅ Verify Your Data

After adding restaurants, run these queries:

### Check all restaurants:
```sql
SELECT 
  name,
  cuisine_type,
  rating,
  (SELECT COUNT(*) FROM dishes WHERE dishes.restaurant_id = restaurants.id) as dish_count
FROM restaurants
ORDER BY name;
```

### Check dishes for a specific restaurant:
```sql
SELECT 
  name,
  category,
  price,
  is_available
FROM dishes
WHERE restaurant_id = (
  SELECT id FROM restaurants WHERE name = 'Al Qariah Restaurant'
)
ORDER BY category, name;
```

### Check everything:
```sql
SELECT 
  r.name as restaurant,
  d.name as dish,
  d.category,
  d.price,
  d.rating
FROM restaurants r
JOIN dishes d ON d.restaurant_id = r.id
ORDER BY r.name, d.category, d.name;
```

---

## 🚨 Common Issues

### Issue: "Could not find the 'partner_id' column"
**Solution**: Make sure you replaced `YOUR_USER_ID` with your actual UUID

### Issue: "Foreign key violation"
**Solution**: The user ID doesn't exist. Run `SELECT id FROM users;` to get the correct ID

### Issue: "Duplicate key value"
**Solution**: Restaurant name already exists. Change the name or delete the old one:
```sql
DELETE FROM restaurants WHERE name = 'Al Qariah Restaurant';
```

### Issue: Images not showing
**Solution**: Make sure URLs are valid and end with `?w=800`

---

## 🎨 Customization Tips

### Change Restaurant Details:
1. Open the SQL file
2. Find the restaurant INSERT statement
3. Modify any field (name, description, etc.)
4. Run the script

### Add More Dishes:
1. Copy an existing dish INSERT
2. Change the values (name, price, image, etc.)
3. Add it to the script
4. Run

### Add Dish Add-ons:
```sql
INSERT INTO dish_addons (dish_id, name, price, is_available) VALUES
  ('DISH_ID_HERE', 'Extra Cheese', 1.000, true),
  ('DISH_ID_HERE', 'Extra Sauce', 0.500, true);
```

---

## 📞 Need Help?

If you get stuck:
1. Check the error message
2. Verify your user ID is correct
3. Make sure all required fields are filled
4. Check the example files for reference

---

## 🎉 You're Ready!

Now you can:
- ✅ Add restaurants with full details
- ✅ Add dishes with images
- ✅ Set prices and ratings
- ✅ Make them available in your app

**Happy coding! 🚀**
