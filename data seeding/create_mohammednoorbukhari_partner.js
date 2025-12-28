/**
 * Create Mohammed Noor Bukhari - Traditional Bahraini Rice Restaurant
 * Authentic Bahraini rice dishes: BD 3-10
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const RESTAURANT_NAME = 'Mohammed Noor Bukhari';
const RESTAURANT_EMAIL = 'mohammednoorbukhari@wajba.bh';
const RESTAURANT_CATEGORY = 'Arabic';
const RESTAURANT_DESCRIPTION = 'Authentic Bahraini rice restaurant serving traditional Bukhari rice, Mandi, and Kabsa. Family recipes passed down through generations. Perfect for traditional Arabic rice lovers.';
const RESTAURANT_ADDRESS = 'Manama, Bahrain';
const RESTAURANT_LATITUDE = 26.2285;
const RESTAURANT_LONGITUDE = 50.5860;
const RESTAURANT_PHONE = '+973 1722 3344';
const RESTAURANT_RATING = 4.6;
const DELIVERY_FEE = 1.500;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '30-35 min';

async function createRestaurantPartner() {
  console.log(`🍚 Creating ${RESTAURANT_NAME} Partner Account...\n`);

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', RESTAURANT_EMAIL)
      .single();

    let userId;

    if (existingUser) {
      console.log('⚠️  User already exists:', existingUser.email);
      userId = existingUser.id;
      if (existingUser.role !== 'partner') {
        await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
        console.log('✅ Role updated to partner');
      }
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: RESTAURANT_EMAIL, password: '12345678', email_confirm: true,
        user_metadata: { full_name: `${RESTAURANT_NAME} Manager` }
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const existingAuthUser = users.find(u => u.email === RESTAURANT_EMAIL);
          userId = existingAuthUser.id;
          console.log('✅ Found existing auth user');
        } else {
          throw authError;
        }
      } else {
        userId = authData.user.id;
        console.log('✅ Auth user created');
      }

      await supabase.from('users').insert({
        id: userId, email: RESTAURANT_EMAIL, full_name: `${RESTAURANT_NAME} Manager`,
        phone: RESTAURANT_PHONE, role: 'partner', is_active: true
      });
      console.log('✅ Public user created');
    }

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: RESTAURANT_NAME, category: RESTAURANT_CATEGORY,
      description: RESTAURANT_DESCRIPTION, address: RESTAURANT_ADDRESS,
      latitude: RESTAURANT_LATITUDE, longitude: RESTAURANT_LONGITUDE,
      phone: RESTAURANT_PHONE, email: RESTAURANT_EMAIL, rating: RESTAURANT_RATING,
      total_reviews: 0, total_orders: 0, delivery_fee: DELIVERY_FEE, min_order: MIN_ORDER,
      avg_prep_time: AVG_PREP_TIME, status: 'open', is_active: true,
      cuisine_types: ['Arabic', 'Bahraini', 'Rice'], price_range: 'mid-range',
      ambiance: ['traditional', 'family-friendly'], dietary_options: ['halal'],
      suitable_for: ['family', 'lunch', 'dinner'], features: ['traditional recipes', 'authentic Bahraini'],
      signature_dishes: ['Chicken Bukhari', 'Lamb Mandi', 'Mixed Grill with Rice']
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Rice Dishes', description: 'Traditional rice meals', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Grilled Meats', description: 'Grilled chicken, lamb, beef', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Starters and sides', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 4, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const riceCat = categories.find(c => c.name === 'Rice Dishes');
    const grillCat = categories.find(c => c.name === 'Grilled Meats');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const bevCat = categories.find(c => c.name === 'Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Chicken Bukhari Rice', 
        description: 'Aromatic Bukhari rice with tender chicken, raisins, and nuts. Traditional Bahraini recipe. Signature dish.', 
        price: 5.500, calories: 680, preparation_time: 30, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'aromatic', 'nutty'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Lamb Bukhari Rice', 
        description: 'Fragrant Bukhari rice with tender lamb pieces, raisins, and almonds. Rich and flavorful. Premium choice.', 
        price: 7.000, calories: 780, preparation_time: 35, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'rich', 'aromatic'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Chicken Mandi', 
        description: 'Slow-cooked chicken with Mandi rice, special spices. Traditional Yemeni-style. Very popular.', 
        price: 6.000, calories: 720, preparation_time: 35, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 1, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'spiced', 'smoky'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Lamb Mandi', 
        description: 'Tender lamb with aromatic Mandi rice. Slow-cooked to perfection. Traditional favorite.', 
        price: 8.000, calories: 850, preparation_time: 40, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 1, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'rich', 'spiced'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Chicken Kabsa', 
        description: 'Saudi-style Kabsa rice with chicken, tomatoes, and spices. Flavorful and aromatic.', 
        price: 5.500, calories: 690, preparation_time: 30, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 1, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'spiced', 'tangy'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Mixed Grill with Rice', 
        description: 'Grilled chicken, lamb, and kafta with rice. Perfect for sharing. Family favorite.', 
        price: 9.500, calories: 920, preparation_time: 35, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'grilled', 'smoky'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Fish Sayadieh', 
        description: 'Spiced rice with fried fish, onions, and nuts. Coastal Bahraini specialty.', 
        price: 7.500, calories: 650, preparation_time: 35, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 1, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'seafood'],
        flavor_profile: ['savory', 'spiced', 'nutty'] },
      
      { restaurant_id: restaurant.id, category_id: grillCat.id, category: 'Main Course',
        name: 'Grilled Chicken (Half)', 
        description: 'Half grilled chicken marinated in Arabic spices. Juicy and flavorful.', 
        price: 4.500, calories: 520, preparation_time: 25, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'grilled', 'spiced'] },
      { restaurant_id: restaurant.id, category_id: grillCat.id, category: 'Main Course',
        name: 'Lamb Chops', 
        description: 'Grilled lamb chops with herbs and spices. Tender and delicious. Premium meat.', 
        price: 8.500, calories: 680, preparation_time: 30, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'grilled', 'rich'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer',
        name: 'Hummus', 
        description: 'Creamy chickpea dip with tahini and olive oil. Classic Arabic appetizer.', 
        price: 2.000, calories: 180, preparation_time: 5, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'vegan', 'healthy'],
        flavor_profile: ['creamy', 'tangy'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer',
        name: 'Arabic Salad', 
        description: 'Fresh tomatoes, cucumbers, lettuce with lemon dressing. Light and refreshing.', 
        price: 2.500, calories: 80, preparation_time: 5, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['appetizer', 'side'], dietary_tags: ['vegetarian', 'vegan', 'healthy', 'low-calorie'],
        flavor_profile: ['fresh', 'tangy'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Fresh Laban', 
        description: 'Traditional yogurt drink. Refreshing and cooling. Perfect with rice dishes.', 
        price: 1.500, calories: 120, preparation_time: 2, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian'],
        flavor_profile: ['tangy', 'refreshing'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Arabic Tea', 
        description: 'Traditional Arabic tea with cardamom. Aromatic and soothing.', 
        price: 1.000, calories: 20, preparation_time: 3, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan'],
        flavor_profile: ['aromatic', 'warm'] }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${RESTAURANT_NAME} Partner Account Created Successfully!`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', RESTAURANT_EMAIL);
    console.log('🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId);
    console.log('🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length);
    console.log('🍚 Dishes:', dishes.length);
    console.log('💰 Price Range: BD 1.00 - BD 9.50');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createRestaurantPartner()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
