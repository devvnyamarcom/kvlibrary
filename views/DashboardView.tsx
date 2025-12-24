
import React, { useState, useMemo } from 'react';
import { KVAsset } from '../types';

interface DashboardViewProps {
  role: string;
  assets: KVAsset[];
  onDetails: (asset: KVAsset) => void;
  onNewAsset: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ role, assets, onDetails, onNewAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [previewAsset, setPreviewAsset] = useState<KVAsset | null>(null);

  // Dynamic Analytics Calculations
  const stats = useMemo(() => {
    const total = assets.length;
    const digital = assets.filter(a => a.campaignType === 'Digital').length;
    const traditional = assets.filter(a => a.campaignType === 'Traditional').length;

    const mobile = assets.filter(a => a.category === 'Mobile').length;
    const household = assets.filter(a => a.category === 'Household').length;

    const hq = assets.filter(a => a.source === 'HQ').length;
    const area = assets.filter(a => a.source === 'Area').length;
    const region = assets.filter(a => a.source === 'Region').length;

    return {
      total,
      digital: total > 0 ? Math.round((digital / total) * 100) : 0,
      traditional: total > 0 ? Math.round((traditional / total) * 100) : 0,
      mobileCount: mobile,
      houseCount: household,
      hqCount: hq,
      areaCount: area,
      regionCount: region,
      maxSource: Math.max(hq, area, region, 1) // Avoid div by 0
    };
  }, [assets]);

  const filteredAssets = assets.filter(asset => {
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesText = asset.name.toLowerCase().includes(lowerSearch) ||
        asset.id.toLowerCase().includes(lowerSearch);
      if (!matchesText) return false;
    }

    if (campaignFilter && asset.campaignType.toLowerCase() !== campaignFilter.toLowerCase()) return false;
    if (productFilter && asset.category.toLowerCase() !== productFilter.toLowerCase()) return false;
    if (sourceFilter && asset.source.toLowerCase() !== sourceFilter.toLowerCase()) return false;

    return true;
  }).sort((a, b) => {
    // Sort Newest to Oldest based on createdAt (ISO string)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const handleThumbnailClick = (e: React.MouseEvent, asset: KVAsset) => {
    e.stopPropagation();
    setPreviewAsset(asset);
  };

  return (
    <div className="animate-fade-in space-y-8 relative">
      {/* Modal Preview */}
      {previewAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
            onClick={() => setPreviewAsset(null)}
          ></div>
          <div className="relative w-full max-w-5xl bg-theme-card rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
              <div>
                <h3 className="text-white font-bold">{previewAsset.name}</h3>
                {/* ID removed from preview */}
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-2 sm:p-6 flex flex-col items-center">
              <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/5 bg-black/40">
                <img
                  src={previewAsset.thumbnail.replace('400/250', '1280/720')}
                  alt={previewAsset.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-4 w-full justify-center pb-4">
                <a
                  href={previewAsset.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download Full Asset
                </a>
                <button
                  onClick={() => onDetails(previewAsset)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold border border-white/10 transition-all"
                >
                  <span className="material-symbols-outlined">info</span>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Dashboard Overview</h1>
        <p className="text-[#c99294] text-base font-normal leading-normal">
          Welcome, {role}. Browse and download approved advertising assets.
        </p>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col justify-center gap-2 rounded-xl p-6 bg-[#482325] shadow-sm min-h-[160px] border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <p className="text-[#c99294] text-base font-medium leading-normal">Total Active KV Stock</p>
          </div>
          <p className="text-white tracking-tight text-5xl font-black leading-tight mt-2">{stats.total.toLocaleString()}</p>
          <p className="text-sm text-[#c99294] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
            <span className="text-green-500 font-bold">+12</span> new this week
          </p>
        </div>

        <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-[#482325] shadow-sm min-h-[160px] group border border-white/5 cursor-pointer" onClick={(e) => assets[0] && handleThumbnailClick(e, assets[0])}>
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-opacity group-hover:opacity-30" style={{ backgroundImage: `url("${assets[0]?.thumbnail || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkVFe-rrne_hu0drQdYGbvg1FnsxIhpUoaegty15H_fQbdyPL6voHGEMpch7km8rqNceKOuZyKV4FdQuF4Ez1FvsafSYOsNlnfxzeXCqTtkxs3ugoQDElcvUZ6X0Wkh7vywjzfwgEaAx9uKhxf4ocaZN4Qpb9e91kb8vMhTfN78tjAIUZE1qaCwj8uYEWOIwwoB4fPGQXsNMM3kLWKHTB6iu67mj8qzaC2bvTq66s7ZFCJzjefavu9OslEqwUHUxcZcRus8NvNsvHe'}")` }}></div>
          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 w-fit">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Latest Update</span>
              </div>
              <span className="text-[#c99294] text-xs">
                {assets[0]?.uploadedDate ? `Uploaded: ${assets[0].uploadedDate}` : 'Today, 10:30 AM'}
              </span>
            </div>
            <div>
              <h3 className="text-white tracking-tight text-2xl font-bold leading-tight mb-1">
                {assets[0]?.name || 'No Assets Available'}
              </h3>
              <p className="text-white/80 text-base font-medium leading-normal max-w-2xl">
                {assets[0]
                  ? `New ${assets[0].campaignType} asset for ${assets[0].category} category from ${assets[0].source}.`
                  : 'Start adding new KV assets to see them here.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campaign Distribution */}
        <div className="rounded-xl bg-[#482325] p-6 shadow-sm border border-white/5 flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-white text-lg font-bold leading-tight">Campaign Distribution</h3>
            <p className="text-[#c99294] text-sm">Digital vs Traditional</p>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#c99294]">
                  <span>Digital</span>
                  <span>{stats.digital}%</span>
                </div>
                <div className="h-2 w-full bg-[#221112] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${stats.digital}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#c99294]">
                  <span>Traditional</span>
                  <span>{stats.traditional}%</span>
                </div>
                <div className="h-2 w-full bg-[#221112] rounded-full overflow-hidden">
                  <div className="h-full bg-[#c99294] rounded-full transition-all duration-1000" style={{ width: `${stats.traditional}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Focus */}
        <div className="rounded-xl bg-[#482325] p-6 shadow-sm border border-white/5 flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-white text-lg font-bold leading-tight">Product Focus</h3>
            <p className="text-[#c99294] text-sm">Mobile vs Household</p>
          </div>
          <div className="flex-1 flex items-end justify-around gap-4 px-2 min-h-[140px]">
            <div className="flex flex-col items-center gap-2 w-full max-w-[60px]">
              <span className="text-xs text-white font-bold">{stats.mobileCount}</span>
              <div className="w-full bg-primary rounded-t-lg transition-all duration-1000" style={{ height: `${(stats.mobileCount / Math.max(stats.mobileCount + stats.houseCount, 1)) * 100}px` }}></div>
              <span className="text-[#c99294] text-[10px] font-bold uppercase">Mobile</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full max-w-[60px]">
              <span className="text-xs text-white font-bold">{stats.houseCount}</span>
              <div className="w-full bg-[#c99294] rounded-t-lg transition-all duration-1000" style={{ height: `${(stats.houseCount / Math.max(stats.mobileCount + stats.houseCount, 1)) * 100}px` }}></div>
              <span className="text-[#c99294] text-[10px] font-bold uppercase">House</span>
            </div>
          </div>
        </div>

        {/* Source Contribution */}
        <div className="rounded-xl bg-[#482325] p-6 shadow-sm border border-white/5 flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-white text-lg font-bold leading-tight">Source Contribution</h3>
            <p className="text-[#c99294] text-sm">HQ, Area, Region Breakdown</p>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-[#c99294] uppercase tracking-wider">
                  <span>HQ</span>
                  <span>{stats.hqCount}</span>
                </div>
                <div className="h-1.5 w-full bg-[#221112] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(stats.hqCount / stats.maxSource) * 100}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-[#c99294] uppercase tracking-wider">
                  <span>Area</span>
                  <span>{stats.areaCount}</span>
                </div>
                <div className="h-1.5 w-full bg-[#221112] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.areaCount / stats.maxSource) * 100}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-[#c99294] uppercase tracking-wider">
                  <span>Region</span>
                  <span>{stats.regionCount}</span>
                </div>
                <div className="h-1.5 w-full bg-[#221112] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.regionCount / stats.maxSource) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search KV Section */}
      <div className="bg-[#482325] rounded-2xl p-8 border border-white/5 shadow-xl">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold leading-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">search</span>
            Search KV
          </h2>
          <p className="text-[#c99294] text-sm">Search assets by name, ID, or other campaign details.</p>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c99294]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="h-14 w-full rounded-xl bg-[#221112] pl-12 pr-4 text-white placeholder-[#c99294] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Search by name, ID, or campaign details..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Asset Library Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-white text-2xl font-bold leading-tight">KV Asset Library</h2>
          <div className="flex flex-1 sm:justify-end gap-3 flex-wrap">
            <select
              className="h-10 rounded-lg bg-[#482325] px-4 text-sm text-white border border-white/5 outline-none cursor-pointer focus:ring-1 focus:ring-primary"
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
            >
              <option value="">Campaign Type</option>
              <option value="digital">Digital</option>
              <option value="traditional">Traditional</option>
            </select>

            <select
              className="h-10 rounded-lg bg-[#482325] px-4 text-sm text-white border border-white/5 outline-none cursor-pointer focus:ring-1 focus:ring-primary"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            >
              <option value="">Product</option>
              <option value="mobile">Mobile</option>
              <option value="household">Household</option>
            </select>

            <select
              className="h-10 rounded-lg bg-[#482325] px-4 text-sm text-white border border-white/5 outline-none cursor-pointer focus:ring-1 focus:ring-primary"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">Source</option>
              <option value="hq">HQ</option>
              <option value="area">Area</option>
              <option value="region">Region</option>
            </select>

            {role !== 'Guest' && (
              <button
                onClick={onNewAsset}
                className="h-10 flex items-center gap-2 rounded-lg bg-primary px-4 text-sm text-white font-bold hover:bg-red-700 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span className="hidden lg:inline">Add New KV</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl border border-[#482325] bg-[#221112] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#482325]">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#c99294]">Uploaded</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#c99294]">Preview</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#c99294]">KV Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#c99294]">Campaign</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#c99294]">Product</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#c99294]">Source</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#c99294] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#482325]">
                {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                  <tr key={asset.id} className="group hover:bg-[#482325]/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-[#c99294]">{asset.uploadedDate}</td>
                    <td className="px-6 py-4">
                      <div
                        className="h-12 w-20 overflow-hidden rounded-md bg-[#482325] border border-white/10 cursor-pointer relative group/thumb"
                        onClick={(e) => handleThumbnailClick(e, asset)}
                      >
                        <img alt={asset.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" src={asset.thumbnail} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="material-symbols-outlined text-white text-sm">visibility</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col cursor-pointer" onClick={() => onDetails(asset)}>
                        <span className="font-bold text-white group-hover:text-primary transition-colors">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${asset.campaignType === 'Digital' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                        {asset.campaignType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{asset.category}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-bold text-xs uppercase tracking-tight ${asset.source === 'HQ' ? 'text-primary' : asset.source === 'Area' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {asset.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={asset.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-red-700 text-white px-4 py-2 text-sm font-bold transition-all shadow-md active:scale-95 gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                        <span>Download</span>
                      </a>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-[#c99294]">
                      No assets found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
