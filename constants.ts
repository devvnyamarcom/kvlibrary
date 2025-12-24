
import { KVAsset, User } from './types';

export const MOCK_ASSETS: KVAsset[] = [
  {
    id: 'KV-29384',
    name: 'Telkomsel Poin Holiday Promo',
    campaignType: 'Digital',
    category: 'Mobile',
    uploadedDate: '12 Dec 2025',
    thumbnail: 'https://picsum.photos/id/1/400/250',
    source: 'HQ',
    driveLink: '#'
  },
  {
    id: 'KV-29385',
    name: 'IndiHome High Speed Package',
    campaignType: 'Traditional',
    category: 'Household',
    uploadedDate: '11 Dec 2025',
    thumbnail: 'https://picsum.photos/id/10/400/250',
    source: 'Area',
    driveLink: '#'
  },
  {
    id: 'KV-29386',
    name: 'By.U Student Starter Pack',
    campaignType: 'Digital',
    category: 'Mobile',
    uploadedDate: '10 Dec 2025',
    thumbnail: 'https://picsum.photos/id/20/400/250',
    source: 'Region',
    driveLink: '#'
  },
  {
    id: 'KV-29387',
    name: 'Orbit 5G Launch Campaign',
    campaignType: 'Digital',
    category: 'Household',
    uploadedDate: '09 Dec 2025',
    thumbnail: 'https://picsum.photos/id/30/400/250',
    source: 'HQ',
    driveLink: '#'
  },
  {
    id: 'KV-29388',
    name: 'Halo Unlimited Postpaid',
    campaignType: 'Traditional',
    category: 'Mobile',
    uploadedDate: '08 Dec 2025',
    thumbnail: 'https://picsum.photos/id/40/400/250',
    source: 'Area',
    driveLink: '#'
  },
  {
    id: 'KV-29389',
    name: 'MyTelkomsel App Refresh',
    campaignType: 'Digital',
    category: 'Mobile',
    uploadedDate: '07 Dec 2025',
    thumbnail: 'https://picsum.photos/id/50/400/250',
    source: 'Region',
    driveLink: '#'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'U-001',
    name: 'Budi Santoso',
    email: 'budi@telkomsel.co.id',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 hours ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwJOiqAAtjTUlay-EZHU3t0zsTSp-CJqAtRp_fa67qS3NTQ4vw8EHkAELOQnZ4liH16jAlSfugi3DquzjEV6OdMqVMrMpM6C6Vf6lO_nBSzsspUU7dTIHUFjmNuXZEnQelDWgKXUeLPF8nU6XXzWpDG098QvRjHA1-1xkX1Fva2bzp3lUybFaWbl3gqUfBz1CGIqYaX7VxMMjuLpas9HeTzOIDvkrvvx-QD5rUdtEr4SlIMZT128jt1f-SXyUgZ2Foyis7gLmlVBNC'
  },
  {
    id: 'U-002',
    name: 'Siti Aminah',
    email: 'siti@agency.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '1 day ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQA6axlzUtYT8EjSejQG_6thwN0MKCXWXdGePYz1PZewqODw3OX5tagMVwpOybHLCImqEA8LHl-glcm28LA023ZYeERBWCzR09Ll6zq0ZZiXmPaYGLK1wMEqxzDlLIVa_REZOv63oASVu55kNdzPpqpy_XUyqPG-elXobiX_7BG_aIrrjqA-ERs5uEQQXFFnxGrs8HSrexSviJ63A071CkmSF3UHmgmnSNlr4qbUROtSKWYEtq10llSiJSpN1ZSkG1Z8TgMAwh53mN'
  },
  {
    id: 'U-004',
    name: 'Admin System',
    email: 'admin@telkomsel.co.id',
    role: 'Admin',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: 'U-005',
    name: 'Guest User',
    email: 'guest@telkomsel.co.id',
    role: 'Guest',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
  },
  {
    id: 'U-006',
    name: 'Editor Assistant',
    email: 'editor@telkomsel.co.id',
    role: 'Editor',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor'
  }
];
