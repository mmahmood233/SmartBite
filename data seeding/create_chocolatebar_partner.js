/**
 * Create The Chocolate Bar Partner Account - Dessert Specialist
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createChocolateBarPartner() {
  console.log('🍫 Creating The Chocolate Bar Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'chocolatebar@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'The Chocolate Bar Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'chocolatebar@wajba.bh', full_name: 'The Chocolate Bar Manager',
      phone: '+973 1789 9789', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'The Chocolate Bar', category: 'Desserts',
      description: 'Premium chocolate desserts and treats. Handcrafted chocolates, decadent cakes, and indulgent sundaes. Heaven for chocolate lovers.',
      address: 'City Centre Bahrain, Building 3333, Road 4646, Block 346, Sanabis, Manama, Bahrain',
      latitude: 26.2280, longitude: 50.5850, phone: '+973 1789 9789', email: 'chocolatebar@wajba.bh',
      rating: 4.9, total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 4.000,
      avg_prep_time: '10-15 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Chocolate Cakes', description: 'Rich chocolate cakes', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Ice Cream & Sundaes', description: 'Ice cream treats', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Brownies & Cookies', description: 'Baked treats', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Hot Chocolate', description: 'Hot chocolate drinks', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Milkshakes', description: 'Chocolate shakes', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const cakesCat = categories.find(c => c.name === 'Chocolate Cakes');
    const iceCreamCat = categories.find(c => c.name === 'Ice Cream & Sundaes');
    const browniesCat = categories.find(c => c.name === 'Brownies & Cookies');
    const hotChocCat = categories.find(c => c.name === 'Hot Chocolate');
    const shakesCat = categories.find(c => c.name === 'Milkshakes');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: cakesCat.id, category: 'Dessert', name: 'Triple Chocolate Cake', 
        description: 'Three layers of dark, milk, and white chocolate cake. Ultimate chocolate indulgence with chocolate ganache.', 
        image: null, image_url: null, price: 4.500, calories: 620, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: cakesCat.id, category: 'Dessert', name: 'Molten Lava Cake', 
        description: 'Warm chocolate cake with gooey molten center. Served with vanilla ice cream. Decadent and rich.', 
        image: null, image_url: null, price: 3.800, calories: 580, preparation_time: 12, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: cakesCat.id, category: 'Dessert', name: 'Black Forest Cake', 
        description: 'Chocolate sponge with cherries and whipped cream. Classic German dessert.', 
        image: null, image_url: null, price: 4.000, calories: 520, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: iceCreamCat.id, category: 'Dessert', name: 'Chocolate Fudge Sundae', 
        description: 'Chocolate ice cream with hot fudge sauce, whipped cream, and nuts. Classic sundae perfection.', 
        image: null, image_url: null, price: 3.500, calories: 480, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: iceCreamCat.id, category: 'Dessert', name: 'Brownie Ice Cream Bowl', 
        description: 'Warm brownie topped with vanilla ice cream, chocolate sauce, and caramel drizzle.', 
        image: null, image_url: null, price: 4.200, calories: 650, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: browniesCat.id, category: 'Dessert', name: 'Fudge Brownie', 
        description: 'Dense chocolate brownie with chocolate chips. Chewy and rich.', 
        image: null, image_url: null, price: 2.500, calories: 380, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: browniesCat.id, category: 'Dessert', name: 'Double Chocolate Cookies (3 pcs)', 
        description: 'Soft chocolate cookies loaded with chocolate chips. Freshly baked.', 
        image: null, image_url: null, price: 2.200, calories: 420, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: hotChocCat.id, category: 'Beverage', name: 'Belgian Hot Chocolate', 
        description: 'Rich hot chocolate made with Belgian chocolate. Topped with whipped cream and chocolate shavings.', 
        image: null, image_url: null, price: 2.800, calories: 320, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: hotChocCat.id, category: 'Beverage', name: 'White Hot Chocolate', 
        description: 'Creamy white chocolate drink with vanilla. Sweet and smooth.', 
        image: null, image_url: null, price: 2.800, calories: 340, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: shakesCat.id, category: 'Beverage', name: 'Chocolate Oreo Shake', 
        description: 'Chocolate milkshake blended with Oreo cookies. Thick and indulgent.', 
        image: null, image_url: null, price: 3.200, calories: 580, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: shakesCat.id, category: 'Beverage', name: 'Nutella Shake', 
        description: 'Creamy milkshake with Nutella and chocolate ice cream. Hazelnut chocolate heaven.', 
        image: null, image_url: null, price: 3.500, calories: 620, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ The Chocolate Bar Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: chocolatebar@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createChocolateBarPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
