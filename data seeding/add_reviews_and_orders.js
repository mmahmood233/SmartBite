/**
 * Add Reviews and Sample Orders for All Restaurants
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Sample review comments
const reviewComments = {
  5: [
    'Absolutely amazing! Best food I\'ve had in a long time.',
    'Perfect in every way. Highly recommend!',
    'Outstanding quality and service. Will order again!',
    'Exceeded all expectations. Five stars!',
    'Delicious food, fast delivery. Couldn\'t be happier!'
  ],
  4: [
    'Very good food, just a minor issue with delivery time.',
    'Great taste, portions could be bigger.',
    'Really enjoyed it, will definitely order again.',
    'Good quality, fast service. Recommended!',
    'Tasty food, good value for money.'
  ],
  3: [
    'Decent food, nothing special.',
    'Average experience, could be better.',
    'Food was okay, delivery took a while.',
    'Not bad, but not great either.',
    'Acceptable quality, met expectations.'
  ]
};

const orderStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

async function createTestCustomers() {
  console.log('👥 Creating test customers...\n');
  
  const customers = [];
  for (let i = 1; i <= 5; i++) {
    const email = `customer${i}@test.com`;
    
    // Check if customer exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      customers.push(existingUser.id);
      console.log(`✓ Customer ${i} already exists`);
      continue;
    }
    
    // Create auth user
    const { data: authData } = await supabase.auth.admin.createUser({
      email: email,
      password: '12345678',
      email_confirm: true,
      user_metadata: { full_name: `Test Customer ${i}` }
    });
    
    // Create public user
    await supabase.from('users').insert({
      id: authData.user.id,
      email: email,
      full_name: `Test Customer ${i}`,
      phone: `+973 3300${i}00${i}`,
      role: 'customer',
      is_active: true
    });
    
    customers.push(authData.user.id);
    console.log(`✅ Created customer ${i}: ${authData.user.id}`);
  }
  
  return customers;
}

async function createAddressesForCustomers(customers) {
  console.log('\n📍 Creating addresses for customers...\n');
  
  const addresses = [];
  for (let i = 0; i < customers.length; i++) {
    const customerId = customers[i];
    
    // Check if address exists
    const { data: existingAddress } = await supabase
      .from('user_addresses')
      .select('id')
      .eq('user_id', customerId)
      .single();
    
    if (existingAddress) {
      addresses.push(existingAddress.id);
      console.log(`✓ Address for customer ${i + 1} already exists`);
      continue;
    }
    
    const { data: address } = await supabase.from('user_addresses').insert({
      user_id: customerId,
      building: `${100 + i}`,
      road: `${2000 + i}`,
      block: `${300 + i}`,
      area: 'Juffair',
      city: 'Manama',
      contact_number: `+973 3300${i}00${i}`,
      is_default: true
    }).select().single();
    
    addresses.push(address.id);
    console.log(`✅ Created address for customer ${i + 1}`);
  }
  
  return addresses;
}

async function addReviewsAndOrders() {
  console.log('🚀 Adding Reviews and Orders for All Restaurants...\n');
  
  try {
    // Get all restaurants
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('id, name, partner_id');
    
    console.log(`📊 Found ${restaurants.length} restaurants\n`);
    
    // Create test customers
    const customers = await createTestCustomers();
    const addresses = await createAddressesForCustomers(customers);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    let totalReviews = 0;
    let totalOrders = 0;
    
    for (const restaurant of restaurants) {
      console.log(`🏪 Processing: ${restaurant.name}`);
      
      // Get dishes for this restaurant
      const { data: dishes } = await supabase
        .from('dishes')
        .select('id, name, price')
        .eq('restaurant_id', restaurant.id)
        .limit(10);
      
      if (!dishes || dishes.length === 0) {
        console.log(`   ⚠️  No dishes found, skipping...\n`);
        continue;
      }
      
      // Add 3-8 reviews per restaurant
      const numReviews = Math.floor(Math.random() * 6) + 3;
      const reviews = [];
      
      for (let i = 0; i < numReviews; i++) {
        const customerId = customers[Math.floor(Math.random() * customers.length)];
        const rating = Math.random() < 0.7 ? 5 : (Math.random() < 0.5 ? 4 : 3);
        const comments = reviewComments[rating];
        const comment = comments[Math.floor(Math.random() * comments.length)];
        
        reviews.push({
          restaurant_id: restaurant.id,
          user_id: customerId,
          rating: rating,
          comment: comment,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      await supabase.from('reviews').insert(reviews);
      totalReviews += reviews.length;
      console.log(`   ✅ Added ${reviews.length} reviews`);
      
      // Add 5-12 orders per restaurant
      const numOrders = Math.floor(Math.random() * 8) + 5;
      
      for (let i = 0; i < numOrders; i++) {
        const customerId = customers[Math.floor(Math.random() * customers.length)];
        const addressId = addresses[customers.indexOf(customerId)];
        
        // Random order status (70% delivered, 10% in progress, 10% pending, 10% cancelled)
        const rand = Math.random();
        let status;
        if (rand < 0.7) status = 'delivered';
        else if (rand < 0.8) status = orderStatuses[Math.floor(Math.random() * 5)];
        else if (rand < 0.9) status = 'pending';
        else status = 'cancelled';
        
        // Select 1-4 random dishes
        const numDishes = Math.floor(Math.random() * 4) + 1;
        const selectedDishes = [];
        const usedIndices = new Set();
        
        while (selectedDishes.length < numDishes) {
          const idx = Math.floor(Math.random() * dishes.length);
          if (!usedIndices.has(idx)) {
            usedIndices.add(idx);
            selectedDishes.push(dishes[idx]);
          }
        }
        
        // Calculate total
        const subtotal = selectedDishes.reduce((sum, dish) => sum + parseFloat(dish.price), 0);
        const deliveryFee = 1.2;
        const total = subtotal + deliveryFee;
        
        // Create order
        const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const orderNumber = `WAJ${Math.floor(Math.random() * 90000) + 10000}`;
        
        const { data: order, error: orderError } = await supabase.from('orders').insert({
          order_number: orderNumber,
          user_id: customerId,
          restaurant_id: restaurant.id,
          delivery_address_id: addressId,
          status: status,
          subtotal: subtotal.toFixed(2),
          delivery_fee: deliveryFee.toFixed(2),
          discount_amount: '0.00',
          total_amount: total.toFixed(2),
          payment_method: Math.random() < 0.5 ? 'card' : 'cash',
          payment_status: status === 'delivered' ? 'completed' : (status === 'cancelled' ? 'failed' : 'pending'),
          created_at: createdAt.toISOString(),
          updated_at: createdAt.toISOString()
        }).select().single();
        
        if (orderError || !order) {
          console.log(`   ⚠️  Failed to create order: ${orderError?.message || 'Unknown error'}`);
          continue;
        }
        
        // Create order items
        const orderItems = selectedDishes.map(dish => {
          const quantity = Math.floor(Math.random() * 2) + 1;
          const unitPrice = parseFloat(dish.price);
          return {
            order_id: order.id,
            dish_id: dish.id,
            dish_name: dish.name,
            quantity: quantity,
            unit_price: unitPrice.toFixed(2),
            subtotal: (unitPrice * quantity).toFixed(2)
          };
        });
        
        await supabase.from('order_items').insert(orderItems);
        totalOrders++;
      }
      
      console.log(`   ✅ Added ${numOrders} orders\n`);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Successfully Added Reviews and Orders!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Total Restaurants: ${restaurants.length}`);
    console.log(`⭐ Total Reviews: ${totalReviews}`);
    console.log(`📦 Total Orders: ${totalOrders}`);
    console.log(`👥 Test Customers: ${customers.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  }
}

addReviewsAndOrders()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
