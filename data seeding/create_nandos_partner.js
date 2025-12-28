/**
 * Create Nando's Partner Account
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createNandosPartner() {
  console.log('🔥 Creating Nando\'s Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'nandos@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Nando\'s Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'nandos@wajba.bh', full_name: 'Nando\'s Manager',
      phone: '+973 1777 7777', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Nando\'s', category: 'Chicken',
      description: 'Portuguese flame-grilled PERi-PERi chicken. Spicy, tangy, and full of flavor. Choose your heat level!',
      address: 'Seef District, Building 1414, Road 2828, Block 428, Seef, Manama, Bahrain',
      latitude: 26.2340, longitude: 50.5320, phone: '+973 1777 7777', email: 'nandos@wajba.bh',
      rating: 4.6, total_reviews: 0, total_orders: 0, delivery_fee: 1.300, min_order: 4.000,
      avg_prep_time: '20-25 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Chicken', description: 'Flame-grilled PERi-PERi chicken', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Burgers & Wraps', description: 'Chicken burgers and wraps', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Peri chips and sides', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Sweet treats', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const chickenCat = categories.find(c => c.name === 'Chicken');
    const burgersCat = categories.find(c => c.name === 'Burgers & Wraps');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const beveragesCat = categories.find(c => c.name === 'Beverages');
    const dessertsCat = categories.find(c => c.name === 'Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Quarter Chicken (Mild)', 
        description: 'Flame-grilled quarter chicken with mild PERi-PERi sauce. Tender and juicy with a hint of spice.', 
        image: null, image_url: null, price: 3.500, calories: 380, preparation_time: 15, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Quarter Chicken (Hot)', 
        description: 'Flame-grilled quarter chicken with hot PERi-PERi sauce. For those who like it spicy!', 
        image: null, image_url: null, price: 3.500, calories: 380, preparation_time: 15, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Half Chicken', 
        description: 'Flame-grilled half chicken with your choice of PERi-PERi heat. Perfect for sharing or a hearty meal.', 
        image: null, image_url: null, price: 5.500, calories: 760, preparation_time: 18, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Chicken Wings (6 pcs)', 
        description: 'Six flame-grilled chicken wings with PERi-PERi sauce. Crispy skin, tender meat.', 
        image: null, image_url: null, price: 3.200, calories: 420, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Chicken Burger', 
        description: 'Grilled chicken breast in a Portuguese roll with lettuce, tomato, and PERi-PERi mayo.', 
        image: null, image_url: null, price: 3.800, calories: 520, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Spicy Chicken Wrap', 
        description: 'Grilled chicken strips with lettuce, tomato, and spicy PERi-PERi sauce wrapped in a soft tortilla.', 
        image: null, image_url: null, price: 3.500, calories: 480, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'PERi-PERi Chips (Regular)', 
        description: 'Crispy fries dusted with PERi-PERi seasoning. Addictively spicy and flavorful.', 
        image: null, image_url: null, price: 1.500, calories: 320, preparation_time: 6, 
        is_vegetarian: true, is_vegan: true, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Coleslaw', 
        description: 'Creamy coleslaw with a tangy dressing. A cooling side to balance the heat.', 
        image: null, image_url: null, price: 1.200, calories: 150, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Corn on the Cob', 
        description: 'Grilled corn on the cob with butter. Sweet and smoky.', 
        image: null, image_url: null, price: 1.300, calories: 180, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Coca-Cola', 
        description: 'Ice-cold Coca-Cola. Perfect to cool down the PERi-PERi heat.', 
        image: null, image_url: null, price: 0.600, calories: 140, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCat.id, category: 'Dessert', name: 'Chocolate Cake', 
        description: 'Rich chocolate cake with a moist center. Sweet ending to your meal.', 
        image: null, image_url: null, price: 1.800, calories: 350, preparation_time: 4, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Nando\'s Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: nandos@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createNandosPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
