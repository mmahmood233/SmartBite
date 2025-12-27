/**
 * Create Lanterns Partner Account - Arabic/Middle Eastern Restaurant
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createLanternsPartner() {
  console.log('🏮 Creating Lanterns Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'lanterns@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Lanterns Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'lanterns@wajba.bh', full_name: 'Lanterns Manager',
      phone: '+973 1782 2782', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Lanterns', category: 'Arabic',
      description: 'Authentic Middle Eastern cuisine in a cozy atmosphere. Traditional recipes, fresh ingredients, and warm hospitality. Perfect for family gatherings.',
      address: 'Budaiya, Building 350, Road 4545, Block 440, Budaiya, Bahrain',
      latitude: 26.1950, longitude: 50.4750, phone: '+973 1782 2782', email: 'lanterns@wajba.bh',
      rating: 4.6, total_reviews: 0, total_orders: 0, delivery_fee: 1.500, min_order: 6.000,
      avg_prep_time: '30-35 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Grills & BBQ', description: 'Charcoal grilled meats', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Traditional Dishes', description: 'Authentic Arabic meals', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Mezze & Appetizers', description: 'Cold and hot mezze', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Soups & Salads', description: 'Fresh salads and soups', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Fresh juices and drinks', display_order: 5, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Arabic sweets', display_order: 6, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const grillsCat = categories.find(c => c.name === 'Grills & BBQ');
    const traditionalCat = categories.find(c => c.name === 'Traditional Dishes');
    const mezzeCat = categories.find(c => c.name === 'Mezze & Appetizers');
    const soupsCat = categories.find(c => c.name === 'Soups & Salads');
    const beveragesCat = categories.find(c => c.name === 'Beverages');
    const dessertsCat = categories.find(c => c.name === 'Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: grillsCat.id, category: 'Main Course', name: 'Lamb Chops (4 pcs)', 
        description: 'Tender lamb chops marinated with herbs and grilled over charcoal. Served with grilled vegetables and mint sauce. Premium quality meat.', 
        image: null, image_url: null, price: 7.500, calories: 680, preparation_time: 25, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: grillsCat.id, category: 'Main Course', name: 'Shish Tawook', 
        description: 'Marinated chicken skewers grilled to perfection. Served with garlic sauce, pickles, and Arabic bread. Light and flavorful.', 
        image: null, image_url: null, price: 4.800, calories: 420, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: grillsCat.id, category: 'Main Course', name: 'Mixed Grill for Two', 
        description: 'Assorted grilled meats including lamb, chicken, and kofta. Perfect for sharing with rice, salad, and sauces.', 
        image: null, image_url: null, price: 12.000, calories: 1400, preparation_time: 30, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: traditionalCat.id, category: 'Main Course', name: 'Chicken Mandi', 
        description: 'Traditional Yemeni rice dish with tender chicken, aromatic spices, and roasted nuts. Slow-cooked to perfection.', 
        image: null, image_url: null, price: 6.500, calories: 780, preparation_time: 35, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: traditionalCat.id, category: 'Main Course', name: 'Lamb Ouzi', 
        description: 'Spiced rice with tender lamb, nuts, and raisins wrapped in phyllo pastry. A festive Arabic dish.', 
        image: null, image_url: null, price: 7.000, calories: 850, preparation_time: 40, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Mezze Platter', 
        description: 'Assorted mezze including hummus, mutabal, tabbouleh, and fattoush. Perfect starter for sharing.', 
        image: null, image_url: null, price: 4.500, calories: 420, preparation_time: 10, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Kibbeh (4 pcs)', 
        description: 'Fried bulgur shells stuffed with spiced minced meat and pine nuts. Crispy outside, juicy inside.', 
        image: null, image_url: null, price: 3.200, calories: 380, preparation_time: 12, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Cheese Sambousek (6 pcs)', 
        description: 'Crispy pastry filled with melted cheese and herbs. Vegetarian appetizer favorite.', 
        image: null, image_url: null, price: 2.800, calories: 320, preparation_time: 10, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: soupsCat.id, category: 'Appetizer', name: 'Lentil Soup', 
        description: 'Traditional red lentil soup with cumin and lemon. Healthy and comforting. Vegan friendly.', 
        image: null, image_url: null, price: 1.800, calories: 180, preparation_time: 8, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: soupsCat.id, category: 'Salad', name: 'Fattoush Salad', 
        description: 'Fresh mixed greens with crispy pita chips, pomegranate molasses dressing. Refreshing and tangy.', 
        image: null, image_url: null, price: 2.500, calories: 150, preparation_time: 8, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Fresh Mint Lemonade', 
        description: 'Freshly squeezed lemon with mint leaves. Refreshing and revitalizing.', 
        image: null, image_url: null, price: 1.500, calories: 90, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Jallab', 
        description: 'Traditional drink made with dates, grape molasses, and rose water. Topped with pine nuts and raisins.', 
        image: null, image_url: null, price: 2.000, calories: 180, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCat.id, category: 'Dessert', name: 'Um Ali', 
        description: 'Traditional Egyptian bread pudding with nuts, coconut, and cream. Served warm. Rich and indulgent.', 
        image: null, image_url: null, price: 2.800, calories: 450, preparation_time: 10, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCat.id, category: 'Dessert', name: 'Basbousa', 
        description: 'Semolina cake soaked in sugar syrup with coconut. Sweet and moist Arabic dessert.', 
        image: null, image_url: null, price: 2.200, calories: 380, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Lanterns Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: lanterns@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createLanternsPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
