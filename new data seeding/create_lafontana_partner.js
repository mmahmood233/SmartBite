/**
 * Create La Fontana - Fine Dining Italian
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
  console.log('🇮🇹 Creating La Fontana Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'lafontana@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'lafontana@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'La Fontana Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'lafontana@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'lafontana@wajba.bh', full_name: 'La Fontana Manager',
        phone: '+973 1744 6000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'La Fontana', category: 'Fine Dining',
      description: 'Upscale Italian fine dining. Authentic regional cuisine, homemade pasta, premium ingredients. Elegant atmosphere.',
      address: 'The Ritz-Carlton, Manama', latitude: 26.2361, longitude: 50.5840,
      phone: '+973 1744 6000', email: 'lafontana@wajba.bh', rating: 4.8,
      total_reviews: 0, total_orders: 0, delivery_fee: 3.000, min_order: 20.000,
      avg_prep_time: '35-45 min', status: 'open', is_active: true,
      cuisine_types: ['Italian', 'Fine Dining', 'Mediterranean'], price_range: 'luxury',
      ambiance: ['upscale', 'romantic', 'elegant'], dietary_options: ['halal', 'vegetarian'],
      suitable_for: ['dinner', 'special occasion', 'romantic'], features: ['homemade pasta', 'wine pairing', 'fine dining'],
      signature_dishes: ['Lobster Ravioli', 'Osso Buco', 'Truffle Risotto']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Antipasti', description: 'Italian starters', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pasta', description: 'Homemade pasta', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Main Courses', description: 'Premium mains', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Risotto', description: 'Creamy risotto', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Dolci', description: 'Italian desserts', display_order: 5, is_active: true }
    ]).select();

    const antiCat = categories.find(c => c.name === 'Antipasti');
    const pastaCat = categories.find(c => c.name === 'Pasta');
    const mainCat = categories.find(c => c.name === 'Main Courses');
    const risottoCat = categories.find(c => c.name === 'Risotto');
    const dolciCat = categories.find(c => c.name === 'Dolci');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: antiCat.id, category: 'Appetizer', name: 'Burrata with Truffle', 
        description: 'Creamy burrata with black truffle and aged balsamic. Luxurious. Italian treasure.', 
        price: 18.000, calories: 380, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'halal', 'premium'] },
      { restaurant_id: restaurant.id, category_id: antiCat.id, category: 'Appetizer', name: 'Beef Carpaccio', 
        description: 'Thinly sliced beef with arugula, parmesan, truffle oil. Classic Italian. Elegant.', 
        price: 16.000, calories: 280, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: pastaCat.id, category: 'Main Course', name: 'Lobster Ravioli', 
        description: 'Handmade ravioli with lobster filling in saffron cream. Signature dish. Exquisite.', 
        price: 35.000, calories: 680, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: pastaCat.id, category: 'Main Course', name: 'Tagliatelle al Tartufo', 
        description: 'Fresh tagliatelle with black truffle and butter. Simple perfection. Luxurious.', 
        price: 32.000, calories: 620, preparation_time: 30, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['vegetarian', 'halal', 'premium'] },
      { restaurant_id: restaurant.id, category_id: pastaCat.id, category: 'Main Course', name: 'Pappardelle Bolognese', 
        description: 'Wide pasta with slow-cooked beef ragu. Traditional recipe. Rich and hearty.', 
        price: 28.000, calories: 780, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Osso Buco', 
        description: 'Braised veal shank with saffron risotto. Milanese classic. Melt-in-mouth tender.', 
        price: 38.000, calories: 820, preparation_time: 40, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'premium'] },
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Branzino al Forno', 
        description: 'Whole roasted sea bass with herbs and lemon. Mediterranean elegance. Fresh and light.', 
        price: 36.000, calories: 520, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: mainCat.id, category: 'Main Course', name: 'Veal Milanese', 
        description: 'Breaded veal cutlet with arugula salad. Classic Italian. Crispy and tender.', 
        price: 34.000, calories: 680, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: risottoCat.id, category: 'Main Course', name: 'Truffle Risotto', 
        description: 'Creamy risotto with black truffle and parmesan. Signature dish. Decadent.', 
        price: 30.000, calories: 620, preparation_time: 35, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['vegetarian', 'halal', 'premium'] },
      { restaurant_id: restaurant.id, category_id: risottoCat.id, category: 'Main Course', name: 'Seafood Risotto', 
        description: 'Risotto with lobster, shrimp, and scallops. Ocean flavors. Luxurious.', 
        price: 34.000, calories: 680, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: dolciCat.id, category: 'Dessert', name: 'Tiramisu', 
        description: 'Classic Italian tiramisu. Homemade. Coffee-soaked layers. Authentic recipe.', 
        price: 10.000, calories: 420, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'premium'] },
      { restaurant_id: restaurant.id, category_id: dolciCat.id, category: 'Dessert', name: 'Panna Cotta', 
        description: 'Silky vanilla panna cotta with berry compote. Light and elegant. Perfect finish.', 
        price: 9.000, calories: 320, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'premium'] }
    ]);

    console.log('✅ La Fontana created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
