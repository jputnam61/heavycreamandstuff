import { supabase } from './supabase';

export async function createUser(email: string, password: string, isAdmin: boolean = false) {
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

    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
}

// Create admin user
export async function createAdminUser() {
  return createUser('Nicole@heavycreamandstuff.com', 'DevineDelivery1', true);
}

// Create customer user
export async function createCustomerUser() {
  return createUser('customer@example.com', 'pass', false);
}