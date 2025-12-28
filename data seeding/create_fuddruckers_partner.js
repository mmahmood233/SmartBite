/**
 * Create Fuddruckers Partner Account - Premium Burgers
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createFuddruckersPartner() {
  console.log('🍔 Creating Fuddruckers Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'fuddruckers@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Fuddruckers Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'fuddruckers@wajba.bh', full_name: 'Fuddruckers Manager',
      phone: '+973 1784 4784', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Fuddruckers', category: 'Burgers',
      description: 'World\'s Greatest Hamburgers! Premium beef burgers, fresh-baked buns, and build-your-own toppings bar. Quality ingredients, family atmosphere.',
      address: 'Juffair, Building 777, Road 2626, Block 326, Juffair, Manama, Bahrain',
      latitude: 26.2200, longitude: 50.6050, phone: '+973 1784 4784', email: 'fuddruckers@wajba.bh',
      rating: 4.7, total_reviews: 0, total_orders: 0, delivery_fee: 1.300, min_order: 4.500,
      avg_prep_time: '18-22 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Premium Burgers', description: 'Fresh never frozen beef', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Chicken & Turkey', description: 'Grilled chicken options', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Fries and sides', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Shakes & Beverages', description: 'Milkshakes and drinks', display_order: 4, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const burgersCat = categories.find(c => c.name === 'Premium Burgers');
    const chickenCat = categories.find(c => c.name === 'Chicken & Turkey');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const shakesCat = categories.find(c => c.name === 'Shakes & Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: '1/2 lb Original Burger', 
        description: 'Half pound of premium beef on a fresh-baked bun. Build it your way with unlimited toppings. Our signature burger.', 
        image: null, image_url: null, price: 4.200, calories: 750, preparation_time: 15, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: '1/3 lb Original Burger', 
        description: 'Third pound of premium beef. Perfect size with all the flavor. Customize with free toppings.', 
        image: null, image_url: null, price: 3.500, calories: 520, preparation_time: 15, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Bacon Cheeseburger', 
        description: 'Premium beef with crispy bacon, melted cheese, and your choice of toppings. Classic combination.', 
        image: null, image_url: null, price: 4.500, calories: 850, preparation_time: 15, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Grilled Chicken Sandwich', 
        description: 'Marinated grilled chicken breast with lettuce, tomato, and mayo. Healthy and delicious option.', 
        image: null, image_url: null, price: 3.800, calories: 480, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Turkey Burger', 
        description: 'Lean ground turkey patty with all the fixings. Lower calorie alternative without sacrificing taste.', 
        image: null, image_url: null, price: 3.600, calories: 420, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Seasoned Fries', 
        description: 'Crispy fries with special seasoning. Perfect burger companion.', 
        image: null, image_url: null, price: 1.500, calories: 420, preparation_time: 6, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Onion Rings', 
        description: 'Thick-cut onion rings with crispy batter. Golden and delicious.', 
        image: null, image_url: null, price: 1.800, calories: 450, preparation_time: 7, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: shakesCat.id, category: 'Beverage', name: 'Chocolate Shake', 
        description: 'Rich chocolate milkshake made with real ice cream. Thick and creamy.', 
        image: null, image_url: null, price: 2.200, calories: 580, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: shakesCat.id, category: 'Beverage', name: 'Vanilla Shake', 
        description: 'Classic vanilla milkshake. Simple and delicious.', 
        image: null, image_url: null, price: 2.200, calories: 550, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Fuddruckers Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: fuddruckers@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createFuddruckersPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
