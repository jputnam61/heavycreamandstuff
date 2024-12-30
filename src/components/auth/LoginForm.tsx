import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getUserProfile } from '../../lib/auth/api';
import type { AuthError } from '../../lib/auth/types';

interface LoginFormProps {
  onSuccess?: () => void;
  onSignupClick: () => void;
}

export function LoginForm({ onSuccess, onSignupClick }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await signIn(email, password);
      const profile = await getUserProfile(user.id);
      
      onSuccess?.();
      navigate(profile.is_admin ? '/admin' : '/account');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-serif text-teal-800 mb-6">Welcome Back</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSignupClick}
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}