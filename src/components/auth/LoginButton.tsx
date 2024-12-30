import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { UserCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

export function LoginButton() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignupClick = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleLoginClick = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  // Guest view - show Sign Up and Login buttons
  if (!user) {
    return (
      <>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSignupModalOpen(true)}
            className="text-teal-600 hover:text-teal-800 font-medium"
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
          >
            Login
          </button>
        </div>

        <SignupModal
          isOpen={isSignupModalOpen}
          onClose={() => setIsSignupModalOpen(false)}
          onLoginClick={handleLoginClick}
        />

        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSignupClick={handleSignupClick}
        />
      </>
    );
  }

  // Logged in view - show user menu
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
      >
        <UserCircle className="h-6 w-6" />
        <span className="text-sm font-medium hidden md:inline">
          {profile?.full_name || 'My Account'}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            to={isAdmin ? "/admin" : "/account"}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
            onClick={() => setShowDropdown(false)}
          >
            My Account
          </Link>
          <button
            onClick={async () => {
              setShowDropdown(false);
              await signOut();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}