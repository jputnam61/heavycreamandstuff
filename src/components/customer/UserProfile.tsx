import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
}

export function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const updates = {
      full_name: formData.get('full_name') as string,
    };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', profile?.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      loadProfile();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-serif text-teal-800 mb-6">My Profile</h2>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            defaultValue={profile?.full_name || ''}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Member Since</label>
          <p className="text-gray-600">
            {new Date(profile?.created_at || '').toLocaleDateString()}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}