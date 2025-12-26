
import React, { useState } from 'react';
import { AppRoute } from '../types';
import { LOGO_URL, HOW_IT_WORKS_IMG, SUPPORT_WHATSAPP, SUPPORT_NUMBER, AGENCY_SLOGAN } from '../constants';
import PaymentChat from './PaymentChat';

interface LandingPageProps {
  onNavigate: (route: AppRoute) => void;
  onPaymentSuccess: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onPaymentSuccess }) => {
  const [showPayment, setShowPayment] = useState(false);

  const scrollToPlans = () => {
    const el = document.getElementById('planos');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-black pb-32">
      {showPayment && <PaymentChat onClose={() => setShowPayment(false)} onSuccess={() => { setShowPayment(false); onPaymentSuccess(); }} />}
      
      {/* Maçã ART Header */}
      <header className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(AppRoute.LANDING)}>
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center p-2">
            <img src={LOGO_URL} alt="Logo" className="invert" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-black">Maçã <span className="text-lime-500">ART</span></span>
        </div>
        <div className="flex items-center gap-6">
           <button onClick={scrollToPlans} className="hidden md:block font-black text-[11px] uppercase tracking-widest text-black hover:text-lime-500 transition-colors">Planos</button>
           <button onClick={() => onNavigate(AppRoute.LOGIN)} className="flex flex-col gap-1.5 group cursor-pointer">
            <div className="w-8 h-1 bg-black rounded-full group-hover:scale-x-75 transition-transform origin-right"></div>
            <div className="w-8 h-1 bg-black rounded-full"></div>
            <div className="w-5 h-1 bg-black rounded-full group-hover:scale-x-150 transition-transform origin-right"></div>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="animate-slide space-y-12">
          <div className="text-lg md:text-xl font-medium text-black">
            Sua presença digital <span className="text-lime-500 font-bold">em um clique</span>
          </div>
          
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-black">
              Posts, Logos e <br/> Vídeos em <span className="text-lime-500">segundos.</span>
            </h1>
            <p className="text-xl md:text-2xl text-black leading-relaxed font-medium">
              O Maçã ART automatiza seu estúdio. Crie logomarcas, vídeos cinematográficos, cardápios digitais e carrosséis com IA real de última geração. Sem simulação.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate(AppRoute.CHAT)}
              className="btn-hipay bg-black text-white px-10 py-6 text-xl rounded-[28px] hover:bg-black/90"
            >
              abrir chat grátis
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
            <button 
              onClick={scrollToPlans}
              className="px-10 py-6 text-xl rounded-[28px] border-2 border-black font-black hover:bg-gray-50 transition-all text-center text-black"
            >
              ver planos pro
            </button>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="px-8 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black">Escolha o seu <span className="text-lime-500">Estúdio</span></h2>
           <p className="text-black font-bold">Planos via PIX com ativação imediata.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Free Plan */}
           <div className="hipay-card p-10 flex flex-col h-full border-2 border-gray-100 bg-white">
              <div className="mb-8">
                 <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Iniciante</h3>
                 <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black">R$ 0</span>
                    <span className="text-black font-bold">/grátis</span>
                 </div>
              </div>
              <ul className="space-y-4 flex-1 mb-10">
                 <li className="flex items-center gap-3 font-bold text-sm text-black">
                    <span className="text-lime-500 text-xl">✓</span> 7 créditos por dia
                 </li>
                 <li className="flex items-center gap-3 font-bold text-sm text-black/60">
                    <span className="text-black/30 text-xl">✓</span> Marca d'água Maçã ART
                 </li>
              </ul>
              <button onClick={() => onNavigate(AppRoute.CHAT)} className="w-full py-4 rounded-2xl bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-black/90 transition-all">
                 Começar Grátis
              </button>
           </div>

           {/* Monthly Pro Plan */}
           <div className="hipay-card p-10 flex flex-col h-full bg-lime text-black ring-8 ring-lime/10 relative scale-105 border-transparent">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Mais Popular</div>
              <div className="mb-8">
                 <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Maçã Pro</h3>
                 <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black">R$ 19,90</span>
                    <span className="text-black/70 font-bold">/mês</span>
                 </div>
              </div>
              <ul className="space-y-4 flex-1 mb-10">
                 <li className="flex items-center gap-3 font-bold text-sm text-black">
                    <span className="text-black text-xl">✓</span> Logos e Vídeos ILIMITADOS
                 </li>
                 <li className="flex items-center gap-3 font-bold text-sm text-black">
                    <span className="text-black text-xl">✓</span> SEM marca d'água
                 </li>
                 <li className="flex items-center gap-3 font-bold text-sm text-black">
                    <span className="text-black text-xl">✓</span> Cardápios Digitais Reais
                 </li>
              </ul>
              <button onClick={() => setShowPayment(true)} className="w-full py-4 rounded-2xl bg-black text-white font-black uppercase text-[10px] tracking-widest text-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                 Assinar via Chat PIX
              </button>
           </div>

           {/* Extra Credits Option */}
           <div className="hipay-card p-10 flex flex-col h-full border-2 border-gray-100 bg-white">
              <div className="mb-8">
                 <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Pack 30</h3>
                 <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black">R$ 9,90</span>
                    <span className="text-black font-bold">/avulso</span>
                 </div>
              </div>
              <ul className="space-y-4 flex-1 mb-10">
                 <li className="flex items-center gap-3 font-bold text-sm text-black">
                    <span className="text-lime-500 text-xl">✓</span> 30 artes premium
                 </li>
                 <li className="flex items-center gap-3 font-bold text-sm text-black">
                    <span className="text-lime-500 text-xl">✓</span> SEM marca d'água
                 </li>
              </ul>
              <button onClick={() => setShowPayment(true)} className="w-full py-4 rounded-2xl bg-black text-white font-black uppercase text-[10px] tracking-widest text-center hover:bg-black/90 transition-all">
                 Comprar via Chat PIX
              </button>
           </div>
        </div>
      </section>

      {/* Image Block Section */}
      <section className="px-8 py-10 max-w-5xl mx-auto">
        <div className="hipay-card p-12 bg-white flex flex-col items-center justify-center border-2 border-black/5">
           <img src={HOW_IT_WORKS_IMG} className="max-w-md w-full" alt="Graphic Design" />
           <div className="mt-12">
              <div className="tag-service text-xl px-10 py-4 shadow-xl shadow-lime/20 text-black">
                Design Real 2025 <br/> para o seu <span className="font-black">Negócio</span>
              </div>
           </div>
        </div>
      </section>

      {/* Support Section - Agência X */}
      <section className="px-8 py-24 bg-black text-white rounded-[64px] mx-4 mt-20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-lime/10 blur-[120px]"></div>
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-white">Precisa de suporte? <br/> <span className="text-lime-500">Estamos online.</span></h2>
          <p className="text-white/80 text-lg md:text-xl font-medium">
            Fale conosco sobre artes, planos ou parcerias: {SUPPORT_NUMBER} <br/> 
            <span className="text-lime-500 uppercase text-xs tracking-widest font-black">{AGENCY_SLOGAN}</span>
          </p>
          <div className="pt-6">
            <a href={SUPPORT_WHATSAPP} target="_blank" className="btn-hipay bg-lime text-black px-12 py-6 text-xl rounded-[32px] hover:scale-105 active:scale-95">
              falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-20">
        <div className="flex items-center justify-center gap-2 opacity-100 mb-4">
           <img src={LOGO_URL} className="w-6 h-6" alt="Footer Logo" />
           <span className="text-sm font-black uppercase tracking-widest text-black">Maçã ART Studio</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">© 2025 - Inteligência Artificial Real</p>
      </footer>
    </div>
  );
};

export default LandingPage;
