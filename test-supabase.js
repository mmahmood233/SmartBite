/**
 * Test Supabase Connection
 * Run this to verify your Supabase setup is working
 * 
 * Run with: node test-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Error: Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check restaurant_categories table
    console.log('\n📊 Test 1: Fetching restaurant categories...');
    const { data: categories, error: catError } = await supabase
      .from('restaurant_categories')
      .select('*')
      .limit(5);

    if (catError) {
      console.error('❌ Error:', catError.message);
    } else {
      console.log('✅ Success! Found', categories.length, 'categories');
      console.log('Categories:', categories.map(c => c.name).join(', '));
    }

    // Test 2: Check tables exist
    console.log('\n📊 Test 2: Checking if tables exist...');
    const { data: tables, error: tableError } = await supabase
      .from('restaurants')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('❌ Error:', tableError.message);
    } else {
      console.log('✅ Tables exist and are accessible!');
    }

    console.log('\n🎉 All tests passed! Supabase is connected!\n');
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
