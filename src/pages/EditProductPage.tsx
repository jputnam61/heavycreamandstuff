import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditProductForm } from '../components/admin/products/EditProductForm';

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <div>Product ID not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EditProductForm
        productId={id}
        onSuccess={() => navigate('/products')}
        onCancel={() => navigate('/products')}
      />
    </div>
  );
}