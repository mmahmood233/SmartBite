/**
 * Create Starbucks Partner Account - Global Coffee Chain
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createStarbucksPartner() {
  console.log('☕ Creating Starbucks Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'starbucks@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Starbucks Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'starbucks@wajba.bh', full_name: 'Starbucks Manager',
      phone: '+973 1792 2792', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Starbucks', category: 'Coffee Shop',
      description: 'World\'s leading coffee chain. Handcrafted beverages, fresh food, and welcoming atmosphere. Your third place between home and work.',
      address: 'City Centre Bahrain, Building 3350, Road 4650, Block 346, Sanabis, Manama, Bahrain',
      latitude: 26.2285, longitude: 50.5855, phone: '+973 1792 2792', email: 'starbucks@wajba.bh',
      rating: 4.6, total_reviews: 0, total_orders: 0, delivery_fee: 1.300, min_order: 4.500,
      avg_prep_time: '10-15 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Hot Coffees', description: 'Hot espresso drinks', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Iced Coffees', description: 'Cold coffee drinks', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Frappuccinos', description: 'Blended beverages', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Bakery', description: 'Fresh baked goods', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches', description: 'Fresh sandwiches', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const hotCoffeeCat = categories.find(c => c.name === 'Hot Coffees');
    const icedCoffeeCat = categories.find(c => c.name === 'Iced Coffees');
    const frappeCat = categories.find(c => c.name === 'Frappuccinos');
    const bakeryCat = categories.find(c => c.name === 'Bakery');
    const sandwichesCat = categories.find(c => c.name === 'Sandwiches');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: hotCoffeeCat.id, category: 'Beverage', name: 'Caffe Latte', 
        description: 'Espresso with steamed milk and light foam. Smooth and creamy Starbucks classic.', 
        image: null, image_url: null, price: 2.500, calories: 190, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: hotCoffeeCat.id, category: 'Beverage', name: 'Caramel Macchiato', 
        description: 'Espresso with vanilla, steamed milk, and caramel drizzle. Sweet and layered.', 
        image: null, image_url: null, price: 3.000, calories: 250, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: hotCoffeeCat.id, category: 'Beverage', name: 'White Chocolate Mocha', 
        description: 'Espresso with white chocolate sauce, steamed milk, and whipped cream. Rich and sweet.', 
        image: null, image_url: null, price: 3.200, calories: 430, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: icedCoffeeCat.id, category: 'Beverage', name: 'Iced Caramel Macchiato', 
        description: 'Espresso with vanilla, milk, and caramel over ice. Refreshing and sweet.', 
        image: null, image_url: null, price: 3.000, calories: 250, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: icedCoffeeCat.id, category: 'Beverage', name: 'Cold Brew', 
        description: 'Slow-steeped cold brew coffee. Smooth and naturally sweet.', 
        image: null, image_url: null, price: 2.500, calories: 5, preparation_time: 3, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: frappeCat.id, category: 'Beverage', name: 'Caramel Frappuccino', 
        description: 'Blended coffee with caramel, milk, ice, and whipped cream. Signature Starbucks drink.', 
        image: null, image_url: null, price: 3.500, calories: 380, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: frappeCat.id, category: 'Beverage', name: 'Java Chip Frappuccino', 
        description: 'Blended coffee with chocolate chips and mocha sauce. Topped with whipped cream.', 
        image: null, image_url: null, price: 3.800, calories: 470, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: bakeryCat.id, category: 'Dessert', name: 'Chocolate Chip Cookie', 
        description: 'Classic chocolate chip cookie. Soft and chewy.', 
        image: null, image_url: null, price: 1.800, calories: 320, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: bakeryCat.id, category: 'Dessert', name: 'Blueberry Muffin', 
        description: 'Moist blueberry muffin with streusel topping. Perfect breakfast treat.', 
        image: null, image_url: null, price: 2.200, calories: 380, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: sandwichesCat.id, category: 'Main Course', name: 'Turkey & Cheese Panini', 
        description: 'Roasted turkey with cheese, tomatoes, and pesto mayo in pressed ciabatta.', 
        image: null, image_url: null, price: 3.800, calories: 480, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Starbucks Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: starbucks@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createStarbucksPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
