/**
 * Create Manila Kitchen - Filipino Cuisine
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
  console.log('🇵🇭 Creating Manila Kitchen Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'manilakitchen@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'manilakitchen@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Manila Kitchen Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'manilakitchen@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'manilakitchen@wajba.bh', full_name: 'Manila Kitchen Manager',
        phone: '+973 1766 7000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Manila Kitchen', category: 'Filipino',
      description: 'Authentic Filipino home cooking. Adobo, pancit, lumpia, sisig. Traditional recipes.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1766 7000', email: 'manilakitchen@wajba.bh', rating: 4.5,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 1.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true,
      cuisine_types: ['Filipino', 'Asian'], price_range: 'budget',
      ambiance: ['casual', 'homestyle'], dietary_options: ['halal'],
      suitable_for: ['family', 'lunch', 'dinner'], features: ['authentic Filipino'],
      signature_dishes: ['Chicken Adobo', 'Pancit Canton', 'Lumpia Shanghai']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Main Dishes', description: 'Filipino mains', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Noodles', description: 'Pancit varieties', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Lumpia and starters', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true }
    ]).select();

    const mainCat = categories.find(c => c.name === 'Main Dishes');
    const noodlesCat = categories.find(c => c.name === 'Noodles');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Chicken Adobo', 
        description: 'Chicken in soy sauce, vinegar, garlic. National dish. Savory and tangy.', 
        price: 5.000, calories: 520, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Pork Sisig', 
        description: 'Sizzling pork with onions and chili. Crispy and spicy. Bar food favorite.', 
        price: 6.000, calories: 680, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: [] },
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Beef Caldereta', 
        description: 'Beef stew in tomato sauce. Rich and hearty. Comfort food.', 
        price: 6.500, calories: 720, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Chicken Tinola', 
        description: 'Ginger chicken soup with vegetables. Light and healthy. Traditional soup.', 
        price: 4.500, calories: 320, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'low-calorie'] },
      
      { restaurant_id: restaurant.id, category_id: noodlesCat.id, category: 'Main Course', name: 'Pancit Canton', 
        description: 'Stir-fried noodles with vegetables and meat. Filipino classic. Savory.', 
        price: 4.500, calories: 580, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: noodlesCat.id, category: 'Main Course', name: 'Pancit Bihon', 
        description: 'Rice noodles with chicken and vegetables. Light and tasty. Popular choice.', 
        price: 4.000, calories: 520, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Lumpia Shanghai (6 pcs)', 
        description: 'Crispy spring rolls with meat. Perfect appetizer. Crunchy.', 
        price: 3.500, calories: 420, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Vegetable Lumpia (6 pcs)', 
        description: 'Fresh vegetable spring rolls. Healthy option. Light.', 
        price: 3.000, calories: 320, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Calamansi Juice', 
        description: 'Filipino lime juice. Refreshing and tangy. Traditional drink.', 
        price: 2.000, calories: 80, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Mango Shake', 
        description: 'Fresh mango shake. Sweet and creamy. Tropical favorite.', 
        price: 2.500, calories: 220, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] }
    ]);

    console.log('✅ Manila Kitchen created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
