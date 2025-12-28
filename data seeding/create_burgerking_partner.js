/**
 * Create Burger King Partner Account
 * Complete data for AI analysis and recommendations
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

console.log('🔧 Supabase URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createBurgerKingPartner() {
  console.log('👑 Creating Burger King Partner Account...\n');

  try {
    // Step 1: Create auth user
    console.log('📧 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'burgerking@wajba.bh',
      password: '12345678',
      email_confirm: true,
      user_metadata: {
        full_name: 'Burger King Manager'
      }
    });

    if (authError) throw authError;
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    // Step 2: Create public user
    console.log('\n👤 Creating public user record...');
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: 'burgerking@wajba.bh',
        full_name: 'Burger King Manager',
        phone: '+973 1773 3773',
        role: 'partner',
        is_active: true
      });

    if (userError) throw userError;
    console.log('✅ Public user created');

    // Step 3: Create restaurant
    console.log('\n🏪 Creating restaurant...');
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        partner_id: userId,
        name: 'Burger King',
        category: 'Fast Food',
        description: 'Have it your way! Flame-grilled burgers, crispy fries, and signature Whoppers. Quality fast food with bold flavors.',
        address: 'City Centre Bahrain, Building 10, Road 4626, Block 346, Seef, Manama, Bahrain',
        latitude: 26.2346,
        longitude: 50.5328,
        phone: '+973 1773 3773',
        email: 'burgerking@wajba.bh',
        rating: 4.4,
        total_reviews: 0,
        total_orders: 0,
        delivery_fee: 1.300,
        min_order: 4.000,
        avg_prep_time: '15-20 min',
        status: 'open',
        is_active: true
      })
      .select()
      .single();

    if (restaurantError) throw restaurantError;
    console.log('✅ Restaurant created:', restaurant.id);

    // Step 4: Create menu categories
    console.log('\n📋 Creating menu categories...');
    const { data: categories, error: categoryError } = await supabase
      .from('menu_categories')
      .insert([
        { restaurant_id: restaurant.id, name: 'Flame-Grilled Burgers', description: 'Our signature flame-grilled burgers', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Chicken & Fish', description: 'Crispy chicken and fish sandwiches', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Sides', description: 'Fries, onion rings, and more', display_order: 3, is_active: true },
        { restaurant_id: restaurant.id, name: 'Beverages', description: 'Soft drinks and shakes', display_order: 4, is_active: true },
        { restaurant_id: restaurant.id, name: 'Desserts', description: 'Sweet treats', display_order: 5, is_active: true }
      ])
      .select();

    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    // Step 5: Create dishes
    console.log('\n🍽️  Creating dishes...');
    
    const burgersCategory = categories.find(c => c.name === 'Flame-Grilled Burgers');
    const chickenCategory = categories.find(c => c.name === 'Chicken & Fish');
    const sidesCategory = categories.find(c => c.name === 'Sides');
    const beveragesCategory = categories.find(c => c.name === 'Beverages');
    const dessertsCategory = categories.find(c => c.name === 'Desserts');

    const dishes = [
      // Burgers
      { 
        restaurant_id: restaurant.id, 
        category_id: burgersCategory.id, 
        category: 'Main Course', 
        name: 'Whopper', 
        description: 'Our signature flame-grilled beef patty with tomatoes, lettuce, mayo, ketchup, pickles, and onions on a sesame seed bun. The king of burgers.', 
        image: null,
        image_url: null,
        price: 2.600, 
        calories: 660, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: burgersCategory.id, 
        category: 'Main Course', 
        name: 'Double Whopper', 
        description: 'Two flame-grilled beef patties with all the Whopper toppings. Double the beef, double the flavor.', 
        image: null,
        image_url: null,
        price: 3.500, 
        calories: 900, 
        preparation_time: 12, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: burgersCategory.id, 
        category: 'Main Course', 
        name: 'Bacon King', 
        description: 'Two flame-grilled beef patties, thick-cut smoked bacon, melted cheese, ketchup, and mayo. A bacon lover\'s dream.', 
        image: null,
        image_url: null,
        price: 3.800, 
        calories: 1040, 
        preparation_time: 12, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: burgersCategory.id, 
        category: 'Main Course', 
        name: 'Cheeseburger', 
        description: 'Flame-grilled beef patty with melted cheese, pickles, ketchup, and mustard. Simple and satisfying.', 
        image: null,
        image_url: null,
        price: 1.800, 
        calories: 290, 
        preparation_time: 8, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: false, 
        is_available: true 
      },

      // Chicken & Fish
      { 
        restaurant_id: restaurant.id, 
        category_id: chickenCategory.id, 
        category: 'Main Course', 
        name: 'Chicken Royale', 
        description: 'Crispy chicken breast fillet with lettuce and mayo on a sesame seed bun. Crunchy and delicious.', 
        image: null,
        image_url: null,
        price: 2.300, 
        calories: 670, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: chickenCategory.id, 
        category: 'Main Course', 
        name: 'Spicy Chicken Royale', 
        description: 'Crispy spicy chicken breast with lettuce and spicy mayo. For those who like it hot.', 
        image: null,
        image_url: null,
        price: 2.400, 
        calories: 700, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: true, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: chickenCategory.id, 
        category: 'Main Course', 
        name: 'Chicken Nuggets (9 pcs)', 
        description: 'Nine pieces of golden crispy chicken nuggets. Perfect for sharing or snacking.', 
        image: null,
        image_url: null,
        price: 2.000, 
        calories: 420, 
        preparation_time: 6, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: false, 
        is_available: true 
      },

      // Sides
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCategory.id, 
        category: 'Side', 
        name: 'French Fries (Medium)', 
        description: 'Golden crispy fries, lightly salted. The perfect companion to any burger.', 
        image: null,
        image_url: null,
        price: 0.900, 
        calories: 380, 
        preparation_time: 4, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCategory.id, 
        category: 'Side', 
        name: 'Onion Rings (Medium)', 
        description: 'Crispy golden onion rings with a crunchy coating. A BK favorite.', 
        image: null,
        image_url: null,
        price: 1.200, 
        calories: 410, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCategory.id, 
        category: 'Side', 
        name: 'Mozzarella Sticks (4 pcs)', 
        description: 'Four pieces of breaded mozzarella cheese sticks. Crispy outside, melted inside.', 
        image: null,
        image_url: null,
        price: 1.500, 
        calories: 290, 
        preparation_time: 6, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: false, 
        is_available: true 
      },

      // Beverages
      { 
        restaurant_id: restaurant.id, 
        category_id: beveragesCategory.id, 
        category: 'Beverage', 
        name: 'Coca-Cola (Medium)', 
        description: 'Ice-cold Coca-Cola. Refreshing and classic.', 
        image: null,
        image_url: null,
        price: 0.600, 
        calories: 220, 
        preparation_time: 2, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: beveragesCategory.id, 
        category: 'Beverage', 
        name: 'Chocolate Shake', 
        description: 'Thick and creamy chocolate milkshake. Rich and indulgent.', 
        image: null,
        image_url: null,
        price: 1.600, 
        calories: 580, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },

      // Desserts
      { 
        restaurant_id: restaurant.id, 
        category_id: dessertsCategory.id, 
        category: 'Dessert', 
        name: 'Hershey\'s Sundae Pie', 
        description: 'Creamy chocolate pie with Hershey\'s chocolate. A sweet ending to your meal.', 
        image: null,
        image_url: null,
        price: 1.300, 
        calories: 310, 
        preparation_time: 3, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: dessertsCategory.id, 
        category: 'Dessert', 
        name: 'Apple Turnover', 
        description: 'Warm apple-filled pastry with a flaky crust. Sweet and satisfying.', 
        image: null,
        image_url: null,
        price: 1.100, 
        calories: 270, 
        preparation_time: 4, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: false, 
        is_available: true 
      }
    ];

    const { error: dishError } = await supabase
      .from('dishes')
      .insert(dishes);

    if (dishError) throw dishError;
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Burger King Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: burgerking@wajba.bh');
    console.log('🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId);
    console.log('🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length);
    console.log('🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createBurgerKingPartner()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
