/**
 * Create Healthy Spot - Healthy Meal Restaurant
 * Mexican chicken, pasta, soups, shawarma: BD 3-7
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const RESTAURANT_NAME = 'Healthy Spot';
const RESTAURANT_EMAIL = 'healthyspot@wajba.bh';
const RESTAURANT_CATEGORY = 'Healthy';
const RESTAURANT_DESCRIPTION = 'Healthy meals with international flavors. Mexican chicken, pasta, soups, and shawarma - all made healthy. Perfect for those who want flavor without compromising health.';
const RESTAURANT_ADDRESS = 'Riffa, Bahrain';
const RESTAURANT_LATITUDE = 26.1300;
const RESTAURANT_LONGITUDE = 50.5550;
const RESTAURANT_PHONE = '+973 1766 6000';
const RESTAURANT_RATING = 4.6;
const DELIVERY_FEE = 1.000;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '18-22 min';

async function createRestaurantPartner() {
  console.log(`🥗 Creating ${RESTAURANT_NAME} Partner Account...\n`);

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
      cuisine_types: ['Healthy', 'International', 'Mexican'], price_range: 'mid-range',
      ambiance: ['healthy', 'casual'], dietary_options: ['halal', 'low-calorie', 'high-protein'],
      suitable_for: ['fitness', 'lunch', 'dinner', 'diet'], features: ['healthy options', 'international flavors'],
      signature_dishes: ['Mexican Chicken', 'Spaghetti Bolognese Pasta', 'Chicken Shawarma']
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Mexican', description: 'Healthy Mexican dishes', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pasta', description: 'Healthy pasta options', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Soups', description: 'Nutritious soups', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches & Wraps', description: 'Healthy wraps and sandwiches', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Healthy drinks', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const mexicanCat = categories.find(c => c.name === 'Mexican');
    const pastaCat = categories.find(c => c.name === 'Pasta');
    const soupCat = categories.find(c => c.name === 'Soups');
    const sandwichCat = categories.find(c => c.name === 'Sandwiches & Wraps');
    const bevCat = categories.find(c => c.name === 'Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: mexicanCat.id, category: 'Main Course',
        name: 'Mexican Chicken', 
        description: 'Grilled chicken with Mexican spices, peppers, and onions. Flavorful and healthy. Signature dish.', 
        price: 5.000, calories: 420, preparation_time: 18, is_vegetarian: false, is_vegan: false, 
        is_spicy: true, spice_level: 2, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein', 'low-fat'],
        flavor_profile: ['savory', 'spiced', 'grilled'] },
      { restaurant_id: restaurant.id, category_id: mexicanCat.id, category: 'Main Course',
        name: 'Chicken Fajitas Bowl', 
        description: 'Grilled chicken fajitas with peppers, onions, and brown rice. Tex-Mex healthy bowl. Balanced meal.', 
        price: 5.500, calories: 480, preparation_time: 20, is_vegetarian: false, is_vegan: false, 
        is_spicy: true, spice_level: 2, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'spiced', 'smoky'] },
      { restaurant_id: restaurant.id, category_id: mexicanCat.id, category: 'Main Course',
        name: 'Healthy Burrito Bowl', 
        description: 'Brown rice, grilled chicken, black beans, salsa, guacamole. No tortilla, all flavor. Protein-packed.', 
        price: 5.800, calories: 520, preparation_time: 18, is_vegetarian: false, is_vegan: false, 
        is_spicy: true, spice_level: 1, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein', 'high-fiber'],
        flavor_profile: ['savory', 'spiced', 'fresh'] },
      
      { restaurant_id: restaurant.id, category_id: pastaCat.id, category: 'Main Course',
        name: 'Spaghetti Bolognese Pasta', 
        description: 'Whole wheat spaghetti with lean beef Bolognese sauce. Italian classic made healthy. Comfort food.', 
        price: 5.200, calories: 520, preparation_time: 20, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'rich', 'tangy'] },
      { restaurant_id: restaurant.id, category_id: pastaCat.id, category: 'Main Course',
        name: 'Chicken Alfredo Pasta', 
        description: 'Whole wheat pasta with grilled chicken and light Alfredo sauce. Creamy and satisfying. Lower calorie version.', 
        price: 5.500, calories: 480, preparation_time: 18, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'creamy', 'rich'] },
      { restaurant_id: restaurant.id, category_id: pastaCat.id, category: 'Main Course',
        name: 'Penne Arrabbiata', 
        description: 'Whole wheat penne with spicy tomato sauce. Vegan-friendly Italian. Light and flavorful.', 
        price: 4.500, calories: 380, preparation_time: 15, is_vegetarian: true, is_vegan: true, 
        is_spicy: true, spice_level: 2, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'vegan', 'low-calorie'],
        flavor_profile: ['savory', 'spicy', 'tangy'] },
      
      { restaurant_id: restaurant.id, category_id: soupCat.id, category: 'Soup',
        name: 'Chicken Oats Soup', 
        description: 'Hearty chicken soup with oats and vegetables. Warming and nutritious. Comfort in a bowl.', 
        price: 3.500, calories: 280, preparation_time: 15, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner', 'appetizer'], dietary_tags: ['halal', 'high-protein', 'high-fiber'],
        flavor_profile: ['savory', 'warm', 'comforting'] },
      { restaurant_id: restaurant.id, category_id: soupCat.id, category: 'Soup',
        name: 'Lentil Soup', 
        description: 'Red lentil soup with vegetables and spices. Vegan protein source. Hearty and healthy.', 
        price: 3.000, calories: 220, preparation_time: 12, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner', 'appetizer'], dietary_tags: ['vegetarian', 'vegan', 'high-protein', 'high-fiber'],
        flavor_profile: ['savory', 'earthy', 'spiced'] },
      { restaurant_id: restaurant.id, category_id: soupCat.id, category: 'Soup',
        name: 'Vegetable Minestrone', 
        description: 'Italian vegetable soup with beans and pasta. Light and nutritious. Mediterranean goodness.', 
        price: 3.200, calories: 240, preparation_time: 15, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner', 'appetizer'], dietary_tags: ['vegetarian', 'vegan', 'low-calorie'],
        flavor_profile: ['savory', 'fresh', 'herby'] },
      
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich',
        name: 'Chicken Shawarma', 
        description: 'Grilled chicken shawarma with vegetables in whole wheat wrap. Middle Eastern favorite made healthy.', 
        price: 4.000, calories: 420, preparation_time: 12, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 1, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'spiced', 'tangy'] },
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich',
        name: 'Grilled Chicken Wrap', 
        description: 'Whole wheat wrap with grilled chicken, lettuce, tomato, light sauce. Classic healthy wrap.', 
        price: 3.800, calories: 380, preparation_time: 10, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'snack'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'fresh'] },
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich',
        name: 'Falafel Wrap', 
        description: 'Baked falafel with vegetables and tahini in whole wheat wrap. Vegan protein option. Mediterranean delight.', 
        price: 3.500, calories: 360, preparation_time: 10, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'snack'], dietary_tags: ['vegetarian', 'vegan', 'high-protein'],
        flavor_profile: ['savory', 'nutty', 'tangy'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Fresh Lemon Mint Juice', 
        description: 'Freshly squeezed lemon with mint. Refreshing and detoxifying. Natural energy boost.', 
        price: 2.000, calories: 60, preparation_time: 5, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'low-calorie', 'detox'],
        flavor_profile: ['tangy', 'fresh', 'minty'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Berry Smoothie', 
        description: 'Mixed berries, banana, almond milk smoothie. Antioxidant-rich. Natural sweetness.', 
        price: 3.000, calories: 180, preparation_time: 5, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'healthy'],
        flavor_profile: ['sweet', 'fresh', 'fruity'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Green Power Juice', 
        description: 'Spinach, cucumber, apple, lemon juice. Detox and energize. Vitamin-packed.', 
        price: 3.200, calories: 120, preparation_time: 5, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'low-calorie', 'detox'],
        flavor_profile: ['fresh', 'earthy', 'tangy'] }
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
    console.log('🥗 Dishes:', dishes.length);
    console.log('💰 Price Range: BD 2.00 - BD 5.80');
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
