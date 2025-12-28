/**
 * Create Turkish Kebab House - Turkish Cuisine
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
  console.log('🥙 Creating Turkish Kebab House Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'turkishkebab@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'turkishkebab@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Turkish Kebab House Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'turkishkebab@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'turkishkebab@wajba.bh', full_name: 'Turkish Kebab House Manager',
        phone: '+973 1799 9000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Turkish Kebab House', category: 'Turkish',
      description: 'Authentic Turkish cuisine. Famous kebabs, pide, lahmacun, and mezze. Traditional Ottoman recipes.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1799 9000', email: 'turkishkebab@wajba.bh', rating: 4.5,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 1.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true,
      cuisine_types: ['Turkish', 'Mediterranean', 'Kebab'], price_range: 'mid-range',
      ambiance: ['traditional', 'family-friendly'], dietary_options: ['halal', 'vegetarian'],
      suitable_for: ['family', 'lunch', 'dinner'], features: ['authentic Turkish', 'charcoal grilled'],
      signature_dishes: ['Mixed Grill Platter', 'Adana Kebab', 'Turkish Pide']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Kebabs', description: 'Grilled kebabs', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pide & Pizza', description: 'Turkish flatbreads', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Mezze', description: 'Appetizers', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true }
    ]).select();

    const kebabCat = categories.find(c => c.name === 'Kebabs');
    const pideCat = categories.find(c => c.name === 'Pide & Pizza');
    const mezzeCat = categories.find(c => c.name === 'Mezze');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: kebabCat.id, category: 'Main Course', name: 'Adana Kebab', 
        description: 'Spicy minced meat kebab. Charcoal grilled. Signature Turkish dish.', 
        price: 5.500, calories: 520, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: kebabCat.id, category: 'Main Course', name: 'Chicken Shish Kebab', 
        description: 'Marinated chicken cubes grilled on skewer. Tender and juicy. Popular choice.', 
        price: 5.000, calories: 450, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: kebabCat.id, category: 'Main Course', name: 'Mixed Grill Platter', 
        description: 'Adana, chicken, lamb kebabs with rice and salad. Perfect for sharing. Best value.', 
        price: 9.000, calories: 980, preparation_time: 30, is_vegetarian: false, is_spicy: true, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: kebabCat.id, category: 'Main Course', name: 'Lamb Shish Kebab', 
        description: 'Tender lamb cubes grilled to perfection. Premium meat. Rich flavor.', 
        price: 7.000, calories: 580, preparation_time: 28, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: pideCat.id, category: 'Main Course', name: 'Turkish Pide with Cheese', 
        description: 'Boat-shaped flatbread with melted cheese. Turkish pizza. Crispy and cheesy.', 
        price: 4.000, calories: 520, preparation_time: 20, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: pideCat.id, category: 'Main Course', name: 'Mixed Meat Pide', 
        description: 'Pide with minced meat, cheese, and vegetables. Hearty and filling. Family favorite.', 
        price: 5.500, calories: 680, preparation_time: 22, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: pideCat.id, category: 'Main Course', name: 'Lahmacun', 
        description: 'Thin crispy flatbread with minced meat. Turkish style. Light and flavorful.', 
        price: 3.500, calories: 380, preparation_time: 15, is_vegetarian: false, is_spicy: true, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Hummus', 
        description: 'Creamy chickpea dip with olive oil. Classic mezze. Fresh and smooth.', 
        price: 2.000, calories: 180, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Baba Ganoush', 
        description: 'Smoky eggplant dip with tahini. Rich and creamy. Mediterranean classic.', 
        price: 2.500, calories: 200, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Turkish Salad', 
        description: 'Fresh tomatoes, cucumber, onion with olive oil. Light and refreshing. Perfect starter.', 
        price: 2.000, calories: 120, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'side'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'low-calorie'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Turkish Tea', 
        description: 'Traditional Turkish black tea. Strong and aromatic. Served in tulip glass.', 
        price: 1.000, calories: 20, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Ayran', 
        description: 'Salted yogurt drink. Refreshing and cooling. Perfect with kebabs.', 
        price: 1.500, calories: 80, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] }
    ]);

    console.log('✅ Turkish Kebab House created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
