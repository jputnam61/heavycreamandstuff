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

async function createUser(email, password, isAdmin = false) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        is_admin: isAdmin,
      });

    if (profileError) throw profileError;

    console.log(`Successfully created user: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
}

async function createUsers() {
  console.log('Creating admin user...');
  await createUser('Nicole@heavycreamandstuff.com', 'DevineDelivery1', true);
  
  console.log('Creating customer user...');
  await createUser('customer@example.com', 'pass', false);
  
  console.log('User creation complete!');
}

createUsers().then(() => process.exit(0));