require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iplsamlkpkuzurthdzdh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbHNhbWxrcGt1enVydGhkemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzIwMjMsImV4cCI6MjA5MDEwODAyM30.2mCc0Z_yfqsFC5XX5OWBtTkHMqaYFyauUZlDPh4WZVo';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnon() {
  const { data, error } = await supabase.from('mundiales_historicos').select('*');
  console.log("Error:", error);
  console.log("Data length:", data ? data.length : null);
}

testAnon();
