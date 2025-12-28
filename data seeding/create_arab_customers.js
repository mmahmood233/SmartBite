/**
 * Create Realistic Arab Customer Accounts
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Realistic Arab names (Bahraini/Gulf region)
const customers = [
  { name: 'Ahmed Al-Khalifa', email: 'ahmed.alkhalifa@gmail.com', phone: '+973 3311 1001' },
  { name: 'Fatima Al-Mansoor', email: 'fatima.mansoor@gmail.com', phone: '+973 3311 1002' },
  { name: 'Mohammed Al-Dosari', email: 'mohammed.dosari@gmail.com', phone: '+973 3311 1003' },
  { name: 'Maryam Al-Mutawa', email: 'maryam.mutawa@gmail.com', phone: '+973 3311 1004' },
  { name: 'Ali Al-Zayani', email: 'ali.zayani@gmail.com', phone: '+973 3311 1005' },
  { name: 'Noora Al-Binali', email: 'noora.binali@gmail.com', phone: '+973 3311 1006' },
  { name: 'Khalid Al-Jowder', email: 'khalid.jowder@gmail.com', phone: '+973 3311 1007' },
  { name: 'Sara Al-Mahmood', email: 'sara.mahmood@gmail.com', phone: '+973 3311 1008' },
  { name: 'Hassan Al-Fadhel', email: 'hassan.fadhel@gmail.com', phone: '+973 3311 1009' },
  { name: 'Layla Al-Hashemi', email: 'layla.hashemi@gmail.com', phone: '+973 3311 1010' },
  { name: 'Omar Al-Sayed', email: 'omar.sayed@gmail.com', phone: '+973 3311 1011' },
  { name: 'Aisha Al-Qassim', email: 'aisha.qassim@gmail.com', phone: '+973 3311 1012' },
  { name: 'Yousef Al-Thawadi', email: 'yousef.thawadi@gmail.com', phone: '+973 3311 1013' },
  { name: 'Huda Al-Kooheji', email: 'huda.kooheji@gmail.com', phone: '+973 3311 1014' },
  { name: 'Salman Al-Buainain', email: 'salman.buainain@gmail.com', phone: '+973 3311 1015' },
  { name: 'Mariam Al-Arrayedh', email: 'mariam.arrayedh@gmail.com', phone: '+973 3311 1016' },
  { name: 'Abdullah Al-Hawaj', email: 'abdullah.hawaj@gmail.com', phone: '+973 3311 1017' },
  { name: 'Zahra Al-Saeed', email: 'zahra.saeed@gmail.com', phone: '+973 3311 1018' },
  { name: 'Hamad Al-Mannai', email: 'hamad.mannai@gmail.com', phone: '+973 3311 1019' },
  { name: 'Reem Al-Moayyed', email: 'reem.moayyed@gmail.com', phone: '+973 3311 1020' }
];

// Bahraini addresses
const addresses = [
  { area: 'Juffair', building: '101', road: '2010', block: '326' },
  { area: 'Seef', building: '202', road: '2828', block: '428' },
  { area: 'Adliya', building: '303', road: '3838', block: '338' },
  { area: 'Hoora', building: '404', road: '2020', block: '320' },
  { area: 'Manama', building: '505', road: '1010', block: '304' },
  { area: 'Muharraq', building: '606', road: '1515', block: '215' },
  { area: 'Budaiya', building: '707', road: '4545', block: '440' },
  { area: 'Saar', building: '808', road: '5555', block: '550' },
  { area: 'Riffa', building: '909', road: '6060', block: '660' },
  { area: 'Isa Town', building: '1010', road: '7070', block: '770' },
  { area: 'Hamala', building: '1111', road: '3636', block: '555' },
  { area: 'Sanabis', building: '1212', road: '4646', block: '346' },
  { area: 'Gudaibiya', building: '1313', road: '1212', block: '312' },
  { area: 'Zinj', building: '1414', road: '2424', block: '324' },
  { area: 'Tubli', building: '1515', road: '3030', block: '330' },
  { area: 'Salmabad', building: '1616', road: '4040', block: '440' },
  { area: 'Amwaj', building: '1717', road: '5050', block: '550' },
  { area: 'Diyar', building: '1818', road: '6060', block: '660' },
  { area: 'Busaiteen', building: '1919', road: '7070', block: '770' },
  { area: 'Hidd', building: '2020', road: '8080', block: '880' }
];

async function createArabCustomers() {
  console.log('👥 Creating Arab Customer Accounts...\n');
  
  try {
    let created = 0;
    let skipped = 0;
    
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const address = addresses[i];
      
      // Check if customer exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', customer.email)
        .single();
      
      if (existingUser) {
        console.log(`✓ ${customer.name} already exists`);
        skipped++;
        continue;
      }
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: customer.email,
        password: '12345678',
        email_confirm: true,
        user_metadata: { full_name: customer.name }
      });
      
      if (authError) {
        console.log(`❌ Failed to create ${customer.name}: ${authError.message}`);
        continue;
      }
      
      // Create public user
      await supabase.from('users').insert({
        id: authData.user.id,
        email: customer.email,
        full_name: customer.name,
        phone: customer.phone,
        role: 'customer',
        is_active: true
      });
      
      // Create address
      await supabase.from('user_addresses').insert({
        user_id: authData.user.id,
        building: address.building,
        road: address.road,
        block: address.block,
        area: address.area,
        city: 'Manama',
        contact_number: customer.phone,
        is_default: true
      });
      
      console.log(`✅ Created: ${customer.name} (${address.area})`);
      created++;
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Arab Customers Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Total Customers: ${customers.length}`);
    console.log(`✅ Created: ${created}`);
    console.log(`✓ Already Existed: ${skipped}`);
    console.log('🔑 Password for all: 12345678');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  }
}

createArabCustomers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
