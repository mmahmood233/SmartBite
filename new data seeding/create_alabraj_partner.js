/**
 * Create Al Abraj Partner Account - Local Bahraini Restaurant
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAlAbrajPartner() {
  console.log('🇧🇭 Creating Al Abraj Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'alabraj@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Al Abraj Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'alabraj@wajba.bh', full_name: 'Al Abraj Manager',
      phone: '+973 1780 0780', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Al Abraj', category: 'Arabic',
      description: 'Authentic Bahraini and Arabic cuisine. Traditional grills, mezze, and local specialties. Family-friendly atmosphere with genuine flavors.',
      address: 'Manama Souq, Building 120, Road 1010, Block 304, Manama, Bahrain',
      latitude: 26.2285, longitude: 50.5860, phone: '+973 1780 0780', email: 'alabraj@wajba.bh',
      rating: 4.7, total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 5.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Grills', description: 'Traditional Arabic grills', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Mezze', description: 'Arabic appetizers', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Rice Dishes', description: 'Biryani and Kabsa', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches', description: 'Arabic sandwiches', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Fresh juices and drinks', display_order: 5, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Arabic sweets', display_order: 6, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const grillsCat = categories.find(c => c.name === 'Grills');
    const mezzeCat = categories.find(c => c.name === 'Mezze');
    const riceCat = categories.find(c => c.name === 'Rice Dishes');
    const sandwichesCat = categories.find(c => c.name === 'Sandwiches');
    const beveragesCat = categories.find(c => c.name === 'Beverages');
    const dessertsCat = categories.find(c => c.name === 'Desserts');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: grillsCat.id, category: 'Main Course', name: 'Mixed Grill Platter', 
        description: 'Assorted grilled meats including lamb kebab, chicken tikka, and beef kofta. Served with rice, grilled vegetables, and tahini sauce. A feast of flavors.', 
        image: null, image_url: null, price: 6.500, calories: 850, preparation_time: 25, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: grillsCat.id, category: 'Main Course', name: 'Chicken Tikka', 
        description: 'Marinated chicken pieces grilled to perfection. Tender and juicy with aromatic spices. Served with garlic sauce and pickles.', 
        image: null, image_url: null, price: 4.500, calories: 420, preparation_time: 20, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: grillsCat.id, category: 'Main Course', name: 'Lamb Kebab', 
        description: 'Minced lamb with herbs and spices, grilled on skewers. Traditional Arabic preparation with authentic flavors.', 
        image: null, image_url: null, price: 5.000, calories: 520, preparation_time: 22, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Hummus', 
        description: 'Creamy chickpea dip with tahini, lemon, and olive oil. Served with warm Arabic bread. Classic Middle Eastern appetizer.', 
        image: null, image_url: null, price: 1.800, calories: 180, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Mutabal (Baba Ghanoush)', 
        description: 'Smoky grilled eggplant dip with tahini and garlic. Rich and creamy vegetarian mezze.', 
        image: null, image_url: null, price: 2.000, calories: 150, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Falafel (6 pcs)', 
        description: 'Crispy fried chickpea patties with herbs and spices. Served with tahini sauce. Vegetarian and vegan friendly.', 
        image: null, image_url: null, price: 2.200, calories: 330, preparation_time: 8, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course', name: 'Chicken Biryani', 
        description: 'Fragrant basmati rice with tender chicken, aromatic spices, and fried onions. A complete meal with raita and salad.', 
        image: null, image_url: null, price: 5.500, calories: 720, preparation_time: 30, 
        is_vegetarian: false, is_vegan: false, is_spicy: true, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course', name: 'Lamb Kabsa', 
        description: 'Traditional Gulf rice dish with tender lamb, aromatic spices, and nuts. Authentic Bahraini flavor.', 
        image: null, image_url: null, price: 6.000, calories: 820, preparation_time: 35, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sandwichesCat.id, category: 'Main Course', name: 'Shawarma Chicken', 
        description: 'Marinated chicken shawarma in Arabic bread with garlic sauce, pickles, and fries. Street food favorite.', 
        image: null, image_url: null, price: 2.500, calories: 480, preparation_time: 10, 
        is_vegetarian: false, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: sandwichesCat.id, category: 'Main Course', name: 'Falafel Sandwich', 
        description: 'Crispy falafel in Arabic bread with tahini, vegetables, and pickles. Vegetarian and vegan option.', 
        image: null, image_url: null, price: 2.000, calories: 380, preparation_time: 8, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Fresh Orange Juice', 
        description: 'Freshly squeezed orange juice. Natural and refreshing with no added sugar.', 
        image: null, image_url: null, price: 1.500, calories: 110, preparation_time: 5, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Laban (Buttermilk)', 
        description: 'Traditional Arabic yogurt drink. Refreshing and pairs perfectly with grilled meats.', 
        image: null, image_url: null, price: 1.000, calories: 80, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCat.id, category: 'Dessert', name: 'Kunafa', 
        description: 'Sweet cheese pastry with crispy shredded phyllo and sugar syrup. Traditional Arabic dessert.', 
        image: null, image_url: null, price: 2.500, calories: 420, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: dessertsCat.id, category: 'Dessert', name: 'Baklava (3 pcs)', 
        description: 'Layers of phyllo pastry with nuts and honey. Sweet and crunchy Middle Eastern classic.', 
        image: null, image_url: null, price: 2.000, calories: 350, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Al Abraj Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: alabraj@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createAlAbrajPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
