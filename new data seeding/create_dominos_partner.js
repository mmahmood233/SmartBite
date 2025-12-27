/**
 * Create Domino's Partner Account
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

console.log('🔧 Supabase URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createDominosPartner() {
  console.log('🍕 Creating Domino\'s Partner Account...\n');

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'dominos@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Domino\'s Manager' }
    });
    if (authError) throw authError;
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'dominos@wajba.bh', full_name: 'Domino\'s Manager',
      phone: '+973 1776 6776', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Domino\'s Pizza', category: 'Pizza',
      description: 'You Got 30 Minutes! Fresh hand-tossed pizzas, pasta, chicken wings, and desserts. Fast delivery guaranteed.',
      address: 'Saar, Building 1818, Road 4242, Block 704, Saar, Bahrain',
      latitude: 26.1833, longitude: 50.4833, phone: '+973 1776 6776', email: 'dominos@wajba.bh',
      rating: 4.4, total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 4.500,
      avg_prep_time: '20-25 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Pizzas', description: 'Hand-tossed pizzas', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Wings, breadsticks, and more', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pasta', description: 'Italian pasta', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Sweet endings', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const pizzasCategory = categories.find(c => c.name === 'Pizzas');
    const sidesCategory = categories.find(c => c.name === 'Sides');
    const pastaCategory = categories.find(c => c.name === 'Pasta');
    const beveragesCategory = categories.find(c => c.name === 'Beverages');
    const dessertsCategory = categories.find(c => c.name === 'Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: pizzasCategory.id, category: 'Main Course', name: 'Extravaganza Pizza (Medium)', 
        description: 'Loaded with pepperoni, ham, beef, mushrooms, green peppers, onions, and black olives. The ultimate feast pizza.', 
        image: null, image_url: null, price: 5.800, calories: 310, preparation_time: 18, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pizzasCategory.id, category: 'Main Course', name: 'Pepperoni Pizza (Medium)', 
        description: 'Classic pepperoni with mozzarella cheese on our signature hand-tossed crust. Simple and delicious.', 
        image: null, image_url: null, price: 4.500, calories: 280, preparation_time: 18, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pizzasCategory.id, category: 'Main Course', name: 'Veggie Pizza (Medium)', 
        description: 'Fresh mushrooms, onions, green peppers, tomatoes, and black olives. A healthy vegetarian choice.', 
        image: null, image_url: null, price: 4.200, calories: 200, preparation_time: 18, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: pizzasCategory.id, category: 'Main Course', name: 'BBQ Chicken Pizza (Medium)', 
        description: 'Grilled chicken with tangy BBQ sauce, onions, and cheese. Sweet and smoky flavor.', 
        image: null, image_url: null, price: 5.200, calories: 270, preparation_time: 18, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCategory.id, category: 'Side', name: 'Buffalo Wings (8 pcs)', 
        description: 'Eight pieces of spicy buffalo wings with ranch dipping sauce. Hot and crispy.', 
        image: null, image_url: null, price: 3.200, calories: 500, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCategory.id, category: 'Side', name: 'Cheesy Bread', 
        description: 'Freshly baked bread topped with melted cheese and garlic. Perfect side for pizza.', 
        image: null, image_url: null, price: 2.000, calories: 200, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sidesCategory.id, category: 'Side', name: 'Garlic Twists', 
        description: 'Soft breadsticks twisted with garlic and herbs. Great for dipping.', 
        image: null, image_url: null, price: 1.800, calories: 180, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastaCategory.id, category: 'Main Course', name: 'Chicken Carbonara Pasta', 
        description: 'Creamy carbonara sauce with grilled chicken and bacon. Rich and indulgent.', 
        image: null, image_url: null, price: 4.800, calories: 650, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastaCategory.id, category: 'Main Course', name: 'Pasta Primavera', 
        description: 'Fresh vegetables in a light cream sauce with penne pasta. Vegetarian option.', 
        image: null, image_url: null, price: 4.200, calories: 480, preparation_time: 12, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCategory.id, category: 'Beverage', name: 'Coca-Cola (Medium)', 
        description: 'Ice-cold Coca-Cola. Classic refreshment.', 
        image: null, image_url: null, price: 0.600, calories: 140, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCategory.id, category: 'Dessert', name: 'Chocolate Lava Cake', 
        description: 'Warm chocolate cake with a molten chocolate center. Served with vanilla ice cream.', 
        image: null, image_url: null, price: 2.200, calories: 370, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCategory.id, category: 'Dessert', name: 'Cinnamon Bread Twists', 
        description: 'Sweet cinnamon-sugar coated bread twists. Perfect dessert or snack.', 
        image: null, image_url: null, price: 1.500, calories: 250, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Domino\'s Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: dominos@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createDominosPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
