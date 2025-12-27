/**
 * Create Chatime - Bubble Tea Shop
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
  console.log('🧋 Creating Chatime Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'chatime@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'chatime@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Chatime Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'chatime@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'chatime@wajba.bh', full_name: 'Chatime Manager',
        phone: '+973 1777 9000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Chatime', category: 'Beverages',
      description: 'Premium bubble tea and specialty drinks. Fresh fruit teas, milk teas, smoothies. Customizable sweetness and toppings.',
      address: 'City Centre Bahrain, Manama', latitude: 26.2361, longitude: 50.5340,
      phone: '+973 1777 9000', email: 'chatime@wajba.bh', rating: 4.6,
      total_reviews: 0, total_orders: 0, delivery_fee: 0.800, min_order: 1.000,
      avg_prep_time: '8-12 min', status: 'open', is_active: true,
      cuisine_types: ['Beverages', 'Bubble Tea', 'Asian'], price_range: 'budget',
      ambiance: ['trendy', 'casual', 'youth-friendly'], dietary_options: ['vegetarian'],
      suitable_for: ['snack', 'beverage', 'hangout'], features: ['bubble tea', 'customizable', 'fresh ingredients'],
      signature_dishes: ['Pearl Milk Tea', 'Taro Milk Tea', 'Mango Green Tea']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Milk Tea', description: 'Classic milk teas', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Fruit Tea', description: 'Fresh fruit teas', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Smoothies', description: 'Blended smoothies', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Special Drinks', description: 'Signature drinks', display_order: 4, is_active: true }
    ]).select();

    const milkTeaCat = categories.find(c => c.name === 'Milk Tea');
    const fruitTeaCat = categories.find(c => c.name === 'Fruit Tea');
    const smoothieCat = categories.find(c => c.name === 'Smoothies');
    const specialCat = categories.find(c => c.name === 'Special Drinks');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: milkTeaCat.id, category: 'Beverage', name: 'Pearl Milk Tea', 
        description: 'Classic bubble tea with tapioca pearls. Signature drink. Customizable sweetness.', 
        price: 2.500, calories: 280, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: milkTeaCat.id, category: 'Beverage', name: 'Taro Milk Tea', 
        description: 'Creamy taro milk tea with pearls. Purple and delicious. Fan favorite.', 
        price: 2.800, calories: 320, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: milkTeaCat.id, category: 'Beverage', name: 'Brown Sugar Milk Tea', 
        description: 'Milk tea with brown sugar pearls. Sweet and rich. Trending drink.', 
        price: 3.000, calories: 350, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: milkTeaCat.id, category: 'Beverage', name: 'Matcha Milk Tea', 
        description: 'Japanese matcha with milk and pearls. Earthy and sweet. Healthy choice.', 
        price: 3.200, calories: 290, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: fruitTeaCat.id, category: 'Beverage', name: 'Mango Green Tea', 
        description: 'Fresh mango with green tea. Refreshing and fruity. Light and healthy.', 
        price: 2.800, calories: 180, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'healthy'] },
      { restaurant_id: restaurant.id, category_id: fruitTeaCat.id, category: 'Beverage', name: 'Passion Fruit Tea', 
        description: 'Tangy passion fruit with black tea. Tropical and refreshing. Vitamin C boost.', 
        price: 2.800, calories: 160, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'healthy'] },
      { restaurant_id: restaurant.id, category_id: fruitTeaCat.id, category: 'Beverage', name: 'Strawberry Tea', 
        description: 'Fresh strawberries with jasmine tea. Sweet and aromatic. Popular choice.', 
        price: 2.800, calories: 170, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: smoothieCat.id, category: 'Beverage', name: 'Mango Smoothie', 
        description: 'Blended mango smoothie. Thick and creamy. Tropical delight.', 
        price: 3.500, calories: 280, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: smoothieCat.id, category: 'Beverage', name: 'Berry Blast Smoothie', 
        description: 'Mixed berries smoothie. Antioxidant-rich. Healthy and delicious.', 
        price: 3.500, calories: 260, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'snack'], dietary_tags: ['vegetarian', 'halal', 'healthy'] },
      
      { restaurant_id: restaurant.id, category_id: specialCat.id, category: 'Beverage', name: 'Cheese Foam Tea', 
        description: 'Tea topped with creamy cheese foam. Unique and trendy. Must try.', 
        price: 3.500, calories: 320, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: specialCat.id, category: 'Beverage', name: 'Oreo Milk Tea', 
        description: 'Milk tea blended with Oreo cookies. Cookies and cream. Indulgent.', 
        price: 3.200, calories: 380, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'snack'], dietary_tags: ['vegetarian', 'halal'] }
    ]);

    console.log('✅ Chatime created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
