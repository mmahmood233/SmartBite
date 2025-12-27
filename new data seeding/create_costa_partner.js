/**
 * Create Costa Coffee Partner Account - International Coffee Chain
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createCostaPartner() {
  console.log('☕ Creating Costa Coffee Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'costa@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Costa Coffee Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'costa@wajba.bh', full_name: 'Costa Coffee Manager',
      phone: '+973 1791 1791', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Costa Coffee', category: 'Coffee Shop',
      description: 'Premium coffee experience with handcrafted beverages. Cozy atmosphere perfect for work or relaxation. Fresh pastries and sandwiches.',
      address: 'Seef Mall, Building 2500, Road 2833, Block 428, Seef, Manama, Bahrain',
      latitude: 26.2365, longitude: 50.5335, phone: '+973 1791 1791', email: 'costa@wajba.bh',
      rating: 4.5, total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 4.000,
      avg_prep_time: '8-12 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Hot Coffee', description: 'Hot coffee drinks', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Iced Coffee', description: 'Cold coffee drinks', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Frappes', description: 'Blended drinks', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pastries', description: 'Fresh pastries', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches', description: 'Fresh sandwiches', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const hotCoffeeCat = categories.find(c => c.name === 'Hot Coffee');
    const icedCoffeeCat = categories.find(c => c.name === 'Iced Coffee');
    const frappesCat = categories.find(c => c.name === 'Frappes');
    const pastriesCat = categories.find(c => c.name === 'Pastries');
    const sandwichesCat = categories.find(c => c.name === 'Sandwiches');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: hotCoffeeCat.id, category: 'Beverage', name: 'Flat White', 
        description: 'Smooth espresso with velvety microfoam. Costa signature drink.', 
        image: null, image_url: null, price: 2.000, calories: 120, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: hotCoffeeCat.id, category: 'Beverage', name: 'Cappuccino', 
        description: 'Classic cappuccino with rich espresso and foamed milk.', 
        image: null, image_url: null, price: 2.200, calories: 140, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: hotCoffeeCat.id, category: 'Beverage', name: 'Caramel Latte', 
        description: 'Espresso with steamed milk and caramel syrup. Sweet and smooth.', 
        image: null, image_url: null, price: 2.500, calories: 220, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: icedCoffeeCat.id, category: 'Beverage', name: 'Iced Latte', 
        description: 'Espresso with cold milk over ice. Refreshing coffee drink.', 
        image: null, image_url: null, price: 2.300, calories: 150, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: icedCoffeeCat.id, category: 'Beverage', name: 'Iced Mocha', 
        description: 'Espresso with chocolate and milk over ice. Sweet and refreshing.', 
        image: null, image_url: null, price: 2.800, calories: 280, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: frappesCat.id, category: 'Beverage', name: 'Caramel Frappe', 
        description: 'Blended coffee with caramel, ice, and whipped cream. Indulgent frozen drink.', 
        image: null, image_url: null, price: 3.200, calories: 420, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastriesCat.id, category: 'Dessert', name: 'Chocolate Muffin', 
        description: 'Moist chocolate muffin with chocolate chips. Perfect with coffee.', 
        image: null, image_url: null, price: 1.800, calories: 380, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastriesCat.id, category: 'Dessert', name: 'Blueberry Muffin', 
        description: 'Fresh blueberry muffin. Light and fruity.', 
        image: null, image_url: null, price: 1.800, calories: 350, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: sandwichesCat.id, category: 'Main Course', name: 'Chicken Pesto Panini', 
        description: 'Grilled chicken with pesto, mozzarella, and tomatoes in pressed ciabatta.', 
        image: null, image_url: null, price: 3.500, calories: 480, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Costa Coffee Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: costa@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createCostaPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
