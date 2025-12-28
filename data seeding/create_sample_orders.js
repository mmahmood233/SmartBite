/**
 * Create Sample Orders for Testing
 * Creates orders with different statuses for KFC restaurant
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

async function createSampleOrders() {
  console.log('📦 Creating Sample Orders for KFC...\n');

  try {
    // Step 1: Get KFC restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, name')
      .eq('email', 'kfc@wajba.bh')
      .single();

    if (restaurantError) throw restaurantError;
    console.log('✅ Found restaurant:', restaurant.name);

    // Step 2: Get some dishes
    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select('id, name, price')
      .eq('restaurant_id', restaurant.id)
      .limit(5);

    if (dishesError) throw dishesError;
    console.log('✅ Found', dishes.length, 'dishes');

    // Step 3: Get or create test customer
    console.log('\n👤 Getting or creating test customer...');
    
    // Check if customer already exists
    let customerId;
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'customer@test.com')
      .single();

    if (existingUser) {
      customerId = existingUser.id;
      console.log('✅ Using existing customer:', customerId);
    } else {
      // Create new customer
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'customer@test.com',
        password: '12345678',
        email_confirm: true,
        user_metadata: {
          full_name: 'Test Customer'
        }
      });

      if (authError) throw authError;
      customerId = authData.user.id;

      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: customerId,
          email: 'customer@test.com',
          full_name: 'Test Customer',
          phone: '+973 3333 3333',
          role: 'customer',
          is_active: true
        });

      if (userError) throw userError;
      console.log('✅ Customer created:', customerId);
    }

    // Step 4: Get or create delivery address
    let address;
    const { data: existingAddress } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', customerId)
      .eq('is_default', true)
      .single();

    if (existingAddress) {
      address = existingAddress;
      console.log('✅ Using existing address');
    } else {
      const { data: newAddress, error: addressError } = await supabase
        .from('user_addresses')
        .insert({
          user_id: customerId,
          label: 'Home',
          building: 'Building 456',
          road: 'Road 1234',
          block: 'Block 324',
          area: 'Seef',
          city: 'Manama',
          contact_number: '+973 3333 3333',
          is_default: true
        })
        .select()
        .single();

      if (addressError) throw addressError;
      address = newAddress;
      console.log('✅ Address created');
    }

    // Step 5: Create sample orders with different statuses
    console.log('\n📦 Creating orders...');
    
    const orderStatuses = [
      // New orders
      { status: 'pending', payment_status: 'pending', delivery_status: null },
      { status: 'pending', payment_status: 'pending', delivery_status: null },
      { status: 'confirmed', payment_status: 'completed', delivery_status: null },
      { status: 'confirmed', payment_status: 'completed', delivery_status: null },
      
      // Being prepared
      { status: 'preparing', payment_status: 'completed', delivery_status: null },
      { status: 'preparing', payment_status: 'completed', delivery_status: null },
      
      // Ready for delivery
      { status: 'ready_for_pickup', payment_status: 'completed', delivery_status: 'pending' },
      { status: 'ready_for_pickup', payment_status: 'completed', delivery_status: 'picked_up' },
      
      // Out for delivery
      { status: 'out_for_delivery', payment_status: 'completed', delivery_status: 'on_the_way' },
      { status: 'out_for_delivery', payment_status: 'completed', delivery_status: 'on_the_way' },
      
      // Completed
      { status: 'delivered', payment_status: 'completed', delivery_status: 'delivered' },
      { status: 'delivered', payment_status: 'completed', delivery_status: 'delivered' },
      { status: 'delivered', payment_status: 'completed', delivery_status: 'delivered' },
      
      // Cancelled
      { status: 'cancelled', payment_status: 'refunded', delivery_status: null }
    ];

    let orderCount = 0;
    for (const orderStatus of orderStatuses) {
      // Generate unique order number
      const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Select random dishes for this order (1-4 dishes)
      const numDishes = 1 + Math.floor(Math.random() * 4);
      const orderDishes = [];
      for (let i = 0; i < numDishes; i++) {
        const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
        orderDishes.push(randomDish);
      }
      
      const subtotal = orderDishes.reduce((sum, dish) => sum + parseFloat(dish.price), 0);
      const deliveryFee = 1.5;
      const totalAmount = subtotal + deliveryFee;
      
      // Vary the creation time (orders from last 2 hours)
      const hoursAgo = Math.floor(Math.random() * 2);
      const minutesAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));

      // Create order with custom created_at
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: customerId,
          restaurant_id: restaurant.id,
          delivery_address_id: address.id,
          status: orderStatus.status,
          payment_status: orderStatus.payment_status,
          delivery_status: orderStatus.delivery_status,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          discount_amount: 0,
          total_amount: totalAmount,
          payment_method: Math.random() > 0.5 ? 'card' : 'cash',
          delivery_notes: 'Please ring the doorbell',
          estimated_delivery_time: new Date(createdAt.getTime() + 30 * 60 * 1000).toISOString(),
          created_at: createdAt.toISOString()
        })
        .select()
        .single();

      if (orderError) {
        console.error('❌ Order error:', orderError);
        continue;
      }

      // Create order items
      for (const dish of orderDishes) {
        await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            dish_id: dish.id,
            dish_name: dish.name,
            quantity: 1,
            unit_price: dish.price,
            subtotal: dish.price
          });
      }

      console.log(`✅ Order ${orderCount + 1}: ${orderStatus.status} - BD ${totalAmount.toFixed(3)}`);
      orderCount++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Sample Orders Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏪 Restaurant:', restaurant.name);
    console.log('👤 Customer: customer@test.com / 12345678');
    console.log('📦 Orders created:', orderCount);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the script
createSampleOrders()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
