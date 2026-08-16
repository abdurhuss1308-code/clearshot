import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Trash2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [imageRetention, setImageRetention] = useState<'keep_thumbnail' | 'delete_immediately'>(
    user?.image_retention || 'keep_thumbnail'
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(displayName, imageRetention);
      alert('Profile updated successfully');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-cream md:ml-48 pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-charcoal mb-8">Settings</h2>

        {/* Account Section */}
        <section className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-4">Account</h3>
            <div className="space-y-4 bg-white rounded-card p-6 border border-taupe/10">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                <div className="px-4 py-2 bg-taupe/5 rounded-card text-taupe text-sm">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Display name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal placeholder-taupe focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  placeholder="Your name"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-teal-600 text-cream rounded-card font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-taupe/20 text-charcoal rounded-card font-medium hover:bg-taupe/5 transition-colors"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-4">Privacy</h3>
            <div className="space-y-4 bg-white rounded-card p-6 border border-taupe/10">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">Image retention</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={imageRetention === 'keep_thumbnail'}
                      onChange={() => setImageRetention('keep_thumbnail')}
                      className="w-4 h-4 accent-teal-600"
                    />
                    <span className="text-charcoal">
                      <span className="font-medium">Keep a thumbnail</span>
                      <p className="text-sm text-taupe">Keep a small preview after processing for easy reference</p>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={imageRetention === 'delete_immediately'}
                      onChange={() => setImageRetention('delete_immediately')}
                      className="w-4 h-4 accent-teal-600"
                    />
                    <span className="text-charcoal">
                      <span className="font-medium">Delete immediately</span>
                      <p className="text-sm text-taupe">Delete the original image right after processing</p>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delete Account Section */}
        <section className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger zone</h3>
            <div className="space-y-4 bg-white rounded-card p-6 border border-red-200">
              <p className="text-sm text-taupe mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-card font-medium hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete account
                </button>
              ) : (
                <div className="space-y-3 p-4 bg-red-50 rounded-card border border-red-200">
                  <p className="font-medium text-red-700">Are you absolutely sure?</p>
                  <p className="text-sm text-red-600">This will permanently delete your account and all your cards. This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-card font-medium hover:bg-red-700 transition-colors"
                    >
                      Yes, delete everything
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-red-200 text-red-700 rounded-card font-medium hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
