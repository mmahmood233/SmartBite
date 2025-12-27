/**
 * Create VOX Cinema - Cinema Snacks & Concessions
 * Popcorn, nachos, hot dogs, candy, drinks: BD 1-6
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const RESTAURANT_NAME = 'VOX Cinema';
const RESTAURANT_EMAIL = 'voxcinema@wajba.bh';
const RESTAURANT_CATEGORY = 'Cinema';
const RESTAURANT_DESCRIPTION = 'Premium cinema concessions featuring freshly popped popcorn, loaded nachos, hot dogs, candy, and beverages. Perfect movie snacks for your entertainment experience.';
const RESTAURANT_ADDRESS = 'City Centre Bahrain, Manama';
const RESTAURANT_LATITUDE = 26.2361;
const RESTAURANT_LONGITUDE = 50.5340;
const RESTAURANT_PHONE = '+973 1711 0000';
const RESTAURANT_RATING = 4.5;
const DELIVERY_FEE = 0.800;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '5-8 min';

async function createRestaurantPartner() {
  console.log(`🎬 Creating ${RESTAURANT_NAME} Partner Account...\n`);

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
      cuisine_types: ['Cinema', 'Snacks', 'Fast Food'], price_range: 'budget',
      ambiance: ['entertainment', 'casual'], dietary_options: ['vegetarian'],
      suitable_for: ['snack', 'movie night', 'entertainment'], features: ['quick service', 'cinema snacks'],
      signature_dishes: ['VOX Signature Popcorn', 'Loaded Nachos', 'Cinema Combo']
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Popcorn', description: 'Freshly popped popcorn', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Nachos', description: 'Loaded nachos', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Hot Food', description: 'Hot dogs and more', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Candy & Snacks', description: 'Sweet treats', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true },
      { restaurant_id: restaurant.id, name: 'Combos', description: 'Value combos', display_order: 6, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const popcornCat = categories.find(c => c.name === 'Popcorn');
    const nachosCat = categories.find(c => c.name === 'Nachos');
    const hotFoodCat = categories.find(c => c.name === 'Hot Food');
    const candyCat = categories.find(c => c.name === 'Candy & Snacks');
    const bevCat = categories.find(c => c.name === 'Beverages');
    const comboCat = categories.find(c => c.name === 'Combos');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: popcornCat.id, category: 'Snack',
        name: 'Regular Butter Popcorn', 
        description: 'Freshly popped popcorn with butter. Classic cinema snack. Perfect for solo viewing.', 
        price: 1.500, calories: 250, preparation_time: 3, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: popcornCat.id, category: 'Snack',
        name: 'Large Butter Popcorn', 
        description: 'Large freshly popped popcorn with butter. Great for sharing. Movie night essential.', 
        price: 2.500, calories: 420, preparation_time: 3, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: popcornCat.id, category: 'Snack',
        name: 'Caramel Popcorn', 
        description: 'Sweet caramel-coated popcorn. Crunchy and delicious. Premium cinema treat.', 
        price: 2.800, calories: 380, preparation_time: 3, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: popcornCat.id, category: 'Snack',
        name: 'Cheese Popcorn', 
        description: 'Savory cheese-flavored popcorn. Rich and cheesy. Fan favorite.', 
        price: 2.800, calories: 340, preparation_time: 3, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      
      { restaurant_id: restaurant.id, category_id: nachosCat.id, category: 'Snack',
        name: 'Regular Nachos with Cheese', 
        description: 'Crispy nachos with warm cheese sauce. Classic cinema snack. Cheesy goodness.', 
        price: 2.500, calories: 380, preparation_time: 4, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: nachosCat.id, category: 'Snack',
        name: 'Large Loaded Nachos', 
        description: 'Large nachos with cheese, jalapeños, salsa, and sour cream. Fully loaded. Sharing size.', 
        price: 4.000, calories: 580, preparation_time: 5, is_vegetarian: true, is_vegan: false, 
        is_spicy: true, spice_level: 2, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      
      { restaurant_id: restaurant.id, category_id: hotFoodCat.id, category: 'Main Course',
        name: 'Classic Hot Dog', 
        description: 'Grilled hot dog with mustard and ketchup. Cinema classic. Quick and tasty.', 
        price: 2.500, calories: 320, preparation_time: 5, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: [] },
      { restaurant_id: restaurant.id, category_id: hotFoodCat.id, category: 'Main Course',
        name: 'Cheese Hot Dog', 
        description: 'Hot dog topped with melted cheese. Extra cheesy. Comfort food.', 
        price: 3.000, calories: 380, preparation_time: 5, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: [] },
      { restaurant_id: restaurant.id, category_id: hotFoodCat.id, category: 'Main Course',
        name: 'Chicken Tenders (3 pcs)', 
        description: 'Crispy chicken tenders with dipping sauce. Crunchy and juicy. Movie snack favorite.', 
        price: 3.500, calories: 420, preparation_time: 6, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: candyCat.id, category: 'Snack',
        name: 'M&Ms', 
        description: 'Colorful chocolate candies. Classic movie candy. Sweet treat.', 
        price: 1.500, calories: 240, preparation_time: 1, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: candyCat.id, category: 'Snack',
        name: 'Skittles', 
        description: 'Fruity chewy candies. Rainbow of flavors. Sweet and tangy.', 
        price: 1.500, calories: 230, preparation_time: 1, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian', 'vegan'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Soft Drink (Regular)', 
        description: 'Chilled soft drink. Choice of flavors. Refreshing.', 
        price: 1.500, calories: 150, preparation_time: 2, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Soft Drink (Large)', 
        description: 'Large chilled soft drink. Choice of flavors. Perfect for sharing.', 
        price: 2.000, calories: 250, preparation_time: 2, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Bottled Water', 
        description: 'Chilled bottled water. Stay hydrated. Refreshing.', 
        price: 1.000, calories: 0, preparation_time: 1, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'healthy'] },
      
      { restaurant_id: restaurant.id, category_id: comboCat.id, category: 'Combo',
        name: 'Cinema Combo (Popcorn + Drink)', 
        description: 'Large popcorn and large soft drink. Perfect movie combo. Best value.', 
        price: 4.000, calories: 670, preparation_time: 4, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: comboCat.id, category: 'Combo',
        name: 'Nachos Combo (Nachos + Drink)', 
        description: 'Large loaded nachos and soft drink. Cheesy combo. Great deal.', 
        price: 5.500, calories: 830, preparation_time: 5, is_vegetarian: true, is_vegan: false, 
        is_spicy: true, spice_level: 2, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] },
      { restaurant_id: restaurant.id, category_id: comboCat.id, category: 'Combo',
        name: 'Family Combo (2 Popcorn + 2 Drinks)', 
        description: 'Two large popcorns and two large drinks. Perfect for sharing. Family size.', 
        price: 7.500, calories: 1340, preparation_time: 5, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['snack'], dietary_tags: ['vegetarian'] }
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
    console.log('🎬 Dishes:', dishes.length);
    console.log('💰 Price Range: BD 1.00 - BD 7.50');
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
