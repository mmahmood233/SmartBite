/**
 * Create Saffron Partner Account - Popular Indian/Asian Restaurant
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createSaffronPartner() {
  console.log('🍛 Creating Saffron Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'saffron@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Saffron Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'saffron@wajba.bh', full_name: 'Saffron Manager',
      phone: '+973 1787 7787', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Saffron', category: 'Indian',
      description: 'Authentic Indian cuisine with aromatic spices and traditional recipes. Tandoori specialties, curries, and biryanis. Popular with locals and expats.',
      address: 'Seef District, Building 555, Road 2929, Block 428, Seef, Manama, Bahrain',
      latitude: 26.2350, longitude: 50.5340, phone: '+973 1787 7787', email: 'saffron@wajba.bh',
      rating: 4.6, total_reviews: 0, total_orders: 0, delivery_fee: 1.500, min_order: 5.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Tandoori & Grills', description: 'Clay oven specialties', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Curries', description: 'Traditional Indian curries', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Biryani & Rice', description: 'Aromatic rice dishes', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Breads', description: 'Fresh naan and roti', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks and lassi', display_order: 5, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Indian sweets', display_order: 6, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const tandooriCat = categories.find(c => c.name === 'Tandoori & Grills');
    const curriesCat = categories.find(c => c.name === 'Curries');
    const biryaniCat = categories.find(c => c.name === 'Biryani & Rice');
    const breadsCat = categories.find(c => c.name === 'Breads');
    const beveragesCat = categories.find(c => c.name === 'Beverages');
    const dessertsCat = categories.find(c => c.name === 'Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: tandooriCat.id, category: 'Main Course', name: 'Chicken Tikka', 
        description: 'Marinated chicken pieces cooked in tandoor clay oven with aromatic spices. Served with mint chutney and onions.', 
        image: null, image_url: null, price: 4.500, calories: 380, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: tandooriCat.id, category: 'Main Course', name: 'Tandoori Chicken (Half)', 
        description: 'Half chicken marinated in yogurt and spices, grilled in tandoor. Smoky and flavorful.', 
        image: null, image_url: null, price: 5.000, calories: 520, preparation_time: 25, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: curriesCat.id, category: 'Main Course', name: 'Butter Chicken', 
        description: 'Tender chicken in creamy tomato-based sauce with butter and cream. Mild and rich curry.', 
        image: null, image_url: null, price: 4.800, calories: 620, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: curriesCat.id, category: 'Main Course', name: 'Lamb Rogan Josh', 
        description: 'Slow-cooked lamb curry with aromatic Kashmiri spices. Traditional North Indian dish.', 
        image: null, image_url: null, price: 5.500, calories: 680, preparation_time: 25, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: curriesCat.id, category: 'Main Course', name: 'Palak Paneer', 
        description: 'Cottage cheese cubes in creamy spinach gravy. Popular vegetarian curry.', 
        image: null, image_url: null, price: 4.200, calories: 420, preparation_time: 18, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: biryaniCat.id, category: 'Main Course', name: 'Chicken Biryani', 
        description: 'Fragrant basmati rice layered with spiced chicken, saffron, and fried onions. Served with raita.', 
        image: null, image_url: null, price: 5.200, calories: 720, preparation_time: 30, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: biryaniCat.id, category: 'Main Course', name: 'Vegetable Biryani', 
        description: 'Mixed vegetables with aromatic rice and spices. Vegetarian biryani option.', 
        image: null, image_url: null, price: 4.500, calories: 580, preparation_time: 25, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: breadsCat.id, category: 'Side', name: 'Butter Naan', 
        description: 'Soft leavened bread brushed with butter. Fresh from tandoor oven.', 
        image: null, image_url: null, price: 0.800, calories: 180, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: breadsCat.id, category: 'Side', name: 'Garlic Naan', 
        description: 'Naan topped with fresh garlic and cilantro. Aromatic and flavorful.', 
        image: null, image_url: null, price: 1.000, calories: 200, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Mango Lassi', 
        description: 'Sweet yogurt drink blended with fresh mango. Refreshing and cooling.', 
        image: null, image_url: null, price: 1.500, calories: 180, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Masala Chai', 
        description: 'Spiced Indian tea with milk. Aromatic and comforting.', 
        image: null, image_url: null, price: 1.000, calories: 100, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCat.id, category: 'Dessert', name: 'Gulab Jamun (2 pcs)', 
        description: 'Sweet milk dumplings soaked in rose-flavored syrup. Classic Indian dessert.', 
        image: null, image_url: null, price: 1.800, calories: 320, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Saffron Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: saffron@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createSaffronPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
