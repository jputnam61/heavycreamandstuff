import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  social_media: {
    facebook?: string;
    instagram?: string;
  };
}

export function ContactInfo() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [settings, setSettings] = useState<ContactSettings>({
    email: 'nicole@heavycreamandstuff.com',
    phone: '(555) 123-4567',
    address: '123 Southern Kitchen Lane, Nashville, TN 37203',
    social_media: {
      facebook: 'https://facebook.com/heavycreamandstuff',
      instagram: 'https://instagram.com/heavycreamandstuff'
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          id: 'contact',
          data: settings 
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Contact information updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update contact information. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-serif text-teal-800 mb-6">Contact Information</h2>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">Business Email</label>
          <input
            type="email"
            id="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-700 mb-2">Business Address</label>
          <textarea
            id="address"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="facebook" className="block text-gray-700 mb-2">Facebook URL</label>
          <input
            type="url"
            id="facebook"
            value={settings.social_media.facebook}
            onChange={(e) => setSettings({
              ...settings,
              social_media: { ...settings.social_media, facebook: e.target.value }
            })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="instagram" className="block text-gray-700 mb-2">Instagram URL</label>
          <input
            type="url"
            id="instagram"
            value={settings.social_media.instagram}
            onChange={(e) => setSettings({
              ...settings,
              social_media: { ...settings.social_media, instagram: e.target.value }
            })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Contact Information'}
        </button>
      </form>
    </div>
  );
}