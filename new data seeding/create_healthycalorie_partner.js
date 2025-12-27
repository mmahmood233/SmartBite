/**
 * Create Healthy Calorie - Healthy Meal Restaurant
 * Grilled proteins, salads, healthy meals: BD 3-8
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const RESTAURANT_NAME = 'Healthy Calorie';
const RESTAURANT_EMAIL = 'healthycalorie@wajba.bh';
const RESTAURANT_CATEGORY = 'Healthy';
const RESTAURANT_DESCRIPTION = 'Premium healthy meals with calorie-counted options. Grilled proteins, fresh salads, and nutritious meals for fitness enthusiasts. All meals include detailed nutritional information.';
const RESTAURANT_ADDRESS = 'Juffair, Manama, Bahrain';
const RESTAURANT_LATITUDE = 26.2172;
const RESTAURANT_LONGITUDE = 50.5816;
const RESTAURANT_PHONE = '+973 1755 5000';
const RESTAURANT_RATING = 4.9;
const DELIVERY_FEE = 1.000;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '20-25 min';

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
      cuisine_types: ['Healthy', 'Fitness', 'Salads'], price_range: 'mid-range',
      ambiance: ['healthy', 'modern'], dietary_options: ['halal', 'low-calorie', 'high-protein'],
      suitable_for: ['fitness', 'lunch', 'dinner', 'diet'], features: ['calorie counted', 'macro tracking'],
      signature_dishes: ['Grilled Chicken With Mash Potato', 'Chicken Caesar Salad', 'Asian Rice']
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Grilled Proteins', description: 'Grilled chicken, steak, fish', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Salads', description: 'Fresh healthy salads', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Rice & Pasta', description: 'Healthy carbs', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches', description: 'Healthy wraps and sandwiches', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Healthy drinks', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const proteinCat = categories.find(c => c.name === 'Grilled Proteins');
    const saladCat = categories.find(c => c.name === 'Salads');
    const riceCat = categories.find(c => c.name === 'Rice & Pasta');
    const sandwichCat = categories.find(c => c.name === 'Sandwiches');
    const bevCat = categories.find(c => c.name === 'Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: proteinCat.id, category: 'Main Course',
        name: 'Grilled Chicken With Mash Potato', 
        description: 'Tender grilled chicken breast with creamy mash potato. High protein, low fat. Perfect post-workout meal.', 
        price: 4.500, calories: 420, preparation_time: 20, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein', 'low-fat'],
        flavor_profile: ['savory', 'grilled'] },
      { restaurant_id: restaurant.id, category_id: proteinCat.id, category: 'Main Course',
        name: 'Grilled Steak With Mash Potato', 
        description: 'Premium grilled steak with mash potato. High protein, rich in iron. Fitness favorite.', 
        price: 6.500, calories: 520, preparation_time: 22, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'grilled', 'rich'] },
      { restaurant_id: restaurant.id, category_id: proteinCat.id, category: 'Main Course',
        name: 'Grilled Salmon With Vegetables', 
        description: 'Fresh grilled salmon with steamed vegetables. Omega-3 rich, heart-healthy. Premium choice.', 
        price: 7.500, calories: 380, preparation_time: 20, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein', 'omega-3', 'low-calorie'],
        flavor_profile: ['savory', 'grilled', 'fresh'] },
      { restaurant_id: restaurant.id, category_id: proteinCat.id, category: 'Main Course',
        name: 'Grilled Chicken With Sweet Potato', 
        description: 'Grilled chicken with roasted sweet potato. Complex carbs, high protein. Balanced meal.', 
        price: 4.800, calories: 450, preparation_time: 20, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein', 'complex-carbs'],
        flavor_profile: ['savory', 'grilled', 'sweet'] },
      
      { restaurant_id: restaurant.id, category_id: saladCat.id, category: 'Salad',
        name: 'Chicken Caesar Salad', 
        description: 'Grilled chicken, romaine lettuce, parmesan, Caesar dressing. Classic healthy salad. Protein-packed.', 
        price: 4.000, calories: 320, preparation_time: 12, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein', 'low-carb'],
        flavor_profile: ['savory', 'tangy', 'fresh'] },
      { restaurant_id: restaurant.id, category_id: saladCat.id, category: 'Salad',
        name: 'Greek Salad', 
        description: 'Tomatoes, cucumber, feta, olives, olive oil. Mediterranean classic. Fresh and light.', 
        price: 3.500, calories: 220, preparation_time: 10, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner', 'side'], dietary_tags: ['vegetarian', 'low-calorie', 'healthy'],
        flavor_profile: ['fresh', 'tangy', 'savory'] },
      { restaurant_id: restaurant.id, category_id: saladCat.id, category: 'Salad',
        name: 'Quinoa Power Salad', 
        description: 'Quinoa, mixed greens, avocado, chickpeas, lemon dressing. Superfood salad. Vegan-friendly.', 
        price: 4.500, calories: 380, preparation_time: 12, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'vegan', 'high-protein', 'healthy'],
        flavor_profile: ['fresh', 'nutty', 'tangy'] },
      
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Asian Rice', 
        description: 'Stir-fried rice with vegetables and chicken. Asian-inspired healthy meal. Balanced nutrition.', 
        price: 4.200, calories: 480, preparation_time: 18, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 1, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'umami', 'spiced'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Brown Rice With Grilled Chicken', 
        description: 'Healthy brown rice with grilled chicken and vegetables. Whole grain goodness. Fiber-rich.', 
        price: 4.500, calories: 420, preparation_time: 20, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein', 'high-fiber'],
        flavor_profile: ['savory', 'grilled', 'nutty'] },
      { restaurant_id: restaurant.id, category_id: riceCat.id, category: 'Main Course',
        name: 'Whole Wheat Pasta With Chicken', 
        description: 'Whole wheat pasta with grilled chicken and light tomato sauce. Healthy Italian. Complex carbs.', 
        price: 5.000, calories: 520, preparation_time: 18, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'tangy'] },
      
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich',
        name: 'Grilled Chicken Wrap', 
        description: 'Whole wheat wrap with grilled chicken, lettuce, tomato. Healthy on-the-go meal. Protein-packed.', 
        price: 3.500, calories: 380, preparation_time: 12, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'snack'], dietary_tags: ['halal', 'high-protein'],
        flavor_profile: ['savory', 'fresh'] },
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich',
        name: 'Turkey Avocado Sandwich', 
        description: 'Whole grain bread with turkey, avocado, lettuce. Healthy fats, lean protein. Nutritious choice.', 
        price: 4.000, calories: 420, preparation_time: 10, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'snack'], dietary_tags: ['halal', 'high-protein', 'healthy-fats'],
        flavor_profile: ['savory', 'creamy', 'fresh'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Fresh Orange Juice', 
        description: 'Freshly squeezed orange juice. Vitamin C boost. Natural energy.', 
        price: 2.000, calories: 110, preparation_time: 5, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'healthy'],
        flavor_profile: ['sweet', 'tangy', 'fresh'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Green Detox Smoothie', 
        description: 'Spinach, apple, banana, ginger smoothie. Detox and energize. Superfood blend.', 
        price: 3.000, calories: 180, preparation_time: 5, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'healthy', 'detox'],
        flavor_profile: ['sweet', 'fresh', 'earthy'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Protein Shake', 
        description: 'Whey protein shake with banana and almond milk. Post-workout recovery. Muscle building.', 
        price: 3.500, calories: 250, preparation_time: 5, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'high-protein'],
        flavor_profile: ['sweet', 'creamy'] }
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
    console.log('💰 Price Range: BD 2.00 - BD 7.50');
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
