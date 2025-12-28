/**
 * Create Hardee's Partner Account
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createHardeesPartner() {
  console.log('⭐ Creating Hardee\'s Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'hardees@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Hardee\'s Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'hardees@wajba.bh', full_name: 'Hardee\'s Manager',
      phone: '+973 1778 8778', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Hardee\'s', category: 'Fast Food',
      description: 'Charbroiled burgers and hand-breaded chicken. Premium fast food with bold flavors and quality ingredients.',
      address: 'Muharraq, Building 505, Road 1515, Block 215, Muharraq, Bahrain',
      latitude: 26.2572, longitude: 50.6118, phone: '+973 1778 8778', email: 'hardees@wajba.bh',
      rating: 4.3, total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 4.000,
      avg_prep_time: '15-20 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Burgers', description: 'Charbroiled burgers', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Chicken', description: 'Hand-breaded chicken', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Fries and sides', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Sweet treats', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const burgersCat = categories.find(c => c.name === 'Burgers');
    const chickenCat = categories.find(c => c.name === 'Chicken');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const beveragesCat = categories.find(c => c.name === 'Beverages');
    const dessertsCat = categories.find(c => c.name === 'Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Thickburger', 
        description: 'Charbroiled Angus beef patty with lettuce, tomato, onion, pickles, and mayo. Premium burger experience.', 
        image: null, image_url: null, price: 3.200, calories: 720, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Mushroom Swiss Burger', 
        description: 'Charbroiled beef with sautéed mushrooms and Swiss cheese. Rich and savory.', 
        image: null, image_url: null, price: 3.500, calories: 780, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Bacon Cheeseburger', 
        description: 'Charbroiled beef with crispy bacon, cheese, and all the fixings. Classic American burger.', 
        image: null, image_url: null, price: 3.300, calories: 820, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Hand-Breaded Chicken Tenders (5 pcs)', 
        description: 'Five pieces of hand-breaded chicken tenders. Crispy outside, tender inside.', 
        image: null, image_url: null, price: 3.800, calories: 580, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Spicy Chicken Sandwich', 
        description: 'Hand-breaded spicy chicken breast with lettuce and mayo. Hot and crispy.', 
        image: null, image_url: null, price: 2.800, calories: 560, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Natural Cut Fries (Medium)', 
        description: 'Skin-on natural cut fries with sea salt. Crispy and flavorful.', 
        image: null, image_url: null, price: 1.200, calories: 430, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Onion Rings', 
        description: 'Crispy breaded onion rings. Perfect side for burgers.', 
        image: null, image_url: null, price: 1.500, calories: 410, preparation_time: 6, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Coca-Cola', 
        description: 'Ice-cold Coca-Cola. Classic refreshment.', 
        image: null, image_url: null, price: 0.600, calories: 140, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCat.id, category: 'Dessert', name: 'Chocolate Chip Cookie', 
        description: 'Freshly baked chocolate chip cookie. Warm and gooey.', 
        image: null, image_url: null, price: 1.000, calories: 290, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Hardee\'s Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: hardees@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createHardeesPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
