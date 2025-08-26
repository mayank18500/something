import React, { useMemo } from 'react';
import { Crown, Calendar, FileText, Sparkles, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export function AccountView() {
  const { profile } = useAuth();

  const handleUpgrade = () => {
    toast.success('Redirecting to PayPal for payment processing...');
    // This would redirect to PayPal checkout
    // In a real implementation, you would integrate with PayPal's API
    // For example: window.location.href = 'https://www.paypal.com/checkoutnow?token=YOUR_TOKEN';
  };

  // Memoize derived values to prevent unnecessary re-renders
  const isPremium = useMemo(() => profile?.subscription_tier === 'premium', [profile]);
  const memberSince = useMemo(() => {
    if (!profile?.created_at) return 'Invalid date';
    try {
      return new Date(profile.created_at).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Account</h2>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-gray-600" aria-hidden="true">
              {profile.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{profile.full_name}</h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPremium && <Crown className="h-5 w-5 text-yellow-500" aria-hidden="true" />}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPremium 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isPremium ? 'Premium Member' : 'Free Member'}
          </span>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Notes Created</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile.notes_count} {!isPremium && '/ 10'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-600">AI Summaries</p>
              <p className="text-lg font-semibold text-gray-900">
                {isPremium ? 'Unlimited' : '0 / 0'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="text-lg font-semibold text-gray-900">
                {memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-blue-100 mb-4">
                Unlock unlimited notes, AI summaries, and advanced features
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">Unlimited notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">AI-powered summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Upgrade to Premium with PayPal"
              >
                {/* PayPal SVG icon */}
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.2 18c-.3 0-.6 0-.9-.1L4 21.7h2.2l1.6-3.6c.1.1.3.1.4.1.3 0 .6-.1.8-.2.3-.2.5-.4.6-.7.1-.3.2-.6.2-1s-.1-.7-.2-1c-.1-.3-.3-.5-.6-.7-.2-.2-.5-.2-.8-.2s-.6.1-.8.2c-.3.2-.5.4-.6.7-.1.3-.2.6-.2 1h-1.5c0-.6.1-1.1.4-1.6.2-.5.6-.9 1-1.2.4-.3.9-.5 1.5-.5s1.1.2 1.5.5c.4.3.7.7 1 1.2.2.5.3 1 .3 1.6s-.1 1.1-.3 1.6c-.3.5-.6.9-1 1.2-.4.3-.9.5-1.5.5zM16 18c-.3 0-.6 0-.9-.1L12.8 21.7H15l1.6-3.6c.1.1.3.1.4.1.3 0 .6-.1.8-.2.3-.2.5-.4.6-.7.1-.3.2-.6.2-1s-.1-.7-.2-1c-.1-.3-.3-.5-.6-.7-.2-.2-.5-.2-.8-.2s-.6.1-.8.2c-.3.2-.5.4-.6.7-.1.3-.2.6-.2 1h-1.5c0-.6.1-1.1.4-1.6.2-.5.6-.9 1-1.2.4-.3.9-.5 1.5-.5s1.1.2 1.5.5c.4.3.7.7 1 1.2.2.5.3 1 .3 1.6s-.1 1.1-.3 1.6c-.3.5-.6.9-1 1.2-.4.3-.9.5-1.5.5zM12.5 7.5C12.5 5 14.5 3 17 3h4.5v3.5h-3c-.3 0-.5.2-.5.5s.2.5.5.5h3V10h-3c-.3 0-.5.2-.5.5s.2.5.5.5h3V14h-3c-.3 0-.5.2-.5.5s.2.5.5.5h3V19H17c-2.5 0-4.5-2-4.5-4.5v-7z"/>
                </svg>
                Upgrade with PayPal
              </button>
            </div>
            <Crown className="h-12 w-12 text-yellow-300 opacity-20" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}