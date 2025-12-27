/**
 * Create Subway Partner Account
 * Complete data for AI analysis and recommendations
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

console.log('🔧 Supabase URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createSubwayPartner() {
  console.log('🥖 Creating Subway Partner Account...\n');

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'subway@wajba.bh',
      password: '12345678',
      email_confirm: true,
      user_metadata: { full_name: 'Subway Manager' }
    });
    if (authError) throw authError;
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    const { error: userError } = await supabase.from('users').insert({
      id: userId, email: 'subway@wajba.bh', full_name: 'Subway Manager',
      phone: '+973 1774 4774', role: 'partner', is_active: true
    });
    if (userError) throw userError;
    console.log('✅ Public user created');

    const { data: restaurant, error: restaurantError } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Subway', category: 'Fast Food',
      description: 'Eat Fresh! Customizable subs, salads, and wraps made with fresh ingredients. Healthy fast food options.',
      address: 'Diplomatic Area, Building 1055, Road 1901, Block 319, Manama, Bahrain',
      latitude: 26.2285, longitude: 50.5848, phone: '+973 1774 4774', email: 'subway@wajba.bh',
      rating: 4.3, total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 3.500,
      avg_prep_time: '10-15 min', status: 'open', is_active: true
    }).select().single();
    if (restaurantError) throw restaurantError;
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories, error: categoryError } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Subs', description: 'Freshly made sandwiches', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Salads', description: 'Fresh healthy salads', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Wraps', description: 'Wrapped goodness', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Cookies and chips', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();
    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    const subsCategory = categories.find(c => c.name === 'Subs');
    const saladsCategory = categories.find(c => c.name === 'Salads');
    const wrapsCategory = categories.find(c => c.name === 'Wraps');
    const sidesCategory = categories.find(c => c.name === 'Sides');
    const beveragesCategory = categories.find(c => c.name === 'Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: subsCategory.id, category: 'Main Course', name: 'Italian B.M.T.', 
        description: 'Classic sub with pepperoni, salami, and ham. Topped with lettuce, tomatoes, onions, and Italian dressing on fresh bread.', 
        image: null, image_url: null, price: 2.800, calories: 410, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: subsCategory.id, category: 'Main Course', name: 'Chicken Teriyaki', 
        description: 'Tender chicken strips with sweet teriyaki sauce. Served with fresh vegetables on your choice of bread.', 
        image: null, image_url: null, price: 3.000, calories: 380, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: subsCategory.id, category: 'Main Course', name: 'Veggie Delite', 
        description: 'Healthy vegetarian sub loaded with fresh vegetables, lettuce, tomatoes, cucumbers, and peppers. Vegetarian friendly.', 
        image: null, image_url: null, price: 2.200, calories: 230, preparation_time: 7, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: subsCategory.id, category: 'Main Course', name: 'Subway Club', 
        description: 'Turkey, roast beef, and ham with cheese. A protein-packed classic with all the fresh fixings.', 
        image: null, image_url: null, price: 3.200, calories: 360, preparation_time: 8, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: saladsCategory.id, category: 'Salad', name: 'Chicken Caesar Salad', 
        description: 'Grilled chicken on fresh lettuce with Caesar dressing, croutons, and parmesan cheese. Light and satisfying.', 
        image: null, image_url: null, price: 3.500, calories: 320, preparation_time: 6, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: saladsCategory.id, category: 'Salad', name: 'Veggie Salad', 
        description: 'Fresh garden salad with mixed vegetables, lettuce, tomatoes, cucumbers. Vegetarian and vegan option.', 
        image: null, image_url: null, price: 2.800, calories: 150, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: wrapsCategory.id, category: 'Main Course', name: 'Chicken Wrap', 
        description: 'Grilled chicken wrapped in a soft tortilla with fresh vegetables and your choice of sauce.', 
        image: null, image_url: null, price: 2.900, calories: 340, preparation_time: 7, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCategory.id, category: 'Side', name: 'Chocolate Chip Cookie', 
        description: 'Freshly baked chocolate chip cookie. Soft and chewy with melted chocolate chips.', 
        image: null, image_url: null, price: 0.700, calories: 220, preparation_time: 2, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCategory.id, category: 'Side', name: 'Lays Chips', 
        description: 'Classic crispy potato chips. The perfect crunchy side.', 
        image: null, image_url: null, price: 0.600, calories: 160, preparation_time: 1, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCategory.id, category: 'Beverage', name: 'Coca-Cola', 
        description: 'Ice-cold Coca-Cola. Refreshing classic soft drink.', 
        image: null, image_url: null, price: 0.500, calories: 140, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCategory.id, category: 'Beverage', name: 'Orange Juice', 
        description: 'Fresh squeezed orange juice. Healthy and vitamin-rich.', 
        image: null, image_url: null, price: 1.200, calories: 110, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true }
    ];

    const { error: dishError } = await supabase.from('dishes').insert(dishes);
    if (dishError) throw dishError;
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Subway Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: subway@wajba.bh');
    console.log('🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId);
    console.log('🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length);
    console.log('🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createSubwayPartner()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
