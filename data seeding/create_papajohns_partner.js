/**
 * Create Papa John's Partner Account
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createPapaJohnsPartner() {
  console.log('🍕 Creating Papa John\'s Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'papajohns@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Papa John\'s Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'papajohns@wajba.bh', full_name: 'Papa John\'s Manager',
      phone: '+973 1779 9779', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Papa John\'s', category: 'Pizza',
      description: 'Better Ingredients. Better Pizza. Fresh dough, quality toppings, and signature garlic sauce.',
      address: 'Hamala, Building 808, Road 3636, Block 555, Hamala, Bahrain',
      latitude: 26.1500, longitude: 50.4500, phone: '+973 1779 9779', email: 'papajohns@wajba.bh',
      rating: 4.5, total_reviews: 0, total_orders: 0, delivery_fee: 1.300, min_order: 4.500,
      avg_prep_time: '25-30 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Pizzas', description: 'Fresh made pizzas', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Wings and sides', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Sweet treats', display_order: 4, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const pizzasCat = categories.find(c => c.name === 'Pizzas');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const beveragesCat = categories.find(c => c.name === 'Beverages');
    const dessertsCat = categories.find(c => c.name === 'Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: pizzasCat.id, category: 'Main Course', name: 'The Works Pizza (Medium)', 
        description: 'Pepperoni, sausage, mushrooms, green peppers, and onions. Loaded with toppings and flavor.', 
        image: null, image_url: null, price: 5.500, calories: 290, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pizzasCat.id, category: 'Main Course', name: 'Pepperoni Pizza (Medium)', 
        description: 'Classic pepperoni with our signature sauce and fresh mozzarella. Simple perfection.', 
        image: null, image_url: null, price: 4.800, calories: 280, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pizzasCat.id, category: 'Main Course', name: 'Garden Fresh Pizza (Medium)', 
        description: 'Mushrooms, green peppers, onions, tomatoes, and black olives. Vegetarian delight.', 
        image: null, image_url: null, price: 4.500, calories: 210, preparation_time: 20, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Buffalo Wings (8 pcs)', 
        description: 'Eight spicy buffalo wings with ranch dipping sauce. Crispy and flavorful.', 
        image: null, image_url: null, price: 3.500, calories: 520, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Garlic Knots', 
        description: 'Freshly baked knots with garlic butter and parmesan. Served with marinara sauce.', 
        image: null, image_url: null, price: 2.000, calories: 220, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Pepsi', 
        description: 'Ice-cold Pepsi. Refreshing classic.', 
        image: null, image_url: null, price: 0.600, calories: 150, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCat.id, category: 'Dessert', name: 'Chocolate Chip Cookie', 
        description: 'Warm chocolate chip cookie. Sweet and gooey.', 
        image: null, image_url: null, price: 1.200, calories: 280, preparation_time: 4, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Papa John\'s Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: papajohns@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createPapaJohnsPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
