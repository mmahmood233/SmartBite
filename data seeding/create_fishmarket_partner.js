/**
 * Create Fish Market - Seafood Restaurant
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
  console.log('🐟 Creating Fish Market Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'fishmarket@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'fishmarket@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Fish Market Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'fishmarket@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'fishmarket@wajba.bh', full_name: 'Fish Market Manager',
        phone: '+973 1755 6000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Fish Market', category: 'Seafood',
      description: 'Fresh seafood daily. Grilled fish, shrimp, calamari, fish & chips. Ocean-fresh flavors.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1755 6000', email: 'fishmarket@wajba.bh', rating: 4.5,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.500, min_order: 1.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true,
      cuisine_types: ['Seafood', 'Fish'], price_range: 'mid-range',
      ambiance: ['casual', 'fresh'], dietary_options: ['halal'],
      suitable_for: ['lunch', 'dinner'], features: ['fresh daily'],
      signature_dishes: ['Grilled Hammour', 'Fish & Chips', 'Shrimp Platter']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Grilled Fish', description: 'Fresh grilled fish', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Fried Seafood', description: 'Fried fish and seafood', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Shrimp', description: 'Shrimp dishes', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true }
    ]).select();

    const grilledCat = categories.find(c => c.name === 'Grilled Fish');
    const friedCat = categories.find(c => c.name === 'Fried Seafood');
    const shrimpCat = categories.find(c => c.name === 'Shrimp');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: grilledCat.id, category: 'Main Course', name: 'Grilled Hammour', 
        description: 'Fresh hammour grilled with lemon. Local favorite. Light and healthy.', 
        price: 8.000, calories: 420, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: grilledCat.id, category: 'Main Course', name: 'Grilled Salmon', 
        description: 'Atlantic salmon grilled to perfection. Omega-3 rich. Premium fish.', 
        price: 9.000, calories: 480, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: grilledCat.id, category: 'Main Course', name: 'Grilled Sea Bass', 
        description: 'Whole sea bass grilled with spices. Delicate flavor. Chef special.', 
        price: 10.000, calories: 520, preparation_time: 28, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood', 'high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: friedCat.id, category: 'Main Course', name: 'Fish & Chips', 
        description: 'Crispy battered fish with fries. Classic British. Comfort food.', 
        price: 6.500, calories: 780, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood'] },
      { restaurant_id: restaurant.id, category_id: friedCat.id, category: 'Main Course', name: 'Fried Calamari', 
        description: 'Crispy fried calamari rings. Crunchy and tender. Popular appetizer.', 
        price: 5.500, calories: 480, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood'] },
      { restaurant_id: restaurant.id, category_id: friedCat.id, category: 'Main Course', name: 'Fried Shrimp Basket', 
        description: 'Breaded fried shrimp with fries. Crispy and delicious. Family favorite.', 
        price: 7.000, calories: 680, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood'] },
      
      { restaurant_id: restaurant.id, category_id: shrimpCat.id, category: 'Main Course', name: 'Grilled Shrimp Skewers', 
        description: 'Marinated shrimp grilled on skewers. Light and flavorful. Healthy choice.', 
        price: 7.500, calories: 380, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: shrimpCat.id, category: 'Main Course', name: 'Garlic Butter Shrimp', 
        description: 'Shrimp in garlic butter sauce. Rich and savory. Signature dish.', 
        price: 8.000, calories: 520, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: shrimpCat.id, category: 'Main Course', name: 'Spicy Shrimp Platter', 
        description: 'Shrimp with spicy Cajun seasoning. Hot and flavorful. For spice lovers.', 
        price: 8.500, calories: 580, preparation_time: 20, is_vegetarian: false, is_spicy: true, spice_level: 3, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood', 'high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Fresh Lemonade', 
        description: 'Freshly squeezed lemonade. Refreshing. Perfect with seafood.', 
        price: 2.000, calories: 80, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Fish Market created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
