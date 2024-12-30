import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Purchase {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
}

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          items:purchase_items (
            quantity,
            product:products (
              name,
              price
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading purchase history...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-teal-800">Purchase History</h2>
      
      {purchases.length === 0 ? (
        <p className="text-gray-600">You haven't made any purchases yet.</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-teal-600 font-medium">
                    Total: ${purchase.total_amount.toFixed(2)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm capitalize bg-teal-100 text-teal-800">
                  {purchase.status}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <ul className="space-y-2">
                  {purchase.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}