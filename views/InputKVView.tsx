import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

import { KVAsset, User } from '../types';

interface InputKVViewProps {
  onCancel: () => void;
  onSaved: () => void;
  initialData?: KVAsset | null;
  user: User | null;
}

const InputKVView: React.FC<InputKVViewProps> = ({ onCancel, onSaved, initialData, user }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Parse date from DD/MM/YYYY to YYYY-MM-DD for input field if needed, or assume ISO from DB
  const initialDate = initialData ? new Date(initialData.uploadedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: initialDate,
    name: initialData?.name || '',
    campaignType: (initialData?.campaignType || '') as 'Digital' | 'Traditional',
    category: (initialData?.category || '') as 'Mobile' | 'Household',
    source: initialData?.source || '',
    driveLink: initialData?.driveLink || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.campaignType || !formData.category || !formData.source) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let thumbnailUrl = initialData?.thumbnail || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/400/250`; // Default or existing

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('THUMBNAIL')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('THUMBNAIL')
          .getPublicUrl(filePath);

        thumbnailUrl = publicUrl;
      }

      const assetData = {
        name: formData.name,
        campaign_type: formData.campaignType,
        category: formData.category,
        source: formData.source,
        uploaded_date: new Date(formData.date).toISOString(),
        drive_link: formData.driveLink,
        thumbnail: thumbnailUrl,
        user_id: user?.id
      };

      if (initialData?.id) {
        // Update existing
        const { error } = await supabase
          .from('kv_assets')
          .update(assetData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('kv_assets')
          .insert([assetData]);

        if (error) throw error;
      }

      onSaved();

      if (error) throw error;
      onSaved();
    } catch (error: any) {
      alert('Error saving asset: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button onClick={onCancel} className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Dashboard</button>
        <span className="material-symbols-outlined text-text-muted text-xs">chevron_right</span>
        <span className="text-white text-sm font-medium">New Entry</span>
      </div>

      <div className="mb-8">
        <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">Input New KV Data</h1>
        <p className="text-text-muted text-sm font-normal max-w-2xl opacity-80 mt-2">
          Fill in the details below to add a new marketing asset to the library.
        </p>
      </div>

      <div className="bg-theme-card rounded-2xl shadow-xl border border-white/5 p-6 md:p-10 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 relative z-10" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-text-muted text-xs font-bold uppercase tracking-wider ml-1">Tanggal</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-14 px-4 text-white [color-scheme:dark]"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-text-muted text-xs font-bold uppercase tracking-wider ml-1">Nama Folder (Nama KV)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-14 px-4 text-white"
              placeholder="e.g., KV Ramadhan 2024"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-text-muted text-xs font-bold uppercase tracking-wider ml-1">Campaign</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-[#2c1818] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-14 px-4 text-white"
              required
              value={formData.campaignType}
              onChange={(e) => setFormData({ ...formData, campaignType: e.target.value as any })}
            >
              <option value="" disabled>Select Campaign Type</option>
              <option value="Digital">Digital</option>
              <option value="Traditional">Traditional</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-text-muted text-xs font-bold uppercase tracking-wider ml-1">Kategori (Product)</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-[#2c1818] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-14 px-4 text-white"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="" disabled>Select Product Category</option>
              <option value="Mobile">Mobile</option>
              <option value="Household">Household</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-text-muted text-xs font-bold uppercase tracking-wider ml-1">Source</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-[#2c1818] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-14 px-4 text-white"
              required
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            >
              <option value="" disabled>Select Source</option>
              <option value="HQ">HQ</option>
              <option value="Area">Area</option>
              <option value="Region">Region</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-text-muted text-xs font-bold uppercase tracking-wider ml-1">Thumbnail KV</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-dashed border-white/20 bg-black/30 hover:bg-black/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-14 px-4 py-3 text-sm text-text-muted file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-text-muted">image</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-text-muted text-xs font-bold uppercase tracking-wider ml-1">Link Google Drive</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-14 px-4 pr-12 text-white"
                placeholder="https://drive.google.com/..."
                type="url"
                required
                value={formData.driveLink}
                onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">link</span>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col-reverse md:flex-row justify-end gap-4 mt-8 pt-8 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="h-12 px-8 rounded-full border border-white/20 text-text-muted hover:text-white hover:bg-white/5 transition-all font-bold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-primary to-primary-hover text-white font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              {loading ? 'Saving...' : 'Submit Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputKVView;
