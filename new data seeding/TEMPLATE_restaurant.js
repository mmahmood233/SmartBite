/**
 * TEMPLATE: Create Restaurant Partner Account
 * Copy this file and customize for each restaurant
 * 
 * INSTRUCTIONS:
 * 1. Copy this file and rename it (e.g., create_subway_partner.js)
 * 2. Replace ALL_CAPS placeholders with actual data
 * 3. Customize dishes array with real menu items
 * 4. Run: node create_RESTAURANT_partner.js
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

// ========================================
// CUSTOMIZE THESE VALUES
// ========================================
const RESTAURANT_NAME = 'RESTAURANT_NAME'; // e.g., 'Subway'
const RESTAURANT_EMAIL = 'RESTAURANT_EMAIL@wajba.bh'; // e.g., 'subway@wajba.bh'
const RESTAURANT_CATEGORY = 'CATEGORY'; // e.g., 'Fast Food', 'Pizza', 'Arabic'
const RESTAURANT_DESCRIPTION = 'DESCRIPTION'; // Detailed description
const RESTAURANT_ADDRESS = 'ADDRESS'; // Full address in Bahrain
const RESTAURANT_LATITUDE = 26.2235; // GPS coordinates
const RESTAURANT_LONGITUDE = 50.6089;
const RESTAURANT_PHONE = '+973 1XXX XXXX';
const RESTAURANT_RATING = 4.5;
const DELIVERY_FEE = 1.500;
const MIN_ORDER = 4.000;
const AVG_PREP_TIME = '15-20 min';

async function createRestaurantPartner() {
  console.log(`🍽️  Creating ${RESTAURANT_NAME} Partner Account...\n`);

  try {
    // Step 1: Create auth user
    console.log('📧 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: RESTAURANT_EMAIL,
      password: '12345678',
      email_confirm: true,
      user_metadata: {
        full_name: `${RESTAURANT_NAME} Manager`
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
        email: RESTAURANT_EMAIL,
        full_name: `${RESTAURANT_NAME} Manager`,
        phone: RESTAURANT_PHONE,
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
        is_active: true
      })
      .select()
      .single();

    if (restaurantError) throw restaurantError;
    console.log('✅ Restaurant created:', restaurant.id);

    // Step 4: Create menu categories
    console.log('\n📋 Creating menu categories...');
    
    // CUSTOMIZE CATEGORIES HERE
    const { data: categories, error: categoryError } = await supabase
      .from('menu_categories')
      .insert([
        { restaurant_id: restaurant.id, name: 'Category 1', description: 'Description', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Category 2', description: 'Description', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Category 3', description: 'Description', display_order: 3, is_active: true },
      ])
      .select();

    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    // Step 5: Create dishes
    console.log('\n🍽️  Creating dishes...');
    
    const category1 = categories.find(c => c.name === 'Category 1');
    const category2 = categories.find(c => c.name === 'Category 2');
    const category3 = categories.find(c => c.name === 'Category 3');

    // CUSTOMIZE DISHES HERE - Add all menu items with complete data
    const dishes = [
      { 
        restaurant_id: restaurant.id, 
        category_id: category1.id, 
        category: 'Main Course', // or 'Side', 'Beverage', 'Dessert', 'Breakfast', 'Appetizer'
        name: 'Dish Name', 
        description: 'Detailed description for AI. Include ingredients, taste, preparation method.', 
        image: null,
        image_url: null,
        price: 2.500, 
        calories: 500, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        is_popular: true, 
        is_available: true 
      },
      // Add more dishes...
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
    console.log('🍽️  Dishes:', dishes.length);
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
