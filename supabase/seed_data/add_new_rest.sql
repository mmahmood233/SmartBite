-- ============================================
-- Wajba — Bahrain Intl Restaurants, Menus, and Dish Images (one file)
-- ============================================

BEGIN;
DO $$
DECLARE
  v_restaurant_id UUID;
BEGIN

-- 1) McDonald''s Bahrain — Fast Food
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'McDonald''s Bahrain', 'Global fast‑food burgers and breakfast.', 'Fast Food',
  'Multiple branches, Bahrain', '+973 1700 1013', 'orders@mcdonalds.bh',
  4.4, 15000, '25-35 min', 3.000, 0.800, true, true, '00:00:00', '23:59:59', NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Big Mac','Big Mac','Main Course',2.60,NULL,true,8,620,false,false),
(v_restaurant_id,'McChicken','McChicken','Main Course',2.10,NULL,true,10,180,false,false),
(v_restaurant_id,'Quarter Pounder with Cheese','Quarter Pounder with Cheese','Main Course',2.60,NULL,true,18,300,true,false),
(v_restaurant_id,'Chicken McNuggets (10 pcs)','Chicken McNuggets (10 pcs)','Side',2.40,NULL,true,10,180,false,false),
(v_restaurant_id,'Fries (Large)','Fries (Large)','Side',1.20,NULL,true,10,720,true,false),
(v_restaurant_id,'Apple Pie','Apple Pie','Dessert',1.00,NULL,true,10,220,false,false),
(v_restaurant_id,'Egg McMuffin','Egg McMuffin','Breakfast',1.60,NULL,true,12,300,true,false),
(v_restaurant_id,'Pancakes','Pancakes','Breakfast',1.50,NULL,true,12,300,true,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,15,720,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,10,420,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,15,180,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,20,300,false,false),
(v_restaurant_id,'Crispy Chicken Sandwich','Crispy Chicken Sandwich','Main Course',3.40,NULL,true,20,420,false,false),
(v_restaurant_id,'Chicken Nuggets (10 pcs)','Chicken Nuggets (10 pcs)','Side',2.80,NULL,true,15,180,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,12,520,true,false),
(v_restaurant_id,'Curly Fries','Curly Fries','Side',1.40,NULL,true,10,220,true,false),
(v_restaurant_id,'Onion Rings','Onion Rings','Side',1.50,NULL,true,10,720,true,false),
(v_restaurant_id,'Coleslaw','Coleslaw','Side',0.90,NULL,true,8,260,false,false),
(v_restaurant_id,'Chocolate Shake','Chocolate Shake','Beverage',1.60,NULL,true,20,220,true,false),
(v_restaurant_id,'Vanilla Shake','Vanilla Shake','Beverage',1.60,NULL,true,12,300,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 2) KFC Bahrain — Fast Food
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'KFC Bahrain', 'Fried chicken meals and sandwiches.', 'Fast Food',
  'Multiple branches, Bahrain', '+973 1700 1014', 'orders@kfc.bh',
  4.3, 12000, '25-35 min', 3.000, 0.800, true, true, '10:00:00', '02:00:00', NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Zinger Burger','Zinger Burger','Main Course',2.30,NULL,true,12,620,false,false),
(v_restaurant_id,'Mighty Zinger','Mighty Zinger','Main Course',2.90,NULL,true,18,220,false,false),
(v_restaurant_id,'3‑pc Chicken Meal','3‑pc Chicken Meal','Main Course',3.30,NULL,true,10,300,false,false),
(v_restaurant_id,'8‑pc Bucket','8‑pc Bucket','Main Course',7.90,NULL,true,15,180,false,false),
(v_restaurant_id,'Popcorn Chicken','Popcorn Chicken','Side',1.80,NULL,true,12,620,false,false),
(v_restaurant_id,'Coleslaw','Coleslaw','Side',0.90,NULL,true,8,620,false,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,8,360,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,12,300,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,18,360,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,10,220,false,false),
(v_restaurant_id,'Crispy Chicken Sandwich','Crispy Chicken Sandwich','Main Course',3.40,NULL,true,18,300,false,false),
(v_restaurant_id,'Chicken Nuggets (10 pcs)','Chicken Nuggets (10 pcs)','Side',2.80,NULL,true,20,260,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,15,300,true,false),
(v_restaurant_id,'Curly Fries','Curly Fries','Side',1.40,NULL,true,12,620,true,false),
(v_restaurant_id,'Onion Rings','Onion Rings','Side',1.50,NULL,true,8,720,true,false),
(v_restaurant_id,'Coleslaw','Coleslaw','Side',0.90,NULL,true,12,520,false,false),
(v_restaurant_id,'Chocolate Shake','Chocolate Shake','Beverage',1.60,NULL,true,8,220,true,false),
(v_restaurant_id,'Vanilla Shake','Vanilla Shake','Beverage',1.60,NULL,true,10,300,true,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,10,520,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,18,300,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 3) Burger King Bahrain — Fast Food
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Burger King Bahrain', 'Flame‑grilled burgers and meals.', 'Fast Food',
  'Multiple branches, Bahrain', '+973 1700 1015', 'orders@burgerking.bh',
  4.3, 9000, '25-35 min', 3.000, 0.800, true, true, '10:00:00', '02:00:00', NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Whopper','Whopper','Main Course',2.60,NULL,true,20,180,false,false),
(v_restaurant_id,'Chicken Royale','Chicken Royale','Main Course',2.40,NULL,true,12,720,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,10,520,true,false),
(v_restaurant_id,'Onion Rings','Onion Rings','Side',1.50,NULL,true,15,300,true,false),
(v_restaurant_id,'Apple Pie','Apple Pie','Dessert',1.00,NULL,true,12,360,false,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,8,300,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,18,620,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,20,360,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,8,220,false,false),
(v_restaurant_id,'Crispy Chicken Sandwich','Crispy Chicken Sandwich','Main Course',3.40,NULL,true,15,180,false,false),
(v_restaurant_id,'Chicken Nuggets (10 pcs)','Chicken Nuggets (10 pcs)','Side',2.80,NULL,true,15,360,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,10,360,true,false),
(v_restaurant_id,'Curly Fries','Curly Fries','Side',1.40,NULL,true,10,260,true,false),
(v_restaurant_id,'Onion Rings','Onion Rings','Side',1.50,NULL,true,8,300,true,false),
(v_restaurant_id,'Coleslaw','Coleslaw','Side',0.90,NULL,true,12,620,false,false),
(v_restaurant_id,'Chocolate Shake','Chocolate Shake','Beverage',1.60,NULL,true,12,520,true,false),
(v_restaurant_id,'Vanilla Shake','Vanilla Shake','Beverage',1.60,NULL,true,18,300,true,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,18,300,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,8,520,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,12,220,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 4) Pizza Hut Bahrain — Pizza
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Pizza Hut Bahrain', 'Pizzas, pastas, sides, and desserts.', 'Pizza',
  'Multiple branches, Bahrain', '+973 1700 1016', 'orders@pizzahut.bh',
  4.2, 8000, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:59:00', NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Margherita Pizza','Margherita Pizza','Main Course',3.80,NULL,true,12,300,false,false),
(v_restaurant_id,'Pepperoni Pizza','Pepperoni Pizza','Main Course',4.20,NULL,true,10,180,false,false),
(v_restaurant_id,'Veggie Supreme','Veggie Supreme','Main Course',4.10,NULL,true,15,300,true,false),
(v_restaurant_id,'BBQ Chicken Pizza','BBQ Chicken Pizza','Main Course',4.50,NULL,true,18,260,false,false),
(v_restaurant_id,'Hawaiian Pizza','Hawaiian Pizza','Main Course',4.30,NULL,true,15,620,false,false),
(v_restaurant_id,'Cheesy Breadsticks','Cheesy Breadsticks','Side',1.60,NULL,true,20,180,false,false),
(v_restaurant_id,'Garlic Bread','Garlic Bread','Side',1.20,NULL,true,10,260,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Side',3.00,NULL,true,12,180,false,false),
(v_restaurant_id,'Lasagna','Lasagna','Main Course',4.50,NULL,true,12,520,false,false),
(v_restaurant_id,'Chicken Alfredo Pasta','Chicken Alfredo Pasta','Main Course',4.30,NULL,true,8,620,false,false),
(v_restaurant_id,'Chocolate Lava Cake','Chocolate Lava Cake','Dessert',2.00,NULL,true,15,520,true,false),
(v_restaurant_id,'Tiramisu','Tiramisu','Dessert',2.20,NULL,true,15,300,false,false),
(v_restaurant_id,'Margherita Pizza','Margherita Pizza','Main Course',3.80,NULL,true,15,180,false,false),
(v_restaurant_id,'Pepperoni Pizza','Pepperoni Pizza','Main Course',4.20,NULL,true,20,300,false,false),
(v_restaurant_id,'Veggie Supreme','Veggie Supreme','Main Course',4.10,NULL,true,15,300,true,false),
(v_restaurant_id,'BBQ Chicken Pizza','BBQ Chicken Pizza','Main Course',4.50,NULL,true,15,420,false,false),
(v_restaurant_id,'Hawaiian Pizza','Hawaiian Pizza','Main Course',4.30,NULL,true,20,520,false,false),
(v_restaurant_id,'Cheesy Breadsticks','Cheesy Breadsticks','Side',1.60,NULL,true,20,300,false,false),
(v_restaurant_id,'Garlic Bread','Garlic Bread','Side',1.20,NULL,true,8,220,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Side',3.00,NULL,true,12,620,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 5) Domino''s Pizza Bahrain — Pizza
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Domino''s Pizza Bahrain', 'Pizza delivery & custom toppings.', 'Pizza',
  'Multiple branches, Bahrain', '+973 1700 1017', 'orders@dominos.bh',
  4.2, 8500, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:59:00', NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Margherita Pizza','Margherita Pizza','Main Course',3.80,NULL,true,18,220,false,false),
(v_restaurant_id,'Pepperoni Pizza','Pepperoni Pizza','Main Course',4.20,NULL,true,15,420,false,false),
(v_restaurant_id,'Veggie Supreme','Veggie Supreme','Main Course',4.10,NULL,true,15,260,true,false),
(v_restaurant_id,'BBQ Chicken Pizza','BBQ Chicken Pizza','Main Course',4.50,NULL,true,12,360,false,false),
(v_restaurant_id,'Hawaiian Pizza','Hawaiian Pizza','Main Course',4.30,NULL,true,8,300,false,false),
(v_restaurant_id,'Cheesy Breadsticks','Cheesy Breadsticks','Side',1.60,NULL,true,12,260,false,false),
(v_restaurant_id,'Garlic Bread','Garlic Bread','Side',1.20,NULL,true,18,620,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Side',3.00,NULL,true,20,220,false,false),
(v_restaurant_id,'Lasagna','Lasagna','Main Course',4.50,NULL,true,10,260,false,false),
(v_restaurant_id,'Chicken Alfredo Pasta','Chicken Alfredo Pasta','Main Course',4.30,NULL,true,15,620,false,false),
(v_restaurant_id,'Chocolate Lava Cake','Chocolate Lava Cake','Dessert',2.00,NULL,true,15,720,true,false),
(v_restaurant_id,'Tiramisu','Tiramisu','Dessert',2.20,NULL,true,15,620,false,false),
(v_restaurant_id,'Margherita Pizza','Margherita Pizza','Main Course',3.80,NULL,true,12,180,false,false),
(v_restaurant_id,'Pepperoni Pizza','Pepperoni Pizza','Main Course',4.20,NULL,true,20,260,false,false),
(v_restaurant_id,'Veggie Supreme','Veggie Supreme','Main Course',4.10,NULL,true,10,300,true,false),
(v_restaurant_id,'BBQ Chicken Pizza','BBQ Chicken Pizza','Main Course',4.50,NULL,true,18,620,false,false),
(v_restaurant_id,'Hawaiian Pizza','Hawaiian Pizza','Main Course',4.30,NULL,true,8,360,false,false),
(v_restaurant_id,'Cheesy Breadsticks','Cheesy Breadsticks','Side',1.60,NULL,true,8,180,false,false),
(v_restaurant_id,'Garlic Bread','Garlic Bread','Side',1.20,NULL,true,18,260,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Side',3.00,NULL,true,15,520,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 6) Papa John's Bahrain — Pizza
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Papa John''s Bahrain', 'Pizzas with signature garlic sauce.', 'Pizza',
  'Multiple branches, Bahrain', '+973 1700 1019', 'orders@papajohns.bh',
  4.2, 6200, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:59:00', NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Margherita Pizza','Margherita Pizza','Main Course',3.80,NULL,true,12,520,false,false),
(v_restaurant_id,'Pepperoni Pizza','Pepperoni Pizza','Main Course',4.20,NULL,true,8,520,false,false),
(v_restaurant_id,'Veggie Supreme','Veggie Supreme','Main Course',4.10,NULL,true,10,180,true,false),
(v_restaurant_id,'BBQ Chicken Pizza','BBQ Chicken Pizza','Main Course',4.50,NULL,true,15,360,false,false),
(v_restaurant_id,'Hawaiian Pizza','Hawaiian Pizza','Main Course',4.30,NULL,true,12,300,false,false),
(v_restaurant_id,'Cheesy Breadsticks','Cheesy Breadsticks','Side',1.60,NULL,true,12,720,false,false),
(v_restaurant_id,'Garlic Bread','Garlic Bread','Side',1.20,NULL,true,12,180,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Side',3.00,NULL,true,10,180,false,false),
(v_restaurant_id,'Lasagna','Lasagna','Main Course',4.50,NULL,true,12,300,false,false),
(v_restaurant_id,'Chicken Alfredo Pasta','Chicken Alfredo Pasta','Main Course',4.30,NULL,true,15,260,false,false),
(v_restaurant_id,'Chocolate Lava Cake','Chocolate Lava Cake','Dessert',2.00,NULL,true,10,360,true,false),
(v_restaurant_id,'Tiramisu','Tiramisu','Dessert',2.20,NULL,true,15,420,false,false),
(v_restaurant_id,'Margherita Pizza','Margherita Pizza','Main Course',3.80,NULL,true,10,520,false,false),
(v_restaurant_id,'Pepperoni Pizza','Pepperoni Pizza','Main Course',4.20,NULL,true,8,620,false,false),
(v_restaurant_id,'Veggie Supreme','Veggie Supreme','Main Course',4.10,NULL,true,15,220,true,false),
(v_restaurant_id,'BBQ Chicken Pizza','BBQ Chicken Pizza','Main Course',4.50,NULL,true,15,720,false,false),
(v_restaurant_id,'Hawaiian Pizza','Hawaiian Pizza','Main Course',4.30,NULL,true,8,300,false,false),
(v_restaurant_id,'Cheesy Breadsticks','Cheesy Breadsticks','Side',1.60,NULL,true,15,360,false,false),
(v_restaurant_id,'Garlic Bread','Garlic Bread','Side',1.20,NULL,true,12,220,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Side',3.00,NULL,true,15,300,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 7) Nando's Bahrain — Portuguese
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Nando''s Bahrain', 'Afro‑Portuguese PERi‑PERi chicken specialists.', 'Portuguese',
  'Bahrain City Centre, Seef', '+973 1700 1020', 'orders@nandos.bh',
  4.6, 4100, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:00:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'PERi‑PERi 1/2 Chicken','PERi‑PERi 1/2 Chicken','Main Course',5.50,NULL,true,10,260,false,true),
(v_restaurant_id,'PERi Chicken Wrap','PERi Chicken Wrap','Main Course',3.60,NULL,true,12,180,false,true),
(v_restaurant_id,'PERi Chicken Burger','PERi Chicken Burger','Main Course',3.60,NULL,true,20,220,false,true),
(v_restaurant_id,'Halloumi Sticks','Halloumi Sticks','Appetizer',2.20,NULL,true,15,180,false,false),
(v_restaurant_id,'Corn on the Cob','Corn on the Cob','Side',1.20,NULL,true,15,220,false,false),
(v_restaurant_id,'Spicy Rice','Spicy Rice','Side',1.00,NULL,true,20,520,true,true),
(v_restaurant_id,'PERi Fries','PERi Fries','Side',1.30,NULL,true,8,420,true,true),
(v_restaurant_id,'Mediterranean Salad','Mediterranean Salad','Salad',2.10,NULL,true,18,360,true,false),
(v_restaurant_id,'Hummus with PERi Drizzle','Hummus with PERi Drizzle','Appetizer',1.80,NULL,true,8,260,false,true),
(v_restaurant_id,'Chocolate Cake','Chocolate Cake','Dessert',1.90,NULL,true,8,300,true,false),
(v_restaurant_id,'Pastéis de Nata','Pastéis de Nata','Dessert',1.50,NULL,true,18,620,false,false),
(v_restaurant_id,'PERi‑PERi 1/2 Chicken','PERi‑PERi 1/2 Chicken','Main Course',5.50,NULL,true,20,180,false,true),
(v_restaurant_id,'PERi Chicken Wrap','PERi Chicken Wrap','Main Course',3.60,NULL,true,18,180,false,true),
(v_restaurant_id,'PERi Chicken Burger','PERi Chicken Burger','Main Course',3.60,NULL,true,10,360,false,true),
(v_restaurant_id,'Halloumi Sticks','Halloumi Sticks','Appetizer',2.20,NULL,true,8,220,false,false),
(v_restaurant_id,'Corn on the Cob','Corn on the Cob','Side',1.20,NULL,true,12,520,false,false),
(v_restaurant_id,'Spicy Rice','Spicy Rice','Side',1.00,NULL,true,12,220,true,true),
(v_restaurant_id,'PERi Fries','PERi Fries','Side',1.30,NULL,true,18,180,true,true),
(v_restaurant_id,'Mediterranean Salad','Mediterranean Salad','Salad',2.10,NULL,true,18,620,true,false),
(v_restaurant_id,'Hummus with PERi Drizzle','Hummus with PERi Drizzle','Appetizer',1.80,NULL,true,20,300,false,true);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 8) Shake Shack Bahrain — Burgers
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Shake Shack Bahrain', 'Modern burger stand with shakes.', 'Burgers',
  'The Avenues, Manama', '+973 1700 1021', 'orders@shakeshack.bh',
  4.5, 4300, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:30:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,8,420,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,18,300,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,10,220,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,20,420,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,15,420,true,false),
(v_restaurant_id,'Onion Rings','Onion Rings','Side',1.50,NULL,true,20,720,true,false),
(v_restaurant_id,'Chocolate Shake','Chocolate Shake','Beverage',1.60,NULL,true,18,420,true,false),
(v_restaurant_id,'Vanilla Shake','Vanilla Shake','Beverage',1.60,NULL,true,10,420,true,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,10,220,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,20,420,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,20,420,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,20,360,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,18,420,true,false),
(v_restaurant_id,'Onion Rings','Onion Rings','Side',1.50,NULL,true,10,220,true,false),
(v_restaurant_id,'Chocolate Shake','Chocolate Shake','Beverage',1.60,NULL,true,18,420,true,false),
(v_restaurant_id,'Vanilla Shake','Vanilla Shake','Beverage',1.60,NULL,true,18,260,true,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,18,620,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,18,360,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,18,360,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,15,180,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 9) Texas Chicken Bahrain — Fast Food
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Texas Chicken Bahrain', 'Fried chicken, biscuits, and sandwiches.', 'Fast Food',
  'Multiple branches, Bahrain', '+973 1700 1018', 'orders@texaschicken.bh',
  4.2, 5000, '25-35 min', 3.000, 0.800, true, true, '10:00:00', '01:00:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,15,420,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,12,420,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,20,520,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,8,360,false,false),
(v_restaurant_id,'Crispy Chicken Sandwich','Crispy Chicken Sandwich','Main Course',3.40,NULL,true,20,620,false,false),
(v_restaurant_id,'Chicken Nuggets (10 pcs)','Chicken Nuggets (10 pcs)','Side',2.80,NULL,true,20,260,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,10,220,true,false),
(v_restaurant_id,'Curly Fries','Curly Fries','Side',1.40,NULL,true,8,520,true,false),
(v_restaurant_id,'Onion Rings','Onion Rings','Side',1.50,NULL,true,20,360,true,false),
(v_restaurant_id,'Coleslaw','Coleslaw','Side',0.90,NULL,true,18,300,false,false),
(v_restaurant_id,'Chocolate Shake','Chocolate Shake','Beverage',1.60,NULL,true,15,180,true,false),
(v_restaurant_id,'Vanilla Shake','Vanilla Shake','Beverage',1.60,NULL,true,10,180,true,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,18,220,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,18,720,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,20,420,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,20,180,false,false),
(v_restaurant_id,'Crispy Chicken Sandwich','Crispy Chicken Sandwich','Main Course',3.40,NULL,true,20,260,false,false),
(v_restaurant_id,'Chicken Nuggets (10 pcs)','Chicken Nuggets (10 pcs)','Side',2.80,NULL,true,18,720,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,10,620,true,false),
(v_restaurant_id,'Curly Fries','Curly Fries','Side',1.40,NULL,true,20,620,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 10) Subway Bahrain — Sandwiches
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Subway Bahrain', 'Customizable subs, salads, and wraps.', 'Sandwiches',
  'Multiple branches, Bahrain', '+973 1700 1022', 'orders@subway.bh',
  4.2, 7000, '25-35 min', 3.000, 0.800, true, true, '09:00:00', '23:59:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Turkey Sub (6”)','Turkey Sub (6”)','Main Course',2.60,NULL,true,10,360,false,false),
(v_restaurant_id,'Chicken Teriyaki (6”)','Chicken Teriyaki (6”)','Main Course',2.80,NULL,true,10,420,false,false),
(v_restaurant_id,'Tuna Sub (6”)','Tuna Sub (6”)','Main Course',2.50,NULL,true,20,620,false,false),
(v_restaurant_id,'Veggie Delight (6”)','Veggie Delight (6”)','Main Course',2.20,NULL,true,15,180,true,false),
(v_restaurant_id,'Meatball Marinara (6”)','Meatball Marinara (6”)','Main Course',2.60,NULL,true,12,620,false,false),
(v_restaurant_id,'Cheesy Garlic Bread','Cheesy Garlic Bread','Side',1.20,NULL,true,10,300,false,false),
(v_restaurant_id,'Cookies (2 pcs)','Cookies (2 pcs)','Dessert',0.90,NULL,true,10,360,true,false),
(v_restaurant_id,'Turkey Sub (6”)','Turkey Sub (6”)','Main Course',2.60,NULL,true,12,520,false,false),
(v_restaurant_id,'Chicken Teriyaki (6”)','Chicken Teriyaki (6”)','Main Course',2.80,NULL,true,15,420,false,false),
(v_restaurant_id,'Tuna Sub (6”)','Tuna Sub (6”)','Main Course',2.50,NULL,true,10,300,false,false),
(v_restaurant_id,'Veggie Delight (6”)','Veggie Delight (6”)','Main Course',2.20,NULL,true,18,360,true,false),
(v_restaurant_id,'Meatball Marinara (6”)','Meatball Marinara (6”)','Main Course',2.60,NULL,true,18,360,false,false),
(v_restaurant_id,'Cheesy Garlic Bread','Cheesy Garlic Bread','Side',1.20,NULL,true,12,360,false,false),
(v_restaurant_id,'Cookies (2 pcs)','Cookies (2 pcs)','Dessert',0.90,NULL,true,10,420,true,false),
(v_restaurant_id,'Turkey Sub (6”)','Turkey Sub (6”)','Main Course',2.60,NULL,true,8,620,false,false),
(v_restaurant_id,'Chicken Teriyaki (6”)','Chicken Teriyaki (6”)','Main Course',2.80,NULL,true,20,300,false,false),
(v_restaurant_id,'Tuna Sub (6”)','Tuna Sub (6”)','Main Course',2.50,NULL,true,15,180,false,false),
(v_restaurant_id,'Veggie Delight (6”)','Veggie Delight (6”)','Main Course',2.20,NULL,true,10,620,true,false),
(v_restaurant_id,'Meatball Marinara (6”)','Meatball Marinara (6”)','Main Course',2.60,NULL,true,12,620,false,false),
(v_restaurant_id,'Cheesy Garlic Bread','Cheesy Garlic Bread','Side',1.20,NULL,true,20,360,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 11) Starbucks Bahrain — Coffee
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Starbucks Bahrain', 'Coffee, espresso drinks, and pastries.', 'Coffee',
  'Multiple branches, Bahrain', '+973 1700 1023', 'orders@starbucks.bh',
  4.5, 12000, '25-35 min', 3.000, 0.600, true, true, '07:00:00', '23:59:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,10,300,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,15,720,true,false),
(v_restaurant_id,'Cappuccino','Cappuccino','Beverage',1.90,NULL,true,18,220,false,false),
(v_restaurant_id,'Iced Latte','Iced Latte','Beverage',1.90,NULL,true,15,620,true,false),
(v_restaurant_id,'Caramel Macchiato','Caramel Macchiato','Beverage',2.20,NULL,true,12,360,false,false),
(v_restaurant_id,'Mocha','Mocha','Beverage',2.20,NULL,true,12,260,true,false),
(v_restaurant_id,'Hot Chocolate','Hot Chocolate','Beverage',1.70,NULL,true,15,180,false,false),
(v_restaurant_id,'Blueberry Muffin','Blueberry Muffin','Dessert',1.10,NULL,true,8,520,true,false),
(v_restaurant_id,'Chocolate Croissant','Chocolate Croissant','Dessert',1.20,NULL,true,18,300,false,false),
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,15,260,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,10,300,true,false),
(v_restaurant_id,'Cappuccino','Cappuccino','Beverage',1.90,NULL,true,18,300,false,false),
(v_restaurant_id,'Iced Latte','Iced Latte','Beverage',1.90,NULL,true,18,520,true,false),
(v_restaurant_id,'Caramel Macchiato','Caramel Macchiato','Beverage',2.20,NULL,true,15,260,false,false),
(v_restaurant_id,'Mocha','Mocha','Beverage',2.20,NULL,true,8,720,true,false),
(v_restaurant_id,'Hot Chocolate','Hot Chocolate','Beverage',1.70,NULL,true,8,520,false,false),
(v_restaurant_id,'Blueberry Muffin','Blueberry Muffin','Dessert',1.10,NULL,true,18,620,true,false),
(v_restaurant_id,'Chocolate Croissant','Chocolate Croissant','Dessert',1.20,NULL,true,15,420,false,false),
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,8,720,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,8,520,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 12) Krispy Kreme Bahrain — Donuts
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Krispy Kreme Bahrain', 'Doughnuts and coffee.', 'Donuts',
  'Multiple branches, Bahrain', '+973 1700 1024', 'orders@krispykreme.bh',
  4.6, 6500, '25-35 min', 3.000, 0.600, true, true, '08:00:00', '23:00:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Original Glazed','Original Glazed','Dessert',1.10,NULL,true,10,520,false,false),
(v_restaurant_id,'Chocolate Iced','Chocolate Iced','Dessert',1.10,NULL,true,10,520,true,false),
(v_restaurant_id,'Strawberry Sprinkles','Strawberry Sprinkles','Dessert',1.10,NULL,true,20,420,false,false),
(v_restaurant_id,'Filled Ring','Filled Ring','Dessert',1.10,NULL,true,18,220,false,false),
(v_restaurant_id,'Coffee','Coffee','Beverage',1.20,NULL,true,15,260,true,false),
(v_restaurant_id,'Original Glazed','Original Glazed','Dessert',1.10,NULL,true,18,300,false,false),
(v_restaurant_id,'Chocolate Iced','Chocolate Iced','Dessert',1.10,NULL,true,18,260,true,false),
(v_restaurant_id,'Strawberry Sprinkles','Strawberry Sprinkles','Dessert',1.10,NULL,true,15,360,false,false),
(v_restaurant_id,'Filled Ring','Filled Ring','Dessert',1.10,NULL,true,8,180,false,false),
(v_restaurant_id,'Coffee','Coffee','Beverage',1.20,NULL,true,12,360,true,false),
(v_restaurant_id,'Original Glazed','Original Glazed','Dessert',1.10,NULL,true,15,220,false,false),
(v_restaurant_id,'Chocolate Iced','Chocolate Iced','Dessert',1.10,NULL,true,8,260,true,false),
(v_restaurant_id,'Strawberry Sprinkles','Strawberry Sprinkles','Dessert',1.10,NULL,true,18,520,false,false),
(v_restaurant_id,'Filled Ring','Filled Ring','Dessert',1.10,NULL,true,12,520,false,false),
(v_restaurant_id,'Coffee','Coffee','Beverage',1.20,NULL,true,12,420,true,false),
(v_restaurant_id,'Original Glazed','Original Glazed','Dessert',1.10,NULL,true,15,180,false,false),
(v_restaurant_id,'Chocolate Iced','Chocolate Iced','Dessert',1.10,NULL,true,15,620,true,false),
(v_restaurant_id,'Strawberry Sprinkles','Strawberry Sprinkles','Dessert',1.10,NULL,true,8,300,false,false),
(v_restaurant_id,'Filled Ring','Filled Ring','Dessert',1.10,NULL,true,10,720,false,false),
(v_restaurant_id,'Coffee','Coffee','Beverage',1.20,NULL,true,12,220,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 13) Dunkin' Bahrain — Coffee
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Dunkin'' Bahrain', 'Coffee and donuts.', 'Coffee',
  'Multiple branches, Bahrain', '+973 1700 1025', 'orders@dunkin.bh',
  4.4, 7300, '25-35 min', 3.000, 0.600, true, true, '07:00:00', '23:00:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,15,180,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,15,360,true,false),
(v_restaurant_id,'Cappuccino','Cappuccino','Beverage',1.90,NULL,true,15,300,false,false),
(v_restaurant_id,'Iced Latte','Iced Latte','Beverage',1.90,NULL,true,12,360,true,false),
(v_restaurant_id,'Caramel Macchiato','Caramel Macchiato','Beverage',2.20,NULL,true,20,420,false,false),
(v_restaurant_id,'Mocha','Mocha','Beverage',2.20,NULL,true,15,620,true,false),
(v_restaurant_id,'Hot Chocolate','Hot Chocolate','Beverage',1.70,NULL,true,20,720,false,false),
(v_restaurant_id,'Blueberry Muffin','Blueberry Muffin','Dessert',1.10,NULL,true,8,300,true,false),
(v_restaurant_id,'Chocolate Croissant','Chocolate Croissant','Dessert',1.20,NULL,true,12,620,false,false),
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,10,300,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,15,620,true,false),
(v_restaurant_id,'Cappuccino','Cappuccino','Beverage',1.90,NULL,true,10,180,false,false),
(v_restaurant_id,'Iced Latte','Iced Latte','Beverage',1.90,NULL,true,20,260,true,false),
(v_restaurant_id,'Caramel Macchiato','Caramel Macchiato','Beverage',2.20,NULL,true,10,420,false,false),
(v_restaurant_id,'Mocha','Mocha','Beverage',2.20,NULL,true,18,520,true,false),
(v_restaurant_id,'Hot Chocolate','Hot Chocolate','Beverage',1.70,NULL,true,12,720,false,false),
(v_restaurant_id,'Blueberry Muffin','Blueberry Muffin','Dessert',1.10,NULL,true,15,180,true,false),
(v_restaurant_id,'Chocolate Croissant','Chocolate Croissant','Dessert',1.20,NULL,true,18,620,false,false),
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,10,180,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,10,420,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 14) Baskin Robbins Bahrain — Ice Cream
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Baskin Robbins Bahrain', 'Ice cream scoops, sundaes, and cakes.', 'Ice Cream',
  'Multiple branches, Bahrain', '+973 1700 1026', 'orders@baskinrobbins.bh',
  4.5, 9000, '25-35 min', 3.000, 0.800, true, true, '10:00:00', '23:59:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Single Scoop','Single Scoop','Dessert',1.00,NULL,true,10,520,false,false),
(v_restaurant_id,'Double Scoop','Double Scoop','Dessert',1.60,NULL,true,20,620,false,false),
(v_restaurant_id,'Sundae','Sundae','Dessert',1.80,NULL,true,12,220,false,false),
(v_restaurant_id,'Milkshake','Milkshake','Beverage',1.60,NULL,true,10,180,true,false),
(v_restaurant_id,'Ice Cream Cake Slice','Ice Cream Cake Slice','Dessert',2.40,NULL,true,8,260,true,false),
(v_restaurant_id,'Single Scoop','Single Scoop','Dessert',1.00,NULL,true,10,300,false,false),
(v_restaurant_id,'Double Scoop','Double Scoop','Dessert',1.60,NULL,true,15,300,false,false),
(v_restaurant_id,'Sundae','Sundae','Dessert',1.80,NULL,true,10,180,false,false),
(v_restaurant_id,'Milkshake','Milkshake','Beverage',1.60,NULL,true,8,520,true,false),
(v_restaurant_id,'Ice Cream Cake Slice','Ice Cream Cake Slice','Dessert',2.40,NULL,true,18,260,true,false),
(v_restaurant_id,'Single Scoop','Single Scoop','Dessert',1.00,NULL,true,10,180,false,false),
(v_restaurant_id,'Double Scoop','Double Scoop','Dessert',1.60,NULL,true,12,260,false,false),
(v_restaurant_id,'Sundae','Sundae','Dessert',1.80,NULL,true,15,520,false,false),
(v_restaurant_id,'Milkshake','Milkshake','Beverage',1.60,NULL,true,15,520,true,false),
(v_restaurant_id,'Ice Cream Cake Slice','Ice Cream Cake Slice','Dessert',2.40,NULL,true,10,420,true,false),
(v_restaurant_id,'Single Scoop','Single Scoop','Dessert',1.00,NULL,true,8,620,false,false),
(v_restaurant_id,'Double Scoop','Double Scoop','Dessert',1.60,NULL,true,20,620,false,false),
(v_restaurant_id,'Sundae','Sundae','Dessert',1.80,NULL,true,18,300,false,false),
(v_restaurant_id,'Milkshake','Milkshake','Beverage',1.60,NULL,true,8,180,true,false),
(v_restaurant_id,'Ice Cream Cake Slice','Ice Cream Cake Slice','Dessert',2.40,NULL,true,20,520,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 15) TGI Fridays Bahrain — Casual Dining
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'TGI Fridays Bahrain', 'American casual dining and grills.', 'Casual Dining',
  'Seef / Adliya, Bahrain', '+973 1700 1027', 'orders@tgifridays.bh',
  4.3, 5200, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:59:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Classic Nachos','Classic Nachos','Appetizer',3.20,NULL,true,10,720,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Appetizer',3.00,NULL,true,18,720,false,false),
(v_restaurant_id,'Chicken Caesar Salad','Chicken Caesar Salad','Salad',2.90,NULL,true,15,420,true,false),
(v_restaurant_id,'Steak Sandwich','Steak Sandwich','Main Course',4.80,NULL,true,10,520,false,false),
(v_restaurant_id,'Grilled Chicken','Grilled Chicken','Main Course',4.50,NULL,true,20,520,false,false),
(v_restaurant_id,'Beef Burger','Beef Burger','Main Course',3.60,NULL,true,20,260,false,false),
(v_restaurant_id,'Chocolate Brownie','Chocolate Brownie','Dessert',1.90,NULL,true,20,300,false,false),
(v_restaurant_id,'New York Cheesecake','New York Cheesecake','Dessert',2.20,NULL,true,8,180,true,false),
(v_restaurant_id,'Classic Nachos','Classic Nachos','Appetizer',3.20,NULL,true,20,260,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Appetizer',3.00,NULL,true,12,620,false,false),
(v_restaurant_id,'Chicken Caesar Salad','Chicken Caesar Salad','Salad',2.90,NULL,true,12,360,true,false),
(v_restaurant_id,'Steak Sandwich','Steak Sandwich','Main Course',4.80,NULL,true,10,520,false,false),
(v_restaurant_id,'Grilled Chicken','Grilled Chicken','Main Course',4.50,NULL,true,12,220,false,false),
(v_restaurant_id,'Beef Burger','Beef Burger','Main Course',3.60,NULL,true,15,260,false,false),
(v_restaurant_id,'Chocolate Brownie','Chocolate Brownie','Dessert',1.90,NULL,true,12,720,false,false),
(v_restaurant_id,'New York Cheesecake','New York Cheesecake','Dessert',2.20,NULL,true,8,620,true,false),
(v_restaurant_id,'Classic Nachos','Classic Nachos','Appetizer',3.20,NULL,true,18,180,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Appetizer',3.00,NULL,true,15,620,false,false),
(v_restaurant_id,'Chicken Caesar Salad','Chicken Caesar Salad','Salad',2.90,NULL,true,12,620,true,false),
(v_restaurant_id,'Steak Sandwich','Steak Sandwich','Main Course',4.80,NULL,true,18,220,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 16) Chili''s Bahrain — Casual Dining
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Chili''s Bahrain', 'Southwest‑inspired casual dining.', 'Casual Dining',
  'Seef / Juffair, Bahrain', '+973 1700 1028', 'orders@chilis.bh',
  4.3, 5400, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:59:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Classic Nachos','Classic Nachos','Appetizer',3.20,NULL,true,15,260,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Appetizer',3.00,NULL,true,12,180,false,false),
(v_restaurant_id,'Chicken Caesar Salad','Chicken Caesar Salad','Salad',2.90,NULL,true,20,720,true,false),
(v_restaurant_id,'Steak Sandwich','Steak Sandwich','Main Course',4.80,NULL,true,8,220,false,false),
(v_restaurant_id,'Grilled Chicken','Grilled Chicken','Main Course',4.50,NULL,true,8,420,false,false),
(v_restaurant_id,'Beef Burger','Beef Burger','Main Course',3.60,NULL,true,18,220,false,false),
(v_restaurant_id,'Chocolate Brownie','Chocolate Brownie','Dessert',1.90,NULL,true,18,180,false,false),
(v_restaurant_id,'New York Cheesecake','New York Cheesecake','Dessert',2.20,NULL,true,10,420,true,false),
(v_restaurant_id,'Classic Nachos','Classic Nachos','Appetizer',3.20,NULL,true,10,260,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Appetizer',3.00,NULL,true,18,720,false,false),
(v_restaurant_id,'Chicken Caesar Salad','Chicken Caesar Salad','Salad',2.90,NULL,true,10,520,true,false),
(v_restaurant_id,'Steak Sandwich','Steak Sandwich','Main Course',4.80,NULL,true,18,260,false,false),
(v_restaurant_id,'Grilled Chicken','Grilled Chicken','Main Course',4.50,NULL,true,8,520,false,false),
(v_restaurant_id,'Beef Burger','Beef Burger','Main Course',3.60,NULL,true,12,360,false,false),
(v_restaurant_id,'Chocolate Brownie','Chocolate Brownie','Dessert',1.90,NULL,true,10,420,false,false),
(v_restaurant_id,'New York Cheesecake','New York Cheesecake','Dessert',2.20,NULL,true,18,180,true,false),
(v_restaurant_id,'Classic Nachos','Classic Nachos','Appetizer',3.20,NULL,true,12,360,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Appetizer',3.00,NULL,true,18,220,false,false),
(v_restaurant_id,'Chicken Caesar Salad','Chicken Caesar Salad','Salad',2.90,NULL,true,10,520,true,false),
(v_restaurant_id,'Steak Sandwich','Steak Sandwich','Main Course',4.80,NULL,true,18,260,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 17) P.F. Chang''s Bahrain — Asian
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'P.F. Chang''s Bahrain', 'American Chinese cuisine.', 'Asian',
  'Seef / Avenues, Bahrain', '+973 1700 1029', 'orders@pfchangs.bh',
  4.4, 4800, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:59:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Chicken Lettuce Wraps','Chicken Lettuce Wraps','Appetizer',3.40,NULL,true,10,300,false,false),
(v_restaurant_id,'Crispy Green Beans','Crispy Green Beans','Appetizer',2.20,NULL,true,12,520,false,false),
(v_restaurant_id,'Kung Pao Chicken','Kung Pao Chicken','Main Course',5.20,NULL,true,18,220,false,true),
(v_restaurant_id,'Mongolian Beef','Mongolian Beef','Main Course',6.10,NULL,true,10,720,false,false),
(v_restaurant_id,'Shrimp Fried Rice','Shrimp Fried Rice','Main Course',4.60,NULL,true,18,360,true,false),
(v_restaurant_id,'Lo Mein Noodles','Lo Mein Noodles','Main Course',4.40,NULL,true,10,300,false,false),
(v_restaurant_id,'Great Wall Chocolate Cake','Great Wall Chocolate Cake','Dessert',2.20,NULL,true,12,520,true,false),
(v_restaurant_id,'Chicken Lettuce Wraps','Chicken Lettuce Wraps','Appetizer',3.40,NULL,true,8,360,false,false),
(v_restaurant_id,'Crispy Green Beans','Crispy Green Beans','Appetizer',2.20,NULL,true,18,620,false,false),
(v_restaurant_id,'Kung Pao Chicken','Kung Pao Chicken','Main Course',5.20,NULL,true,12,420,false,true),
(v_restaurant_id,'Mongolian Beef','Mongolian Beef','Main Course',6.10,NULL,true,18,520,false,false),
(v_restaurant_id,'Shrimp Fried Rice','Shrimp Fried Rice','Main Course',4.60,NULL,true,20,180,true,false),
(v_restaurant_id,'Lo Mein Noodles','Lo Mein Noodles','Main Course',4.40,NULL,true,20,720,false,false),
(v_restaurant_id,'Great Wall Chocolate Cake','Great Wall Chocolate Cake','Dessert',2.20,NULL,true,15,620,true,false),
(v_restaurant_id,'Chicken Lettuce Wraps','Chicken Lettuce Wraps','Appetizer',3.40,NULL,true,8,360,false,false),
(v_restaurant_id,'Crispy Green Beans','Crispy Green Beans','Appetizer',2.20,NULL,true,10,620,false,false),
(v_restaurant_id,'Kung Pao Chicken','Kung Pao Chicken','Main Course',5.20,NULL,true,20,180,false,true),
(v_restaurant_id,'Mongolian Beef','Mongolian Beef','Main Course',6.10,NULL,true,10,180,false,false),
(v_restaurant_id,'Shrimp Fried Rice','Shrimp Fried Rice','Main Course',4.60,NULL,true,10,220,true,false),
(v_restaurant_id,'Lo Mein Noodles','Lo Mein Noodles','Main Course',4.40,NULL,true,20,520,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 18) Hardee''s Bahrain — Fast Food
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Hardee''s Bahrain', 'Burgers, chicken sandwiches, and sides.', 'Fast Food',
  'Multiple branches, Bahrain', '+973 1700 1030', 'orders@hardees.bh',
  4.2, 8000, '25-35 min', 3.000, 0.800, true, true, '10:00:00', '02:00:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,12,300,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,8,300,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,8,520,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,12,420,false,false),
(v_restaurant_id,'Crispy Chicken Sandwich','Crispy Chicken Sandwich','Main Course',3.40,NULL,true,15,620,false,false),
(v_restaurant_id,'Chicken Nuggets (10 pcs)','Chicken Nuggets (10 pcs)','Side',2.80,NULL,true,20,420,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,10,620,true,false),
(v_restaurant_id,'Curly Fries','Curly Fries','Side',1.40,NULL,true,10,620,true,false),
(v_restaurant_id,'Onion Rings','Onion Rings','Side',1.50,NULL,true,12,720,true,false),
(v_restaurant_id,'Coleslaw','Coleslaw','Side',0.90,NULL,true,12,620,false,false),
(v_restaurant_id,'Chocolate Shake','Chocolate Shake','Beverage',1.60,NULL,true,18,220,true,false),
(v_restaurant_id,'Vanilla Shake','Vanilla Shake','Beverage',1.60,NULL,true,18,180,true,false),
(v_restaurant_id,'Classic Beef Burger','Classic Beef Burger','Main Course',3.20,NULL,true,8,260,false,false),
(v_restaurant_id,'Cheeseburger','Cheeseburger','Main Course',3.40,NULL,true,15,520,true,false),
(v_restaurant_id,'Double Cheeseburger','Double Cheeseburger','Main Course',4.20,NULL,true,12,260,true,false),
(v_restaurant_id,'Chicken Burger','Chicken Burger','Main Course',3.10,NULL,true,15,300,false,false),
(v_restaurant_id,'Crispy Chicken Sandwich','Crispy Chicken Sandwich','Main Course',3.40,NULL,true,8,520,false,false),
(v_restaurant_id,'Chicken Nuggets (10 pcs)','Chicken Nuggets (10 pcs)','Side',2.80,NULL,true,18,180,false,false),
(v_restaurant_id,'French Fries','French Fries','Side',1.20,NULL,true,18,360,true,false),
(v_restaurant_id,'Curly Fries','Curly Fries','Side',1.40,NULL,true,18,260,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 19) Costa Coffee Bahrain — Coffee
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'Costa Coffee Bahrain', 'Coffee drinks and snacks.', 'Coffee',
  'Multiple branches, Bahrain', '+973 1700 1031', 'orders@costa.bh',
  4.4, 6000, '25-35 min', 3.000, 0.600, true, true, '07:00:00', '23:59:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,20,620,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,18,520,true,false),
(v_restaurant_id,'Cappuccino','Cappuccino','Beverage',1.90,NULL,true,10,220,false,false),
(v_restaurant_id,'Iced Latte','Iced Latte','Beverage',1.90,NULL,true,12,180,true,false),
(v_restaurant_id,'Caramel Macchiato','Caramel Macchiato','Beverage',2.20,NULL,true,12,420,false,false),
(v_restaurant_id,'Mocha','Mocha','Beverage',2.20,NULL,true,15,260,true,false),
(v_restaurant_id,'Hot Chocolate','Hot Chocolate','Beverage',1.70,NULL,true,18,720,false,false),
(v_restaurant_id,'Blueberry Muffin','Blueberry Muffin','Dessert',1.10,NULL,true,12,300,true,false),
(v_restaurant_id,'Chocolate Croissant','Chocolate Croissant','Dessert',1.20,NULL,true,10,620,false,false),
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,18,620,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,12,420,true,false),
(v_restaurant_id,'Cappuccino','Cappuccino','Beverage',1.90,NULL,true,20,520,false,false),
(v_restaurant_id,'Iced Latte','Iced Latte','Beverage',1.90,NULL,true,12,220,true,false),
(v_restaurant_id,'Caramel Macchiato','Caramel Macchiato','Beverage',2.20,NULL,true,20,260,false,false),
(v_restaurant_id,'Mocha','Mocha','Beverage',2.20,NULL,true,20,300,true,false),
(v_restaurant_id,'Hot Chocolate','Hot Chocolate','Beverage',1.70,NULL,true,15,420,false,false),
(v_restaurant_id,'Blueberry Muffin','Blueberry Muffin','Dessert',1.10,NULL,true,15,220,true,false),
(v_restaurant_id,'Chocolate Croissant','Chocolate Croissant','Dessert',1.20,NULL,true,10,220,false,false),
(v_restaurant_id,'Caffè Americano','Caffè Americano','Beverage',1.50,NULL,true,8,520,false,false),
(v_restaurant_id,'Caffè Latte','Caffè Latte','Beverage',1.90,NULL,true,8,180,true,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);


-- 20) PizzaExpress Bahrain — Pizza
INSERT INTO restaurants (partner_id, name, description, category, address, phone, email,
  rating, total_reviews, avg_prep_time, min_order, delivery_fee, is_active, is_open, opening_time, closing_time, created_at, updated_at)
VALUES (
  NULL, 'PizzaExpress Bahrain', 'Hand‑stretched pizzas and sides.', 'Pizza',
  'Seef / Adliya, Bahrain', '+973 1700 1032', 'orders@pizzaexpress.bh',
  4.3, 4600, '25-35 min', 3.000, 0.800, true, true, '11:00:00', '23:59:00',
  NOW(), NOW()
) RETURNING id INTO v_restaurant_id;

INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy) VALUES
(v_restaurant_id,'Margherita Pizza','Margherita Pizza','Main Course',3.80,NULL,true,10,720,false,false),
(v_restaurant_id,'Pepperoni Pizza','Pepperoni Pizza','Main Course',4.20,NULL,true,18,180,false,false),
(v_restaurant_id,'Veggie Supreme','Veggie Supreme','Main Course',4.10,NULL,true,18,620,true,false),
(v_restaurant_id,'BBQ Chicken Pizza','BBQ Chicken Pizza','Main Course',4.50,NULL,true,10,180,false,false),
(v_restaurant_id,'Hawaiian Pizza','Hawaiian Pizza','Main Course',4.30,NULL,true,12,180,false,false),
(v_restaurant_id,'Cheesy Breadsticks','Cheesy Breadsticks','Side',1.60,NULL,true,18,420,false,false),
(v_restaurant_id,'Garlic Bread','Garlic Bread','Side',1.20,NULL,true,8,360,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Side',3.00,NULL,true,18,420,false,false),
(v_restaurant_id,'Lasagna','Lasagna','Main Course',4.50,NULL,true,12,720,false,false),
(v_restaurant_id,'Chicken Alfredo Pasta','Chicken Alfredo Pasta','Main Course',4.30,NULL,true,15,520,false,false),
(v_restaurant_id,'Chocolate Lava Cake','Chocolate Lava Cake','Dessert',2.00,NULL,true,12,180,true,false),
(v_restaurant_id,'Tiramisu','Tiramisu','Dessert',2.20,NULL,true,18,360,false,false),
(v_restaurant_id,'Margherita Pizza','Margherita Pizza','Main Course',3.80,NULL,true,8,300,false,false),
(v_restaurant_id,'Pepperoni Pizza','Pepperoni Pizza','Main Course',4.20,NULL,true,20,300,false,false),
(v_restaurant_id,'Veggie Supreme','Veggie Supreme','Main Course',4.10,NULL,true,18,520,true,false),
(v_restaurant_id,'BBQ Chicken Pizza','BBQ Chicken Pizza','Main Course',4.50,NULL,true,10,420,false,false),
(v_restaurant_id,'Hawaiian Pizza','Hawaiian Pizza','Main Course',4.30,NULL,true,20,360,false,false),
(v_restaurant_id,'Cheesy Breadsticks','Cheesy Breadsticks','Side',1.60,NULL,true,15,420,false,false),
(v_restaurant_id,'Garlic Bread','Garlic Bread','Side',1.20,NULL,true,20,420,false,false),
(v_restaurant_id,'Chicken Wings (8 pcs)','Chicken Wings (8 pcs)','Side',3.00,NULL,true,12,300,false,false);

WITH first_dishes AS (SELECT id FROM dishes WHERE restaurant_id = v_restaurant_id ORDER BY created_at ASC, id ASC LIMIT 3)
INSERT INTO dish_addons (dish_id, name, price, is_available)
SELECT id, addon, price, true FROM first_dishes, LATERAL (VALUES
  ('Extra Cheese', 0.400), ('Extra Sauce', 0.300), ('Make it Spicy', 0.000)
) AS v(addon, price);

END $$;
COMMIT;

-- ============================================
-- Image mapping: Wikimedia Special:FilePath (generic, stable)
-- ============================================

BEGIN;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cheeseburger%20%28sample%29.jpg' WHERE (LOWER(name) LIKE '%burger%' OR LOWER(name) LIKE '%whopper%' OR LOWER(name) LIKE '%big mac%' OR LOWER(name) LIKE '%royale%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Close-up%20burger%20and%20fries.jpg' WHERE ((LOWER(name) LIKE '%burger%fries%' OR LOWER(name) LIKE '%combo%' OR LOWER(name) LIKE '%meal%')) AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/French%20fries.jpg' WHERE (LOWER(name) LIKE '%fries%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20Sandwich.jpg' WHERE (LOWER(name) LIKE '%chicken%burger%' OR LOWER(name) LIKE '%chicken sandwich%' OR LOWER(name) LIKE '%zinger%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20nuggets.jpg' WHERE (LOWER(name) LIKE '%nugget%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20Shawarma%20Wrap%20-%20Lavash%202024-09-11.jpg' WHERE (LOWER(name) LIKE '%wrap%' OR LOWER(name) LIKE '%twister%' OR LOWER(name) LIKE '%shawarma%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Glass%20of%20Cola.jpg' WHERE (LOWER(name) LIKE '%cola%' OR LOWER(name) LIKE '%pepsi%' OR LOWER(name) LIKE '%7up%' OR LOWER(name) LIKE '%soft drink%' OR LOWER(name) LIKE '%soda%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Fresh%20orange%20juice.jpg' WHERE (LOWER(name) LIKE '%juice%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ice%20Cream%20Sundae%20%285684463407%29.jpg' WHERE (LOWER(category) = 'dessert' OR LOWER(name) LIKE '%ice cream%' OR LOWER(name) LIKE '%sundae%' OR LOWER(name) LIKE '%pie%' OR LOWER(name) LIKE '%cake%' OR LOWER(name) LIKE '%donut%' OR LOWER(name) LIKE '%doughnut%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Big%20salad%20bowl.jpg' WHERE (LOWER(category) = 'salad' OR LOWER(name) LIKE '%salad%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Balaleet_2019.jpg' WHERE (LOWER(name) LIKE '%balaleet%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Machboos.JPG' WHERE (LOWER(name) LIKE '%machboos%' OR LOWER(name) LIKE '%majboos%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Bahraini_Halwa_maker.jpg' WHERE (LOWER(name) LIKE '%halwa%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Falafel%20with%20hummus.jpg' WHERE (LOWER(name) LIKE '%falafel%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Hummus-2009.jpg' WHERE (LOWER(name) LIKE '%hummus%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Grilled%20fish.jpg' WHERE (LOWER(name) LIKE '%grilled%fish%' OR LOWER(name) LIKE '%hammour%' OR LOWER(name) LIKE '%fish%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Arabic%20coffee%20with%20dates.jpg' WHERE (LOWER(name) LIKE '%arabic%coffee%' OR LOWER(name) LIKE '%karak%' OR LOWER(name) LIKE '%chai%' OR LOWER(name) LIKE '%coffee%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Luqaimat.jpg' WHERE (LOWER(name) LIKE '%luqaimat%' OR LOWER(name) LIKE '%lugaimat%') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Shakshouka.jpg' WHERE (LOWER(name) LIKE '%shakshouka%' OR LOWER(category) = 'breakfast') AND image_url IS NULL;
UPDATE dishes SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Kebab.jpg' WHERE (LOWER(name) LIKE '%kebab%' OR LOWER(name) LIKE '%kofta%' OR LOWER(name) LIKE '%tawook%') AND image_url IS NULL;
COMMIT;