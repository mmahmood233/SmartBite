/**
 * Create Coco's Partner Account - Popular Local Cafe
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createCocosPartner() {
  console.log('☕ Creating Coco\'s Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'cocos@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Coco\'s Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'cocos@wajba.bh', full_name: 'Coco\'s Manager',
      phone: '+973 1786 6786', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Coco\'s', category: 'Cafe',
      description: 'Trendy local cafe with specialty coffee, fresh pastries, and healthy bowls. Instagram-worthy dishes and cozy atmosphere. Perfect for brunch.',
      address: 'Adliya, Building 199, Road 3838, Block 338, Adliya, Manama, Bahrain',
      latitude: 26.2190, longitude: 50.5960, phone: '+973 1786 6786', email: 'cocos@wajba.bh',
      rating: 4.7, total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 4.000,
      avg_prep_time: '15-20 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Breakfast & Brunch', description: 'All-day breakfast', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Healthy Bowls', description: 'Acai and smoothie bowls', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches & Wraps', description: 'Fresh sandwiches', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Coffee & Drinks', description: 'Specialty coffee', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pastries & Desserts', description: 'Fresh baked goods', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const breakfastCat = categories.find(c => c.name === 'Breakfast & Brunch');
    const bowlsCat = categories.find(c => c.name === 'Healthy Bowls');
    const sandwichesCat = categories.find(c => c.name === 'Sandwiches & Wraps');
    const coffeeCat = categories.find(c => c.name === 'Coffee & Drinks');
    const pastriesCat = categories.find(c => c.name === 'Pastries & Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: breakfastCat.id, category: 'Breakfast', name: 'Avocado Toast', 
        description: 'Smashed avocado on sourdough with poached eggs, cherry tomatoes, and feta cheese. Instagram favorite and nutritious.', 
        image: null, image_url: null, price: 3.500, calories: 420, preparation_time: 12, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: breakfastCat.id, category: 'Breakfast', name: 'Eggs Benedict', 
        description: 'Poached eggs with hollandaise sauce on English muffins. Choice of smoked salmon or turkey bacon.', 
        image: null, image_url: null, price: 4.200, calories: 520, preparation_time: 15, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: breakfastCat.id, category: 'Breakfast', name: 'Pancake Stack', 
        description: 'Fluffy pancakes with maple syrup, fresh berries, and whipped cream. Classic brunch favorite.', 
        image: null, image_url: null, price: 3.200, calories: 580, preparation_time: 12, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: bowlsCat.id, category: 'Main Course', name: 'Acai Bowl', 
        description: 'Acai berry blend topped with granola, fresh fruits, coconut flakes, and honey. Superfood breakfast.', 
        image: null, image_url: null, price: 4.500, calories: 380, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: bowlsCat.id, category: 'Main Course', name: 'Poke Bowl', 
        description: 'Fresh salmon or tuna with rice, edamame, avocado, and sesame dressing. Healthy and filling.', 
        image: null, image_url: null, price: 5.500, calories: 520, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sandwichesCat.id, category: 'Main Course', name: 'Grilled Chicken Wrap', 
        description: 'Grilled chicken with mixed greens, tomatoes, and Caesar dressing in a whole wheat wrap.', 
        image: null, image_url: null, price: 3.800, calories: 480, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sandwichesCat.id, category: 'Main Course', name: 'Veggie Panini', 
        description: 'Grilled vegetables with mozzarella and pesto on pressed ciabatta. Vegetarian option.', 
        image: null, image_url: null, price: 3.500, calories: 420, preparation_time: 10, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: coffeeCat.id, category: 'Beverage', name: 'Flat White', 
        description: 'Smooth espresso with velvety microfoam milk. Specialty coffee perfection.', 
        image: null, image_url: null, price: 1.800, calories: 120, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: coffeeCat.id, category: 'Beverage', name: 'Iced Spanish Latte', 
        description: 'Espresso with condensed milk over ice. Sweet and creamy coffee drink.', 
        image: null, image_url: null, price: 2.200, calories: 180, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: coffeeCat.id, category: 'Beverage', name: 'Fresh Green Smoothie', 
        description: 'Spinach, banana, mango, and coconut water. Healthy and refreshing.', 
        image: null, image_url: null, price: 2.500, calories: 180, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastriesCat.id, category: 'Dessert', name: 'Croissant', 
        description: 'Buttery French croissant baked fresh daily. Flaky and delicious.', 
        image: null, image_url: null, price: 1.500, calories: 280, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastriesCat.id, category: 'Dessert', name: 'Carrot Cake', 
        description: 'Moist carrot cake with cream cheese frosting and walnuts. Homemade recipe.', 
        image: null, image_url: null, price: 2.800, calories: 420, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Coco\'s Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: cocos@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createCocosPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
