/**
 * Create Jasmis Partner Account - Local Bahraini Burger Restaurant
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createJasmisPartner() {
  console.log('🍔 Creating Jasmis Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'jasmis@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Jasmis Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'jasmis@wajba.bh', full_name: 'Jasmis Manager',
      phone: '+973 1781 1781', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Jasmis', category: 'Burgers',
      description: 'Bahrain\'s favorite gourmet burgers! Juicy patties, loaded fries, and thick milkshakes. Local quality with international taste.',
      address: 'Adliya, Building 250, Road 3838, Block 338, Adliya, Manama, Bahrain',
      latitude: 26.2180, longitude: 50.5950, phone: '+973 1781 1781', email: 'jasmis@wajba.bh',
      rating: 4.8, total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 4.000,
      avg_prep_time: '15-20 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Burgers', description: 'Gourmet burgers', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Loaded Fries', description: 'Fries with toppings', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Sides and snacks', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Milkshakes', description: 'Thick milkshakes', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const burgersCat = categories.find(c => c.name === 'Burgers');
    const friesCat = categories.find(c => c.name === 'Loaded Fries');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const shakesCat = categories.find(c => c.name === 'Milkshakes');
    const beveragesCat = categories.find(c => c.name === 'Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Jasmis Special Burger', 
        description: 'Double beef patty with cheese, lettuce, tomato, pickles, and special Jasmis sauce. Our signature burger that made us famous.', 
        image: null, image_url: null, price: 3.500, calories: 780, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'BBQ Bacon Burger', 
        description: 'Beef patty with crispy bacon, cheddar cheese, BBQ sauce, and onion rings. Sweet and smoky perfection.', 
        image: null, image_url: null, price: 3.800, calories: 850, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Spicy Chicken Burger', 
        description: 'Crispy chicken breast with spicy mayo, lettuce, and jalapeños. For those who like it hot!', 
        image: null, image_url: null, price: 3.200, calories: 620, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: burgersCat.id, category: 'Main Course', name: 'Veggie Burger', 
        description: 'Plant-based patty with avocado, lettuce, tomato, and vegan mayo. Delicious vegetarian option.', 
        image: null, image_url: null, price: 3.000, calories: 450, preparation_time: 10, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: friesCat.id, category: 'Side', name: 'Cheese Loaded Fries', 
        description: 'Crispy fries topped with melted cheese sauce, bacon bits, and jalapeños. Indulgent and shareable.', 
        image: null, image_url: null, price: 2.500, calories: 680, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: friesCat.id, category: 'Side', name: 'Chili Cheese Fries', 
        description: 'Fries with beef chili, cheese sauce, and sour cream. Hearty and filling.', 
        image: null, image_url: null, price: 2.800, calories: 750, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Regular Fries', 
        description: 'Classic crispy fries with sea salt. Simple and delicious.', 
        image: null, image_url: null, price: 1.200, calories: 350, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Onion Rings', 
        description: 'Crispy breaded onion rings. Perfect burger companion.', 
        image: null, image_url: null, price: 1.500, calories: 380, preparation_time: 6, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: shakesCat.id, category: 'Beverage', name: 'Chocolate Milkshake', 
        description: 'Thick chocolate milkshake with whipped cream. Rich and creamy.', 
        image: null, image_url: null, price: 2.000, calories: 520, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: shakesCat.id, category: 'Beverage', name: 'Strawberry Milkshake', 
        description: 'Fresh strawberry milkshake with real fruit. Sweet and refreshing.', 
        image: null, image_url: null, price: 2.000, calories: 480, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Coca-Cola', 
        description: 'Ice-cold Coca-Cola. Classic refreshment.', 
        image: null, image_url: null, price: 0.600, calories: 140, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Jasmis Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: jasmis@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createJasmisPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
