import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read environment variables from .env file
const envContent = readFileSync('.env', 'utf-8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(Boolean)
    .map(line => line.split('='))
);

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);

async function createTestAdmin() {
  try {
    console.log('Creating test admin user...');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@test.com',
      password: 'password',
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    console.log('Test admin user created successfully!');
    console.log('Email:', 'admin@test.com');
    console.log('Password:', 'password');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating test admin user:', error);
    return { success: false, error };
  }
}

createTestAdmin().then(() => process.exit(0));