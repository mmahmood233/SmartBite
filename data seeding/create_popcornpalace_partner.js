/**
 * Create Popcorn Palace - Movie Snacks & Treats
 * Budget-friendly snacks: BD 1-3
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

const RESTAURANT_NAME = 'Popcorn Palace';
const RESTAURANT_EMAIL = 'popcornpalace@wajba.bh';
const RESTAURANT_CATEGORY = 'Snacks';
const RESTAURANT_DESCRIPTION = 'Your go-to spot for movie snacks! Fresh popcorn, nachos, candy, and drinks at budget-friendly prices. Perfect for movie nights, parties, or quick snacks.';
const RESTAURANT_ADDRESS = 'Seef District, Manama, Bahrain';
const RESTAURANT_LATITUDE = 26.2361;
const RESTAURANT_LONGITUDE = 50.5340;
const RESTAURANT_PHONE = '+973 1777 8888';
const RESTAURANT_RATING = 4.6;
const DELIVERY_FEE = 0.500;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '5-10 min';

async function createRestaurantPartner() {
  console.log(`🍿 Creating ${RESTAURANT_NAME} Partner Account...\n`);

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
        cuisine_types: ['Snacks', 'American'],
        price_range: 'budget',
        ambiance: ['casual', 'family-friendly'],
        dietary_options: ['vegetarian'],
        suitable_for: ['movie night', 'party', 'quick snack'],
        features: ['quick service', 'budget friendly']
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
        { restaurant_id: restaurant.id, name: 'Popcorn', description: 'Fresh popped popcorn in various flavors', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Nachos', description: 'Crispy nachos with toppings', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Candy & Snacks', description: 'Sweet treats and snacks', display_order: 3, is_active: true },
        { restaurant_id: restaurant.id, name: 'Beverages', description: 'Soft drinks and juices', display_order: 4, is_active: true },
      ])
      .select();

    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    // Step 5: Create dishes
    console.log('\n🍿 Creating dishes...');
    
    const popcornCat = categories.find(c => c.name === 'Popcorn');
    const nachosCat = categories.find(c => c.name === 'Nachos');
    const candyCat = categories.find(c => c.name === 'Candy & Snacks');
    const beverageCat = categories.find(c => c.name === 'Beverages');

    const dishes = [
      // Popcorn
      { 
        restaurant_id: restaurant.id, 
        category_id: popcornCat.id, 
        category: 'Snack',
        name: 'Small Butter Popcorn', 
        description: 'Classic buttery popcorn, freshly popped. Perfect movie snack. Light, crispy, and delicious.', 
        price: 1.000, 
        calories: 180, 
        preparation_time: 3, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack'],
        dietary_tags: ['vegetarian']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: popcornCat.id, 
        category: 'Snack',
        name: 'Medium Butter Popcorn', 
        description: 'Medium size buttery popcorn, freshly popped. Great for sharing or solo movie watching.', 
        price: 1.500, 
        calories: 280, 
        preparation_time: 3, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack'],
        dietary_tags: ['vegetarian'],
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: popcornCat.id, 
        category: 'Snack',
        name: 'Large Butter Popcorn', 
        description: 'Large buttery popcorn, freshly popped. Perfect for sharing with friends during movie night.', 
        price: 2.000, 
        calories: 420, 
        preparation_time: 3, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack'],
        dietary_tags: ['vegetarian'],
        portion_size: 'large'
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: popcornCat.id, 
        category: 'Snack',
        name: 'Caramel Popcorn', 
        description: 'Sweet caramel coated popcorn. Crunchy, sweet, and addictive. Perfect for those with a sweet tooth.', 
        price: 2.500, 
        calories: 350, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack', 'dessert'],
        dietary_tags: ['vegetarian', 'sweet'],
        flavor_profile: ['sweet', 'crunchy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: popcornCat.id, 
        category: 'Snack',
        name: 'Cheese Popcorn', 
        description: 'Savory cheese flavored popcorn. Cheesy, salty, and irresistible. Great for cheese lovers.', 
        price: 2.000, 
        calories: 320, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['savory', 'cheesy']
      },
      
      // Nachos
      { 
        restaurant_id: restaurant.id, 
        category_id: nachosCat.id, 
        category: 'Snack',
        name: 'Plain Nachos', 
        description: 'Crispy tortilla chips. Simple and crunchy. Perfect base for dips or enjoy plain.', 
        price: 1.500, 
        calories: 220, 
        preparation_time: 2, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: false, 
        is_available: true,
        meal_types: ['snack'],
        dietary_tags: ['vegetarian', 'vegan'],
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: nachosCat.id, 
        category: 'Snack',
        name: 'Cheese Nachos', 
        description: 'Crispy nachos topped with melted cheese sauce. Cheesy, warm, and satisfying. Movie night favorite.', 
        price: 2.500, 
        calories: 380, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['savory', 'cheesy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: nachosCat.id, 
        category: 'Snack',
        name: 'Loaded Nachos', 
        description: 'Nachos with cheese, jalapeños, salsa, and sour cream. Fully loaded with toppings. Perfect for sharing.', 
        price: 3.000, 
        calories: 520, 
        preparation_time: 7, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: true, 
        spice_level: 2,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack'],
        dietary_tags: ['vegetarian', 'spicy'],
        flavor_profile: ['savory', 'spicy', 'cheesy']
      },
      
      // Candy & Snacks
      { 
        restaurant_id: restaurant.id, 
        category_id: candyCat.id, 
        category: 'Snack',
        name: 'Chocolate Bar', 
        description: 'Classic milk chocolate bar. Sweet, creamy, and satisfying. Perfect quick treat.', 
        price: 1.000, 
        calories: 220, 
        preparation_time: 1, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack', 'dessert'],
        dietary_tags: ['vegetarian', 'sweet']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: candyCat.id, 
        category: 'Snack',
        name: 'Gummy Bears', 
        description: 'Colorful fruity gummy bears. Chewy, sweet, and fun. Kids and adults love them.', 
        price: 1.500, 
        calories: 180, 
        preparation_time: 1, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack', 'dessert'],
        dietary_tags: ['vegetarian', 'sweet']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: candyCat.id, 
        category: 'Snack',
        name: 'Potato Chips', 
        description: 'Crispy salted potato chips. Crunchy, salty, and addictive. Classic snack choice.', 
        price: 1.500, 
        calories: 280, 
        preparation_time: 1, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['snack'],
        dietary_tags: ['vegetarian', 'vegan'],
        flavor_profile: ['savory', 'salty']
      },
      
      // Beverages
      { 
        restaurant_id: restaurant.id, 
        category_id: beverageCat.id, 
        category: 'Beverage',
        name: 'Small Soft Drink', 
        description: 'Small size soft drink. Refreshing and cold. Choice of cola, sprite, or fanta.', 
        price: 0.500, 
        calories: 120, 
        preparation_time: 1, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage'],
        dietary_tags: ['vegetarian', 'vegan']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: beverageCat.id, 
        category: 'Beverage',
        name: 'Medium Soft Drink', 
        description: 'Medium size soft drink. Refreshing and cold. Choice of cola, sprite, or fanta.', 
        price: 1.000, 
        calories: 200, 
        preparation_time: 1, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage'],
        dietary_tags: ['vegetarian', 'vegan']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: beverageCat.id, 
        category: 'Beverage',
        name: 'Bottled Water', 
        description: 'Cold bottled water. Refreshing and hydrating. Essential for any snack time.', 
        price: 0.500, 
        calories: 0, 
        preparation_time: 1, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['beverage'],
        dietary_tags: ['vegetarian', 'vegan', 'healthy']
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
    console.log('🍿 Dishes:', dishes.length);
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
