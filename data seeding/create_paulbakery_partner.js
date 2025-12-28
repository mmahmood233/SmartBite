/**
 * Create Paul Bakery - French Bakery & Cafe
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
  console.log('🥐 Creating Paul Bakery Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'paulbakery@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'paulbakery@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Paul Bakery Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'paulbakery@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'paulbakery@wajba.bh', full_name: 'Paul Bakery Manager',
        phone: '+973 1700 3000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Paul Bakery', category: 'Bakery',
      description: 'French bakery and cafe. Fresh croissants, baguettes, pastries, sandwiches. Artisan bread baked daily. Parisian atmosphere.',
      address: 'City Centre Bahrain, Manama', latitude: 26.2361, longitude: 50.5340,
      phone: '+973 1700 3000', email: 'paulbakery@wajba.bh', rating: 4.7,
      total_reviews: 0, total_orders: 0, delivery_fee: 0.800, min_order: 1.000,
      avg_prep_time: '10-15 min', status: 'open', is_active: true,
      cuisine_types: ['French', 'Bakery', 'Cafe'], price_range: 'mid-range',
      ambiance: ['cozy', 'European', 'cafe'], dietary_options: ['vegetarian'],
      suitable_for: ['breakfast', 'brunch', 'coffee', 'snack'], features: ['fresh daily', 'artisan bread'],
      signature_dishes: ['Butter Croissant', 'Pain au Chocolat', 'Baguette']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Viennoiserie', description: 'Croissants and pastries', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Bread', description: 'Fresh bread', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches', description: 'French sandwiches', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pastries', description: 'Sweet pastries', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Coffee and drinks', display_order: 5, is_active: true }
    ]).select();

    const viennoiserieCat = categories.find(c => c.name === 'Viennoiserie');
    const breadCat = categories.find(c => c.name === 'Bread');
    const sandwichCat = categories.find(c => c.name === 'Sandwiches');
    const pastryCat = categories.find(c => c.name === 'Pastries');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: viennoiserieCat.id, category: 'Bakery', name: 'Butter Croissant', 
        description: 'Classic French butter croissant. Flaky and buttery. Baked fresh daily. Signature item.', 
        price: 2.000, calories: 280, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: viennoiserieCat.id, category: 'Bakery', name: 'Pain au Chocolat', 
        description: 'Croissant with chocolate. Sweet and flaky. French classic. Morning favorite.', 
        price: 2.500, calories: 320, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: viennoiserieCat.id, category: 'Bakery', name: 'Almond Croissant', 
        description: 'Croissant filled with almond cream. Rich and nutty. Indulgent. Popular choice.', 
        price: 3.000, calories: 380, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: breadCat.id, category: 'Bakery', name: 'French Baguette', 
        description: 'Traditional French baguette. Crusty outside, soft inside. Baked fresh. Authentic.', 
        price: 2.500, calories: 320, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'lunch'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: breadCat.id, category: 'Bakery', name: 'Sourdough Loaf', 
        description: 'Artisan sourdough bread. Tangy flavor. Long fermentation. Premium bread.', 
        price: 4.000, calories: 480, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'lunch'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich', name: 'Jambon Beurre', 
        description: 'Ham and butter on baguette. Classic French sandwich. Simple perfection. Parisian favorite.', 
        price: 4.500, calories: 420, preparation_time: 10, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich', name: 'Chicken Baguette', 
        description: 'Grilled chicken with lettuce and mayo on baguette. Fresh and satisfying. Popular lunch.', 
        price: 5.000, calories: 480, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich', name: 'Cheese & Tomato Panini', 
        description: 'Grilled panini with cheese and tomato. Warm and melty. Vegetarian option. Comfort food.', 
        price: 4.000, calories: 380, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: pastryCat.id, category: 'Dessert', name: 'Éclair', 
        description: 'Chocolate éclair with cream filling. Classic French pastry. Elegant. Sweet treat.', 
        price: 3.500, calories: 320, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: pastryCat.id, category: 'Dessert', name: 'Fruit Tart', 
        description: 'Fresh fruit tart with custard. Beautiful and delicious. Seasonal fruits. Light dessert.', 
        price: 4.000, calories: 280, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Espresso', 
        description: 'Strong Italian espresso. Bold and rich. Perfect morning kick.', 
        price: 2.000, calories: 5, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Café au Lait', 
        description: 'French coffee with steamed milk. Smooth and creamy. Classic pairing.', 
        price: 3.000, calories: 120, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] }
    ]);

    console.log('✅ Paul Bakery created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
