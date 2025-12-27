/**
 * Create Wing Stop - Chicken Wings Specialist
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
  console.log('🍗 Creating Wing Stop Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'wingstop@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'wingstop@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Wing Stop Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'wingstop@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'wingstop@wajba.bh', full_name: 'Wing Stop Manager',
        phone: '+973 1788 0000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Wing Stop', category: 'Fast Food',
      description: 'Chicken wings specialist. 11 signature flavors from mild to atomic. Boneless and classic wings. Perfect for game day.',
      address: 'Seef Mall, Manama', latitude: 26.2361, longitude: 50.5840,
      phone: '+973 1788 0000', email: 'wingstop@wajba.bh', rating: 4.5,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 1.000,
      avg_prep_time: '18-22 min', status: 'open', is_active: true,
      cuisine_types: ['American', 'Fast Food', 'Wings'], price_range: 'budget',
      ambiance: ['casual', 'sports bar'], dietary_options: ['halal'],
      suitable_for: ['lunch', 'dinner', 'game day', 'party'], features: ['11 flavors', 'boneless option'],
      signature_dishes: ['Lemon Pepper Wings', 'Louisiana Rub', 'Atomic Wings']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Classic Wings', description: 'Bone-in wings', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Boneless Wings', description: 'Boneless chicken', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Tenders', description: 'Chicken tenders', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Fries and sides', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();

    const classicCat = categories.find(c => c.name === 'Classic Wings');
    const bonelessCat = categories.find(c => c.name === 'Boneless Wings');
    const tendersCat = categories.find(c => c.name === 'Tenders');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: classicCat.id, category: 'Main Course', name: 'Classic Wings (8 pcs)', 
        description: 'Eight bone-in wings in your choice of flavor. Signature item. Crispy and saucy.', 
        price: 5.000, calories: 680, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: classicCat.id, category: 'Main Course', name: 'Classic Wings (15 pcs)', 
        description: 'Fifteen wings for sharing. Mix and match flavors. Party size.', 
        price: 8.500, calories: 1275, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: classicCat.id, category: 'Main Course', name: 'Classic Wings (24 pcs)', 
        description: 'Twenty-four wings for large groups. Game day favorite. Best value.', 
        price: 13.000, calories: 2040, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: bonelessCat.id, category: 'Main Course', name: 'Boneless Wings (8 pcs)', 
        description: 'Eight boneless chicken pieces. Easier to eat. Same great flavors.', 
        price: 4.500, calories: 620, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: bonelessCat.id, category: 'Main Course', name: 'Boneless Wings (15 pcs)', 
        description: 'Fifteen boneless pieces. Perfect for sharing. No mess.', 
        price: 8.000, calories: 1162, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: tendersCat.id, category: 'Main Course', name: 'Chicken Tenders (3 pcs)', 
        description: 'Three crispy chicken tenders. Classic style. Kids favorite.', 
        price: 4.000, calories: 480, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: tendersCat.id, category: 'Main Course', name: 'Chicken Tenders (5 pcs)', 
        description: 'Five crispy tenders with dipping sauce. Satisfying meal. Popular choice.', 
        price: 6.000, calories: 800, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Seasoned Fries', 
        description: 'Crispy fries with special seasoning. Perfect side. Addictive.', 
        price: 2.000, calories: 380, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Cheese Fries', 
        description: 'Fries loaded with melted cheese. Indulgent side. Cheesy goodness.', 
        price: 3.000, calories: 520, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Soft Drink', 
        description: 'Chilled soft drink. Choice of flavors. Refreshing.', 
        price: 1.000, calories: 150, preparation_time: 2, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Wing Stop created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
