/**
 * Create Pizza Hut Partner Account
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

async function createPizzaHutPartner() {
  console.log('🍕 Creating Pizza Hut Partner Account...\n');

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'pizzahut@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Pizza Hut Manager' }
    });
    if (authError) throw authError;
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'pizzahut@wajba.bh', full_name: 'Pizza Hut Manager',
      phone: '+973 1775 5775', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Pizza Hut', category: 'Pizza',
      description: 'No one OutPizzas the Hut! Delicious pizzas, pasta, wings, and sides. Quality ingredients and great taste.',
      address: 'Riffa, Building 2020, Road 5151, Block 951, Riffa, Bahrain',
      latitude: 26.1299, longitude: 50.5550, phone: '+973 1775 5775', email: 'pizzahut@wajba.bh',
      rating: 4.5, total_reviews: 0, total_orders: 0, delivery_fee: 1.500, min_order: 5.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Pizzas', description: 'Our signature pizzas', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pasta', description: 'Italian pasta dishes', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Wings & Sides', description: 'Chicken wings and sides', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Sweet treats', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const pizzasCategory = categories.find(c => c.name === 'Pizzas');
    const pastaCategory = categories.find(c => c.name === 'Pasta');
    const wingsCategory = categories.find(c => c.name === 'Wings & Sides');
    const beveragesCategory = categories.find(c => c.name === 'Beverages');
    const dessertsCategory = categories.find(c => c.name === 'Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: pizzasCategory.id, category: 'Main Course', name: 'Supreme Pizza (Medium)', 
        description: 'Loaded with pepperoni, beef, mushrooms, green peppers, and onions. Our most popular pizza with all the toppings.', 
        image: null, image_url: null, price: 5.500, calories: 280, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pizzasCategory.id, category: 'Main Course', name: 'Pepperoni Lovers (Medium)', 
        description: 'Extra pepperoni on top of our signature sauce and cheese. For true pepperoni fans.', 
        image: null, image_url: null, price: 5.000, calories: 300, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pizzasCategory.id, category: 'Main Course', name: 'Veggie Lovers (Medium)', 
        description: 'Mushrooms, green peppers, onions, tomatoes, and black olives. A vegetarian delight.', 
        image: null, image_url: null, price: 4.800, calories: 220, preparation_time: 20, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: pizzasCategory.id, category: 'Main Course', name: 'BBQ Chicken Pizza (Medium)', 
        description: 'Grilled chicken with BBQ sauce, onions, and cheese. Sweet and savory combination.', 
        image: null, image_url: null, price: 5.200, calories: 260, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastaCategory.id, category: 'Main Course', name: 'Chicken Alfredo Pasta', 
        description: 'Creamy Alfredo sauce with grilled chicken and fettuccine pasta. Rich and satisfying.', 
        image: null, image_url: null, price: 4.500, calories: 620, preparation_time: 15, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastaCategory.id, category: 'Main Course', name: 'Spaghetti Bolognese', 
        description: 'Classic Italian pasta with rich meat sauce. Comfort food at its best.', 
        image: null, image_url: null, price: 4.200, calories: 580, preparation_time: 15, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: wingsCategory.id, category: 'Side', name: 'Buffalo Wings (8 pcs)', 
        description: 'Eight pieces of spicy buffalo chicken wings. Crispy and flavorful.', 
        image: null, image_url: null, price: 3.500, calories: 540, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: wingsCategory.id, category: 'Side', name: 'Garlic Bread', 
        description: 'Warm bread with garlic butter and herbs. Perfect side for pizza or pasta.', 
        image: null, image_url: null, price: 1.500, calories: 180, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: wingsCategory.id, category: 'Side', name: 'Breadsticks', 
        description: 'Soft breadsticks with marinara dipping sauce. Great for sharing.', 
        image: null, image_url: null, price: 1.800, calories: 150, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCategory.id, category: 'Beverage', name: 'Pepsi (Medium)', 
        description: 'Ice-cold Pepsi. Refreshing soft drink.', 
        image: null, image_url: null, price: 0.600, calories: 150, preparation_time: 2, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCategory.id, category: 'Dessert', name: 'Chocolate Brownie', 
        description: 'Warm chocolate brownie with a gooey center. Decadent dessert.', 
        image: null, image_url: null, price: 1.800, calories: 370, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Pizza Hut Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: pizzahut@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createPizzaHutPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
