import React from 'react';
import { X } from 'lucide-react';
import { SignupForm } from './SignupForm';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export function SignupModal({ isOpen, onClose, onLoginClick }: SignupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-6">
          <SignupForm onSuccess={onClose} />
          <div className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onLoginClick}
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}