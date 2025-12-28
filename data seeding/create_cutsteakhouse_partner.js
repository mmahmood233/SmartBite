/**
 * Create CUT Steakhouse - Premium Luxury Steakhouse
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
  console.log('🥩 Creating CUT Steakhouse Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'cutsteakhouse@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'cutsteakhouse@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'CUT Steakhouse Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'cutsteakhouse@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'cutsteakhouse@wajba.bh', full_name: 'CUT Steakhouse Manager',
        phone: '+973 1733 5000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'CUT Steakhouse', category: 'Fine Dining',
      description: 'Premium luxury steakhouse. USDA Prime beef, Wagyu, premium cuts. Fine dining experience with exceptional service.',
      address: 'Four Seasons Hotel, Bahrain Bay', latitude: 26.2361, longitude: 50.5840,
      phone: '+973 1733 5000', email: 'cutsteakhouse@wajba.bh', rating: 4.9,
      total_reviews: 0, total_orders: 0, delivery_fee: 3.000, min_order: 20.000,
      avg_prep_time: '40-50 min', status: 'open', is_active: true,
      cuisine_types: ['Steakhouse', 'American', 'Fine Dining'], price_range: 'luxury',
      ambiance: ['upscale', 'elegant', 'romantic'], dietary_options: ['halal'],
      suitable_for: ['dinner', 'special occasion', 'business'], features: ['premium cuts', 'fine dining', 'sommelier'],
      signature_dishes: ['Wagyu Ribeye', 'USDA Prime Tomahawk', 'Filet Mignon']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Premium Steaks', description: 'USDA Prime & Wagyu', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Seafood', description: 'Fresh seafood', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Gourmet starters', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Premium sides', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Fine desserts', display_order: 5, is_active: true }
    ]).select();

    const steakCat = categories.find(c => c.name === 'Premium Steaks');
    const seafoodCat = categories.find(c => c.name === 'Seafood');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const dessertCat = categories.find(c => c.name === 'Desserts');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: steakCat.id, category: 'Main Course', name: 'Wagyu Ribeye (300g)', 
        description: 'Japanese A5 Wagyu ribeye. Marbled perfection. Ultimate luxury. Melt-in-mouth texture.', 
        price: 45.000, calories: 820, preparation_time: 40, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'high-protein', 'premium'] },
      { restaurant_id: restaurant.id, category_id: steakCat.id, category: 'Main Course', name: 'USDA Prime Tomahawk (1kg)', 
        description: 'Bone-in ribeye for sharing. Dry-aged 28 days. Spectacular presentation. Show-stopper.', 
        price: 50.000, calories: 1800, preparation_time: 45, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'high-protein', 'premium'] },
      { restaurant_id: restaurant.id, category_id: steakCat.id, category: 'Main Course', name: 'Filet Mignon (250g)', 
        description: 'Center-cut tenderloin. Buttery soft. Most tender cut. Classic elegance.', 
        price: 35.000, calories: 620, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'high-protein', 'premium'] },
      { restaurant_id: restaurant.id, category_id: steakCat.id, category: 'Main Course', name: 'New York Strip (350g)', 
        description: 'USDA Prime strip steak. Bold beef flavor. Perfect marbling. Signature cut.', 
        price: 32.000, calories: 780, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'high-protein', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: seafoodCat.id, category: 'Main Course', name: 'Lobster Thermidor', 
        description: 'Whole lobster in creamy sauce. Luxurious. Classic French preparation. Indulgent.', 
        price: 40.000, calories: 680, preparation_time: 40, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: seafoodCat.id, category: 'Main Course', name: 'Chilean Sea Bass', 
        description: 'Pan-seared sea bass with truffle butter. Delicate and flaky. Premium fish. Elegant.', 
        price: 38.000, calories: 520, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Foie Gras', 
        description: 'Seared foie gras with fig compote. Luxurious starter. French delicacy. Exquisite.', 
        price: 25.000, calories: 420, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['premium'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Oysters (6 pcs)', 
        description: 'Fresh oysters on ice with mignonette. Ocean-fresh. Aphrodisiac. Premium selection.', 
        price: 18.000, calories: 120, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood', 'low-calorie', 'premium'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Beef Carpaccio', 
        description: 'Thinly sliced raw beef with truffle oil and parmesan. Italian classic. Refined.', 
        price: 15.000, calories: 280, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Truffle Mac & Cheese', 
        description: 'Creamy mac and cheese with black truffle. Decadent side. Indulgent.', 
        price: 12.000, calories: 580, preparation_time: 20, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'premium'] },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Grilled Asparagus', 
        description: 'Fresh asparagus with hollandaise. Light and elegant. Perfect pairing.', 
        price: 8.000, calories: 180, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'low-calorie', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: dessertCat.id, category: 'Dessert', name: 'Chocolate Soufflé', 
        description: 'Warm chocolate soufflé with vanilla ice cream. Made to order. Spectacular. 20 min wait.', 
        price: 10.000, calories: 480, preparation_time: 25, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'premium'] },
      { restaurant_id: restaurant.id, category_id: dessertCat.id, category: 'Dessert', name: 'Crème Brûlée', 
        description: 'Classic French custard with caramelized sugar. Silky smooth. Elegant finish.', 
        price: 8.000, calories: 380, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'premium'] }
    ]);

    console.log('✅ CUT Steakhouse created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
