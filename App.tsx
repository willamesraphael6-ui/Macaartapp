
import React, { useState, useEffect, useCallback } from 'react';
import { AppRoute, UserProfile } from './types';
import { authService } from './services/authService';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import Settings from './components/Settings';
import BottomNavbar from './components/BottomNavbar';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem('maca_art_local_user');
      let currentUser: UserProfile | null = savedUser ? JSON.parse(savedUser) : null;
      
      const now = new Date();
      
      if (!currentUser) {
        currentUser = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          email: 'visitante@macaart.com',
          companyName: 'Visitante',
          companyType: 'Geral',
          description: '',
          isSubscribed: false,
          dailyCredits: 10,
          lastCreditReset: now.toISOString()
        };
      } else {
        const lastReset = new Date(currentUser.lastCreditReset);
        if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth()) {
          currentUser.dailyCredits = 10;
          currentUser.lastCreditReset = now.toISOString();
        }

        if (currentUser.isSubscribed && currentUser.subscriptionExpiry) {
          const expiry = new Date(currentUser.subscriptionExpiry);
          if (now > expiry) {
            currentUser.isSubscribed = false;
            currentUser.dailyCredits = 10;
          }
        }
      }
      
      setUser(currentUser);
      localStorage.setItem('maca_art_local_user', JSON.stringify(currentUser));
      
      // Se já era assinante, pula para o chat (VIP) se não estiver na home
      if (currentUser.isSubscribed) {
         // Se estivéssemos vindo de um link /telavipapp poderíamos detectar aqui
      }
    } catch (err) {
      console.warn("Erro ao inicializar banco local.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  useEffect(() => { initApp(); }, [initApp]);

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    localStorage.setItem('maca_art_local_user', JSON.stringify(updated));
  };

  const navigateToVip = () => {
    if (user) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      const updatedUser = { 
        ...user, 
        isSubscribed: true, 
        dailyCredits: 9999, 
        subscriptionExpiry: expiry.toISOString() 
      };
      handleUpdateUser(updatedUser);
      setRoute(AppRoute.CHAT); // Vai para o estúdio VIP
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-black font-black text-lime text-2xl tracking-widest uppercase">🍎 Maçã ART 2025</div>;

  return (
    <div className="min-h-screen bg-white">
      {route === AppRoute.LANDING && <LandingPage onNavigate={setRoute} onPaymentSuccess={navigateToVip} />}
      {(route === AppRoute.CHAT || route === AppRoute.TELAVIPAPP) && user && (
        <ChatInterface user={user} onUpdateUser={handleUpdateUser} />
      )}
      {route === AppRoute.SETTINGS && user && <Settings user={user} onSave={handleUpdateUser} />}
      
      {user && route !== AppRoute.LANDING && (
        <BottomNavbar 
          user={user} 
          onNavigate={setRoute} 
          onLogout={() => { authService.logout(); window.location.reload(); }} 
        />
      )}
    </div>
  );
};

export default App;
