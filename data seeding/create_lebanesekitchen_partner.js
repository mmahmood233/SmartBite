/**
 * Create Lebanese Kitchen - Lebanese Cuisine
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
  console.log('🥙 Creating Lebanese Kitchen Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'lebanesekitchen@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'lebanesekitchen@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Lebanese Kitchen Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'lebanesekitchen@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'lebanesekitchen@wajba.bh', full_name: 'Lebanese Kitchen Manager',
        phone: '+973 1700 1000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Lebanese Kitchen', category: 'Lebanese',
      description: 'Authentic Lebanese cuisine. Famous mezze platters, shawarma, grills, and fresh salads. Traditional Lebanese hospitality.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1700 1000', email: 'lebanesekitchen@wajba.bh', rating: 4.7,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 1.000,
      avg_prep_time: '20-25 min', status: 'open', is_active: true,
      cuisine_types: ['Lebanese', 'Mediterranean', 'Middle Eastern'], price_range: 'mid-range',
      ambiance: ['traditional', 'family-friendly'], dietary_options: ['halal', 'vegetarian', 'vegan'],
      suitable_for: ['family', 'lunch', 'dinner'], features: ['authentic Lebanese', 'fresh ingredients'],
      signature_dishes: ['Mixed Mezze Platter', 'Chicken Shawarma', 'Mixed Grill']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Mezze', description: 'Lebanese appetizers', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Shawarma & Wraps', description: 'Wraps and sandwiches', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Grills', description: 'Charcoal grilled meats', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Salads', description: 'Fresh salads', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Drinks', display_order: 5, is_active: true }
    ]).select();

    const mezzeCat = categories.find(c => c.name === 'Mezze');
    const shawarmaCat = categories.find(c => c.name === 'Shawarma & Wraps');
    const grillCat = categories.find(c => c.name === 'Grills');
    const saladCat = categories.find(c => c.name === 'Salads');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Mixed Mezze Platter', 
        description: 'Hummus, baba ganoush, tabbouleh, fattoush, falafel. Perfect for sharing. Signature platter.', 
        price: 6.500, calories: 680, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Hummus with Meat', 
        description: 'Creamy hummus topped with spiced minced meat and pine nuts. Rich and savory. Premium mezze.', 
        price: 4.500, calories: 420, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: mezzeCat.id, category: 'Appetizer', name: 'Falafel Plate', 
        description: 'Crispy falafel with tahini sauce and vegetables. Vegan protein. Traditional favorite.', 
        price: 3.500, calories: 380, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: shawarmaCat.id, category: 'Sandwich', name: 'Chicken Shawarma', 
        description: 'Marinated chicken shawarma with garlic sauce and pickles. Most popular item. Authentic taste.', 
        price: 3.500, calories: 480, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: shawarmaCat.id, category: 'Sandwich', name: 'Beef Shawarma', 
        description: 'Tender beef shawarma with tahini and vegetables. Rich and flavorful. Premium choice.', 
        price: 4.000, calories: 520, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: shawarmaCat.id, category: 'Sandwich', name: 'Falafel Wrap', 
        description: 'Crispy falafel with tahini, vegetables in pita. Vegan option. Healthy and tasty.', 
        price: 3.000, calories: 420, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'snack'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: grillCat.id, category: 'Main Course', name: 'Mixed Grill Platter', 
        description: 'Chicken, lamb, kafta kebabs with rice and salad. Perfect for sharing. Best value.', 
        price: 9.500, calories: 1020, preparation_time: 28, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: grillCat.id, category: 'Main Course', name: 'Shish Tawook', 
        description: 'Marinated chicken skewers with garlic sauce. Tender and juicy. Lebanese classic.', 
        price: 5.500, calories: 480, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: grillCat.id, category: 'Main Course', name: 'Lamb Kafta', 
        description: 'Minced lamb kebabs with spices and herbs. Charcoal grilled. Traditional recipe.', 
        price: 6.000, calories: 520, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      
      { restaurant_id: restaurant.id, category_id: saladCat.id, category: 'Salad', name: 'Fattoush Salad', 
        description: 'Mixed greens with crispy pita chips and pomegranate dressing. Refreshing and crunchy. Signature salad.', 
        price: 3.500, calories: 220, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'side'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'low-calorie'] },
      { restaurant_id: restaurant.id, category_id: saladCat.id, category: 'Salad', name: 'Tabbouleh', 
        description: 'Parsley, bulgur, tomato, lemon salad. Fresh and healthy. Traditional Lebanese.', 
        price: 3.000, calories: 180, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'side'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'low-calorie'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Fresh Lemonade', 
        description: 'Freshly squeezed lemon juice with mint. Refreshing and tangy. Perfect with mezze.', 
        price: 2.000, calories: 80, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Jallab', 
        description: 'Traditional Lebanese drink with dates, grape molasses, and pine nuts. Sweet and refreshing. Authentic taste.', 
        price: 2.500, calories: 180, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Lebanese Kitchen created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
