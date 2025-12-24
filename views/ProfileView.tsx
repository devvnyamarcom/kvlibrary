import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';

interface ProfileViewProps {
  onLogout: () => void;
  user: User | null;
  onProfileUpdate: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onLogout, user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Profile updated successfully!');
      onProfileUpdate();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-white">Loading profile...</div>;

  return (
    <div className="animate-fade-in max-w-[1400px] mx-auto w-full">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
          <p className="text-text-muted">Manage your account settings and preferences.</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-fit flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-card border border-white/10 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-theme-card border border-white/5 rounded-3xl p-8 relative overflow-hidden text-center shadow-xl">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#4a0f12] to-[#2b080a]"></div>
            <div className="relative z-10 -mt-2 mb-4">
              <div className="size-28 mx-auto rounded-full p-1 bg-theme-card">
                <div className="size-full rounded-full overflow-hidden border-2 border-primary/50">
                  <img className="h-full w-full object-cover" src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Profile" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">{user.name}</h3>
            <p className="text-primary font-medium text-sm mb-6">{user.role}</p>
            <div className="flex justify-center gap-4 mb-2">
              <div className="text-center px-4 py-2 bg-black/20 rounded-xl border border-white/5 w-1/2">
                <span className="block text-xl font-bold text-white">--</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Uploads</span>
              </div>
              <div className="text-center px-4 py-2 bg-black/20 rounded-xl border border-white/5 w-1/2">
                <span className="block text-xl font-bold text-white">{user.status}</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Status</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <div className="bg-theme-card border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-8 pb-6 border-b border-white/5">Personal Information</h3>
            <form className="space-y-6" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300">Full Name</label>
                  <input
                    className="block w-full rounded-2xl border-0 bg-black/20 py-3.5 px-4 text-gray-100 focus:ring-2 focus:ring-primary/60 transition-all sm:text-sm"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300">Email Address</label>
                  <input
                    className="block w-full rounded-2xl border-0 bg-black/20 py-3.5 px-4 text-gray-100 focus:ring-2 focus:ring-primary/60 transition-all sm:text-sm"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
