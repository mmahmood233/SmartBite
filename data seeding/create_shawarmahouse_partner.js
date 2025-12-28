/**
 * Create Shawarma House Partner Account - Local Shawarma Specialist
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createShawarmaHousePartner() {
  console.log('🌯 Creating Shawarma House Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'shawarmahouse@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Shawarma House Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'shawarmahouse@wajba.bh', full_name: 'Shawarma House Manager',
      phone: '+973 1783 3783', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Shawarma House', category: 'Arabic',
      description: 'Best shawarma in Bahrain! Fresh marinated meats, crispy fries inside, and authentic sauces. Quick, delicious, and affordable.',
      address: 'Exhibition Road, Building 88, Road 2020, Block 320, Hoora, Manama, Bahrain',
      latitude: 26.2150, longitude: 50.5820, phone: '+973 1783 3783', email: 'shawarmahouse@wajba.bh',
      rating: 4.5, total_reviews: 0, total_orders: 0, delivery_fee: 0.800, min_order: 3.000,
      avg_prep_time: '10-15 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Shawarma', description: 'Our specialty shawarmas', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Platters', description: 'Shawarma platters with rice', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Fries and sides', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const shawarmaCat = categories.find(c => c.name === 'Shawarma');
    const plattersCat = categories.find(c => c.name === 'Platters');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const beveragesCat = categories.find(c => c.name === 'Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: shawarmaCat.id, category: 'Main Course', name: 'Chicken Shawarma', 
        description: 'Marinated chicken shawarma with garlic sauce, pickles, and fries wrapped in Arabic bread. Our signature sandwich.', 
        image: null, image_url: null, price: 1.800, calories: 520, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: shawarmaCat.id, category: 'Main Course', name: 'Beef Shawarma', 
        description: 'Tender beef shawarma with tahini sauce, tomatoes, onions, and fries. Rich and flavorful.', 
        image: null, image_url: null, price: 2.000, calories: 580, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: shawarmaCat.id, category: 'Main Course', name: 'Mixed Shawarma', 
        description: 'Combination of chicken and beef shawarma with both sauces. Best of both worlds.', 
        image: null, image_url: null, price: 2.200, calories: 620, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: shawarmaCat.id, category: 'Main Course', name: 'Spicy Chicken Shawarma', 
        description: 'Chicken shawarma with spicy sauce and jalapeños. For those who like it hot!', 
        image: null, image_url: null, price: 1.900, calories: 540, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: plattersCat.id, category: 'Main Course', name: 'Chicken Shawarma Platter', 
        description: 'Sliced chicken shawarma served over rice with salad, pickles, and garlic sauce. Complete meal.', 
        image: null, image_url: null, price: 3.500, calories: 780, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: plattersCat.id, category: 'Main Course', name: 'Beef Shawarma Platter', 
        description: 'Sliced beef shawarma over rice with tahini, salad, and grilled vegetables.', 
        image: null, image_url: null, price: 4.000, calories: 850, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'French Fries', 
        description: 'Crispy golden fries. Perfect side for shawarma.', 
        image: null, image_url: null, price: 1.000, calories: 320, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Garlic Sauce Cup', 
        description: 'Extra garlic sauce for dipping. Creamy and garlicky.', 
        image: null, image_url: null, price: 0.500, calories: 120, preparation_time: 2, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Ayran', 
        description: 'Traditional yogurt drink. Refreshing and pairs perfectly with shawarma.', 
        image: null, image_url: null, price: 0.800, calories: 60, preparation_time: 2, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Coca-Cola', 
        description: 'Ice-cold Coca-Cola. Classic refreshment.', 
        image: null, image_url: null, price: 0.600, calories: 140, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Shawarma House Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: shawarmahouse@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createShawarmaHousePartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
