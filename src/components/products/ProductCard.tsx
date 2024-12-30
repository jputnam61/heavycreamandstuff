import React, { useState } from 'react';
import { Trash2, ShoppingCart, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { deleteProduct } from '../../lib/products/api';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FavoriteButton } from '../favorites/FavoriteButton';
import { LoginModal } from '../auth/LoginModal';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    description: string;
    category: string;
    featured: boolean;
  };
  onDelete?: () => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await deleteProduct(product.id);
      
      if (onDelete) {
        onDelete();
      }
      
      setShowDeleteConfirm(false);
      showToast('Product deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
      showToast('Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      addToCart(product);
      showToast('Added to cart!', 'success');
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
      showToast('Failed to add to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-2">
          <FavoriteButton
            productId={product.id}
            onLoginRequired={() => setShowLoginModal(true)}
          />
          
          {isAdmin && (
            <>
              <button
                onClick={handleEdit}
                className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
              >
                <Edit className="h-5 w-5 text-teal-600" />
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100 disabled:opacity-50"
              >
                <Trash2 className="h-5 w-5 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{product.description}</p>
        <p className="mt-1 text-lg font-medium text-teal-600">
          ${product.price.toFixed(2)}
        </p>
        
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
            isAdding 
              ? 'bg-teal-700 text-white'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          {isAdding ? 'Added!' : 'Add to Cart'}
        </button>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSignupClick={() => {
            setShowLoginModal(false);
          }}
        />
      )}
    </div>
  );
}