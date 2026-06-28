const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || '').trim();

const missingVars = [];
if (!supabaseUrl) missingVars.push('SUPABASE_URL');
if (!supabaseAnonKey) missingVars.push('SUPABASE_ANON_KEY');

if (missingVars.length > 0) {
  console.warn(`[Supabase] Missing ${missingVars.join(', ')} — Supabase client unavailable.`);
  module.exports = null;
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection safely
async function testConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('[Supabase] Connection error:', error.message);
  } else {
    console.log('[Supabase] Connected successfully:', data);
  }
}

testConnection();

module.exports = supabase;
