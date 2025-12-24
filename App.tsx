import React, { useState, useEffect } from 'react';
import { Page, KVAsset, User } from './types';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import AdminView from './views/AdminView';
import InputKVView from './views/InputKVView';
import AssetDetailsView from './views/AssetDetailsView';
import ProfileView from './views/ProfileView';
import Header from './components/Header';
import { MOCK_ASSETS } from './constants';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [selectedAsset, setSelectedAsset] = useState<KVAsset | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<KVAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchAssets();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchAssets();
      } else {
        setCurrentUser(null);
        setCurrentPage(Page.LOGIN);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        setCurrentUser(data as User);
        setCurrentPage(Page.DASHBOARD);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback for demo if profile doesn't exist yet (or handle creation)
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('kv_assets')
        .select('*')
        .order('uploaded_date', { ascending: false });

      if (error) throw error;
      if (data) {
        // Map database fields to KVAsset type (snake_case to camelCase)
        const mappedAssets: KVAsset[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          campaignType: item.campaign_type,
          category: item.category,
          uploadedDate: new Date(item.uploaded_date).toLocaleDateString(),
          createdAt: item.created_at || new Date().toISOString(), // Fallback for sorting
          thumbnail: item.thumbnail,
          source: item.source,
          driveLink: item.drive_link
        }));
        setAssets(mappedAssets);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      setAssets(MOCK_ASSETS); // Fallback to mock if fetch fails just for now
    }
  };

  const navigateTo = (page: Page, asset: KVAsset | null = null) => {
    setCurrentPage(page);
    if (asset) setSelectedAsset(asset);
  };

  const handleLogin = (username: string) => {
    // This is now handled by Supabase Auth state change, but keeping signature for prop if needed
    // or we can remove the prop passing in renderContent shortly
  };

  // Note: We need to update InputKVView to call this wrapper or refetch
  const handleRefreshAssets = () => {
    fetchAssets();
    navigateTo(Page.DASHBOARD);
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('kv_assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      fetchAssets();
      navigateTo(Page.DASHBOARD);
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset');
    }
  };

  const renderContent = () => {
    const role = currentUser?.role || 'Guest';
    switch (currentPage) {
      case Page.LOGIN:
        return <LoginView onLogin={(username) => handleLogin(username)} />;
      case Page.DASHBOARD:
        return (
          <DashboardView
            role={role}
            assets={assets}
            onDetails={(asset) => navigateTo(Page.DETAILS, asset)}
            onNewAsset={() => navigateTo(Page.INPUT_KV)}
          />
        );
      case Page.ADMIN:
        return <AdminView />;
      case Page.INPUT_KV:
        return <InputKVView onSaved={handleRefreshAssets} onCancel={() => navigateTo(Page.DASHBOARD)} initialData={selectedAsset} user={currentUser} />;
      case Page.DETAILS:
        return selectedAsset ? (
          <AssetDetailsView
            asset={selectedAsset}
            onBack={() => navigateTo(Page.DASHBOARD)}
            role={role}
            onDelete={() => handleDeleteAsset(selectedAsset.id)}
            onEdit={() => navigateTo(Page.INPUT_KV, selectedAsset)}
          />
        ) : (
          <DashboardView
            role={role}
            assets={assets}
            onDetails={(asset) => navigateTo(Page.DETAILS, asset)}
            onNewAsset={() => navigateTo(Page.INPUT_KV)}
          />
        );
      case Page.PROFILE:
        return (
          <ProfileView
            user={currentUser}
            onProfileUpdate={() => currentUser && fetchUserProfile(currentUser.id)}
            onLogout={() => { setCurrentUser(null); navigateTo(Page.LOGIN); }}
          />
        );
      default:
        return <DashboardView role={role} assets={assets} onDetails={(asset) => navigateTo(Page.DETAILS, asset)} onNewAsset={() => navigateTo(Page.INPUT_KV)} />;
    }
  };

  const showHeader = currentPage !== Page.LOGIN;

  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header user={currentUser} currentPage={currentPage} onNavigate={navigateTo} />}
      <main className={`flex-1 ${currentPage === Page.LOGIN ? '' : 'px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-7xl'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
