
import React from 'react';
import { Page, User } from '../types';

interface HeaderProps {
  user: User | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentPage, onNavigate }) => {
  const isGuest = user?.role === 'Guest';
  const isAdmin = user?.role === 'Admin';

  return (
    <header className="w-full border-b border-solid border-b-[#482325] bg-[#221112] sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 text-white">
          <div 
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => onNavigate(Page.DASHBOARD)}
          >
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-xl">grid_view</span>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              KV Library 
              {isGuest && (
                <span className="ml-2 rounded-full bg-[#482325] px-2 py-0.5 text-xs font-medium text-[#c99294]">Guest Mode</span>
              )}
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <button 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === Page.DASHBOARD ? 'bg-[#482325] text-white' : 'text-[#c99294] hover:text-white hover:bg-[#482325]'}`}
              onClick={() => onNavigate(Page.DASHBOARD)}
            >
              Home
            </button>
            
            {isAdmin && (
              <button 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === Page.ADMIN ? 'bg-[#482325] text-white' : 'text-[#c99294] hover:text-white hover:bg-[#482325]'}`}
                onClick={() => onNavigate(Page.ADMIN)}
              >
                Admin Panel
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="group flex h-10 w-10 items-center justify-center rounded-lg bg-[#482325] hover:bg-[#5d2d30] transition-colors relative">
            <span className="material-symbols-outlined text-white group-hover:text-primary">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-[#482325]"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-2 border-l border-[#482325]">
            <div 
              className="hidden md:flex flex-col items-end cursor-pointer group"
              onClick={() => onNavigate(Page.PROFILE)}
            >
              <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user?.name || 'Guest User'}</span>
              <span className="text-xs text-[#c99294]">{user?.role || 'Guest'}</span>
            </div>
            <div 
              className="size-9 overflow-hidden rounded-full border border-[#482325] bg-[#482325] cursor-pointer" 
              onClick={() => onNavigate(Page.PROFILE)}
              style={{ backgroundImage: `url("${user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            <button 
              className="ml-2 text-[#c99294] hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
              onClick={() => onNavigate(Page.LOGIN)}
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
