/**
 * Create Taco Fiesta - Mexican Cuisine
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
  console.log('🌮 Creating Taco Fiesta Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'tacofiesta@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'tacofiesta@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Taco Fiesta Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'tacofiesta@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'tacofiesta@wajba.bh', full_name: 'Taco Fiesta Manager',
        phone: '+973 1799 1000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Taco Fiesta', category: 'Mexican',
      description: 'Authentic Mexican cuisine. Tacos, burritos, quesadillas, nachos. Fresh ingredients and bold flavors.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1799 1000', email: 'tacofiesta@wajba.bh', rating: 4.4,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 1.000,
      avg_prep_time: '15-20 min', status: 'open', is_active: true,
      cuisine_types: ['Mexican', 'Tex-Mex'], price_range: 'budget',
      ambiance: ['casual', 'vibrant'], dietary_options: ['halal', 'vegetarian'],
      suitable_for: ['lunch', 'dinner', 'quick bite'], features: ['fresh ingredients', 'bold flavors'],
      signature_dishes: ['Beef Tacos', 'Chicken Burrito', 'Loaded Nachos']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Tacos', description: 'Mexican tacos', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Burritos', description: 'Wrapped burritos', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Quesadillas', description: 'Cheese quesadillas', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Nachos', description: 'Loaded nachos', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Mexican drinks', display_order: 5, is_active: true }
    ]).select();

    const tacoCat = categories.find(c => c.name === 'Tacos');
    const burritoCat = categories.find(c => c.name === 'Burritos');
    const quesadillaCat = categories.find(c => c.name === 'Quesadillas');
    const nachosCat = categories.find(c => c.name === 'Nachos');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: tacoCat.id, category: 'Main Course', name: 'Beef Tacos (3 pcs)', 
        description: 'Three beef tacos with lettuce, cheese, salsa. Classic Mexican. Signature dish.', 
        price: 4.500, calories: 520, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: tacoCat.id, category: 'Main Course', name: 'Chicken Tacos (3 pcs)', 
        description: 'Three grilled chicken tacos. Light and flavorful. Popular choice.', 
        price: 4.000, calories: 480, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: tacoCat.id, category: 'Main Course', name: 'Fish Tacos (3 pcs)', 
        description: 'Crispy fish tacos with cabbage slaw. Fresh and crunchy. Coastal favorite.', 
        price: 5.000, calories: 540, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood'] },
      
      { restaurant_id: restaurant.id, category_id: burritoCat.id, category: 'Main Course', name: 'Chicken Burrito', 
        description: 'Large flour tortilla with chicken, rice, beans, cheese. Filling and satisfying. Best seller.', 
        price: 5.500, calories: 720, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: burritoCat.id, category: 'Main Course', name: 'Beef Burrito', 
        description: 'Beef burrito with all the fixings. Hearty and delicious. Premium choice.', 
        price: 6.000, calories: 780, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: burritoCat.id, category: 'Main Course', name: 'Vegetarian Burrito', 
        description: 'Black beans, rice, vegetables, cheese. Healthy option. Meat-free.', 
        price: 4.500, calories: 620, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: quesadillaCat.id, category: 'Main Course', name: 'Cheese Quesadilla', 
        description: 'Grilled tortilla with melted cheese. Simple and delicious. Kids favorite.', 
        price: 3.500, calories: 480, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: quesadillaCat.id, category: 'Main Course', name: 'Chicken Quesadilla', 
        description: 'Quesadilla with grilled chicken and cheese. Protein-packed. Popular.', 
        price: 4.500, calories: 580, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: nachosCat.id, category: 'Appetizer', name: 'Loaded Nachos', 
        description: 'Tortilla chips with cheese, jalapeños, salsa, sour cream. Perfect for sharing. Party food.', 
        price: 5.000, calories: 680, preparation_time: 12, is_vegetarian: true, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: nachosCat.id, category: 'Appetizer', name: 'Beef Nachos', 
        description: 'Nachos topped with seasoned beef. Hearty and delicious. Crowd pleaser.', 
        price: 6.000, calories: 780, preparation_time: 15, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Horchata', 
        description: 'Sweet rice milk drink with cinnamon. Traditional Mexican. Refreshing.', 
        price: 2.000, calories: 180, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Jarritos', 
        description: 'Mexican soda in various flavors. Authentic taste. Popular drink.', 
        price: 1.500, calories: 140, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Taco Fiesta created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
