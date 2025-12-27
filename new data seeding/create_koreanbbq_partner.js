/**
 * Create Korean BBQ House - Korean Cuisine
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
  console.log('🇰🇷 Creating Korean BBQ House Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'koreanbbq@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'koreanbbq@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Korean BBQ House Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'koreanbbq@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'koreanbbq@wajba.bh', full_name: 'Korean BBQ House Manager',
        phone: '+973 1788 9000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Korean BBQ House', category: 'Korean',
      description: 'Authentic Korean BBQ and cuisine. Bulgogi, bibimbap, Korean fried chicken, kimchi. K-food experience.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1788 9000', email: 'koreanbbq@wajba.bh', rating: 4.6,
      total_reviews: 0, total_orders: 0, delivery_fee: 1.200, min_order: 1.000,
      avg_prep_time: '25-30 min', status: 'open', is_active: true,
      cuisine_types: ['Korean', 'Asian', 'BBQ'], price_range: 'mid-range',
      ambiance: ['modern', 'trendy'], dietary_options: ['halal'],
      suitable_for: ['lunch', 'dinner'], features: ['Korean BBQ', 'K-food'],
      signature_dishes: ['Bulgogi', 'Bibimbap', 'Korean Fried Chicken']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'BBQ', description: 'Korean BBQ', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Rice Bowls', description: 'Bibimbap and bowls', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Fried Chicken', description: 'Korean fried chicken', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Korean starters', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Korean drinks', display_order: 5, is_active: true }
    ]).select();

    const bbqCat = categories.find(c => c.name === 'BBQ');
    const bowlCat = categories.find(c => c.name === 'Rice Bowls');
    const chickenCat = categories.find(c => c.name === 'Fried Chicken');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const bevCat = categories.find(c => c.name === 'Beverages');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: bbqCat.id, category: 'Main Course', name: 'Bulgogi', 
        description: 'Marinated beef BBQ. Sweet and savory. Korean classic. Signature dish.', 
        price: 7.000, calories: 580, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: bbqCat.id, category: 'Main Course', name: 'Galbi (Short Ribs)', 
        description: 'Marinated beef short ribs. Premium cut. Rich and tender. Special occasion.', 
        price: 9.000, calories: 720, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal', 'high-protein'] },
      { restaurant_id: restaurant.id, category_id: bbqCat.id, category: 'Main Course', name: 'Spicy Pork BBQ', 
        description: 'Spicy marinated pork. Hot and flavorful. For spice lovers. Traditional recipe.', 
        price: 6.500, calories: 620, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 3, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: [] },
      
      { restaurant_id: restaurant.id, category_id: bowlCat.id, category: 'Main Course', name: 'Bibimbap', 
        description: 'Mixed rice bowl with vegetables, egg, and meat. Signature Korean dish. Healthy and delicious.', 
        price: 6.000, calories: 580, preparation_time: 20, is_vegetarian: false, is_spicy: true, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: bowlCat.id, category: 'Main Course', name: 'Dolsot Bibimbap', 
        description: 'Bibimbap in hot stone pot. Crispy rice bottom. Extra special. Premium version.', 
        price: 7.000, calories: 620, preparation_time: 22, is_vegetarian: false, is_spicy: true, spice_level: 1, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: bowlCat.id, category: 'Main Course', name: 'Kimchi Fried Rice', 
        description: 'Fried rice with kimchi and vegetables. Tangy and savory. Comfort food. Popular choice.', 
        price: 5.000, calories: 520, preparation_time: 18, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Korean Fried Chicken', 
        description: 'Crispy double-fried chicken. Extra crunchy. Addictive. K-food favorite.', 
        price: 6.500, calories: 680, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: chickenCat.id, category: 'Main Course', name: 'Yangnyeom Chicken', 
        description: 'Sweet and spicy glazed chicken. Sticky and delicious. Most popular. Trending.', 
        price: 7.000, calories: 720, preparation_time: 25, is_vegetarian: false, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['lunch', 'dinner', 'snack'], dietary_tags: ['halal'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Kimchi', 
        description: 'Fermented spicy cabbage. Traditional side. Probiotic-rich. Authentic taste.', 
        price: 2.000, calories: 40, preparation_time: 5, is_vegetarian: true, is_spicy: true, spice_level: 2, 
        is_popular: true, is_available: true, meal_types: ['side'], dietary_tags: ['vegetarian', 'vegan', 'halal', 'healthy'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Mandu (Dumplings 6 pcs)', 
        description: 'Korean dumplings with meat and vegetables. Steamed or fried. Juicy filling. Popular starter.', 
        price: 4.000, calories: 320, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Tteokbokki', 
        description: 'Spicy rice cakes in gochujang sauce. Street food favorite. Chewy and spicy. Addictive.', 
        price: 4.500, calories: 420, preparation_time: 18, is_vegetarian: true, is_spicy: true, spice_level: 3, 
        is_popular: true, is_available: true, meal_types: ['appetizer', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Korean Banana Milk', 
        description: 'Sweet banana-flavored milk. Korean classic drink. Nostalgic. Popular.', 
        price: 2.000, calories: 180, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: bevCat.id, category: 'Beverage', name: 'Soju (Non-alcoholic)', 
        description: 'Korean soda drink. Refreshing. Trendy. K-culture.', 
        price: 2.500, calories: 120, preparation_time: 3, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage'], dietary_tags: ['vegetarian', 'vegan', 'halal'] }
    ]);

    console.log('✅ Korean BBQ House created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
