/**
 * Create Cairo Kitchen - Egyptian Cuisine
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
  console.log('🇪🇬 Creating Cairo Kitchen Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'cairokitchen@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'cairokitchen@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Cairo Kitchen Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'cairokitchen@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'cairokitchen@wajba.bh', full_name: 'Cairo Kitchen Manager',
        phone: '+973 1722 4000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Cairo Kitchen', category: 'Egyptian',
      description: 'Authentic Egyptian cuisine. Koshari, falafel, shawarma, ful medames. Traditional Nile flavors.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1722 4000', email: 'cairokitchen@wajba.bh', rating: 4.5,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 1.000,
      avg_prep_time: '20-25 min', status: 'open', is_active: true,
      cuisine_types: ['Egyptian', 'Middle Eastern'], price_range: 'budget',
      ambiance: ['traditional', 'casual'], dietary_options: ['halal', 'vegetarian', 'vegan'],
      suitable_for: ['lunch', 'dinner'], features: ['authentic Egyptian', 'traditional recipes'],
      signature_dishes: ['Koshari', 'Egyptian Falafel', 'Ful Medames']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Egyptian Classics', description: 'Traditional dishes', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sandwiches', description: 'Egyptian sandwiches', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Mezze and starters', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Egyptian drinks', display_order: 4, is_active: true }
    ]).select();

    const classicsCat = categories.find(c => c.name === 'Egyptian Classics');
    const sandwichCat = categories.find(c => c.name === 'Sandwiches');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: classicsCat.id, category: 'Main Course', name: 'Koshari', 
        description: 'Rice, lentils, pasta, chickpeas with tomato sauce. National dish. Vegan-friendly. Signature.', 
        price: 4.000, calories: 520, preparation_time: 20, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: classicsCat.id, category: 'Main Course', name: 'Ful Medames', 
        description: 'Slow-cooked fava beans with olive oil and spices. Traditional breakfast. Healthy.', 
        price: 3.500, calories: 280, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['breakfast', 'lunch'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: classicsCat.id, category: 'Main Course', name: 'Molokhia with Rice', 
        description: 'Green soup with chicken and rice. Traditional Egyptian. Unique flavor.', 
        price: 5.000, calories: 480, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: classicsCat.id, category: 'Main Course', name: 'Mahshi (Stuffed Vegetables)', 
        description: 'Vegetables stuffed with rice and herbs. Traditional home cooking. Comfort food.', 
        price: 5.500, calories: 420, preparation_time: 30, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich', name: 'Egyptian Falafel Sandwich', 
        description: 'Ta\'meya (Egyptian falafel) in pita with tahini. Crispy and flavorful. Street food classic.', 
        price: 3.000, calories: 380, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'snack'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich', name: 'Shawarma Sandwich', 
        description: 'Egyptian-style chicken shawarma. Marinated and grilled. Popular street food.', 
        price: 3.500, calories: 480, preparation_time: 12, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: sandwichCat.id, category: 'Sandwich', name: 'Hawawshi', 
        description: 'Spiced meat in Egyptian bread. Baked to perfection. Traditional favorite.', 
        price: 4.000, calories: 520, preparation_time: 18, is_vegetarian: false, is_spicy: true, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Baba Ganoush', 
        description: 'Smoky eggplant dip with tahini. Creamy and rich. Classic mezze.', 
        price: 2.500, calories: 180, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Egyptian Salad', 
        description: 'Tomatoes, cucumber, onion with lemon. Fresh and tangy. Light starter.', 
        price: 2.000, calories: 80, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'side'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'low-calorie'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Tahini Dip', 
        description: 'Pure tahini with lemon and garlic. Creamy and nutty. Traditional dip.', 
        price: 2.000, calories: 160, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['vegetarian', 'vegan', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Karkade (Hibiscus Tea)', 
        description: 'Cold hibiscus tea. Refreshing and tangy. Traditional Egyptian drink.', 
        price: 1.500, calories: 40, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'healthy'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Sugarcane Juice', 
        description: 'Fresh sugarcane juice. Sweet and natural. Popular street drink.', 
        price: 2.000, calories: 180, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Cairo Kitchen created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
