/**
 * Create Fresh Squeeze - Budget Juice Bar
 * Fresh juices and smoothies: BD 1-3
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const RESTAURANT_NAME = 'Fresh Squeeze';
const RESTAURANT_EMAIL = 'freshsqueeze@wajba.bh';
const RESTAURANT_CATEGORY = 'Juice Bar';
const RESTAURANT_DESCRIPTION = 'Fresh juices, smoothies, and healthy drinks at affordable prices. All natural ingredients, no added sugar. Perfect for health-conscious customers on a budget.';
const RESTAURANT_ADDRESS = 'Exhibition Road, Manama, Bahrain';
const RESTAURANT_LATITUDE = 26.2172;
const RESTAURANT_LONGITUDE = 50.5816;
const RESTAURANT_PHONE = '+973 1555 4444';
const RESTAURANT_RATING = 4.7;
const DELIVERY_FEE = 0.500;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '5-8 min';

async function createRestaurantPartner() {
  console.log(`🥤 Creating ${RESTAURANT_NAME} Partner Account...\n`);

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', RESTAURANT_EMAIL)
      .single();

    let userId;

    if (existingUser) {
      console.log('⚠️  User already exists:', existingUser.email);
      userId = existingUser.id;
      
      // Update role to partner if it's not already
      if (existingUser.role !== 'partner') {
        console.log('🔄 Updating role to partner...');
        await supabase
          .from('users')
          .update({ role: 'partner' })
          .eq('id', userId);
        console.log('✅ Role updated to partner');
      }
    } else {
      // Step 1: Create auth user
      console.log('📧 Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: RESTAURANT_EMAIL,
        password: '12345678',
        email_confirm: true,
        user_metadata: {
          full_name: `${RESTAURANT_NAME} Manager`
        }
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log('⚠️  Auth user already exists, fetching user...');
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
          if (listError) throw listError;
          const existingAuthUser = users.find(u => u.email === RESTAURANT_EMAIL);
          if (!existingAuthUser) throw new Error('Could not find existing auth user');
          userId = existingAuthUser.id;
          console.log('✅ Found existing auth user:', userId);
        } else {
          throw authError;
        }
      } else {
        console.log('✅ Auth user created:', authData.user.id);
        userId = authData.user.id;
      }

      // Step 2: Create public user
      console.log('\n👤 Creating public user record...');
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: RESTAURANT_EMAIL,
          full_name: `${RESTAURANT_NAME} Manager`,
          phone: RESTAURANT_PHONE,
          role: 'partner',
          is_active: true
        });

      if (userError) throw userError;
      console.log('✅ Public user created');
    }

    // Step 3: Create restaurant
    console.log('\n🏪 Creating restaurant...');
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        partner_id: userId,
        name: RESTAURANT_NAME,
        category: RESTAURANT_CATEGORY,
        description: RESTAURANT_DESCRIPTION,
        address: RESTAURANT_ADDRESS,
        latitude: RESTAURANT_LATITUDE,
        longitude: RESTAURANT_LONGITUDE,
        phone: RESTAURANT_PHONE,
        email: RESTAURANT_EMAIL,
        rating: RESTAURANT_RATING,
        total_reviews: 0,
        total_orders: 0,
        delivery_fee: DELIVERY_FEE,
        min_order: MIN_ORDER,
        avg_prep_time: AVG_PREP_TIME,
        status: 'open',
        is_active: true,
        cuisine_types: ['Healthy', 'Beverages'],
        price_range: 'budget',
        ambiance: ['casual', 'healthy'],
        dietary_options: ['vegetarian', 'vegan', 'healthy'],
        suitable_for: ['post-workout', 'quick bite', 'healthy meal', 'breakfast'],
        features: ['quick service', 'budget friendly', 'healthy options', 'fresh ingredients']
      })
      .select()
      .single();

    if (restaurantError) throw restaurantError;
    console.log('✅ Restaurant created:', restaurant.id);

    // Step 4: Create menu categories
    console.log('\n📋 Creating menu categories...');
    
    const { data: categories, error: categoryError } = await supabase
      .from('menu_categories')
      .insert([
        { restaurant_id: restaurant.id, name: 'Fresh Juices', description: 'Freshly squeezed fruit juices', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Smoothies', description: 'Blended fruit smoothies', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Healthy Drinks', description: 'Detox and wellness drinks', display_order: 3, is_active: true },
        { restaurant_id: restaurant.id, name: 'Add-ons', description: 'Protein and supplements', display_order: 4, is_active: true },
      ])
      .select();

    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    // Step 5: Create dishes
    console.log('\n🥤 Creating dishes...');
    
    const juicesCat = categories.find(c => c.name === 'Fresh Juices');
    const smoothiesCat = categories.find(c => c.name === 'Smoothies');
    const healthyCat = categories.find(c => c.name === 'Healthy Drinks');
    const addonsCat = categories.find(c => c.name === 'Add-ons');

    const dishes = [
      // Fresh Juices
      { 
        restaurant_id: restaurant.id, 
        category_id: juicesCat.id, 
        category: 'Beverage',
        name: 'Orange Juice', 
        description: 'Freshly squeezed orange juice. Pure vitamin C boost. No added sugar. Refreshing and healthy.', 
        price: 1.500, 
        calories: 110, 
        preparation_time: 3, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage', 'breakfast'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy', 'vitamin-c'],
        flavor_profile: ['sweet', 'tangy', 'refreshing']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: juicesCat.id, 
        category: 'Beverage',
        name: 'Apple Juice', 
        description: 'Fresh apple juice. Sweet and crisp. Natural energy boost. No preservatives.', 
        price: 1.500, 
        calories: 120, 
        preparation_time: 3, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage', 'breakfast'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy'],
        flavor_profile: ['sweet', 'crisp']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: juicesCat.id, 
        category: 'Beverage',
        name: 'Carrot Juice', 
        description: 'Fresh carrot juice. Rich in vitamin A. Good for eyesight. Naturally sweet.', 
        price: 1.500, 
        calories: 95, 
        preparation_time: 4, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy', 'vitamin-a'],
        flavor_profile: ['sweet', 'earthy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: juicesCat.id, 
        category: 'Beverage',
        name: 'Watermelon Juice', 
        description: 'Fresh watermelon juice. Super hydrating. Light and refreshing. Perfect for summer.', 
        price: 1.500, 
        calories: 85, 
        preparation_time: 3, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy', 'hydrating'],
        flavor_profile: ['sweet', 'refreshing']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: juicesCat.id, 
        category: 'Beverage',
        name: 'Mixed Fruit Juice', 
        description: 'Blend of orange, apple, and pineapple. Tropical flavor explosion. Vitamin-packed.', 
        price: 2.000, 
        calories: 140, 
        preparation_time: 4, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage', 'breakfast'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy'],
        flavor_profile: ['sweet', 'tropical']
      },
      
      // Smoothies
      { 
        restaurant_id: restaurant.id, 
        category_id: smoothiesCat.id, 
        category: 'Beverage',
        name: 'Banana Smoothie', 
        description: 'Creamy banana smoothie with milk. Energy-boosting. Filling and delicious. Great post-workout.', 
        price: 2.000, 
        calories: 220, 
        preparation_time: 4, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage', 'breakfast', 'snack'],
        dietary_tags: ['vegetarian', 'high-protein'],
        flavor_profile: ['sweet', 'creamy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: smoothiesCat.id, 
        category: 'Beverage',
        name: 'Strawberry Smoothie', 
        description: 'Fresh strawberry smoothie. Sweet and tangy. Antioxidant-rich. Refreshing treat.', 
        price: 2.500, 
        calories: 180, 
        preparation_time: 4, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage', 'breakfast', 'snack'],
        dietary_tags: ['vegetarian', 'antioxidants'],
        flavor_profile: ['sweet', 'tangy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: smoothiesCat.id, 
        category: 'Beverage',
        name: 'Mango Smoothie', 
        description: 'Tropical mango smoothie. Thick and creamy. Naturally sweet. Summer favorite.', 
        price: 2.500, 
        calories: 210, 
        preparation_time: 4, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage', 'breakfast', 'snack'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['sweet', 'tropical', 'creamy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: smoothiesCat.id, 
        category: 'Beverage',
        name: 'Berry Blast Smoothie', 
        description: 'Mixed berries smoothie with strawberry, blueberry, and raspberry. Antioxidant powerhouse. Delicious and healthy.', 
        price: 3.000, 
        calories: 190, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage', 'breakfast'],
        dietary_tags: ['vegetarian', 'antioxidants', 'healthy'],
        flavor_profile: ['sweet', 'tangy']
      },
      
      // Healthy Drinks
      { 
        restaurant_id: restaurant.id, 
        category_id: healthyCat.id, 
        category: 'Beverage',
        name: 'Lemon Mint Detox', 
        description: 'Lemon juice with fresh mint and honey. Detoxifying and refreshing. Boosts metabolism.', 
        price: 1.500, 
        calories: 50, 
        preparation_time: 3, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy', 'detox', 'low-calorie'],
        flavor_profile: ['tangy', 'refreshing', 'minty']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: healthyCat.id, 
        category: 'Beverage',
        name: 'Green Detox Juice', 
        description: 'Spinach, cucumber, apple, and lemon. Super healthy green juice. Detoxifying and energizing.', 
        price: 2.500, 
        calories: 80, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy', 'detox', 'low-calorie'],
        flavor_profile: ['earthy', 'refreshing']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: healthyCat.id, 
        category: 'Beverage',
        name: 'Ginger Shot', 
        description: 'Concentrated ginger juice with lemon. Immunity booster. Spicy kick. Great for digestion.', 
        price: 1.000, 
        calories: 20, 
        preparation_time: 2, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: true, 
        spice_level: 3,
        is_popular: false, 
        is_available: true,
        meal_types: ['beverage'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy', 'immunity-boost'],
        flavor_profile: ['spicy', 'tangy']
      },
      
      // Add-ons
      { 
        restaurant_id: restaurant.id, 
        category_id: addonsCat.id, 
        category: 'Add-on',
        name: 'Protein Boost', 
        description: 'Add protein powder to any smoothie. 20g extra protein. Perfect for post-workout recovery.', 
        price: 1.000, 
        calories: 80, 
        preparation_time: 1, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['add-on'],
        dietary_tags: ['high-protein']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: addonsCat.id, 
        category: 'Add-on',
        name: 'Chia Seeds', 
        description: 'Add chia seeds to any drink. Rich in omega-3 and fiber. Healthy boost.', 
        price: 0.500, 
        calories: 60, 
        preparation_time: 1, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['add-on'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy', 'omega-3']
      },
    ];

    const { error: dishError } = await supabase
      .from('dishes')
      .insert(dishes);

    if (dishError) throw dishError;
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${RESTAURANT_NAME} Partner Account Created Successfully!`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', RESTAURANT_EMAIL);
    console.log('🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId);
    console.log('🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length);
    console.log('🥤 Dishes:', dishes.length);
    console.log('💰 Price Range: BD 0.50 - BD 3.00');
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
