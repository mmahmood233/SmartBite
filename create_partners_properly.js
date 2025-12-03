/**
 * Create Partner Accounts Using Supabase Admin API
 * This ensures accounts are created properly and can actually log in
 * 
 * Run with: node create_partners_properly.js
 */

const { createClient } = require('@supabase/supabase-js');

// YOU NEED TO FILL THESE IN FROM YOUR .env FILE
const SUPABASE_URL = 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U'; // NOT the anon key!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const partners = [
  {
    email: 'mcdonaldsbahrain@wajba.bh',
    password: '12345678',
    full_name: "McDonald's Bahrain Manager",
    phone: '+973 1758 8888',
    restaurant_name: "McDonald's Bahrain"
  },
  {
    email: 'blacktapbahrain@wajba.bh',
    password: '12345678',
    full_name: 'Black Tap Manager',
    phone: '+973 1700 1000',
    restaurant_name: 'Black Tap Craft Burgers & Shakes - Bahrain'
  },
  {
    email: 'calexicoadliya@wajba.bh',
    password: '12345678',
    full_name: 'Calexico Adliya Manager',
    phone: '+973 1700 2000',
    restaurant_name: 'Calexico Adliya'
  },
  {
    email: 'nomadurbaneatery@wajba.bh',
    password: '12345678',
    full_name: 'Nomad Urban Eatery Manager',
    phone: '+973 1700 3000',
    restaurant_name: 'Nomad Urban Eatery'
  },
  {
    email: 'pizzahutriffa@wajba.bh',
    password: '12345678',
    full_name: 'Pizza Hut Riffa Manager',
    phone: '+973 1700 4000',
    restaurant_name: 'Pizza Hut Riffa'
  },
  {
    email: 'kfcjuffair@wajba.bh',
    password: '12345678',
    full_name: 'KFC Juffair Manager',
    phone: '+973 1700 5000',
    restaurant_name: 'KFC Juffair'
  },
  {
    email: 'shakeshackbahrain@wajba.bh',
    password: '12345678',
    full_name: 'Shake Shack Manager',
    phone: '+973 1700 6000',
    restaurant_name: 'Shake Shack – City Centre Bahrain'
  }
];

async function createPartnerAccounts() {
  console.log('🚀 Starting partner account creation...\n');

  for (const partner of partners) {
    try {
      console.log(`Creating account for ${partner.email}...`);

      // 1. Delete existing auth user if exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === partner.email);
      
      if (existingUser) {
        console.log(`  ⚠️  Deleting existing auth user...`);
        await supabase.auth.admin.deleteUser(existingUser.id);
      }

      // 2. Delete existing user profile if exists
      await supabase.from('users').delete().eq('email', partner.email);

      // 3. Create new auth user with Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: partner.email,
        password: partner.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: partner.full_name
        }
      });

      if (authError) {
        console.error(`  ❌ Auth error: ${authError.message}`);
        continue;
      }

      console.log(`  ✅ Auth user created: ${authData.user.id}`);

      // 4. Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: partner.email,
          full_name: partner.full_name,
          phone: partner.phone,
          role: 'partner',
          is_active: true,
          email_verified: true,
          phone_verified: true
        });

      if (profileError) {
        console.error(`  ❌ Profile error: ${profileError.message}`);
        continue;
      }

      console.log(`  ✅ User profile created`);

      // 5. Link to restaurant
      const { error: restaurantError } = await supabase
        .from('restaurants')
        .update({ partner_id: authData.user.id })
        .ilike('name', `%${partner.restaurant_name}%`);

      if (restaurantError) {
        console.error(`  ⚠️  Restaurant link error: ${restaurantError.message}`);
      } else {
        console.log(`  ✅ Linked to restaurant: ${partner.restaurant_name}`);
      }

      console.log(`  ✅ SUCCESS: ${partner.email}\n`);

    } catch (error) {
      console.error(`  ❌ Unexpected error for ${partner.email}:`, error.message, '\n');
    }
  }

  console.log('\n🎉 Partner account creation complete!');
  console.log('\n📋 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  partners.forEach(p => {
    console.log(`${p.full_name}`);
    console.log(`  Email: ${p.email}`);
    console.log(`  Password: ${p.password}\n`);
  });
}

// Run the script
createPartnerAccounts()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
