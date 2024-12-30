import React from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
}

export function LoginModal({ isOpen, onClose, onSignupClick }: LoginModalProps) {
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
          <LoginForm onSuccess={onClose} onSignupClick={onSignupClick} />
        </div>
      </div>
    </div>
  );
}