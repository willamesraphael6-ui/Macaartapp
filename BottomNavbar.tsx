
import React from 'react';
import { AppRoute, UserProfile } from '../types';

interface BottomNavbarProps {
  user: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ user, onNavigate, onLogout }) => {
  if (!user) return null;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/95 backdrop-blur-xl border border-white/10 p-4 rounded-[32px] shadow-2xl z-[100] flex justify-around items-center">
      <button 
        onClick={() => onNavigate(AppRoute.CHAT)}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
          <span className="text-lg">🍎</span>
        </div>
        <span className="text-[9px] font-black uppercase text-white tracking-widest">Estúdio</span>
      </button>

      <button 
        onClick={() => onNavigate(AppRoute.SETTINGS)}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
          <span className="text-lg">⚙️</span>
        </div>
        <span className="text-[9px] font-black uppercase text-white tracking-widest">Empresa</span>
      </button>

      <div className="w-[1px] h-8 bg-white/20 mx-2"></div>

      <button 
        onClick={onLogout}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center group-active:scale-90 transition-transform">
           <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </div>
        <span className="text-[9px] font-black uppercase text-red-500 tracking-widest">Sair</span>
      </button>
    </nav>
  );
};

export default BottomNavbar;
