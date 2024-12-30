import { supabase } from '../supabase';
import type { CheckoutFormData } from '../../types/checkout';
import type { CartItem } from '../../types/cart';

interface OrderData extends CheckoutFormData {
  items: CartItem[];
  total: number;
}

export async function processOrder(orderData: OrderData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: orderData.total,
        status: 'pending',
        shipping_address: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          zipCode: orderData.zipCode,
          phone: orderData.phone,
          email: orderData.email,
        },
      })
      .select()
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error('Failed to create order');

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Process payment (mock implementation)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update order status to confirmed
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', order.id);

    if (updateError) throw updateError;

    return order;
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}