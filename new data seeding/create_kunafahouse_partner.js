/**
 * Create Kunafa House - Arabic Sweets & Desserts
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
  console.log('🍰 Creating Kunafa House Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'kunafahouse@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'kunafahouse@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Kunafa House Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'kunafahouse@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'kunafahouse@wajba.bh', full_name: 'Kunafa House Manager',
        phone: '+973 1722 3000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Kunafa House', category: 'Desserts',
      description: 'Authentic Arabic sweets and desserts. Famous kunafa, baklava, maamoul, and traditional Middle Eastern sweets. Fresh daily.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1722 3000', email: 'kunafahouse@wajba.bh', rating: 4.8,
      total_reviews: 0, total_orders: 0, delivery_fee: 0.800, min_order: 1.000,
      avg_prep_time: '10-15 min', status: 'open', is_active: true,
      cuisine_types: ['Arabic', 'Desserts', 'Sweets'], price_range: 'budget',
      ambiance: ['traditional', 'sweet shop'], dietary_options: ['vegetarian'],
      suitable_for: ['dessert', 'gift', 'celebration'], features: ['fresh daily', 'traditional recipes'],
      signature_dishes: ['Kunafa with Cheese', 'Baklava Assortment', 'Arabic Sweets Box']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Kunafa', description: 'Kunafa varieties', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Baklava', description: 'Baklava types', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Arabic Sweets', description: 'Traditional sweets', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Boxes & Platters', description: 'Gift boxes', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();

    const kunafaCat = categories.find(c => c.name === 'Kunafa');
    const baklavaCat = categories.find(c => c.name === 'Baklava');
    const sweetsCat = categories.find(c => c.name === 'Arabic Sweets');
    const boxesCat = categories.find(c => c.name === 'Boxes & Platters');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: kunafaCat.id, category: 'Dessert', name: 'Kunafa with Cheese', 
        description: 'Traditional kunafa with sweet cheese and syrup. Signature dish. Crispy and sweet.', 
        price: 3.500, calories: 480, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: kunafaCat.id, category: 'Dessert', name: 'Kunafa with Cream', 
        description: 'Kunafa filled with fresh cream. Rich and indulgent. Popular choice.', 
        price: 4.000, calories: 520, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: kunafaCat.id, category: 'Dessert', name: 'Nutella Kunafa', 
        description: 'Modern twist with Nutella filling. Sweet and chocolatey. Trending item.', 
        price: 4.500, calories: 580, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: baklavaCat.id, category: 'Dessert', name: 'Pistachio Baklava', 
        description: 'Layers of phyllo with pistachio and honey. Classic Arabic sweet. Premium quality.', 
        price: 2.500, calories: 320, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: baklavaCat.id, category: 'Dessert', name: 'Walnut Baklava', 
        description: 'Baklava with walnuts and syrup. Rich and crunchy. Traditional favorite.', 
        price: 2.000, calories: 300, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: baklavaCat.id, category: 'Dessert', name: 'Mixed Baklava (6 pcs)', 
        description: 'Assorted baklava pieces. Perfect for sharing. Variety pack.', 
        price: 5.000, calories: 960, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: sweetsCat.id, category: 'Dessert', name: 'Maamoul (6 pcs)', 
        description: 'Date-filled cookies. Traditional Eid sweet. Melt-in-mouth texture.', 
        price: 3.000, calories: 420, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sweetsCat.id, category: 'Dessert', name: 'Basbousa', 
        description: 'Semolina cake soaked in syrup. Soft and sweet. Classic dessert.', 
        price: 2.500, calories: 380, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sweetsCat.id, category: 'Dessert', name: 'Qatayef (3 pcs)', 
        description: 'Stuffed pancakes with nuts or cream. Ramadan special. Sweet and delicious.', 
        price: 3.500, calories: 450, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sweetsCat.id, category: 'Dessert', name: 'Luqaimat (10 pcs)', 
        description: 'Sweet dumplings with date syrup. Crispy outside, soft inside. Traditional treat.', 
        price: 2.500, calories: 380, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: boxesCat.id, category: 'Dessert', name: 'Arabic Sweets Box (1 kg)', 
        description: 'Mixed Arabic sweets box. Perfect for gifts. Assorted varieties.', 
        price: 12.000, calories: 3200, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: boxesCat.id, category: 'Dessert', name: 'Baklava Platter (20 pcs)', 
        description: 'Large baklava platter for gatherings. Party size. Best value.', 
        price: 15.000, calories: 6400, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Arabic Coffee', 
        description: 'Traditional Arabic coffee with cardamom. Perfect with sweets. Aromatic.', 
        price: 1.500, calories: 20, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Mint Tea', 
        description: 'Fresh mint tea. Refreshing and soothing. Traditional pairing.', 
        price: 1.500, calories: 30, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Kunafa House created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
