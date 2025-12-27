/**
 * Create Thai House - Thai Cuisine
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
  console.log('🌶️ Creating Thai House Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'thaihouse@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'thaihouse@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Thai House Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'thaihouse@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'thaihouse@wajba.bh', full_name: 'Thai House Manager',
        phone: '+973 1744 5000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Thai House', category: 'Thai',
      description: 'Authentic Thai cuisine. Pad Thai, green curry, tom yum, spring rolls. Fresh herbs and traditional flavors.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1744 5000', email: 'thaihouse@wajba.bh', rating: 4.6,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 1.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true,
      cuisine_types: ['Thai', 'Asian'], price_range: 'mid-range',
      ambiance: ['casual', 'exotic'], dietary_options: ['halal', 'vegetarian', 'vegan'],
      suitable_for: ['lunch', 'dinner'], features: ['authentic Thai', 'fresh herbs'],
      signature_dishes: ['Pad Thai', 'Green Curry', 'Tom Yum Soup']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Noodles', description: 'Thai noodles', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Curry', description: 'Thai curries', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Soups', description: 'Thai soups', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Starters', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();

    const noodlesCat = categories.find(c => c.name === 'Noodles');
    const curryCat = categories.find(c => c.name === 'Curry');
    const soupCat = categories.find(c => c.name === 'Soups');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: noodlesCat.id, category: 'Main Course', name: 'Pad Thai', 
        description: 'Stir-fried rice noodles with shrimp, peanuts, and tamarind. Signature Thai dish. Sweet and tangy.', 
        price: 5.500, calories: 620, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood'] },
      { restaurant_id: restaurant.id, category_id: noodlesCat.id, category: 'Main Course', name: 'Pad See Ew', 
        description: 'Wide rice noodles with chicken and vegetables. Savory soy sauce flavor. Comfort food.', 
        price: 5.000, calories: 580, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: noodlesCat.id, category: 'Main Course', name: 'Drunken Noodles', 
        description: 'Spicy stir-fried noodles with basil and vegetables. Bold flavors. For spice lovers.', 
        price: 5.500, calories: 640, preparation_time: 22, is_vegetarian: false, is_spicy: true, spice_level: 3, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: curryCat.id, category: 'Main Course', name: 'Green Curry', 
        description: 'Coconut green curry with chicken and vegetables. Creamy and aromatic. Signature curry.', 
        price: 6.000, calories: 580, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: curryCat.id, category: 'Main Course', name: 'Red Curry', 
        description: 'Spicy red curry with beef and bamboo shoots. Rich and flavorful. Traditional recipe.', 
        price: 6.500, calories: 620, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 3, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: curryCat.id, category: 'Main Course', name: 'Massaman Curry', 
        description: 'Mild curry with chicken, potatoes, and peanuts. Sweet and savory. Less spicy option.', 
        price: 6.000, calories: 680, preparation_time: 28, is_vegetarian: false, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: soupCat.id, category: 'Soup', name: 'Tom Yum Soup', 
        description: 'Spicy and sour soup with shrimp and lemongrass. Signature Thai soup. Hot and tangy.', 
        price: 4.500, calories: 220, preparation_time: 18, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'soup'], dietary_tags: ['halal', 'seafood', 'low-calorie'] },
      { restaurant_id: restaurant.id, category_id: soupCat.id, category: 'Soup', name: 'Tom Kha Gai', 
        description: 'Coconut chicken soup with galangal. Creamy and mild. Comfort soup.', 
        price: 4.500, calories: 320, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'soup'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Spring Rolls (4 pcs)', 
        description: 'Fresh vegetable spring rolls with peanut sauce. Light and healthy. Perfect starter.', 
        price: 3.500, calories: 280, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Chicken Satay (5 skewers)', 
        description: 'Grilled chicken skewers with peanut sauce. Smoky and savory. Popular appetizer.', 
        price: 4.500, calories: 420, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Thai Fish Cakes (4 pcs)', 
        description: 'Spiced fish cakes with sweet chili sauce. Crispy and flavorful. Thai classic.', 
        price: 4.000, calories: 320, preparation_time: 12, is_vegetarian: false, is_spicy: true, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Thai Iced Tea', 
        description: 'Sweet Thai tea with condensed milk. Creamy and refreshing. Signature drink.', 
        price: 2.500, calories: 220, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Coconut Water', 
        description: 'Fresh coconut water. Natural and hydrating. Healthy choice.', 
        price: 2.000, calories: 60, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'healthy'] }
    ]);

    console.log('✅ Thai House created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
