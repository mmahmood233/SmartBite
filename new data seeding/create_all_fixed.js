/**
 * Create All New Restaurants - Fixed Version
 * Based on Hardee's pattern with user existence check
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('🍽️  Creating All New Restaurants...\n');
  
  // First, update existing users to partner role
  console.log('🔄 Updating existing users to partner role...');
  const { data: updated } = await supabase
    .from('users')
    .update({ role: 'partner' })
    .in('email', [
      'fitfuel@wajba.bh',
      'lavinoteca@wajba.bh',
      'tokyosushi@wajba.bh',
      'popcornpalace@wajba.bh',
      'streetbites@wajba.bh',
      'freshsqueeze@wajba.bh'
    ])
    .select();
  
  console.log(`✅ Updated ${updated?.length || 0} users to partner role\n`);
  
  // Now run each restaurant creation
  console.log('Creating restaurants...\n');
  
  try {
    await require('./create_fitfuel_partner.js');
  } catch (e) {
    console.log('⚠️  Fit Fuel:', e.message);
  }
  
  try {
    await require('./create_lavinoteca_partner.js');
  } catch (e) {
    console.log('⚠️  La Vinoteca:', e.message);
  }
  
  try {
    await require('./create_tokyosushi_partner.js');
  } catch (e) {
    console.log('⚠️  Tokyo Sushi:', e.message);
  }
  
  try {
    await require('./create_popcornpalace_partner.js');
  } catch (e) {
    console.log('⚠️  Popcorn Palace:', e.message);
  }
  
  try {
    await require('./create_freshsqueeze_partner.js');
  } catch (e) {
    console.log('⚠️  Fresh Squeeze:', e.message);
  }
  
  console.log('\n✅ Done!');
}

main().then(() => process.exit(0)).catch(console.error);
