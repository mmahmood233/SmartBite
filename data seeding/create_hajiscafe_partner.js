/**
 * Create Haji's Cafe Partner Account - Traditional Bahraini Cafe
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createHajisCafePartner() {
  console.log('☕ Creating Haji\'s Cafe Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'hajiscafe@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Haji\'s Cafe Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'hajiscafe@wajba.bh', full_name: 'Haji\'s Cafe Manager',
      phone: '+973 1785 5785', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Haji\'s Cafe', category: 'Cafe',
      description: 'Traditional Bahraini cafe serving authentic breakfast, fresh juices, and local favorites. Family-run since 1985. Taste of home.',
      address: 'Manama Souq, Building 45, Road 808, Block 302, Manama, Bahrain',
      latitude: 26.2250, longitude: 50.5800, phone: '+973 1785 5785', email: 'hajiscafe@wajba.bh',
      rating: 4.8, total_reviews: 0, total_orders: 0, delivery_fee: 0.800, min_order: 3.000,
      avg_prep_time: '15-20 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Breakfast', description: 'Traditional Bahraini breakfast', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches', description: 'Fresh sandwiches', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Fresh Juices', description: 'Freshly squeezed juices', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Hot Beverages', description: 'Tea and coffee', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sweets', description: 'Traditional sweets', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const breakfastCat = categories.find(c => c.name === 'Breakfast');
    const sandwichesCat = categories.find(c => c.name === 'Sandwiches');
    const juicesCat = categories.find(c => c.name === 'Fresh Juices');
    const hotBevCat = categories.find(c => c.name === 'Hot Beverages');
    const sweetsCat = categories.find(c => c.name === 'Sweets');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: breakfastCat.id, category: 'Breakfast', name: 'Balaleet', 
        description: 'Traditional Bahraini sweet vermicelli with eggs and saffron. A beloved breakfast dish passed through generations.', 
        image: null, image_url: null, price: 2.500, calories: 420, preparation_time: 15, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: breakfastCat.id, category: 'Breakfast', name: 'Chebab (Bahraini Pancakes)', 
        description: 'Traditional Bahraini pancakes with date syrup and cheese. Sweet and savory breakfast favorite.', 
        image: null, image_url: null, price: 2.200, calories: 380, preparation_time: 12, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: breakfastCat.id, category: 'Breakfast', name: 'Foul Medames', 
        description: 'Slow-cooked fava beans with olive oil, lemon, and spices. Served with Arabic bread. Healthy and filling.', 
        image: null, image_url: null, price: 1.800, calories: 280, preparation_time: 10, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: breakfastCat.id, category: 'Breakfast', name: 'Egg & Cheese Paratha', 
        description: 'Flaky paratha bread with scrambled eggs and melted cheese. Quick and satisfying breakfast.', 
        image: null, image_url: null, price: 1.500, calories: 350, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: sandwichesCat.id, category: 'Main Course', name: 'Halloumi Sandwich', 
        description: 'Grilled halloumi cheese with tomatoes, cucumber, and mint in Arabic bread. Vegetarian delight.', 
        image: null, image_url: null, price: 2.000, calories: 380, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sandwichesCat.id, category: 'Main Course', name: 'Labneh & Zaatar Sandwich', 
        description: 'Creamy labneh with zaatar, olive oil, and fresh vegetables. Light and refreshing.', 
        image: null, image_url: null, price: 1.500, calories: 250, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: juicesCat.id, category: 'Beverage', name: 'Fresh Orange Juice', 
        description: 'Freshly squeezed orange juice. No sugar added, pure and natural.', 
        image: null, image_url: null, price: 1.500, calories: 110, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: juicesCat.id, category: 'Beverage', name: 'Lemon Mint Juice', 
        description: 'Fresh lemon juice with mint leaves. Refreshing and revitalizing.', 
        image: null, image_url: null, price: 1.200, calories: 80, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: juicesCat.id, category: 'Beverage', name: 'Avocado Juice', 
        description: 'Creamy avocado blended with milk and honey. Rich and nutritious.', 
        image: null, image_url: null, price: 2.000, calories: 320, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: hotBevCat.id, category: 'Beverage', name: 'Karak Chai', 
        description: 'Traditional spiced tea with milk. The perfect morning drink. Aromatic and comforting.', 
        image: null, image_url: null, price: 0.800, calories: 120, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: hotBevCat.id, category: 'Beverage', name: 'Arabic Coffee', 
        description: 'Traditional Arabic coffee with cardamom. Served with dates. Cultural experience.', 
        image: null, image_url: null, price: 1.000, calories: 20, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sweetsCat.id, category: 'Dessert', name: 'Luqaimat', 
        description: 'Traditional Bahraini sweet dumplings drizzled with date syrup. Crispy outside, soft inside.', 
        image: null, image_url: null, price: 1.800, calories: 320, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sweetsCat.id, category: 'Dessert', name: 'Halwa', 
        description: 'Traditional Bahraini halwa with saffron and nuts. Sweet and aromatic.', 
        image: null, image_url: null, price: 2.000, calories: 280, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Haji\'s Cafe Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: hajiscafe@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createHajisCafePartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
