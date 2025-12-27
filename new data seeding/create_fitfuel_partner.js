/**
 * Create Fit Fuel - Healthy Restaurant
 * Healthy meals, salads, protein bowls: BD 3-8
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

const RESTAURANT_NAME = 'Fit Fuel';
const RESTAURANT_EMAIL = 'fitfuel@wajba.bh';
const RESTAURANT_CATEGORY = 'Healthy';
const RESTAURANT_DESCRIPTION = 'Premium healthy meals for fitness enthusiasts and health-conscious customers. Fresh salads, protein bowls, grilled meats, and nutritious options. All meals include calorie and macro information.';
const RESTAURANT_ADDRESS = 'Seef District, Manama, Bahrain';
const RESTAURANT_LATITUDE = 26.2361;
const RESTAURANT_LONGITUDE = 50.5340;
const RESTAURANT_PHONE = '+973 1888 9999';
const RESTAURANT_RATING = 4.8;
const DELIVERY_FEE = 1.000;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '15-20 min';

async function createRestaurantPartner() {
  console.log(`🥗 Creating ${RESTAURANT_NAME} Partner Account...\n`);

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
      // Create new auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: RESTAURANT_EMAIL,
        password: '12345678',
        email_confirm: true,
        user_metadata: {
          full_name: `${RESTAURANT_NAME} Manager`
        }
      });

      if (authError) {
        // If auth user already exists, try to get it
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

      // Create public user
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
        cuisine_types: ['Healthy', 'International'],
        price_range: 'mid-range',
        ambiance: ['modern', 'healthy', 'casual'],
        dietary_options: ['vegetarian', 'vegan', 'gluten-free', 'keto', 'high-protein'],
        suitable_for: ['post-workout', 'healthy meal', 'lunch', 'dinner'],
        features: ['calorie info', 'macro tracking', 'fresh ingredients', 'healthy options']
      })
      .select()
      .single();

    if (restaurantError) throw restaurantError;
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories, error: categoryError } = await supabase
      .from('menu_categories')
      .insert([
        { restaurant_id: restaurant.id, name: 'Protein Bowls', description: 'High-protein balanced meals', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Fresh Salads', description: 'Nutritious salad options', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Grilled Mains', description: 'Grilled lean proteins', display_order: 3, is_active: true },
        { restaurant_id: restaurant.id, name: 'Healthy Sides', description: 'Nutritious side dishes', display_order: 4, is_active: true },
      ])
      .select();

    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    const bowlsCat = categories.find(c => c.name === 'Protein Bowls');
    const saladsCat = categories.find(c => c.name === 'Fresh Salads');
    const grillCat = categories.find(c => c.name === 'Grilled Mains');
    const sidesCat = categories.find(c => c.name === 'Healthy Sides');

    const dishes = [
      // Protein Bowls
      { 
        restaurant_id: restaurant.id, 
        category_id: bowlsCat.id, 
        category: 'Main Course',
        name: 'Grilled Chicken Bowl', 
        description: 'Grilled chicken breast with quinoa, roasted vegetables, and tahini sauce. High protein, balanced macros. Perfect post-workout meal. 450 cal, 45g protein, 40g carbs, 12g fat.', 
        price: 5.500, 
        calories: 450, 
        preparation_time: 15, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['high-protein', 'healthy', 'balanced'],
        flavor_profile: ['savory', 'grilled']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: bowlsCat.id, 
        category: 'Main Course',
        name: 'Salmon Power Bowl', 
        description: 'Grilled salmon with brown rice, avocado, edamame, and sesame dressing. Omega-3 rich. Heart-healthy. 520 cal, 38g protein, 45g carbs, 18g fat.', 
        price: 7.500, 
        calories: 520, 
        preparation_time: 18, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['high-protein', 'healthy', 'omega-3'],
        flavor_profile: ['savory', 'umami']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: bowlsCat.id, 
        category: 'Main Course',
        name: 'Vegan Buddha Bowl', 
        description: 'Chickpeas, quinoa, kale, sweet potato, tahini dressing. Plant-based protein. Nutrient-dense. 420 cal, 18g protein, 55g carbs, 14g fat.', 
        price: 5.000, 
        calories: 420, 
        preparation_time: 15, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegan', 'vegetarian', 'healthy', 'plant-based'],
        flavor_profile: ['savory', 'earthy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: bowlsCat.id, 
        category: 'Main Course',
        name: 'Beef Teriyaki Bowl', 
        description: 'Lean beef strips with brown rice, broccoli, and teriyaki sauce. High protein. Satisfying. 480 cal, 42g protein, 48g carbs, 14g fat.', 
        price: 6.500, 
        calories: 480, 
        preparation_time: 18, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['high-protein', 'healthy'],
        flavor_profile: ['savory', 'sweet']
      },
      
      // Fresh Salads
      { 
        restaurant_id: restaurant.id, 
        category_id: saladsCat.id, 
        category: 'Main Course',
        name: 'Grilled Chicken Caesar Salad', 
        description: 'Romaine lettuce, grilled chicken, parmesan, light caesar dressing. Protein-packed salad. 320 cal, 35g protein, 12g carbs, 15g fat.', 
        price: 4.500, 
        calories: 320, 
        preparation_time: 10, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['high-protein', 'low-carb', 'healthy'],
        flavor_profile: ['savory', 'tangy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: saladsCat.id, 
        category: 'Main Course',
        name: 'Mediterranean Quinoa Salad', 
        description: 'Quinoa, cucumber, tomatoes, feta, olives, lemon dressing. Light and refreshing. 380 cal, 14g protein, 42g carbs, 16g fat.', 
        price: 4.000, 
        calories: 380, 
        preparation_time: 8, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegetarian', 'healthy', 'mediterranean'],
        flavor_profile: ['fresh', 'tangy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: saladsCat.id, 
        category: 'Main Course',
        name: 'Kale & Avocado Salad', 
        description: 'Kale, avocado, cherry tomatoes, pumpkin seeds, lemon vinaigrette. Superfood salad. 280 cal, 8g protein, 22g carbs, 18g fat.', 
        price: 4.500, 
        calories: 280, 
        preparation_time: 8, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegan', 'vegetarian', 'healthy', 'superfood'],
        flavor_profile: ['fresh', 'tangy']
      },
      
      // Grilled Mains
      { 
        restaurant_id: restaurant.id, 
        category_id: grillCat.id, 
        category: 'Main Course',
        name: 'Grilled Chicken Breast', 
        description: 'Lean grilled chicken breast with herbs. Pure protein. 200g serving. 280 cal, 52g protein, 0g carbs, 6g fat.', 
        price: 4.500, 
        calories: 280, 
        preparation_time: 15, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['high-protein', 'low-carb', 'keto', 'healthy'],
        flavor_profile: ['savory', 'grilled']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: grillCat.id, 
        category: 'Main Course',
        name: 'Grilled Salmon Fillet', 
        description: 'Fresh salmon fillet with lemon and herbs. Omega-3 rich. Heart-healthy. 350 cal, 40g protein, 0g carbs, 20g fat.', 
        price: 7.000, 
        calories: 350, 
        preparation_time: 18, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['high-protein', 'low-carb', 'keto', 'omega-3', 'healthy'],
        flavor_profile: ['savory', 'grilled']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: grillCat.id, 
        category: 'Main Course',
        name: 'Grilled Beef Steak', 
        description: 'Lean beef steak grilled to perfection. High protein. Iron-rich. 380 cal, 48g protein, 0g carbs, 18g fat.', 
        price: 8.000, 
        calories: 380, 
        preparation_time: 20, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['high-protein', 'low-carb', 'keto', 'healthy'],
        flavor_profile: ['savory', 'grilled']
      },
      
      // Healthy Sides
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCat.id, 
        category: 'Side',
        name: 'Steamed Broccoli', 
        description: 'Fresh steamed broccoli. Vitamin-rich. Low-calorie. 50 cal, 4g protein, 8g carbs, 0g fat.', 
        price: 2.000, 
        calories: 50, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['side'],
        dietary_tags: ['vegan', 'vegetarian', 'healthy', 'low-calorie'],
        flavor_profile: ['fresh']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCat.id, 
        category: 'Side',
        name: 'Sweet Potato Fries', 
        description: 'Baked sweet potato fries. Healthier alternative. Complex carbs. 180 cal, 2g protein, 32g carbs, 5g fat.', 
        price: 2.500, 
        calories: 180, 
        preparation_time: 12, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['side'],
        dietary_tags: ['vegan', 'vegetarian', 'healthy'],
        flavor_profile: ['sweet', 'savory']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: sidesCat.id, 
        category: 'Side',
        name: 'Brown Rice', 
        description: 'Steamed brown rice. Whole grain. Fiber-rich. 220 cal, 5g protein, 45g carbs, 2g fat.', 
        price: 2.000, 
        calories: 220, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['side'],
        dietary_tags: ['vegan', 'vegetarian', 'healthy', 'whole-grain'],
        flavor_profile: ['neutral']
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
    console.log('🥗 Dishes:', dishes.length);
    console.log('💰 Price Range: BD 2.00 - BD 8.00');
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
