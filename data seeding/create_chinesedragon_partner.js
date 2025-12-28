/**
 * Create Chinese Dragon - Chinese Cuisine
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createRestaurantPartner() {
  console.log('🐉 Creating Chinese Dragon Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'chinesedragon@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'chinesedragon@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Chinese Dragon Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'chinesedragon@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'chinesedragon@wajba.bh', full_name: 'Chinese Dragon Manager',
        phone: '+973 1733 4000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Chinese Dragon', category: 'Chinese',
      description: 'Authentic Chinese cuisine. Fried rice, noodles, sweet & sour, dim sum. Traditional Cantonese and Szechuan flavors.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1733 4000', email: 'chinesedragon@wajba.bh', rating: 4.4,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 1.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true,
      cuisine_types: ['Chinese', 'Asian', 'Cantonese'], price_range: 'mid-range',
      ambiance: ['casual', 'family-friendly'], dietary_options: ['halal', 'vegetarian'],
      suitable_for: ['family', 'lunch', 'dinner'], features: ['authentic Chinese', 'wok-fried'],
      signature_dishes: ['Sweet & Sour Chicken', 'Chicken Fried Rice', 'Kung Pao Chicken']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Fried Rice', description: 'Rice dishes', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Noodles', description: 'Noodle dishes', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Main Dishes', description: 'Chicken, beef, seafood', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Dim Sum', description: 'Dumplings and buns', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();

    const riceCat = categories.find(c => c.name === 'Fried Rice');
    const noodlesCat = categories.find(c => c.name === 'Noodles');
    const mainCat = categories.find(c => c.name === 'Main Dishes');
    const dimSumCat = categories.find(c => c.name === 'Dim Sum');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course', name: 'Chicken Fried Rice', 
        description: 'Wok-fried rice with chicken and vegetables. Classic Chinese. Most popular.', 
        price: 4.500, calories: 580, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course', name: 'Shrimp Fried Rice', 
        description: 'Fried rice with shrimp and egg. Seafood favorite. Light and tasty.', 
        price: 5.500, calories: 620, preparation_time: 22, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course', name: 'Vegetable Fried Rice', 
        description: 'Fried rice with mixed vegetables. Vegetarian option. Healthy choice.', 
        price: 3.500, calories: 480, preparation_time: 18, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: noodlesCat.id, category: 'Main Course', name: 'Chicken Chow Mein', 
        description: 'Stir-fried noodles with chicken and vegetables. Classic noodle dish. Savory.', 
        price: 5.000, calories: 620, preparation_time: 22, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: noodlesCat.id, category: 'Main Course', name: 'Singapore Noodles', 
        description: 'Spicy curry noodles with shrimp and vegetables. Flavorful and spicy. Signature dish.', 
        price: 5.500, calories: 680, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood'] },
      
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Sweet & Sour Chicken', 
        description: 'Crispy chicken in sweet and sour sauce. Signature dish. Perfect balance.', 
        price: 6.000, calories: 720, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Kung Pao Chicken', 
        description: 'Spicy chicken with peanuts and vegetables. Szechuan classic. Hot and savory.', 
        price: 6.500, calories: 680, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 3, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Beef with Broccoli', 
        description: 'Tender beef with broccoli in oyster sauce. Healthy and delicious. Popular choice.', 
        price: 7.000, calories: 580, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'General Tso Chicken', 
        description: 'Crispy chicken in spicy-sweet sauce. American-Chinese favorite. Addictive flavor.', 
        price: 6.500, calories: 780, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: dimSumCat.id, category: 'Appetizer', name: 'Chicken Dumplings (6 pcs)', 
        description: 'Steamed chicken dumplings. Juicy and flavorful. Classic dim sum.', 
        price: 4.000, calories: 320, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: dimSumCat.id, category: 'Appetizer', name: 'Vegetable Spring Rolls (4 pcs)', 
        description: 'Crispy spring rolls with vegetables. Perfect starter. Crunchy.', 
        price: 3.000, calories: 280, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: dimSumCat.id, category: 'Appetizer', name: 'Pork Bao Buns (3 pcs)', 
        description: 'Steamed buns with BBQ pork filling. Soft and savory. Dim sum favorite.', 
        price: 4.500, calories: 420, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: [] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Chinese Tea', 
        description: 'Traditional Chinese tea. Hot and aromatic. Perfect with meal.', 
        price: 1.500, calories: 0, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Lychee Juice', 
        description: 'Sweet lychee juice. Refreshing and exotic. Asian favorite.', 
        price: 2.000, calories: 120, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Chinese Dragon created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
