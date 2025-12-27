const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = 'https://hrepvprrbsubbajxwrnj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXB2cHJyYnN1YmJhanh3cm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzNjMyOCwiZXhwIjoyMDc4MTEyMzI4fQ.-TsJJH0De7hgOspm_Jq3Fm7MdaRR4ppf37IoX5Rmf-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkLogo() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, logo, banner_image')
    .eq('name', 'Lanterns')
    .single();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Lanterns Restaurant Data:');
  console.log('ID:', data.id);
  console.log('Name:', data.name);
  console.log('Logo:', data.logo);
  console.log('Banner:', data.banner_image);
}

checkLogo().then(() => process.exit(0));
