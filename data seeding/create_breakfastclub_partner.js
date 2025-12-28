/**
 * Create Breakfast Club - All-Day Breakfast
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
  console.log('🍳 Creating Breakfast Club Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'breakfastclub@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'breakfastclub@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Breakfast Club Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'breakfastclub@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'breakfastclub@wajba.bh', full_name: 'Breakfast Club Manager',
        phone: '+973 1711 2000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Breakfast Club', category: 'Breakfast',
      description: 'All-day breakfast cafe. Pancakes, eggs, waffles, and breakfast classics served anytime. Perfect morning start or brunch.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1711 2000', email: 'breakfastclub@wajba.bh', rating: 4.6,
      total_reviews: 0, total_orders: 0, delivery_fee: 0.800, min_order: 1.000,
      avg_prep_time: '15-20 min', status: 'open', is_active: true,
      cuisine_types: ['Breakfast', 'American', 'Cafe'], price_range: 'budget',
      ambiance: ['casual', 'cozy'], dietary_options: ['vegetarian'],
      suitable_for: ['breakfast', 'brunch', 'morning'], features: ['all-day breakfast', 'fresh ingredients'],
      signature_dishes: ['Fluffy Pancakes', 'Classic Eggs Benedict', 'Full English Breakfast']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Pancakes & Waffles', description: 'Sweet breakfast', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Eggs', description: 'Egg dishes', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Breakfast Platters', description: 'Full breakfast meals', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Breakfast sides', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();

    const pancakeCat = categories.find(c => c.name === 'Pancakes & Waffles');
    const eggsCat = categories.find(c => c.name === 'Eggs');
    const platterCat = categories.find(c => c.name === 'Breakfast Platters');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: pancakeCat.id, category: 'Main Course', name: 'Fluffy Pancakes (3 pcs)', 
        description: 'Three fluffy pancakes with maple syrup and butter. Light and airy. Signature dish.', 
        price: 3.500, calories: 520, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: pancakeCat.id, category: 'Main Course', name: 'Chocolate Chip Pancakes', 
        description: 'Pancakes loaded with chocolate chips. Sweet and indulgent. Kids favorite.', 
        price: 4.000, calories: 620, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: pancakeCat.id, category: 'Main Course', name: 'Belgian Waffles', 
        description: 'Crispy Belgian waffles with whipped cream and berries. Classic breakfast. Delicious.', 
        price: 4.500, calories: 580, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['vegetarian'] },
      
      { restaurant_id: restaurant.id, category_id: eggsCat.id, category: 'Main Course', name: 'Classic Eggs Benedict', 
        description: 'Poached eggs on English muffin with hollandaise sauce. Elegant breakfast. Premium choice.', 
        price: 5.000, calories: 480, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: [] },
      { restaurant_id: restaurant.id, category_id: eggsCat.id, category: 'Main Course', name: 'Scrambled Eggs with Toast', 
        description: 'Fluffy scrambled eggs with buttered toast. Simple and satisfying. Classic breakfast.', 
        price: 3.000, calories: 380, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: eggsCat.id, category: 'Main Course', name: 'Omelette (3 eggs)', 
        description: 'Three-egg omelette with choice of fillings. Customizable. Protein-packed.', 
        price: 4.000, calories: 420, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['vegetarian', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: eggsCat.id, category: 'Main Course', name: 'Shakshuka', 
        description: 'Eggs poached in spiced tomato sauce. Middle Eastern breakfast. Flavorful and hearty.', 
        price: 4.500, calories: 380, preparation_time: 15, is_vegetarian: true, is_spicy: true, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: platterCat.id, category: 'Main Course', name: 'Full English Breakfast', 
        description: 'Eggs, bacon, sausage, beans, toast, tomato, mushrooms. Complete breakfast. Very filling.', 
        price: 6.500, calories: 820, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: platterCat.id, category: 'Main Course', name: 'American Breakfast', 
        description: 'Eggs, bacon, hash browns, pancakes, toast. Classic American. Best value.', 
        price: 6.000, calories: 780, preparation_time: 18, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: platterCat.id, category: 'Main Course', name: 'Healthy Breakfast Bowl', 
        description: 'Greek yogurt, granola, fresh fruits, honey. Light and nutritious. Healthy start.', 
        price: 4.500, calories: 380, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'brunch'], dietary_tags: ['vegetarian', 'healthy'] },
      
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Hash Browns', 
        description: 'Crispy golden hash browns. Perfect breakfast side. Crunchy outside, soft inside.', 
        price: 2.000, calories: 280, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Turkey Bacon (3 strips)', 
        description: 'Three strips of crispy turkey bacon. Halal option. Savory and delicious.', 
        price: 2.500, calories: 180, preparation_time: 8, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side', name: 'Fresh Fruit Bowl', 
        description: 'Seasonal fresh fruits. Healthy and refreshing. Vitamin-packed.', 
        price: 3.000, calories: 120, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'vegan', 'healthy', 'low-calorie'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Fresh Orange Juice', 
        description: 'Freshly squeezed orange juice. Vitamin C boost. Perfect morning drink.', 
        price: 2.000, calories: 110, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'healthy'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Coffee (Regular)', 
        description: 'Freshly brewed coffee. Wake up essential. Hot and aromatic.', 
        price: 1.500, calories: 5, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Cappuccino', 
        description: 'Espresso with steamed milk and foam. Creamy and smooth. Coffee shop quality.', 
        price: 2.500, calories: 120, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian'] }
    ]);

    console.log('✅ Breakfast Club created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
