/**
 * Create KFC Partner Account using Supabase Admin API
 * This properly creates the auth user with correct password hashing
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

console.log('🔧 Supabase URL:', SUPABASE_URL);

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createKFCPartner() {
  console.log('🍗 Creating KFC Partner Account...\n');

  try {
    // Step 1: Create auth user with Supabase Admin API
    console.log('📧 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'kfc@wajba.bh',
      password: '12345678',
      email_confirm: true,
      user_metadata: {
        full_name: 'KFC Manager'
      }
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    // Step 2: Create user in public.users table
    console.log('\n👤 Creating public user record...');
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: 'kfc@wajba.bh',
        full_name: 'KFC Manager',
        phone: '+973 1771 1771',
        role: 'partner',
        is_active: true
      });

    if (userError) {
      console.error('❌ User error:', userError);
      return;
    }

    console.log('✅ Public user created');

    // Step 3: Create restaurant
    console.log('\n🏪 Creating restaurant...');
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        partner_id: userId,
        name: 'KFC',
        category: 'Fast Food',
        description: 'World-famous fried chicken and sides. Finger Lickin\' Good!',
        address: 'Building 123, Road 2407, Block 324, Juffair, Manama, Bahrain',
        latitude: 26.2235,
        longitude: 50.6089,
        phone: '+973 1771 1771',
        email: 'kfc@wajba.bh',
        rating: 4.5,
        total_reviews: 0,
        total_orders: 0,
        delivery_fee: 1.500,
        min_order: 5.000,
        avg_prep_time: '20-25 min',
        status: 'open',
        is_active: true
      })
      .select()
      .single();

    if (restaurantError) {
      console.error('❌ Restaurant error:', restaurantError);
      return;
    }

    console.log('✅ Restaurant created:', restaurant.id);

    // Step 4: Create menu categories
    console.log('\n📋 Creating menu categories...');
    const { data: categories, error: categoryError } = await supabase
      .from('menu_categories')
      .insert([
        { restaurant_id: restaurant.id, name: 'Chicken Meals', description: 'Our signature fried chicken meals', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Burgers & Sandwiches', description: 'Delicious burgers and sandwiches', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Sides', description: 'Perfect sides to complete your meal', display_order: 3, is_active: true },
        { restaurant_id: restaurant.id, name: 'Drinks', description: 'Refreshing beverages', display_order: 4, is_active: true },
        { restaurant_id: restaurant.id, name: 'Desserts', description: 'Sweet treats', display_order: 5, is_active: true }
      ])
      .select();

    if (categoryError) {
      console.error('❌ Category error:', categoryError);
      return;
    }

    console.log('✅ Categories created:', categories.length);

    // Step 5: Create dishes
    console.log('\n🍽️  Creating dishes...');
    
    const chickenCategory = categories.find(c => c.name === 'Chicken Meals');
    const burgersCategory = categories.find(c => c.name === 'Burgers & Sandwiches');
    const sidesCategory = categories.find(c => c.name === 'Sides');
    const drinksCategory = categories.find(c => c.name === 'Drinks');
    const dessertsCategory = categories.find(c => c.name === 'Desserts');

    const dishes = [
      // Chicken Meals - Complete data for AI analysis
      { 
        restaurant_id: restaurant.id, 
        category_id: chickenCategory.id, 
        category: 'Main Course', 
        name: 'Zinger Meal', 
        description: 'Crispy Zinger fillet with fries and drink. A spicy chicken sandwich meal with golden fries and refreshing beverage.', 
        image: null,
        image_url: null,
        price: 3.200, 
        calories: 850, 
        preparation_time: 15, 
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
        name: '3-Piece Chicken Meal', 
        description: 'Three pieces of Original Recipe chicken with fries and drink. Classic fried chicken with signature herbs and spices.', 
        image: null,
        image_url: null,
        price: 3.500, 
        calories: 920, 
        preparation_time: 15, 
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
        name: 'Hot Wings Meal', 
        description: '6 spicy hot wings with fries and drink. Fiery chicken wings with a kick, served with crispy fries.', 
        image: null,
        image_url: null,
        price: 2.900, 
        calories: 780, 
        preparation_time: 12, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: true, 
        is_popular: false, 
        is_available: true 
      },
      
      // Burgers & Sandwiches
      { 
        restaurant_id: restaurant.id, 
        category_id: burgersCategory.id, 
        category: 'Main Course', 
        name: 'Zinger Burger', 
        description: 'Crispy chicken fillet with lettuce and mayo. Spicy breaded chicken breast in a soft bun with fresh lettuce and creamy mayo.', 
        image: null,
        image_url: null,
        price: 2.200, 
        calories: 650, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: true, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: burgersCategory.id, 
        category: 'Main Course', 
        name: 'Twister Wrap', 
        description: 'Grilled chicken wrap with fresh vegetables. Tender grilled chicken wrapped in a soft tortilla with crisp lettuce, tomatoes, and special sauce.', 
        image: null,
        image_url: null,
        price: 2.500, 
        calories: 580, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      
      // Sides
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCategory.id, 
        category: 'Side', 
        name: 'Regular Fries', 
        description: 'Crispy golden fries. Classic French fries, perfectly salted and golden brown. Vegetarian and vegan friendly.', 
        image: null,
        image_url: null,
        price: 0.800, 
        calories: 320, 
        preparation_time: 5, 
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
        name: 'Coleslaw', 
        description: 'Fresh creamy coleslaw. Shredded cabbage and carrots in a tangy creamy dressing. Vegetarian option.', 
        image: null,
        image_url: null,
        price: 0.700, 
        calories: 150, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: false, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCategory.id, 
        category: 'Side', 
        name: 'Popcorn Chicken', 
        description: 'Bite-sized crispy chicken pieces. Small crunchy chicken bites, perfect for snacking or sharing.', 
        image: null,
        image_url: null,
        price: 1.500, 
        calories: 420, 
        preparation_time: 8, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      
      // Drinks
      { 
        restaurant_id: restaurant.id, 
        category_id: drinksCategory.id, 
        category: 'Beverage', 
        name: 'Pepsi Regular', 
        description: 'Chilled Pepsi. Ice-cold Pepsi cola, refreshing and fizzy. Vegetarian and vegan.', 
        image: null,
        image_url: null,
        price: 0.500, 
        calories: 150, 
        preparation_time: 2, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: drinksCategory.id, 
        category: 'Beverage', 
        name: 'Mountain Dew', 
        description: 'Refreshing Mountain Dew. Citrus-flavored carbonated soft drink with a bold taste. Vegetarian and vegan.', 
        image: null,
        image_url: null,
        price: 0.500, 
        calories: 170, 
        preparation_time: 2, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        is_popular: false, 
        is_available: true 
      },
      
      // Desserts
      { 
        restaurant_id: restaurant.id, 
        category_id: dessertsCategory.id, 
        category: 'Dessert', 
        name: 'Chocolate Chip Cookie', 
        description: 'Warm chocolate chip cookie. Freshly baked cookie with melted chocolate chips, soft and chewy. Vegetarian dessert option.', 
        image: null,
        image_url: null,
        price: 0.600, 
        calories: 280, 
        preparation_time: 5, 
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

    if (dishError) {
      console.error('❌ Dish error:', dishError);
      return;
    }

    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ KFC Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: kfc@wajba.bh');
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

// Run the script
createKFCPartner()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
