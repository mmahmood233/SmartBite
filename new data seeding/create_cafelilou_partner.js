/**
 * Create Cafe Lilou Partner Account - Premium Coffee Shop & Patisserie
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createCafeLilouPartner() {
  console.log('☕ Creating Cafe Lilou Partner Account...\n');

  try {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: 'cafelilou@wajba.bh', password: '12345678', email_confirm: true,
      user_metadata: { full_name: 'Cafe Lilou Manager' }
    });
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    await supabase.from('users').insert({
      id: userId, email: 'cafelilou@wajba.bh', full_name: 'Cafe Lilou Manager',
      phone: '+973 1788 8788', role: 'partner', is_active: true
    });
    console.log('✅ Public user created');

    const { data: restaurant } = await supabase.from('restaurants').insert({
      partner_id: userId, name: 'Cafe Lilou', category: 'Coffee Shop',
      description: 'French-inspired cafe and patisserie. Premium coffee, artisan pastries, and elegant desserts. Chic atmosphere perfect for meetings or relaxation.',
      address: 'Seef Mall, Building 2499, Road 2832, Block 428, Seef, Manama, Bahrain',
      latitude: 26.2360, longitude: 50.5330, phone: '+973 1788 8788', email: 'cafelilou@wajba.bh',
      rating: 4.8, total_reviews: 0, total_orders: 0, delivery_fee: 1.500, min_order: 5.000,
      avg_prep_time: '10-15 min', status: 'open', is_active: true
    }).select().single();
    console.log('✅ Restaurant created:', restaurant.id);

    const { data: categories } = await supabase.from('menu_categories').insert([
      { restaurant_id: restaurant.id, name: 'Coffee & Espresso', description: 'Premium coffee drinks', display_order: 1, is_active: true },
      { restaurant_id: restaurant.id, name: 'Specialty Drinks', description: 'Signature beverages', display_order: 2, is_active: true },
      { restaurant_id: restaurant.id, name: 'Pastries', description: 'French pastries', display_order: 3, is_active: true },
      { restaurant_id: restaurant.id, name: 'Cakes & Desserts', description: 'Artisan desserts', display_order: 4, is_active: true },
      { restaurant_id: restaurant.id, name: 'Macarons', description: 'French macarons', display_order: 5, is_active: true }
    ]).select();
    console.log('✅ Categories created:', categories.length);

    const coffeeCat = categories.find(c => c.name === 'Coffee & Espresso');
    const specialtyCat = categories.find(c => c.name === 'Specialty Drinks');
    const pastriesCat = categories.find(c => c.name === 'Pastries');
    const cakesCat = categories.find(c => c.name === 'Cakes & Desserts');
    const macaronsCat = categories.find(c => c.name === 'Macarons');

    const dishes = [
      { restaurant_id: restaurant.id, category_id: coffeeCat.id, category: 'Beverage', name: 'Cappuccino', 
        description: 'Classic Italian cappuccino with perfectly steamed milk foam. Rich espresso balanced with creamy texture.', 
        image: null, image_url: null, price: 2.200, calories: 120, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: coffeeCat.id, category: 'Beverage', name: 'Cafe Latte', 
        description: 'Smooth espresso with steamed milk. Simple elegance in a cup.', 
        image: null, image_url: null, price: 2.000, calories: 150, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: coffeeCat.id, category: 'Beverage', name: 'Espresso', 
        description: 'Single shot of premium espresso. Pure coffee perfection.', 
        image: null, image_url: null, price: 1.500, calories: 5, preparation_time: 3, 
        is_vegetarian: true, is_vegan: true, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: specialtyCat.id, category: 'Beverage', name: 'Iced Caramel Macchiato', 
        description: 'Espresso with vanilla, milk, and caramel drizzle over ice. Sweet and refreshing.', 
        image: null, image_url: null, price: 2.800, calories: 250, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: specialtyCat.id, category: 'Beverage', name: 'Rose Latte', 
        description: 'Espresso with rose syrup and steamed milk. Floral and elegant signature drink.', 
        image: null, image_url: null, price: 3.000, calories: 180, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastriesCat.id, category: 'Dessert', name: 'Chocolate Croissant', 
        description: 'Buttery French croissant filled with rich chocolate. Baked fresh daily.', 
        image: null, image_url: null, price: 2.200, calories: 320, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: pastriesCat.id, category: 'Dessert', name: 'Almond Croissant', 
        description: 'Croissant filled with almond cream and topped with sliced almonds. Sweet and nutty.', 
        image: null, image_url: null, price: 2.500, calories: 380, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: cakesCat.id, category: 'Dessert', name: 'Red Velvet Cake Slice', 
        description: 'Moist red velvet cake with cream cheese frosting. Rich and decadent.', 
        image: null, image_url: null, price: 3.500, calories: 450, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: cakesCat.id, category: 'Dessert', name: 'Tiramisu', 
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone. Elegant and light.', 
        image: null, image_url: null, price: 3.800, calories: 420, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true },
      { restaurant_id: restaurant.id, category_id: cakesCat.id, category: 'Dessert', name: 'Cheesecake Slice', 
        description: 'New York style cheesecake with berry compote. Creamy and smooth.', 
        image: null, image_url: null, price: 3.500, calories: 480, preparation_time: 5, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: false, is_available: true },
      { restaurant_id: restaurant.id, category_id: macaronsCat.id, category: 'Dessert', name: 'Macarons (Box of 6)', 
        description: 'Assorted French macarons in flavors like vanilla, chocolate, pistachio, and raspberry. Delicate and colorful.', 
        image: null, image_url: null, price: 4.500, calories: 420, preparation_time: 3, 
        is_vegetarian: true, is_vegan: false, is_spicy: false, is_popular: true, is_available: true }
    ];

    await supabase.from('dishes').insert(dishes);
    console.log('✅ Dishes created:', dishes.length);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Cafe Lilou Partner Account Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: cafelilou@wajba.bh | 🔑 Password: 12345678');
    console.log('👤 Partner ID:', userId, '| 🏪 Restaurant ID:', restaurant.id);
    console.log('📋 Categories:', categories.length, '| 🍽️  Dishes:', dishes.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

createCafeLilouPartner().then(() => process.exit(0)).catch(error => { console.error('Fatal error:', error); process.exit(1); });
