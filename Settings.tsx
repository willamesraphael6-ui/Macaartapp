
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile | null;
  onSave: (u: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState<UserProfile | null>(user);

  if (!user || !formData) return <div className="p-20 text-center text-black font-black uppercase tracking-widest">Carregando dados 2025...</div>;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => prev ? ({ ...prev, companyLogo: reader.result as string }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDaysRemaining = () => {
    if (!user.subscriptionExpiry) return 0;
    const expiry = new Date(user.subscriptionExpiry);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="p-6 max-w-2xl mx-auto pb-48 animate-slide">
      <h2 className="text-4xl font-black mb-10 tracking-tighter text-black">Gestão do Estúdio</h2>
      
      <div className="space-y-8">
        {/* Card de Assinatura */}
        <div className={`hipay-card p-8 border-2 transition-all ${user.isSubscribed ? 'bg-black text-white border-lime' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Status do Plano</p>
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                {user.isSubscribed ? 'Maçã PRO Ativo 🍎' : 'Plano Gratuito'}
              </h3>
            </div>
            {user.isSubscribed && <span className="bg-lime text-black px-3 py-1 rounded-full text-[9px] font-black uppercase">Premium</span>}
          </div>

          <div className="space-y-4">
            {user.isSubscribed ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                   <span className="text-[11px] font-bold">Expiração em:</span>
                   <span className={`text-[11px] font-black ${daysRemaining < 5 ? 'text-red-500' : 'text-lime'}`}>
                     {new Date(user.subscriptionExpiry!).toLocaleDateString('pt-BR')} ({daysRemaining} dias)
                   </span>
                </div>
                {daysRemaining < 5 && (
                  <p className="text-red-500 text-[10px] font-black uppercase animate-pulse">⚠️ Sua assinatura está vencendo! Renove para não perder o acesso.</p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center bg-black/5 p-4 rounded-2xl">
                 <span className="text-[11px] font-bold">Créditos de hoje:</span>
                 <span className="text-[11px] font-black">{user.dailyCredits} / 10</span>
              </div>
            )}
          </div>
        </div>

        <div className="hipay-card p-6 bg-[#f9f9f9] border-gray-100">
          <label className="block text-sm font-bold text-black mb-4 uppercase tracking-widest">Identidade Visual</label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white border border-gray-100 rounded-3xl overflow-hidden flex items-center justify-center shadow-inner">
              {formData.companyLogo ? (
                <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-black/10 text-4xl font-black">?</div>
              )}
            </div>
            <input type="file" id="logo" className="hidden" onChange={handleLogoUpload} accept="image/*" />
            <label htmlFor="logo" className="bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold cursor-pointer hover:bg-black/80 transition-all">
              Mudar Logo
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Nome da sua Marca</label>
            <input 
              type="text" 
              value={formData.companyName}
              onChange={(e) => setFormData(p => p ? ({ ...p, companyName: e.target.value }) : null)}
              className="input-hipay text-black"
              placeholder="Ex: Burger Art"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Segmento Principal</label>
            <select 
              value={formData.companyType}
              onChange={(e) => setFormData(p => p ? ({ ...p, companyType: e.target.value }) : null)}
              className="input-hipay bg-white text-black font-black"
            >
              <option value="Hambúrgueria">Hambúrgueria</option>
              <option value="Pizzaria">Pizzaria</option>
              <option value="Restaurante">Restaurante Geral</option>
              <option value="Moda">Moda / Vestuário</option>
              <option value="Serviços">Prestação de Serviços</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Descrição para a IA</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData(p => p ? ({ ...p, description: e.target.value }) : null)}
              className="input-hipay h-32 resize-none text-black"
              placeholder="Ex: Somos uma hamburgueria artesanal focada em carnes suculentas e um estilo rústico..."
            />
          </div>
        </div>

        <button 
          onClick={() => onSave(formData)}
          className="btn-hipay bg-black text-white w-full justify-center text-lg py-5 shadow-xl shadow-black/10 hover:bg-black/90 active:scale-95 transition-all"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default Settings;
