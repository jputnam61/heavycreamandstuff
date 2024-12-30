import { supabase } from '../supabase';

export async function deleteProduct(productId: string) {
  try {
    // Start a transaction by using a single request
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch product: ${fetchError.message}`);
    }

    if (!product) {
      throw new Error('Product not found');
    }

    // Delete the product image from storage if it exists
    if (product.image_url) {
      const fileName = product.image_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('products')
          .remove([fileName]);

        if (storageError) {
          console.error('Error deleting image:', storageError);
          // Continue with product deletion even if image deletion fails
        }
      }
    }

    // Delete the product from the database
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .throwOnError(); // This ensures the operation fails if there's an error

    if (deleteError) {
      throw new Error(`Failed to delete product: ${deleteError.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error; // Re-throw to handle in the component
  }
}