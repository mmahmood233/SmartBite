/**
 * Create Texas BBQ - American BBQ Restaurant
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
  console.log('🍖 Creating Texas BBQ Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'texasbbq@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'texasbbq@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Texas BBQ Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'texasbbq@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'texasbbq@wajba.bh', full_name: 'Texas BBQ Manager',
        phone: '+973 1799 2000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Texas BBQ', category: 'American',
      description: 'Authentic American BBQ. Slow-smoked ribs, brisket, pulled pork. Texas-style smokehouse with signature BBQ sauce.',
      address: 'Adliya, Manama', latitude: 26.2172, longitude: 50.5816,
      phone: '+973 1799 2000', email: 'texasbbq@wajba.bh', rating: 4.6,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.500, min_order: 1.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true,
      cuisine_types: ['American', 'BBQ', 'Smokehouse'], price_range: 'mid-range',
      ambiance: ['casual', 'rustic', 'family-friendly'], dietary_options: ['halal'],
      suitable_for: ['lunch', 'dinner', 'family'], features: ['slow-smoked', 'signature sauce'],
      signature_dishes: ['Beef Brisket', 'BBQ Ribs', 'Pulled Pork']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Smoked Meats', description: 'Slow-smoked BBQ', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Ribs', description: 'BBQ ribs', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Platters', description: 'BBQ platters', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Classic sides', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();

    const smokedCat = categories.find(c => c.name === 'Smoked Meats');
    const ribsCat = categories.find(c => c.name === 'Ribs');
    const platterCat = categories.find(c => c.name === 'Platters');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: smokedCat.id, category: 'Main Course', name: 'Beef Brisket', 
        description: 'Slow-smoked beef brisket for 12 hours. Melt-in-mouth tender. Signature dish. Texas classic.', 
        price: 8.000, calories: 680, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: smokedCat.id, category: 'Main Course', name: 'Pulled Pork', 
        description: 'Slow-smoked pulled pork with BBQ sauce. Tender and juicy. Southern favorite. Comfort food.', 
        price: 7.000, calories: 620, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: smokedCat.id, category: 'Main Course', name: 'Smoked Chicken', 
        description: 'Half chicken smoked to perfection. Juicy and flavorful. Lighter option. Popular choice.', 
        price: 6.500, calories: 580, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: ribsCat.id, category: 'Main Course', name: 'BBQ Ribs (Half Rack)', 
        description: 'Half rack of tender pork ribs with BBQ sauce. Fall-off-the-bone. Signature ribs.', 
        price: 9.000, calories: 780, preparation_time: 28, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: ribsCat.id, category: 'Main Course', name: 'BBQ Ribs (Full Rack)', 
        description: 'Full rack of ribs for serious BBQ lovers. Massive portion. Best value.', 
        price: 16.000, calories: 1560, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: ribsCat.id, category: 'Main Course', name: 'Beef Ribs', 
        description: 'Meaty beef ribs smoked low and slow. Huge bones. Texas-style. Impressive.', 
        price: 12.000, calories: 920, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: platterCat.id, category: 'Main Course', name: 'BBQ Combo Platter', 
        description: 'Brisket, ribs, pulled pork with 2 sides. Ultimate BBQ experience. For sharing.', 
        price: 18.000, calories: 1680, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: platterCat.id, category: 'Main Course', name: 'Family Feast', 
        description: 'All meats, 4 sides, cornbread. Feeds 4-6 people. Party size. Best deal.', 
        price: 35.000, calories: 4200, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Mac & Cheese', 
        description: 'Creamy homemade mac and cheese. Comfort side. Cheesy goodness.', 
        price: 3.000, calories: 420, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Coleslaw', 
        description: 'Tangy coleslaw. Refreshing side. Perfect with BBQ.', 
        price: 2.000, calories: 180, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Baked Beans', 
        description: 'Sweet and smoky baked beans. Classic BBQ side. Hearty.', 
        price: 2.500, calories: 280, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Sweet Tea', 
        description: 'Southern-style sweet iced tea. Refreshing. Classic pairing.', 
        price: 1.500, calories: 120, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Texas BBQ created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
