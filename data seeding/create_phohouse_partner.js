/**
 * Create Pho House - Vietnamese Cuisine
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
  console.log('🍜 Creating Pho House Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'phohouse@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'phohouse@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Pho House Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'phohouse@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'phohouse@wajba.bh', full_name: 'Pho House Manager',
        phone: '+973 1711 3000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Pho House', category: 'Vietnamese',
      description: 'Authentic Vietnamese cuisine. Pho noodle soup, banh mi, spring rolls. Fresh herbs and aromatic broth.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1711 3000', email: 'phohouse@wajba.bh', rating: 4.5,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 1.000,
      avg_prep_time: '20-25 min', status: 'open', is_active: true,
      cuisine_types: ['Vietnamese', 'Asian'], price_range: 'budget',
      ambiance: ['casual', 'fresh'], dietary_options: ['halal', 'vegetarian'],
      suitable_for: ['lunch', 'dinner'], features: ['fresh herbs', 'aromatic broth'],
      signature_dishes: ['Pho Bo', 'Banh Mi', 'Fresh Spring Rolls']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Pho', description: 'Vietnamese noodle soup', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Banh Mi', description: 'Vietnamese sandwiches', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Spring rolls and starters', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Vietnamese drinks', display_order: 4, is_active: true }
    ]).select();

    const phoCat = categories.find(c => c.name === 'Pho');
    const banhMiCat = categories.find(c => c.name === 'Banh Mi');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: phoCat.id, category: 'Main Course', name: 'Pho Bo (Beef)', 
        description: 'Traditional beef noodle soup with aromatic broth. National dish. Signature pho.', 
        price: 5.500, calories: 480, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: phoCat.id, category: 'Main Course', name: 'Pho Ga (Chicken)', 
        description: 'Chicken noodle soup with fresh herbs. Light and healthy. Popular choice.', 
        price: 5.000, calories: 420, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'low-calorie'] },
      { restaurant_id: restaurant.id, category_id: phoCat.id, category: 'Main Course', name: 'Vegetarian Pho', 
        description: 'Vegetable noodle soup with tofu. Vegan-friendly. Healthy option.', 
        price: 4.500, calories: 380, preparation_time: 18, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: banhMiCat.id, category: 'Sandwich', name: 'Grilled Chicken Banh Mi', 
        description: 'Vietnamese baguette with grilled chicken, pickled vegetables. Fresh and crunchy. Signature sandwich.', 
        price: 4.000, calories: 420, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: banhMiCat.id, category: 'Sandwich', name: 'Grilled Beef Banh Mi', 
        description: 'Banh mi with marinated beef. Savory and delicious. Premium choice.', 
        price: 4.500, calories: 480, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: banhMiCat.id, category: 'Sandwich', name: 'Tofu Banh Mi', 
        description: 'Vegetarian banh mi with marinated tofu. Plant-based. Healthy option.', 
        price: 3.500, calories: 360, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'snack'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Fresh Spring Rolls (2 pcs)', 
        description: 'Rice paper rolls with shrimp, vegetables, herbs. Light and healthy. Signature appetizer.', 
        price: 3.500, calories: 180, preparation_time: 10, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood', 'low-calorie'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Fried Spring Rolls (4 pcs)', 
        description: 'Crispy fried rolls with vegetables and meat. Crunchy. Popular starter.', 
        price: 4.000, calories: 320, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Vietnamese Salad', 
        description: 'Fresh salad with herbs, vegetables, lime dressing. Light and refreshing. Healthy.', 
        price: 3.000, calories: 120, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'side'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'low-calorie'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Vietnamese Iced Coffee', 
        description: 'Strong coffee with condensed milk over ice. Sweet and bold. Signature drink.', 
        price: 2.500, calories: 180, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Fresh Coconut Water', 
        description: 'Natural coconut water. Hydrating and refreshing. Healthy choice.', 
        price: 2.000, calories: 60, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'healthy'] }
    ]);

    console.log('✅ Pho House created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
