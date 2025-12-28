/**
 * Create Showaiter - Bahraini Halwa
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
  console.log('🇧🇭 Creating Showaiter Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'showaiter@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'showaiter@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Showaiter Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'showaiter@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'showaiter@wajba.bh', full_name: 'Showaiter Manager',
        phone: '+973 1777 8000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Showaiter', category: 'Bahraini',
      description: 'Authentic Bahraini halwa and traditional sweets. Famous halwa Bahraini, dates, and local delicacies.',
      address: 'Manama Souq, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1777 8000', email: 'showaiter@wajba.bh', rating: 4.9,
      total_reviews: 0, total_orders: 0, delivery_fee: 0.500, min_order: 1.000,
      avg_prep_time: '5-10 min', status: 'open', is_active: true,
      cuisine_types: ['Bahraini', 'Sweets', 'Traditional'], price_range: 'budget',
      ambiance: ['traditional', 'heritage'], dietary_options: ['vegetarian'],
      suitable_for: ['dessert', 'gift', 'souvenir'], features: ['authentic Bahraini'],
      signature_dishes: ['Halwa Bahraini', 'Dates with Halwa', 'Traditional Sweets Box']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Halwa', description: 'Bahraini halwa', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Dates', description: 'Premium dates', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Gift Boxes', description: 'Souvenir boxes', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Traditional drinks', display_order: 4, is_active: true }
    ]).select();

    const halwaCat = categories.find(c => c.name === 'Halwa');
    const datesCat = categories.find(c => c.name === 'Dates');
    const boxesCat = categories.find(c => c.name === 'Gift Boxes');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: halwaCat.id, category: 'Dessert', name: 'Halwa Bahraini (250g)', 
        description: 'Traditional Bahraini halwa with saffron and nuts. National sweet. Authentic recipe.', 
        price: 3.500, calories: 680, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: halwaCat.id, category: 'Dessert', name: 'Halwa Bahraini (500g)', 
        description: 'Half kilo of premium Bahraini halwa. Perfect for sharing. Traditional favorite.', 
        price: 6.500, calories: 1360, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: halwaCat.id, category: 'Dessert', name: 'Halwa with Pistachios', 
        description: 'Bahraini halwa topped with premium pistachios. Luxury version. Rich and nutty.', 
        price: 4.500, calories: 720, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: datesCat.id, category: 'Dessert', name: 'Premium Dates (250g)', 
        description: 'Fresh Bahraini dates. Sweet and natural. Healthy snack.', 
        price: 2.500, calories: 420, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['snack', 'dessert'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: datesCat.id, category: 'Dessert', name: 'Dates with Halwa', 
        description: 'Dates served with Bahraini halwa. Traditional pairing. Perfect combination.', 
        price: 4.000, calories: 620, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: datesCat.id, category: 'Dessert', name: 'Stuffed Dates (6 pcs)', 
        description: 'Dates stuffed with nuts and covered in chocolate. Gourmet treat. Delicious.', 
        price: 5.000, calories: 480, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: boxesCat.id, category: 'Dessert', name: 'Bahraini Sweets Box (Small)', 
        description: 'Assorted Bahraini sweets including halwa and dates. Perfect gift. Souvenir box.', 
        price: 8.000, calories: 1200, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: boxesCat.id, category: 'Dessert', name: 'Bahraini Sweets Box (Large)', 
        description: 'Large gift box with premium halwa, dates, and sweets. Luxury gift. Best presentation.', 
        price: 15.000, calories: 2400, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Arabic Coffee', 
        description: 'Traditional Bahraini coffee with cardamom. Perfect with halwa. Aromatic.', 
        price: 1.500, calories: 20, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Saffron Tea', 
        description: 'Traditional tea with saffron. Warm and soothing. Heritage drink.', 
        price: 2.000, calories: 30, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Showaiter created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
