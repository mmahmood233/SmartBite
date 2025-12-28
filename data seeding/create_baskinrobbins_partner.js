/**
 * Create Baskin Robbins - Ice Cream Shop
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
  console.log('🍦 Creating Baskin Robbins Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'baskinrobbins@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'baskinrobbins@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'Baskin Robbins Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'baskinrobbins@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'baskinrobbins@wajba.bh', full_name: 'Baskin Robbins Manager',
        phone: '+973 1700 2000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Baskin Robbins', category: 'Desserts',
      description: 'World-famous ice cream with 31 flavors. Sundaes, milkshakes, ice cream cakes. Sweet treats for everyone.',
      address: 'Manama, Bahrain', latitude: 26.2285, longitude: 50.5860,
      phone: '+973 1700 2000', email: 'baskinrobbins@wajba.bh', rating: 4.7,
      total_reviews: 0, total_orders: 0, delivery_fee: 0.800, min_order: 1.000,
      avg_prep_time: '10-15 min', status: 'open', is_active: true,
      cuisine_types: ['Desserts', 'Ice Cream'], price_range: 'budget',
      ambiance: ['family-friendly', 'sweet shop'], dietary_options: ['vegetarian'],
      suitable_for: ['dessert', 'snack', 'celebration'], features: ['31 flavors', 'ice cream cakes'],
      signature_dishes: ['Chocolate Chip Cookie Dough', 'Mint Chocolate Chip', 'Pralines n Cream']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Ice Cream Scoops', description: 'Ice cream by scoop', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Sundaes', description: 'Ice cream sundaes', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Milkshakes', description: 'Thick milkshakes', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Cakes', description: 'Ice cream cakes', display_order: 4, is_active: true }
    ]).select();

    const scoopCat = categories.find(c => c.name === 'Ice Cream Scoops');
    const sundaeCat = categories.find(c => c.name === 'Sundaes');
    const shakeCat = categories.find(c => c.name === 'Milkshakes');
    const cakeCat = categories.find(c => c.name === 'Cakes');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: scoopCat.id, category: 'Dessert', name: 'Single Scoop', 
        description: 'One scoop of your favorite flavor. Choose from 31 flavors. Classic treat.', 
        price: 2.000, calories: 180, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: scoopCat.id, category: 'Dessert', name: 'Double Scoop', 
        description: 'Two scoops of ice cream. Mix and match flavors. Popular choice.', 
        price: 3.500, calories: 360, preparation_time: 5, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert', 'snack'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: scoopCat.id, category: 'Dessert', name: 'Triple Scoop', 
        description: 'Three scoops of ice cream. Perfect for sharing. Best value.', 
        price: 5.000, calories: 540, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: sundaeCat.id, category: 'Dessert', name: 'Hot Fudge Sundae', 
        description: 'Ice cream with hot fudge, whipped cream, cherry. Classic sundae. Indulgent.', 
        price: 4.500, calories: 480, preparation_time: 10, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sundaeCat.id, category: 'Dessert', name: 'Banana Split', 
        description: 'Three scoops with banana, toppings, whipped cream. Signature sundae. Spectacular.', 
        price: 6.000, calories: 680, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: sundaeCat.id, category: 'Dessert', name: 'Brownie Sundae', 
        description: 'Warm brownie with ice cream and toppings. Decadent. Chocolate lovers dream.', 
        price: 5.500, calories: 620, preparation_time: 12, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: shakeCat.id, category: 'Beverage', name: 'Chocolate Milkshake', 
        description: 'Thick chocolate milkshake. Rich and creamy. Classic flavor.', 
        price: 4.000, calories: 520, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: shakeCat.id, category: 'Beverage', name: 'Strawberry Milkshake', 
        description: 'Fresh strawberry milkshake. Fruity and sweet. Popular choice.', 
        price: 4.000, calories: 480, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: shakeCat.id, category: 'Beverage', name: 'Oreo Milkshake', 
        description: 'Cookies and cream milkshake. Crunchy and creamy. Fan favorite.', 
        price: 4.500, calories: 580, preparation_time: 8, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['beverage', 'dessert'], dietary_tags: ['vegetarian', 'halal'] },
      
      { restaurant_id: restaurant.id, category_id: cakeCat.id, category: 'Dessert', name: 'Ice Cream Cake (Small)', 
        description: 'Small ice cream cake for 4-6 people. Perfect for celebrations. Customizable.', 
        price: 15.000, calories: 2400, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] },
      { restaurant_id: restaurant.id, category_id: cakeCat.id, category: 'Dessert', name: 'Ice Cream Cake (Large)', 
        description: 'Large ice cream cake for 10-12 people. Party size. Special occasions.', 
        price: 25.000, calories: 4800, preparation_time: 20, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'halal'] }
    ]);

    console.log('✅ Baskin Robbins created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
