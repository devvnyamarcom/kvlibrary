
export enum Page {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN',
  INPUT_KV = 'INPUT_KV',
  DETAILS = 'DETAILS',
  PROFILE = 'PROFILE'
}

export interface KVAsset {
  id: string;
  name: string;
  campaignType: 'Digital' | 'Traditional';
  category: 'Mobile' | 'Household';
  uploadedDate: string;
  createdAt?: string; // ISO string for sorting
  thumbnail: string;
  source: string;
  driveLink: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Guest';
  status: 'Active' | 'Suspended';
  lastActive: string;
  avatar: string;
}

export interface DashboardStats {
  totalAssets: number;
  digitalCount: number;
  traditionalCount: number;
  mobilePercentage: number;
  householdPercentage: number;
}
