import { supabase } from '../supabase';
import type { UserProfile, AuthError } from './types';

export async function signIn(email: string, password: string) {
  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    throw { message: signInError.message };
  }

  if (!user) {
    throw { message: 'No user returned from authentication' };
  }

  return user;
}

export async function signUp(data: { email: string; password: string; fullName?: string }) {
  try {
    // Create auth user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('No user returned from signup');

    // Create profile immediately
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        full_name: data.fullName || null,
        is_admin: false,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      await supabase.auth.signOut();
      throw new Error('Failed to create user profile');
    }

    return user;
  } catch (error) {
    console.error('Error in signup process:', error);
    throw { 
      message: error.message || 'An error occurred during signup. Please try again.'
    };
  }
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}