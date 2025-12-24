import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';

const AdminView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Guest', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    // Fetch profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch all assets to count uploads (client-side aggregation for now)
    const { data: assets, error: assetError } = await supabase
      .from('kv_assets')
      .select('user_id');

    if (profileError) {
      console.error('Error fetching users:', profileError);
    } else if (profiles) {
      // Calculate counts
      const uploadCounts: Record<string, number> = {};
      if (assets) {
        assets.forEach((asset: any) => {
          if (asset.user_id) {
            uploadCounts[asset.user_id] = (uploadCounts[asset.user_id] || 0) + 1;
          }
        });
      }

      // Merge counts into users
      const usersWithCounts: any[] = profiles.map((p: any) => ({
        ...p,
        totalUploads: uploadCounts[p.id] || 0
      }));

      setUsers(usersWithCounts);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user profile? (This does not delete their Supabase Auth account, only their access profile)')) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error deleting user: ' + error.message);
      } else {
        fetchUsers();
      }
    }
  };

  const handleAdd = async () => {
    if (!newUser.name || !newUser.email) return;

    // NOTE: We cannot securely create a Supabase Auth user (with password) from the client-side 
    // without signing in as that user (which logs the Admin out).
    // Instead, we will create the Profile. Usually, you would use an Edge Function for this.
    // For this implementation, we will pre-create the profile so when they DO sign up, 
    // or if you create them in the Dashboard, they have the correct role.

    const tempId = crypto.randomUUID(); // Temporary ID until they sign up, usually Auth ID matches Profile ID

    const { error } = await supabase
      .from('profiles') // Assuming RLS allows Admin to INSERT
      .insert([{
        id: tempId, // This is tricky. Usually ID must match Auth ID. 
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'Active',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
      }]);

    if (error) {
      alert('Error creating profile: ' + error.message + '\n\nNote: Creating users usually requires Supabase Auth access. Please create the user in the Supabase Dashboard Authentication tab first, then editing their role here is safer.');
    } else {
      alert('User Profile created! \nIMPORTANT: You must still create the account in Supabase Authentication Dashboard with this email for them to login.');
      fetchUsers();
      setShowAddModal(false);
      setNewUser({ name: '', email: '', role: 'Guest', password: '' });
    }
  };

  return (
    <div className="animate-fade-in space-y-8 relative">
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-theme-card p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Add New User Profile</h2>
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg mb-4">
              <p className="text-xs text-blue-200">
                <strong>Note:</strong> This creates the user's <em>access profile</em>.
                You must also manually create their account in the <strong>Supabase Dashboard &gt; Authentication</strong> with this email.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted font-bold uppercase mb-1 block">Name</label>
                <input
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted font-bold uppercase mb-1 block">Email</label>
                <input
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted font-bold uppercase mb-1 block">Role</label>
                <select
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="Guest">Guest</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg"
                >
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-sm text-text-muted mt-1.5 font-medium">Manage access roles, permissions and view user activity for KV Library.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white px-6 py-3 rounded-full shadow-lg transition-all group hover:scale-105"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">add</span>
          <span className="font-bold text-sm tracking-wide">Add New User</span>
        </button>
      </div>

      <div className="bg-theme-card p-5 rounded-2xl border border-border-color shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-80 group">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-[20px]">search</span>
            <input className="w-full pl-11 pr-4 py-3 bg-black/20 border border-border-color rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white" placeholder="Search users by name or email..." type="text" />
          </div>
        </div>
        <div className="text-text-muted text-sm font-medium">
          Total Users: <span className="text-white">{users.length}</span>
        </div>
      </div>

      <div className="bg-theme-card rounded-2xl border border-border-color shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color bg-black/20 text-xs uppercase tracking-wider text-text-muted font-bold">
                <th className="p-5 min-w-[220px]">User</th>
                <th className="p-5 min-w-[150px]">Role</th>
                <th className="p-5 min-w-[120px]">Uploads</th>
                <th className="p-5 min-w-[140px]">Status</th>
                <th className="p-5 min-w-[160px]">Last Active</th>
                <th className="p-5 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">No users found. (Check RLS Policies or Table Data)</td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-cover bg-center shrink-0 border-2 border-border-color" style={{ backgroundImage: `url("${user.avatar}")` }}></div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">{user.name}</span>
                          <span className="text-xs text-text-muted">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.role === 'Admin' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-blue-900/20 text-blue-300 border-blue-800/30'} border`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-bold text-white bg-white/5 py-1 px-3 rounded-lg border border-white/5">{user.totalUploads || 0}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></span>
                        <span className="text-sm font-medium text-gray-300">{user.status}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-sm text-text-muted font-medium">{user.lastActive || 'Never'}</span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-red-600 transition-all"
                          title="Delete User"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
