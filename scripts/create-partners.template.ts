/**
 * Helper script to create all partner accounts
 * Run this once to set up all partner users
 * 
 * BEFORE RUNNING:
 * 1. Copy this file to create-partners.ts
 * 2. Go to Supabase Dashboard → Settings → API
 * 3. Copy your service_role key (NOT the anon key)
 * 4. Replace 'YOUR_SERVICE_ROLE_KEY' below with your actual key
 * 5. Make sure your EXPO_PUBLIC_SUPABASE_URL is set in .env
 * 
 * Usage: npx ts-node scripts/create-partners.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY'; // ⚠️ REPLACE THIS with your service_role key from Supabase Dashboard

if (!supabaseUrl) {
  console.error('❌ EXPO_PUBLIC_SUPABASE_URL not found in .env file');
  process.exit(1);
}

if (supabaseServiceKey === 'YOUR_SERVICE_ROLE_KEY') {
  console.error('❌ Please replace YOUR_SERVICE_ROLE_KEY with your actual service_role key');
  console.error('   Get it from: Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const partners = [
  { email: 'mcdonaldsbahrain@wajba.bh', name: "McDonald's Bahrain Owner", phone: '+973 1700 1013' },
  { email: 'kfcbahrain@wajba.bh', name: 'KFC Bahrain Owner', phone: '+973 1700 1014' },
  { email: 'burgerkingbahrain@wajba.bh', name: 'Burger King Bahrain Owner', phone: '+973 1700 1015' },
  { email: 'pizzahutbahrain@wajba.bh', name: 'Pizza Hut Bahrain Owner', phone: '+973 1700 1016' },
  { email: 'dominospizzabahrain@wajba.bh', name: "Domino's Bahrain Owner", phone: '+973 1700 1017' },
  { email: 'papajohnsbahrain@wajba.bh', name: "Papa John's Bahrain Owner", phone: '+973 1700 1019' },
  { email: 'nandosbahrain@wajba.bh', name: "Nando's Bahrain Owner", phone: '+973 1700 1020' },
  { email: 'shakeshackbahrain@wajba.bh', name: 'Shake Shack Bahrain Owner', phone: '+973 1700 1021' },
  { email: 'texaschickenbahrain@wajba.bh', name: 'Texas Chicken Bahrain Owner', phone: '+973 1700 1018' },
  { email: 'subwaybahrain@wajba.bh', name: 'Subway Bahrain Owner', phone: '+973 1700 1022' },
  { email: 'starbucksbahrain@wajba.bh', name: 'Starbucks Bahrain Owner', phone: '+973 1700 1023' },
  { email: 'krispykremebahrain@wajba.bh', name: 'Krispy Kreme Bahrain Owner', phone: '+973 1700 1024' },
  { email: 'dunkinbahrain@wajba.bh', name: "Dunkin' Bahrain Owner", phone: '+973 1700 1025' },
  { email: 'baskinrobbinsbahrain@wajba.bh', name: 'Baskin Robbins Bahrain Owner', phone: '+973 1700 1026' },
  { email: 'tgifridaysbahrain@wajba.bh', name: 'TGI Fridays Bahrain Owner', phone: '+973 1700 1027' },
  { email: 'chilisbahrain@wajba.bh', name: "Chili's Bahrain Owner", phone: '+973 1700 1028' },
  { email: 'pfchangsbahrain@wajba.bh', name: "P.F. Chang's Bahrain Owner", phone: '+973 1700 1029' },
  { email: 'hardeesbahrain@wajba.bh', name: "Hardee's Bahrain Owner", phone: '+973 1700 1030' },
  { email: 'costacoffeebahrain@wajba.bh', name: 'Costa Coffee Bahrain Owner', phone: '+973 1700 1031' },
  { email: 'pizzaexpressbahrain@wajba.bh', name: 'PizzaExpress Bahrain Owner', phone: '+973 1700 1032' },
];

async function createPartners() {
  console.log('Creating partner accounts...\n');

  for (const partner of partners) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: partner.email,
        password: '12345678',
        email_confirm: true,
      });

      if (authError) {
        console.error(`❌ Failed to create ${partner.email}:`, authError.message);
        continue;
      }

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: partner.email,
          full_name: partner.name,
          phone: partner.phone,
          role: 'partner',
        });

      if (userError) {
        console.error(`❌ Failed to create profile for ${partner.email}:`, userError.message);
        continue;
      }

      console.log(`✅ Created ${partner.email}`);
    } catch (error: any) {
      console.error(`❌ Error creating ${partner.email}:`, error.message);
    }
  }

  console.log('\n✅ Done! Now run link_users.sql to link partners to restaurants.');
}

createPartners();
