/**
 * Create Texas Chicken - Fried Chicken Buckets & Family Meals
 * Chicken buckets, tenders, family meals: BD 2-12
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const RESTAURANT_NAME = 'Texas Chicken';
const RESTAURANT_EMAIL = 'texaschicken@wajba.bh';
const RESTAURANT_CATEGORY = 'Fast Food';
const RESTAURANT_DESCRIPTION = 'Famous fried chicken buckets and family meals. Perfect for gatherings, parties, and sharing. Crispy chicken, tenders, and sides that everyone loves.';
const RESTAURANT_ADDRESS = 'Manama, Bahrain';
const RESTAURANT_LATITUDE = 26.2285;
const RESTAURANT_LONGITUDE = 50.5860;
const RESTAURANT_PHONE = '+973 1777 7000';
const RESTAURANT_RATING = 4.3;
const DELIVERY_FEE = 1.200;
const MIN_ORDER = 1.000;
const AVG_PREP_TIME = '20-25 min';

async function createRestaurantPartner() {
  console.log(`🍗 Creating ${RESTAURANT_NAME} Partner Account...\n`);

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
      cuisine_types: ['American', 'Fast Food', 'Fried Chicken'], price_range: 'budget',
      ambiance: ['casual', 'family-friendly'], dietary_options: ['halal'],
      suitable_for: ['family', 'gathering', 'party', 'lunch', 'dinner'], 
      features: ['family meals', 'bucket deals', 'party food'],
      signature_dishes: ['12 Piece Bucket', 'Family Meal', 'Chicken Tenders']
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Buckets', description: 'Chicken buckets for sharing', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Family Meals', description: 'Complete family meals', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Chicken Pieces', description: 'Individual chicken pieces', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Tenders & Strips', description: 'Chicken tenders and strips', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sides', description: 'Fries, coleslaw, biscuits', display_order: 5, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 6, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const bucketCat = categories.find(c => c.name === 'Buckets');
    const familyCat = categories.find(c => c.name === 'Family Meals');
    const piecesCat = categories.find(c => c.name === 'Chicken Pieces');
    const tendersCat = categories.find(c => c.name === 'Tenders & Strips');
    const sidesCat = categories.find(c => c.name === 'Sides');
    const bevCat = categories.find(c => c.name === 'Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: bucketCat.id, category: 'Main Course',
        name: '8 Piece Bucket', 
        description: '8 pieces of crispy fried chicken. Perfect for small gatherings. Signature crispy coating.', 
        price: 6.500, calories: 1920, preparation_time: 20, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy', 'fried'] },
      { restaurant_id: restaurant.id, category_id: bucketCat.id, category: 'Main Course',
        name: '12 Piece Bucket', 
        description: '12 pieces of crispy fried chicken. Great for family meals. Most popular bucket.', 
        price: 9.000, calories: 2880, preparation_time: 22, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy', 'fried'] },
      { restaurant_id: restaurant.id, category_id: bucketCat.id, category: 'Main Course',
        name: '16 Piece Bucket', 
        description: '16 pieces of crispy fried chicken. Perfect for parties and large gatherings. Party size.', 
        price: 11.500, calories: 3840, preparation_time: 25, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy', 'fried'] },
      
      { restaurant_id: restaurant.id, category_id: familyCat.id, category: 'Combo',
        name: 'Family Meal (8 pcs + 4 sides)', 
        description: '8 chicken pieces with 4 regular sides and 4 biscuits. Complete family meal. Best value.', 
        price: 10.000, calories: 3200, preparation_time: 22, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy'] },
      { restaurant_id: restaurant.id, category_id: familyCat.id, category: 'Combo',
        name: 'Party Meal (16 pcs + 8 sides)', 
        description: '16 chicken pieces with 8 sides and 8 biscuits. Perfect for parties. Feeds 6-8 people.', 
        price: 18.000, calories: 6400, preparation_time: 25, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy'] },
      
      { restaurant_id: restaurant.id, category_id: piecesCat.id, category: 'Main Course',
        name: '2 Piece Chicken', 
        description: '2 pieces of crispy fried chicken. Individual meal. Quick and satisfying.', 
        price: 2.500, calories: 480, preparation_time: 15, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy'] },
      { restaurant_id: restaurant.id, category_id: piecesCat.id, category: 'Main Course',
        name: '3 Piece Chicken', 
        description: '3 pieces of crispy fried chicken. Hearty individual meal. Popular choice.', 
        price: 3.500, calories: 720, preparation_time: 15, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy'] },
      
      { restaurant_id: restaurant.id, category_id: tendersCat.id, category: 'Main Course',
        name: '3 Piece Chicken Tenders', 
        description: 'Three crispy chicken tenders with dipping sauce. Tender and juicy. Kids favorite.', 
        price: 3.000, calories: 420, preparation_time: 12, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy'] },
      { restaurant_id: restaurant.id, category_id: tendersCat.id, category: 'Main Course',
        name: '5 Piece Chicken Tenders', 
        description: 'Five crispy chicken tenders with dipping sauce. Perfect meal size. Very popular.', 
        price: 4.500, calories: 700, preparation_time: 15, is_vegetarian: false, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'crispy'] },
      { restaurant_id: restaurant.id, category_id: tendersCat.id, category: 'Main Course',
        name: 'Spicy Chicken Strips (5 pcs)', 
        description: 'Five spicy chicken strips with kick. For spice lovers. Hot and crispy.', 
        price: 4.800, calories: 720, preparation_time: 15, is_vegetarian: false, is_vegan: false, 
        is_spicy: true, spice_level: 3, is_popular: true, is_available: true,
        meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'],
        flavor_profile: ['savory', 'spicy', 'crispy'] },
      
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side',
        name: 'Regular Fries', 
        description: 'Crispy golden fries. Classic side. Perfect with chicken.', 
        price: 1.500, calories: 320, preparation_time: 8, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['side'], dietary_tags: ['vegetarian', 'vegan'],
        flavor_profile: ['savory', 'crispy'] },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side',
        name: 'Coleslaw', 
        description: 'Fresh creamy coleslaw. Refreshing side. Balances the fried chicken.', 
        price: 1.500, calories: 180, preparation_time: 5, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['side'], dietary_tags: ['vegetarian'],
        flavor_profile: ['creamy', 'tangy', 'fresh'] },
      { restaurant_id: restaurant.id, category_id: sidesCat.id, category: 'Side',
        name: 'Biscuits (2 pcs)', 
        description: 'Two warm buttery biscuits. Soft and fluffy. Texas Chicken signature.', 
        price: 1.000, calories: 280, preparation_time: 5, is_vegetarian: true, is_vegan: false, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['side'], dietary_tags: ['vegetarian'],
        flavor_profile: ['buttery', 'soft'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Soft Drink (Regular)', 
        description: 'Chilled soft drink. Choice of flavors. Refreshing.', 
        price: 1.000, calories: 150, preparation_time: 2, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan'],
        flavor_profile: ['sweet', 'refreshing'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage',
        name: 'Soft Drink (Large)', 
        description: 'Large chilled soft drink. Choice of flavors. Great for sharing.', 
        price: 1.500, calories: 250, preparation_time: 2, is_vegetarian: true, is_vegan: true, 
        is_spicy: false, spice_level: 0, is_popular: true, is_available: true,
        meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan'],
        flavor_profile: ['sweet', 'refreshing'] }
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
    console.log('🍗 Dishes:', dishes.length);
    console.log('💰 Price Range: BD 1.00 - BD 18.00');
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
