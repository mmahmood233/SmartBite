/**
 * Create The Seafood Grill - Luxury Seafood Restaurant
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
  console.log('🦞 Creating The Seafood Grill Partner Account...\n');

  try {
    const { data: existingUser } = await supabase.from('users').select('id, email, role').eq('email', 'seafoodgrill@wajba.bh').single();
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      if (existingUser.role !== 'partner') await supabase.from('users').update({ role: 'partner' }).eq('id', userId);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'seafoodgrill@wajba.bh', password: '12345678', email_confirm: true,
        user_metadata: { full_name: 'The Seafood Grill Manager' }
      });

      if (authError?.message.includes('already been registered')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        userId = users.find(u => u.email === 'seafoodgrill@wajba.bh').id;
      } else {
        userId = authData.user.id;
      }

      await supabase.from('users').insert({
        id: userId, email: 'seafoodgrill@wajba.bh', full_name: 'The Seafood Grill Manager',
        phone: '+973 1755 7000', role: 'partner', is_active: true
      });
    }
    console.log('✅ User ready');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'The Seafood Grill', category: 'Fine Dining',
      description: 'Premium seafood restaurant. Fresh catch daily, lobster, oysters, caviar. Oceanfront luxury dining.',
      address: 'Bahrain Bay, Manama', latitude: 26.2361, longitude: 50.5840,
      phone: '+973 1755 7000', email: 'seafoodgrill@wajba.bh', rating: 4.8,
      total_reviews: 0, total_orders: 0, delivery_fee: 3.000, min_order: 20.000,
      avg_prep_time: '35-45 min', status: 'open', is_active: true,
      cuisine_types: ['Seafood', 'Fine Dining', 'Mediterranean'], price_range: 'luxury',
      ambiance: ['upscale', 'oceanfront', 'elegant'], dietary_options: ['halal'],
      suitable_for: ['dinner', 'special occasion', 'business'], features: ['fresh daily', 'premium seafood', 'ocean view'],
      signature_dishes: ['Whole Lobster', 'King Crab Legs', 'Caviar Service']
    }).select().single();
    console.log('✅ Restaurant created');

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Raw Bar', description: 'Oysters and caviar', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Lobster & Crab', description: 'Premium shellfish', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Fresh Fish', description: 'Daily catch', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Appetizers', description: 'Seafood starters', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Desserts', description: 'Fine desserts', display_order: 5, is_active: true }
    ]).select();

    const rawCat = categories.find(c => c.name === 'Raw Bar');
    const lobsterCat = categories.find(c => c.name === 'Lobster & Crab');
    const fishCat = categories.find(c => c.name === 'Fresh Fish');
    const appsCat = categories.find(c => c.name === 'Appetizers');
    const dessertCat = categories.find(c => c.name === 'Desserts');

    await supabase.from('dishes').insert([
      { restaurant_id: restaurant.id, category_id: rawCat.id, category: 'Appetizer', name: 'Oysters Platter (12 pcs)', 
        description: 'Dozen fresh oysters on ice with mignonette and lemon. Ocean-fresh. Premium selection.', 
        price: 30.000, calories: 240, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood', 'low-calorie', 'premium'] },
      { restaurant_id: restaurant.id, category_id: rawCat.id, category: 'Appetizer', name: 'Caviar Service (30g)', 
        description: 'Premium caviar with blinis and crème fraîche. Ultimate luxury. Exquisite.', 
        price: 80.000, calories: 180, preparation_time: 15, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: lobsterCat.id, category: 'Main Course', name: 'Whole Maine Lobster (800g)', 
        description: 'Grilled whole lobster with drawn butter. Signature dish. Spectacular presentation.', 
        price: 55.000, calories: 680, preparation_time: 40, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'high-protein', 'premium'] },
      { restaurant_id: restaurant.id, category_id: lobsterCat.id, category: 'Main Course', name: 'King Crab Legs (1kg)', 
        description: 'Alaskan king crab legs steamed to perfection. Sweet and succulent. Premium shellfish.', 
        price: 60.000, calories: 520, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'high-protein', 'premium'] },
      { restaurant_id: restaurant.id, category_id: lobsterCat.id, category: 'Main Course', name: 'Lobster Thermidor', 
        description: 'Lobster in creamy cognac sauce. French classic. Indulgent and rich.', 
        price: 52.000, calories: 780, preparation_time: 40, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: fishCat.id, category: 'Main Course', name: 'Wild Turbot', 
        description: 'Whole turbot grilled with herbs. Delicate white fish. Premium catch. Elegant.', 
        price: 45.000, calories: 480, preparation_time: 35, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'high-protein', 'premium'] },
      { restaurant_id: restaurant.id, category_id: fishCat.id, category: 'Main Course', name: 'Dover Sole', 
        description: 'Pan-fried Dover sole with lemon butter. Classic preparation. Refined taste.', 
        price: 42.000, calories: 420, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'high-protein', 'premium'] },
      { restaurant_id: restaurant.id, category_id: fishCat.id, category: 'Main Course', name: 'Tuna Steak', 
        description: 'Seared yellowfin tuna with wasabi. Rare center. Japanese-inspired. Bold flavors.', 
        price: 38.000, calories: 380, preparation_time: 25, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dinner'], dietary_tags: ['halal', 'seafood', 'high-protein', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Seafood Tower', 
        description: 'Lobster, crab, shrimp, oysters on ice. Ultimate seafood platter. For sharing. Show-stopper.', 
        price: 75.000, calories: 980, preparation_time: 30, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood', 'premium'] },
      { restaurant_id: restaurant.id, category_id: appsCat.id, category: 'Appetizer', name: 'Grilled Scallops', 
        description: 'Pan-seared scallops with truffle butter. Sweet and tender. Premium starter.', 
        price: 28.000, calories: 320, preparation_time: 20, is_vegetarian: false, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['appetizer'], dietary_tags: ['halal', 'seafood', 'premium'] },
      
      { restaurant_id: restaurant.id, category_id: dessertCat.id, category: 'Dessert', name: 'Lemon Tart', 
        description: 'Tangy lemon tart with meringue. Light and refreshing. Perfect after seafood.', 
        price: 9.000, calories: 380, preparation_time: 15, is_vegetarian: true, is_spicy: false, spice_level: 0, 
        is_popular: true, is_available: true, meal_types: ['dessert'], dietary_tags: ['vegetarian', 'premium'] }
    ]);

    console.log('✅ The Seafood Grill created successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRestaurantPartner().then(() => process.exit(0)).catch(console.error);
