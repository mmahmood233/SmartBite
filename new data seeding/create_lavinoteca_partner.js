/**
 * Create La Vinoteca - Italian Restaurant
 * Authentic Italian cuisine: BD 5-15
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

const RESTAURANT_NAME = 'La Vinoteca';
const RESTAURANT_EMAIL = 'lavinoteca@wajba.bh';
const RESTAURANT_CATEGORY = 'Italian';
const RESTAURANT_DESCRIPTION = 'Authentic Italian restaurant serving traditional pasta, pizza, and Italian specialties. Fresh ingredients, homemade sauces, and classic Italian flavors. Perfect for romantic dinners and family gatherings.';
const RESTAURANT_ADDRESS = 'Adliya, Manama, Bahrain';
const RESTAURANT_LATITUDE = 26.2172;
const RESTAURANT_LONGITUDE = 50.5816;
const RESTAURANT_PHONE = '+973 1777 6666';
const RESTAURANT_RATING = 4.7;
const DELIVERY_FEE = 1.500;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '25-30 min';

async function createRestaurantPartner() {
  console.log(`🍝 Creating ${RESTAURANT_NAME} Partner Account...\n`);

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
        cuisine_types: ['Italian', 'Mediterranean'],
        price_range: 'mid-range',
        ambiance: ['romantic', 'cozy', 'family-friendly'],
        dietary_options: ['vegetarian', 'halal'],
        suitable_for: ['date night', 'family', 'dinner'],
        features: ['authentic cuisine', 'homemade pasta', 'wood-fired pizza'],
        signature_dishes: ['Fettuccine Alfredo', 'Margherita Pizza', 'Tiramisu']
      })
      .select()
      .single();

    if (restaurantError) throw restaurantError;
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories, error: categoryError } = await supabase
      .from('menu_categories')
      .insert([
        { restaurant_id: restaurant.id, name: 'Pasta', description: 'Fresh homemade pasta dishes', display_order: 1, is_active: true },
        { restaurant_id: restaurant.id, name: 'Pizza', description: 'Wood-fired Italian pizzas', display_order: 2, is_active: true },
        { restaurant_id: restaurant.id, name: 'Main Courses', description: 'Italian main dishes', display_order: 3, is_active: true },
        { restaurant_id: restaurant.id, name: 'Desserts', description: 'Traditional Italian desserts', display_order: 4, is_active: true },
      ])
      .select();

    if (categoryError) throw categoryError;
    console.log('✅ Categories created:', categories.length);

    const pastaCat = categories.find(c => c.name === 'Pasta');
    const pizzaCat = categories.find(c => c.name === 'Pizza');
    const mainsCat = categories.find(c => c.name === 'Main Courses');
    const dessertsCat = categories.find(c => c.name === 'Desserts');

    const dishes = [
      // Pasta
      { 
        restaurant_id: restaurant.id, 
        category_id: pastaCat.id, 
        category: 'Main Course',
        name: 'Spaghetti Carbonara', 
        description: 'Classic Roman pasta with eggs, pecorino cheese, guanciale, and black pepper. Creamy, rich, and authentic. Traditional Italian recipe.', 
        price: 6.500, 
        calories: 580, 
        preparation_time: 20, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal'],
        flavor_profile: ['creamy', 'savory', 'rich']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: pastaCat.id, 
        category: 'Main Course',
        name: 'Fettuccine Alfredo', 
        description: 'Creamy fettuccine pasta with parmesan cheese and butter. Rich and indulgent. Italian comfort food. Signature dish.', 
        price: 7.000, 
        calories: 620, 
        preparation_time: 18, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['creamy', 'cheesy', 'rich']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: pastaCat.id, 
        category: 'Main Course',
        name: 'Penne Arrabbiata', 
        description: 'Penne pasta in spicy tomato sauce with garlic and red chili. Fiery and flavorful. For spice lovers.', 
        price: 5.500, 
        calories: 480, 
        preparation_time: 18, 
        is_vegetarian: true, 
        is_vegan: true, 
        is_spicy: true, 
        spice_level: 3,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegetarian', 'vegan', 'spicy'],
        flavor_profile: ['spicy', 'tangy', 'garlicky']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: pastaCat.id, 
        category: 'Main Course',
        name: 'Lasagna Bolognese', 
        description: 'Layers of pasta, meat sauce, béchamel, and cheese. Baked to perfection. Hearty and satisfying. Family favorite.', 
        price: 8.000, 
        calories: 720, 
        preparation_time: 25, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal'],
        flavor_profile: ['savory', 'cheesy', 'rich']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: pastaCat.id, 
        category: 'Main Course',
        name: 'Seafood Linguine', 
        description: 'Linguine with shrimp, mussels, and calamari in white wine sauce. Fresh seafood. Light and elegant.', 
        price: 9.500, 
        calories: 540, 
        preparation_time: 22, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal', 'seafood'],
        flavor_profile: ['savory', 'garlicky', 'fresh']
      },
      
      // Pizza
      { 
        restaurant_id: restaurant.id, 
        category_id: pizzaCat.id, 
        category: 'Main Course',
        name: 'Margherita Pizza', 
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil. Simple perfection. Wood-fired. Signature dish.', 
        price: 6.000, 
        calories: 680, 
        preparation_time: 15, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['savory', 'cheesy', 'fresh']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: pizzaCat.id, 
        category: 'Main Course',
        name: 'Pepperoni Pizza', 
        description: 'Tomato sauce, mozzarella, and spicy pepperoni. Classic favorite. Crispy crust. Always popular.', 
        price: 7.000, 
        calories: 780, 
        preparation_time: 15, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 1,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal'],
        flavor_profile: ['savory', 'spicy', 'cheesy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: pizzaCat.id, 
        category: 'Main Course',
        name: 'Quattro Formaggi Pizza', 
        description: 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and fontina. Cheese lovers dream. Rich and creamy.', 
        price: 8.000, 
        calories: 820, 
        preparation_time: 15, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['cheesy', 'rich', 'savory']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: pizzaCat.id, 
        category: 'Main Course',
        name: 'Vegetariana Pizza', 
        description: 'Loaded with bell peppers, mushrooms, olives, onions, and tomatoes. Healthy and delicious. Vegetarian favorite.', 
        price: 7.500, 
        calories: 620, 
        preparation_time: 15, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['savory', 'fresh']
      },
      
      // Main Courses
      { 
        restaurant_id: restaurant.id, 
        category_id: mainsCat.id, 
        category: 'Main Course',
        name: 'Chicken Parmigiana', 
        description: 'Breaded chicken breast with tomato sauce and melted mozzarella. Served with pasta. Hearty and satisfying.', 
        price: 8.500, 
        calories: 720, 
        preparation_time: 25, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['halal'],
        flavor_profile: ['savory', 'cheesy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: mainsCat.id, 
        category: 'Main Course',
        name: 'Osso Buco', 
        description: 'Braised veal shanks in white wine and vegetables. Tender and flavorful. Traditional Milanese dish. Premium choice.', 
        price: 12.000, 
        calories: 680, 
        preparation_time: 30, 
        is_vegetarian: false, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: false, 
        is_available: true,
        meal_types: ['dinner'],
        dietary_tags: ['halal'],
        flavor_profile: ['savory', 'rich']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: mainsCat.id, 
        category: 'Main Course',
        name: 'Risotto ai Funghi', 
        description: 'Creamy mushroom risotto with parmesan. Rich and comforting. Vegetarian Italian classic.', 
        price: 7.500, 
        calories: 520, 
        preparation_time: 25, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['lunch', 'dinner'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['creamy', 'earthy', 'savory']
      },
      
      // Desserts
      { 
        restaurant_id: restaurant.id, 
        category_id: dessertsCat.id, 
        category: 'Dessert',
        name: 'Tiramisu', 
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone. Light and indulgent. Signature dessert.', 
        price: 4.500, 
        calories: 380, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['dessert'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['sweet', 'coffee', 'creamy']
      },
      { 
        restaurant_id: restaurant.id, 
        category_id: dessertsCat.id, 
        category: 'Dessert',
        name: 'Panna Cotta', 
        description: 'Silky Italian custard with berry sauce. Light and elegant. Perfect ending to Italian meal.', 
        price: 4.000, 
        calories: 320, 
        preparation_time: 5, 
        is_vegetarian: true, 
        is_vegan: false, 
        is_spicy: false, 
        spice_level: 0,
        is_popular: true, 
        is_available: true,
        meal_types: ['dessert'],
        dietary_tags: ['vegetarian'],
        flavor_profile: ['sweet', 'creamy', 'fruity']
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
    console.log('🍝 Dishes:', dishes.length);
    console.log('💰 Price Range: BD 4.00 - BD 12.00');
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
