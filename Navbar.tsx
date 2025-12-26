
import React from 'react';
import { AppRoute, UserProfile } from '../types';
import { LOGO_URL } from '../constants';

interface NavbarProps {
  user: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <nav className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(AppRoute.LANDING)}>
        <img src={LOGO_URL} alt="Logo" className="w-8 h-8" />
        <span className="text-2xl font-black tracking-tighter text-black">Maçã <span className="text-lime-500">ART</span></span>
      </div>

      <div className="hidden md:flex items-center gap-10 font-bold text-sm">
        {user ? (
          <>
            <button onClick={() => onNavigate(AppRoute.CHAT)} className="text-black hover:text-lime-500 transition-colors uppercase tracking-widest text-[11px] font-black">Criar 2025</button>
            <button onClick={() => onNavigate(AppRoute.SETTINGS)} className="text-black hover:text-lime-500 transition-colors uppercase tracking-widest text-[11px] font-black">Minha Empresa</button>
            <button onClick={onLogout} className="text-red-600 uppercase tracking-widest text-[11px] font-black hover:opacity-70">Sair</button>
          </>
        ) : (
          <>
            <button onClick={() => onNavigate(AppRoute.LANDING)} className="text-black hover:text-lime-500 transition-colors uppercase tracking-widest text-[11px] font-black">Home</button>
            <button onClick={() => onNavigate(AppRoute.LOGIN)} className="text-black hover:text-lime-500 transition-colors uppercase tracking-widest text-[11px] font-black">Entrar</button>
            <button 
              onClick={() => onNavigate(AppRoute.REGISTER)} 
              className="bg-black text-white px-6 py-2 rounded-xl uppercase tracking-widest text-[11px] font-black hover:bg-black/90 transition-all"
            >
              Criar Conta
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-[9px] font-black text-black/30 uppercase tracking-tighter">Créditos Diários</p>
               <p className={`text-xs font-black text-black`}>
                 {user.isSubscribed ? '∞ ILIMITADO' : `${user.dailyCredits} / 7`}
               </p>
             </div>
             <button 
              onClick={() => onNavigate(AppRoute.SETTINGS)}
              className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm"
             >
               {user.companyLogo ? (
                 <img src={user.companyLogo} className="w-full h-full object-cover" alt="Logo" />
               ) : (
                 <span className="text-xs font-black text-black">{user.email[0].toUpperCase()}</span>
               )}
             </button>
          </div>
        )}
        
        {!user && (
          <button 
            onClick={() => onNavigate(AppRoute.REGISTER)}
            className="md:hidden bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-black"
          >
            +
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
