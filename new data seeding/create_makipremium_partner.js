/**
 * Create Maki Premium - High-End Japanese Omakase
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
  console.log('🍣 Creating Maki Premium Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'makipremium@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'makipremium@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Maki Premium Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'makipremium@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'makipremium@wajba.bh', full_name: 'Maki Premium Manager',
        phone: '+973 1766 8000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Maki Premium', category: 'Fine Dining',
      description: 'High-end Japanese omakase experience. Master sushi chef, premium fish flown from Tokyo. Intimate counter seating.',
      address: 'Seef District, Manama', latitude: 26.2361, longitude: 50.5840,
      phone: '+973 1766 8000', email: 'makipremium@wajba.bh', rating: 4.9,
      total_reviews: 0, total_orders: 0, delivery_fee: 3.000, min_order: 25.000,
      avg_prep_time: '45-60 min', status: 'open', is_active: true,
      cuisine_types: ['Japanese', 'Sushi', 'Fine Dining'], price_range: 'luxury',
      ambiance: ['upscale', 'intimate', 'zen'], dietary_options: ['halal'],
      suitable_for: ['dinner', 'special occasion', 'omakase'], features: ['omakase', 'master chef', 'premium fish'],
      signature_dishes: ['Omakase Experience', 'Wagyu Nigiri', 'Toro Sashimi']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Omakase', description: 'Chef selection', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Premium Sashimi', description: 'Fresh sashimi', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Premium Nigiri', description: 'Hand-pressed sushi', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Signature Rolls', description: 'Special rolls', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Wagyu', description: 'Japanese beef', display_order: 5, is_active: true }
    ]).select();

    const omakaseCat = categories.find(c => c.name === 'Omakase');
    const sashimiCat = categories.find(c => c.name === 'Premium Sashimi');
    const nigiriCat = categories.find(c => c.name === 'Premium Nigiri');
    const rollsCat = categories.find(c => c.name === 'Signature Rolls');
    const wagyuCat = categories.find(c => c.name === 'Wagyu');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: omakaseCat.id, category: 'Main Course', name: 'Omakase Experience (12 courses)', 
        description: 'Chef\'s selection of 12 premium courses. Seasonal ingredients. Ultimate Japanese dining. Reservation required.', 
        price: 80.000, calories: 1200, preparation_time: 60, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: omakaseCat.id, category: 'Main Course', name: 'Premium Omakase (18 courses)', 
        description: 'Extended omakase with rare ingredients. Chef\'s masterpiece. Once-in-lifetime experience. Limited seating.', 
        price: 120.000, calories: 1800, preparation_time: 90, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: sashimiCat.id, category: 'Appetizer', name: 'Toro Sashimi', 
        description: 'Fatty tuna belly sashimi. Melt-in-mouth. Most prized cut. Ultimate luxury.', 
        price: 35.000, calories: 280, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: sashimiCat.id, category: 'Appetizer', name: 'Uni (Sea Urchin)', 
        description: 'Fresh sea urchin from Hokkaido. Creamy and sweet. Delicacy. Acquired taste.', 
        price: 30.000, calories: 120, preparation_time: 10, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: sashimiCat.id, category: 'Appetizer', name: 'Hamachi Sashimi', 
        description: 'Yellowtail sashimi with yuzu. Buttery texture. Premium fish. Fresh daily.', 
        price: 25.000, calories: 220, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: nigiriCat.id, category: 'Main Course', name: 'Wagyu Nigiri (2 pcs)', 
        description: 'A5 Wagyu beef nigiri with truffle. Seared to perfection. Luxurious fusion. Signature.', 
        price: 28.000, calories: 320, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'premium'] },
      { restaurant_id: restaurant.id, category_id: nigiriCat.id, category: 'Main Course', name: 'Otoro Nigiri (2 pcs)', 
        description: 'Fatty tuna nigiri. Most prized tuna cut. Melt-in-mouth. Ultimate indulgence.', 
        price: 32.000, calories: 260, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: nigiriCat.id, category: 'Main Course', name: 'Premium Nigiri Set (8 pcs)', 
        description: 'Chef\'s selection of 8 premium nigiri. Seasonal fish. Expertly prepared. Best variety.', 
        price: 45.000, calories: 680, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: rollsCat.id, category: 'Main Course', name: 'Dragon Roll Premium', 
        description: 'Eel, avocado, topped with tuna and caviar. Signature roll. Spectacular presentation. Luxurious.', 
        price: 28.000, calories: 520, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: rollsCat.id, category: 'Main Course', name: 'Rainbow Roll Deluxe', 
        description: 'California roll topped with 5 types of premium fish. Colorful. Beautiful. Delicious.', 
        price: 25.000, calories: 480, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: wagyuCat.id, category: 'Main Course', name: 'Wagyu Tataki', 
        description: 'Seared Wagyu with ponzu and scallions. Rare center. Rich and tender. Premium beef.', 
        price: 38.000, calories: 580, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'premium'] },
      { restaurant_id: restaurant.id, category_id: wagyuCat.id, category: 'Main Course', name: 'Wagyu Sukiyaki', 
        description: 'Thinly sliced Wagyu in sweet soy broth. Traditional hot pot. Comforting luxury. Sharing dish.', 
        price: 42.000, calories: 720, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'premium'] }
    ]);

    console.log('✅ Maki Premium created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
