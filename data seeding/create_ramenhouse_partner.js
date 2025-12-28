/**
 * Create Ramen House - Japanese Ramen Specialist
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
  console.log('🍜 Creating Ramen House Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'ramenhouse@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'ramenhouse@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Ramen House Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'ramenhouse@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'ramenhouse@wajba.bh', full_name: 'Ramen House Manager',
        phone: '+973 1711 4000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Ramen House', category: 'Japanese',
      description: 'Authentic Japanese ramen specialist. Rich tonkotsu, miso, shoyu broths. Fresh noodles made daily. Traditional recipes.',
      address: 'Seef District, Manama', latitude: 26.2361, longitude: 50.5840,
      phone: '+973 1711 4000', email: 'ramenhouse@wajba.bh', rating: 4.7,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 1.000,
      avg_prep_time: '20-25 min', status: 'open', is_active: true,
      cuisine_types: ['Japanese', 'Ramen', 'Noodles'], price_range: 'budget',
      ambiance: ['casual', 'authentic', 'cozy'], dietary_options: ['halal', 'vegetarian'],
      suitable_for: ['lunch', 'dinner'], features: ['fresh noodles', 'rich broth'],
      signature_dishes: ['Tonkotsu Ramen', 'Spicy Miso Ramen', 'Shoyu Ramen']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Ramen Bowls', description: 'Signature ramen', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Japanese starters', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Rice Bowls', description: 'Donburi bowls', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Japanese drinks', display_order: 4, is_active: true }
    ]).select();

    const ramenCat = categories.find(c => c.name === 'Ramen Bowls');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const riceCat = categories.find(c => c.name === 'Rice Bowls');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: ramenCat.id, category: 'Main Course', name: 'Tonkotsu Ramen', 
        description: 'Rich pork bone broth with noodles, chashu, egg. Signature ramen. Creamy and flavorful. 12-hour broth.', 
        price: 6.000, calories: 680, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: ramenCat.id, category: 'Main Course', name: 'Spicy Miso Ramen', 
        description: 'Miso broth with spicy paste, noodles, vegetables. Bold flavors. For spice lovers. Popular choice.', 
        price: 6.500, calories: 720, preparation_time: 20, is_vegetarian: false, is_spicy: true, spice_level: 3, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: ramenCat.id, category: 'Main Course', name: 'Shoyu Ramen', 
        description: 'Soy sauce broth with chicken, noodles, egg. Classic ramen. Light and savory. Traditional recipe.', 
        price: 5.500, calories: 620, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: ramenCat.id, category: 'Main Course', name: 'Vegetarian Ramen', 
        description: 'Vegetable broth with tofu, mushrooms, noodles. Plant-based. Healthy option. Flavorful.', 
        price: 5.500, calories: 520, preparation_time: 18, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: ramenCat.id, category: 'Main Course', name: 'Black Garlic Ramen', 
        description: 'Tonkotsu with black garlic oil. Rich and aromatic. Unique flavor. Signature dish.', 
        price: 7.000, calories: 740, preparation_time: 22, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Gyoza (6 pcs)', 
        description: 'Pan-fried dumplings with pork and vegetables. Crispy bottom. Classic appetizer. Juicy filling.', 
        price: 4.000, calories: 320, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Edamame', 
        description: 'Steamed soybeans with sea salt. Healthy starter. Light and addictive. Japanese classic.', 
        price: 3.000, calories: 180, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'healthy'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Takoyaki (6 pcs)', 
        description: 'Octopus balls with bonito flakes. Street food favorite. Crispy outside, soft inside. Unique.', 
        price: 4.500, calories: 380, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['halal', 'seafood'] },
      
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course', name: 'Chicken Katsu Don', 
        description: 'Breaded chicken cutlet over rice with egg. Comfort food. Satisfying. Popular donburi.', 
        price: 6.000, calories: 720, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course', name: 'Gyudon (Beef Bowl)', 
        description: 'Sliced beef with onions over rice. Sweet and savory. Quick meal. Japanese fast food.', 
        price: 5.500, calories: 680, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Green Tea', 
        description: 'Hot Japanese green tea. Refreshing and healthy. Perfect with ramen. Traditional.', 
        price: 1.500, calories: 0, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'healthy'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Ramune', 
        description: 'Japanese soda with marble. Fun and fizzy. Nostalgic. Popular choice.', 
        price: 2.000, calories: 120, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Ramen House created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
