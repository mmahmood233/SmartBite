/**
 * Create Biryani House - Indian/Pakistani Cuisine
 * Biryani, curry, tandoori: BD 3-9
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createRestaurantPartner() {
  console.log('🍛 Creating Biryani House Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'biryanihouse@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') {
        await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
      }
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'biryanihouse@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Biryani House Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'biryanihouse@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'biryanihouse@wajba.bh', full_name: 'Biryani House Manager',
        phone: '+973 1788 8000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Biryani House', category: 'Indian',
      description: 'Authentic Indian and Pakistani cuisine. Famous biryani, curry, tandoori, and naan. Rich spices and traditional recipes.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1788 8000', email: 'biryanihouse@wajba.bh', rating: 4.6,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 1.000,
      avg_prep_time: '30-35 min', status: 'open', is_active: true,
      cuisine_types: ['Indian', 'Pakistani', 'Curry'], price_range: 'mid-range',
      ambiance: ['traditional', 'family-friendly'], dietary_options: ['halal', 'vegetarian'],
      suitable_for: ['family', 'lunch', 'dinner'], features: ['authentic spices', 'traditional recipes'],
      signature_dishes: ['Chicken Biryani', 'Butter Chicken', 'Tandoori Chicken']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Biryani', description: 'Rice dishes', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Curry', description: 'Curry dishes', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Tandoori', description: 'Tandoor grilled', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Bread', description: 'Naan and roti', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();

    const biryaniCat = categories.find(c => c.name === 'Biryani');
    const curryCat = categories.find(c => c.name === 'Curry');
    const tandooriCat = categories.find(c => c.name === 'Tandoori');
    const breadCat = categories.find(c => c.name === 'Bread');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: biryaniCat.id, category: 'Main Course', name: 'Chicken Biryani', 
        description: 'Aromatic basmati rice with spiced chicken. Signature dish. Traditional recipe.', 
        price: 5.500, calories: 680, preparation_time: 30, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: biryaniCat.id, category: 'Main Course', name: 'Mutton Biryani', 
        description: 'Tender mutton with fragrant rice and spices. Premium choice. Rich and flavorful.', 
        price: 7.500, calories: 780, preparation_time: 35, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: biryaniCat.id, category: 'Main Course', name: 'Vegetable Biryani', 
        description: 'Mixed vegetables with aromatic rice. Vegetarian delight. Flavorful and healthy.', 
        price: 4.500, calories: 520, preparation_time: 25, is_vegetarian: true, is_spicy: true, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: curryCat.id, category: 'Main Course', name: 'Butter Chicken', 
        description: 'Creamy tomato curry with tender chicken. Most popular curry. Rich and mild.', 
        price: 6.000, calories: 620, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: curryCat.id, category: 'Main Course', name: 'Chicken Tikka Masala', 
        description: 'Grilled chicken in spiced tomato curry. Classic favorite. Perfectly spiced.', 
        price: 6.200, calories: 580, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: curryCat.id, category: 'Main Course', name: 'Palak Paneer', 
        description: 'Spinach curry with cottage cheese. Vegetarian classic. Creamy and nutritious.', 
        price: 5.000, calories: 420, preparation_time: 20, is_vegetarian: true, is_spicy: false, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: tandooriCat.id, category: 'Main Course', name: 'Tandoori Chicken (Half)', 
        description: 'Half chicken marinated in yogurt and spices, grilled in tandoor. Smoky and juicy.', 
        price: 5.500, calories: 520, preparation_time: 30, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: tandooriCat.id, category: 'Main Course', name: 'Chicken Tikka', 
        description: 'Boneless chicken pieces grilled in tandoor. Perfect starter. Tender and flavorful.', 
        price: 4.500, calories: 380, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'appetizer'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: tandooriCat.id, category: 'Main Course', name: 'Seekh Kebab', 
        description: 'Minced meat kebabs grilled in tandoor. Spiced and smoky. Traditional favorite.', 
        price: 5.000, calories: 450, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'appetizer'], dietary_tags: ['halal', 'high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: breadCat.id, category: 'Side', name: 'Butter Naan', 
        description: 'Soft naan bread with butter. Perfect with curry. Tandoor-baked.', 
        price: 1.000, calories: 280, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: breadCat.id, category: 'Side', name: 'Garlic Naan', 
        description: 'Naan with garlic and herbs. Aromatic and delicious. Popular choice.', 
        price: 1.200, calories: 300, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Mango Lassi', 
        description: 'Sweet mango yogurt drink. Refreshing and cooling. Traditional beverage.', 
        price: 2.000, calories: 220, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Masala Chai', 
        description: 'Spiced Indian tea with milk. Warm and aromatic. Perfect after meal.', 
        price: 1.500, calories: 120, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] }
    ]);

    console.log('✅ Biryani House created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
