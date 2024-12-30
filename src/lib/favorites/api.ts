import { supabase } from '../supabase';

export async function addToFavorites(productId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      product_id: productId
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Product already in favorites');
    }
    throw error;
  }

  return data;
}

export async function removeFromFavorites(productId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('favorites')
    .delete()
    .match({ user_id: user.id, product_id: productId });

  if (error) throw error;
}

export async function checkIsFavorite(productId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .match({ user_id: user.id, product_id: productId })
    .maybeSingle();

  if (error) throw error;
  return !!data;
}