/**
 * Create Tokyo Sushi - Japanese Sushi Restaurant
 * Fresh sushi and Japanese cuisine: BD 4-15
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const RESTAURANT_NAME = 'Tokyo Sushi';
const RESTAURANT_EMAIL = 'tokyosushi@wajba.bh';
const RESTAURANT_CATEGORY = 'Japanese';
const RESTAURANT_DESCRIPTION = 'Authentic Japanese sushi restaurant with fresh fish and traditional preparation. Expert sushi chefs, premium ingredients, and elegant presentation. Perfect for sushi lovers and Japanese cuisine enthusiasts.';
const RESTAURANT_ADDRESS = 'Seef District, Manama, Bahrain';
const RESTAURANT_LATITUDE = 26.2361;
const RESTAURANT_LONGITUDE = 50.5340;
const RESTAURANT_PHONE = '+973 1999 8888';
const RESTAURANT_RATING = 4.8;
const DELIVERY_FEE = 1.500;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '20-25 min';

async function createRestaurantPartner() {
  console.log(`🍣 Creating ${RESTAURANT_NAME} Partner Account...\n`);

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', RESTAURANT_EMAIL)
      .single();

    let userId;

    if (existingUser) {
      console.log('⚠️  User already exists:', existingUser.email);
      userId = existingUser.id;
      
      // Update role to partner if it's not already
      if (existingUser.role !== 'partner') {
        console.log('🔄 Updating role to partner...');
        await supabase
          .from('users')
          .update({ role: 'partner' })
          .eq('id', userId);
        console.log('✅ Role updated to partner');
      }
    } else {
      // Create new auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: RESTAURANT_EMAIL,
        password: '12345678',
        email_confirm: true,
        user_metadata: {
          full_name: `${RESTAURANT_NAME} Manager`
        }
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log('⚠️  Auth user already exists, fetching user...');
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
          if (listError) throw listError;
          const existingAuthUser = users.find(u => u.email === RESTAURANT_EMAIL);
          if (!existingAuthUser) throw new Error('Could not find existing auth user');
          userId = existingAuthUser.id;
          console.log('✅ Found existing auth user:', userId);
        } else {
          throw authError;
        }
      } else {
        console.log('✅ Auth user created:', authData.user.id);
        userId = authData.user.id;
      }

      // Create public user
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: RESTAURANT_EMAIL,
          full_name: `${RESTAURANT_NAME} Manager`,
          phone: RESTAURANT_PHONE,
          role: 'partner',
          is_active: true
        });

      if (userError) throw userError;
      console.log('✅ Public user created');
    }

    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        partner_id: userId,
        name: RESTAURANT_NAME,
        category: RESTAURANT_CATEGORY,
        description: RESTAURANT_DESCRIPTION,
        address: RESTAURANT_ADDRESS,
        latitude: RESTAURANT_LATITUDE,
        longitude: RESTAURANT_LONGITUDE,
        phone: RESTAURANT_PHONE,
        email: RESTAURANT_EMAIL,
        rating: RESTAURANT_RATING,
        total_reviews: 0,
        total_orders: 0,
        delivery_fee: DELIVERY_FEE,
        min_order: MIN_ORDER,
        avg_prep_time: AVG_PREP_TIME,
        status: 'open',
        is_active: true,
        cuisine_types: ['Japanese', 'Sushi', 'Asian'],
        price_range: 'mid-range',
        ambiance: ['modern', 'elegant', 'quiet'],
        dietary_options: ['halal', 'gluten-free'],
        suitable_for: ['date night', 'business', 'dinner'],
        features: ['fresh fish', 'expert chefs', 'authentic Japanese'],
        signature_dishes: ['Salmon Sashimi', 'California Roll', 'Dragon Roll']
      })
      .select()
      .single();

    if (restaurantError) throw restaurantError;
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories, error: categoryError } = await supabase
      .from('menu_categories')
      .insert([
        { restaurant_id: restaurant.id, name: 'Nigiri Sushi', description: 'Hand-pressed sushi', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Maki Rolls', description: 'Rolled sushi', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Sashimi', description: 'Fresh raw fish', display_order: 3, is_active: true },
        { restaurant_id: restaurant.id, name: 'Hot Dishes', description: 'Cooked Japanese dishes', display_order: 4, is_active: true },
      ])
      .select();

    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    const nigiriCat = categories.find(c => c.name === 'Nigiri Sushi');
    const makiCat = categories.find(c => c.name === 'Maki Rolls');
    const sashimiCat = categories.find(c => c.name === 'Sashimi');
    const hotCat = categories.find(c => c.name === 'Hot Dishes');

    const dishes = [
      // Nigiri Sushi
      { 
        restaurant_id: restaurant.id, 
        category_id: nigiriCat.id, 
        category: 'Main Course',
        name: 'Salmon Nigiri (2 pcs)', 
        description: 'Fresh salmon on pressed sushi rice. Buttery and delicate. Premium quality fish. Classic Japanese sushi.', 
        price: 4.500, 
        calories: 140, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood', 'high-protein'],
        flavor_profile: ['fresh', 'umami', 'delicate']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: nigiriCat.id, 
        category: 'Main Course',
        name: 'Tuna Nigiri (2 pcs)', 
        description: 'Fresh tuna on pressed sushi rice. Rich and meaty. High-quality tuna. Sushi lover favorite.', 
        price: 5.000, 
        calories: 120, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood', 'high-protein'],
        flavor_profile: ['fresh', 'umami', 'rich']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: nigiriCat.id, 
        category: 'Main Course',
        name: 'Shrimp Nigiri (2 pcs)', 
        description: 'Cooked shrimp on pressed sushi rice. Sweet and tender. Perfect for beginners. Light and refreshing.', 
        price: 4.000, 
        calories: 100, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood'],
        flavor_profile: ['sweet', 'fresh', 'delicate']
      },
      
      // Maki Rolls
      { 
        restaurant_id: restaurant.id, 
        category_id: makiCat.id, 
        category: 'Main Course',
        name: 'California Roll (8 pcs)', 
        description: 'Crab stick, avocado, cucumber rolled in rice and seaweed. Classic American-style sushi. Signature roll.', 
        price: 5.500, 
        calories: 320, 
        preparation_time: 15, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood'],
        flavor_profile: ['fresh', 'creamy', 'savory']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: makiCat.id, 
        category: 'Main Course',
        name: 'Spicy Tuna Roll (8 pcs)', 
        description: 'Spicy tuna with cucumber and chili sauce. Fiery and flavorful. For spice lovers. Popular choice.', 
        price: 6.500, 
        calories: 340, 
        preparation_time: 15, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: true, 
        spice_level: 3,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood', 'spicy'],
        flavor_profile: ['spicy', 'umami', 'fresh']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: makiCat.id, 
        category: 'Main Course',
        name: 'Dragon Roll (8 pcs)', 
        description: 'Shrimp tempura topped with avocado and eel sauce. Impressive presentation. Premium roll. Signature dish.', 
        price: 8.500, 
        calories: 420, 
        preparation_time: 18, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood'],
        flavor_profile: ['savory', 'sweet', 'umami']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: makiCat.id, 
        category: 'Main Course',
        name: 'Philadelphia Roll (8 pcs)', 
        description: 'Salmon, cream cheese, and cucumber. Creamy and rich. Popular fusion roll. Great for beginners.', 
        price: 6.000, 
        calories: 380, 
        preparation_time: 15, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood'],
        flavor_profile: ['creamy', 'fresh', 'rich']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: makiCat.id, 
        category: 'Main Course',
        name: 'Vegetable Roll (8 pcs)', 
        description: 'Cucumber, avocado, carrot, and lettuce. Fresh and healthy. Vegetarian option. Light and refreshing.', 
        price: 4.000, 
        calories: 220, 
        preparation_time: 12, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy'],
        flavor_profile: ['fresh', 'crisp']
      },
      
      // Sashimi
      { 
        restaurant_id: restaurant.id, 
        category_id: sashimiCat.id, 
        category: 'Main Course',
        name: 'Salmon Sashimi (6 pcs)', 
        description: 'Fresh salmon slices. Pure and simple. Premium quality. For sashimi purists. Signature dish.', 
        price: 7.000, 
        calories: 180, 
        preparation_time: 8, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood', 'high-protein', 'low-carb'],
        flavor_profile: ['fresh', 'buttery', 'delicate']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: sashimiCat.id, 
        category: 'Main Course',
        name: 'Tuna Sashimi (6 pcs)', 
        description: 'Fresh tuna slices. Rich and meaty. High-quality fish. Premium choice.', 
        price: 8.000, 
        calories: 160, 
        preparation_time: 8, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood', 'high-protein', 'low-carb'],
        flavor_profile: ['fresh', 'rich', 'umami']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: sashimiCat.id, 
        category: 'Main Course',
        name: 'Mixed Sashimi Platter (12 pcs)', 
        description: 'Assorted fresh fish slices - salmon, tuna, and white fish. Variety platter. Perfect for sharing. Premium selection.', 
        price: 12.000, 
        calories: 280, 
        preparation_time: 12, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood', 'high-protein', 'low-carb'],
        flavor_profile: ['fresh', 'varied', 'delicate']
      },
      
      // Hot Dishes
      { 
        restaurant_id: restaurant.id, 
        category_id: hotCat.id, 
        category: 'Main Course',
        name: 'Chicken Teriyaki', 
        description: 'Grilled chicken with sweet teriyaki sauce and vegetables. Served with rice. Japanese comfort food. Family favorite.', 
        price: 6.500, 
        calories: 520, 
        preparation_time: 20, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal'],
        flavor_profile: ['sweet', 'savory', 'grilled']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: hotCat.id, 
        category: 'Main Course',
        name: 'Shrimp Tempura (6 pcs)', 
        description: 'Lightly battered and fried shrimp. Crispy and delicious. Served with tempura sauce. Classic Japanese dish.', 
        price: 7.000, 
        calories: 380, 
        preparation_time: 15, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner', 'appetizer'],
        dietary_tags: ['halal', 'seafood'],
        flavor_profile: ['crispy', 'savory', 'light']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: hotCat.id, 
        category: 'Main Course',
        name: 'Beef Ramen', 
        description: 'Rich beef broth with noodles, tender beef slices, egg, and vegetables. Hearty and warming. Comfort food.', 
        price: 7.500, 
        calories: 620, 
        preparation_time: 18, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal'],
        flavor_profile: ['savory', 'rich', 'umami']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: hotCat.id, 
        category: 'Main Course',
        name: 'Edamame', 
        description: 'Steamed soybeans with sea salt. Healthy appetizer. Simple and delicious. Vegetarian friendly.', 
        price: 3.000, 
        calories: 120, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['appetizer', 'snack'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy', 'high-protein'],
        flavor_profile: ['fresh', 'salty']
      },
    ];

    const { error: dishError } = await supabase
      .from('dishes')
      .insert(dishes);

    if (dishError) throw dishError;
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${RESTAURANT_NAME} Partner Account Created Successfully!`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', RESTAURANT_EMAIL);
    console.log('🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId);
    console.log('🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length);
    console.log('🍣 Dishes:', dishes.length);
    console.log('💰 Price Range: BD 3.00 - BD 12.00');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createRestaurantPartner()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
