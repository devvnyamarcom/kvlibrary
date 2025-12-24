
import React from 'react';
import { KVAsset } from '../types';

interface AssetDetailsViewProps {
  asset: KVAsset;
  onBack: () => void;
  role: string;
  onDelete: () => void;
  onEdit: () => void;
}

const AssetDetailsView: React.FC<AssetDetailsViewProps> = ({ asset, onBack, role, onDelete, onEdit }) => {
  const handleDownload = () => {
    const url = asset.driveLink || asset.thumbnail;
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('No download link available for this asset.');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      onDelete();
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onBack} className="text-text-muted hover:text-primary transition-colors text-sm font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">home</span>
          Dashboard
        </button>
        <span className="text-text-muted text-sm font-medium">/</span>
        <span className="text-white text-sm font-medium">{asset.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-color pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">{asset.name}</h1>
          <div className="flex items-center gap-3">
            <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
            <p className="text-text-muted text-sm font-medium">KV ID: {asset.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full bg-theme-card rounded-xl overflow-hidden shadow-xl border border-border-color group relative">
            <div
              className="w-full aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url("${asset.thumbnail}")` }}
            ></div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={handleDownload}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-3"
              >
                <span className="material-symbols-outlined text-3xl">zoom_in</span>
              </button>
            </div>
          </div>
          <p className="text-text-muted text-sm px-2">Full resolution preview available for download (1920x1080px).</p>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-theme-card rounded-xl p-6 border border-border-color shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-color">
              <span className="material-symbols-outlined text-primary">info</span>
              <h3 className="text-white text-lg font-bold">KV Details</h3>
            </div>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 items-baseline">
                <span className="text-text-muted text-sm font-medium">Uploaded</span>
                <span className="text-white text-base font-medium col-span-2">{asset.uploadedDate}</span>
              </div>
              <div className="grid grid-cols-3 items-baseline">
                <span className="text-text-muted text-sm font-medium">Campaign</span>
                <span className="text-white text-base font-medium col-span-2">{asset.campaignType}</span>
              </div>
              <div className="grid grid-cols-3 items-baseline">
                <span className="text-text-muted text-sm font-medium">Category</span>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2 py-1 text-xs font-medium text-primary">
                    {asset.category}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 items-baseline">
                <span className="text-text-muted text-sm font-medium">Source</span>
                <span className="text-white text-base font-medium col-span-2 font-bold uppercase tracking-wider">{asset.source}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-lg font-bold text-lg transition-all shadow-lg group"
            >
              <span className="material-symbols-outlined">download</span>
              Download Asset
            </button>
            {role !== 'Guest' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={onEdit}
                  className="flex items-center justify-center gap-2 bg-transparent border border-border-color text-white hover:bg-theme-card-hover px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  Edit KV
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                  Delete KV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsView;
