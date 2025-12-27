/**
 * Create McDonald's Partner Account
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

async function createMcDonaldsPartner() {
  console.log('🍔 Creating McDonald\'s Partner Account...\n');

  try {
    // Step 1: Create auth user
    console.log('📧 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'mcdonalds@wajba.bh',
      password: '12345678',
      email_confirm: true,
      user_metadata: {
        full_name: 'McDonald\'s Manager'
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
        email: 'mcdonalds@wajba.bh',
        full_name: 'McDonald\'s Manager',
        phone: '+973 1772 2772',
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
        name: 'McDonald\'s',
        category: 'Fast Food',
        description: 'I\'m lovin\' it! World-famous burgers, fries, and more. Quality ingredients and quick service.',
        address: 'Seef Mall, Building 2255, Road 2832, Block 428, Seef, Manama, Bahrain',
        latitude: 26.2361,
        longitude: 50.5331,
        phone: '+973 1772 2772',
        email: 'mcdonalds@wajba.bh',
        rating: 4.6,
        total_reviews: 0,
        total_orders: 0,
        delivery_fee: 1.200,
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
        { restaurant_id: restaurant.id, name: 'Burgers', description: 'Our signature burgers', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Chicken & Fish', description: 'Chicken sandwiches and fish fillet', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Breakfast', description: 'Breakfast menu items', display_order: 3, is_active: true },
        { restaurant_id: restaurant.id, name: 'Sides & Snacks', description: 'Fries, nuggets, and more', display_order: 4, is_active: true },
        { restaurant_id: restaurant.id, name: 'Beverages', description: 'Soft drinks, coffee, and shakes', display_order: 5, is_active: true },
        { restaurant_id: restaurant.id, name: 'Desserts', description: 'Sweet treats and ice cream', display_order: 6, is_active: true }
      ])
      .select();

    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    // Step 5: Create dishes with complete data
    console.log('\n🍽️  Creating dishes...');
    
    const burgersCategory = categories.find(c => c.name === 'Burgers');
    const chickenCategory = categories.find(c => c.name === 'Chicken & Fish');
    const breakfastCategory = categories.find(c => c.name === 'Breakfast');
    const sidesCategory = categories.find(c => c.name === 'Sides & Snacks');
    const beveragesCategory = categories.find(c => c.name === 'Beverages');
    const dessertsCategory = categories.find(c => c.name === 'Desserts');

    const dishes = [
      // Burgers
      { 
        restaurant_id: restaurant.id, 
        category_id: burgersCategory.id, 
        category: 'Main Course', 
        name: 'Big Mac', 
        description: 'Two 100% beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun. The iconic McDonald\'s burger.', 
        image: null,
        image_url: null,
        price: 2.500, 
        calories: 550, 
        preparation_time: 8, 
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
        name: 'Quarter Pounder with Cheese', 
        description: 'Quarter pound of 100% beef, melted cheese, pickles, onions, ketchup, and mustard. A classic favorite.', 
        image: null,
        image_url: null,
        price: 2.800, 
        calories: 520, 
        preparation_time: 8, 
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
        name: 'McChicken', 
        description: 'Crispy chicken patty with lettuce and mayo on a soft bun. Simple and delicious.', 
        image: null,
        image_url: null,
        price: 1.900, 
        calories: 400, 
        preparation_time: 7, 
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
        name: 'Double Cheeseburger', 
        description: 'Two beef patties with double cheese, pickles, onions, ketchup, and mustard. Extra cheesy goodness.', 
        image: null,
        image_url: null,
        price: 2.200, 
        calories: 450, 
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
        name: 'Chicken McNuggets (6 pcs)', 
        description: 'Six pieces of tender chicken nuggets made with white meat. Perfect for dipping.', 
        image: null,
        image_url: null,
        price: 1.800, 
        calories: 280, 
        preparation_time: 5, 
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
        name: 'Filet-O-Fish', 
        description: 'Wild-caught fish fillet with tartar sauce and cheese on a soft bun. A seafood classic.', 
        image: null,
        image_url: null,
        price: 2.300, 
        calories: 390, 
        preparation_time: 8, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: false, 
        is_available: true 
      },

      // Breakfast
      { 
        restaurant_id: restaurant.id, 
        category_id: breakfastCategory.id, 
        category: 'Breakfast', 
        name: 'Egg McMuffin', 
        description: 'Freshly cracked egg, Canadian bacon, and melted cheese on a toasted English muffin. The perfect breakfast.', 
        image: null,
        image_url: null,
        price: 2.000, 
        calories: 300, 
        preparation_time: 6, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: breakfastCategory.id, 
        category: 'Breakfast', 
        name: 'Hotcakes with Syrup', 
        description: 'Three fluffy hotcakes with butter and maple syrup. A sweet morning treat.', 
        image: null,
        image_url: null,
        price: 1.700, 
        calories: 580, 
        preparation_time: 7, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: false, 
        is_available: true 
      },

      // Sides & Snacks
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCategory.id, 
        category: 'Side', 
        name: 'World Famous Fries (Medium)', 
        description: 'Golden, crispy French fries with just the right amount of salt. The perfect side.', 
        image: null,
        image_url: null,
        price: 0.900, 
        calories: 340, 
        preparation_time: 3, 
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
        name: 'Apple Slices', 
        description: 'Fresh apple slices. A healthy snack option.', 
        image: null,
        image_url: null,
        price: 0.800, 
        calories: 15, 
        preparation_time: 2, 
        is_vegetarian: true, 
        is_vegan: true, 
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
        description: 'Ice-cold Coca-Cola. Refreshing and fizzy.', 
        image: null,
        image_url: null,
        price: 0.600, 
        calories: 210, 
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
        name: 'McCafé Latte', 
        description: 'Smooth espresso with steamed milk. Made with 100% Arabica beans.', 
        image: null,
        image_url: null,
        price: 1.500, 
        calories: 150, 
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
        name: 'McFlurry Oreo', 
        description: 'Creamy soft serve with Oreo cookie pieces mixed in. A cool and crunchy treat.', 
        image: null,
        image_url: null,
        price: 1.400, 
        calories: 510, 
        preparation_time: 4, 
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
        name: 'Apple Pie', 
        description: 'Warm apple pie with a crispy crust. A classic dessert.', 
        image: null,
        image_url: null,
        price: 1.000, 
        calories: 230, 
        preparation_time: 3, 
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
    console.log('✅ McDonald\'s Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: mcdonalds@wajba.bh');
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

createMcDonaldsPartner()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
