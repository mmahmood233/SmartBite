/**
 * Create Cinnabon Partner Account - Cinnamon Rolls & Bakery
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createCinnabonPartner() {
  console.log('🥐 Creating Cinnabon Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'cinnabon@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Cinnabon Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'cinnabon@wajba.bh', full_name: 'Cinnabon Manager',
      phone: '+973 1790 0790', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Cinnabon', category: 'Bakery',
      description: 'World-famous cinnamon rolls! Freshly baked with signature cream cheese frosting. Irresistible aroma and taste.',
      address: 'Bahrain City Centre, Building 3344, Road 4747, Block 346, Sanabis, Manama, Bahrain',
      latitude: 26.2290, longitude: 50.5860, phone: '+973 1790 0790', email: 'cinnabon@wajba.bh',
      rating: 4.7, total_reviews: 0, total_orders: 0, delivery_fee: 1.000, min_order: 3.500,
      avg_prep_time: '8-12 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Cinnamon Rolls', description: 'Signature rolls', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Specialty Treats', description: 'Special items', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Beverages', description: 'Coffee and drinks', display_order: 3, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const rollsCat = categories.find(c => c.name === 'Cinnamon Rolls');
    const specialtyCat = categories.find(c => c.name === 'Specialty Treats');
    const beveragesCat = categories.find(c => c.name === 'Beverages');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: rollsCat.id, category: 'Dessert', name: 'Classic Cinnabon Roll', 
        description: 'Our signature cinnamon roll with cream cheese frosting. Warm, gooey, and absolutely irresistible.', 
        image: null, image_url: null, price: 3.200, calories: 880, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: rollsCat.id, category: 'Dessert', name: 'Minibon (4 pcs)', 
        description: 'Four mini cinnamon rolls with cream cheese frosting. Perfect for sharing or snacking.', 
        image: null, image_url: null, price: 3.500, calories: 520, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: rollsCat.id, category: 'Dessert', name: 'Caramel Pecanbon', 
        description: 'Cinnamon roll topped with caramel and pecans. Sweet and nutty perfection.', 
        image: null, image_url: null, price: 3.800, calories: 1080, preparation_time: 8, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: specialtyCat.id, category: 'Dessert', name: 'Cinnabon Bites', 
        description: 'Bite-sized cinnamon roll pieces with cream cheese frosting dip. Fun and shareable.', 
        image: null, image_url: null, price: 2.800, calories: 420, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: specialtyCat.id, category: 'Dessert', name: 'Cinnamon Stix', 
        description: 'Cinnamon breadsticks with cream cheese frosting for dipping. Crispy and sweet.', 
        image: null, image_url: null, price: 2.500, calories: 380, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Mochalatta Chill', 
        description: 'Frozen coffee drink with chocolate. Refreshing and energizing.', 
        image: null, image_url: null, price: 2.500, calories: 450, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: beveragesCat.id, category: 'Beverage', name: 'Hot Coffee', 
        description: 'Freshly brewed coffee. Perfect pairing with cinnamon rolls.', 
        image: null, image_url: null, price: 1.500, calories: 5, preparation_time: 3, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Cinnabon Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: cinnabon@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createCinnabonPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
