
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, Conversation, ChatMode } from '../types';
import { gemini } from '../services/geminiService';
import { chatService } from '../services/chatService';
import { LOGO_URL } from '../constants';
import ImageEditor from './ImageEditor';
import PaymentChat from './PaymentChat';

interface ChatInterfaceProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onUpdateUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('post');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showUpgradeChat, setShowUpgradeChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await chatService.getConversations(user.id);
      if (data && data.length > 0) setMessages(data[0].messages);
    };
    loadHistory();
  }, [user.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Por favor, envie apenas arquivos de imagem (JPG, PNG ou GIF).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    if (user.dailyCredits <= 0 && !user.isSubscribed) {
      alert('Seus 10 créditos diários acabaram! Renove via PIX ou aguarde a meia-noite.');
      setShowUpgradeChat(true);
      return;
    }

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input || `Gerar arte para ${mode}`, 
      imageUrl: selectedImage || undefined, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImg = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await gemini.generateSocialContent(currentInput || `Design profissional para ${mode}`, user, { 
        type: mode, 
        mediaData: currentImg ? { data: currentImg, mimeType: 'image/jpeg' } : undefined 
      });
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: response.text, 
        imageUrls: response.imageUrls, 
        videoUrl: response.videoUrl, 
        timestamp: new Date() 
      }]);
      if (!user.isSubscribed) onUpdateUser({ ...user, dailyCredits: Math.max(0, user.dailyCredits - 1) });
    } catch (e) {
      alert('IA indisponível. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const tools = [
    { id: 'post', label: 'Postagens', icon: '🖼️' },
    { id: 'storys', label: 'Storys', icon: '📱' },
    { id: 'carousel', label: 'Carrossel', icon: '📑' },
    { id: 'menu', label: 'Cardápio', icon: '🍔' },
    { id: 'video', label: 'Vídeo IA', icon: '🎬' },
    { id: 'logo', label: 'Logo', icon: '✒️' }
  ];

  return (
    <div className="flex h-full flex-col bg-white text-black overflow-hidden font-sans">
      {showUpgradeChat && (
        <PaymentChat 
          onClose={() => setShowUpgradeChat(false)} 
          onSuccess={() => { 
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            onUpdateUser({ 
              ...user, 
              isSubscribed: true, 
              dailyCredits: 9999, 
              subscriptionExpiry: expiryDate.toISOString() 
            }); 
            setShowUpgradeChat(false); 
          }} 
        />
      )}
      
      {editingImage && <ImageEditor imageUrl={editingImage} onClose={() => setEditingImage(null)} onSave={(url) => { 
        const a = document.createElement('a'); a.href = url; a.download = 'maca-art-2025.png'; a.click(); setEditingImage(null); 
      }} />}

      {/* HEADER FIXO NO TOPO COM MENU DE FERRAMENTAS */}
      <header className="bg-black text-white p-4 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} className="w-8 h-8 invert" alt="Logo" />
              <div>
                <h1 className="font-black text-sm uppercase tracking-tighter leading-none">Maçã ART Studio</h1>
                <p className="text-[7px] font-bold text-lime uppercase tracking-widest">
                  {user.isSubscribed ? '👑 PRO ILIMITADO' : `${user.dailyCredits}/10 CRÉDITOS HOJE`}
                </p>
              </div>
            </div>
            <button onClick={() => setShowUpgradeChat(true)} className="bg-lime text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              {user.isSubscribed ? 'Plano Ativo' : 'Ativar Pro'}
            </button>
          </div>

          <div className="flex bg-zinc-900 p-1 rounded-2xl overflow-x-auto scrollbar-hide gap-1 border border-white/5">
            {tools.map(t => (
              <button 
                key={t.id} 
                onClick={() => setMode(t.id as ChatMode)} 
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${mode === t.id ? 'bg-lime text-black shadow-lg shadow-lime/10' : 'text-white/40 hover:text-white'}`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ÁREA DE CONVERSA */}
      <main className="flex-1 relative flex flex-col bg-[#FAFAFA]">
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 pb-44">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-xl">🍎</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Estúdio de {tools.find(t => t.id === mode)?.label}</h2>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Criação real em 2025. Descreva o que você precisa abaixo.</p>
              </div>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide`}>
              <div className={`flex gap-3 max-w-[95%] md:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-[9px] ${m.role === 'user' ? 'bg-black text-white' : 'bg-lime text-black shadow-lg'}`}>
                  {m.role === 'user' ? 'VC' : 'IA'}
                </div>
                <div className="space-y-3">
                  <div className={`p-6 rounded-3xl text-sm font-bold shadow-sm ${m.role === 'user' ? 'bg-gray-100' : 'bg-white border border-gray-100'}`}>
                    {m.imageUrl && <img src={m.imageUrl} className="w-full max-w-xs h-auto rounded-2xl mb-4 border shadow-sm" alt="Anexo" />}
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                  
                  {m.videoUrl && (
                    <div className="rounded-[40px] overflow-hidden bg-black border-4 border-black shadow-2xl max-w-xs transition-all hover:scale-[1.02]">
                      <video src={m.videoUrl} controls className="w-full h-auto aspect-[9/16]" />
                    </div>
                  )}

                  {m.imageUrls && (
                    <div className="grid grid-cols-1 gap-6">
                      {m.imageUrls.map((url, i) => (
                        <div key={i} className="group relative rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl transition-all">
                          <img src={url} className="w-full h-auto" alt="Arte Gerada" />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-4 transition-all backdrop-blur-sm">
                            <button onClick={() => window.open(url, '_blank')} className="bg-white text-black py-4 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Baixar em HD</button>
                            <button onClick={() => setEditingImage(url)} className="bg-lime text-black py-4 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Ajustar Arte</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* CONTROLE DE INPUT */}
        <div className="absolute bottom-6 left-0 right-0 p-4 z-40">
          <div className="max-w-4xl mx-auto bg-white p-5 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-gray-100">
            {selectedImage && (
              <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-2xl border-2 border-dashed border-gray-200">
                <img src={selectedImage} className="w-14 h-14 rounded-xl object-cover shadow-md" alt="Preview" />
                <p className="text-[10px] font-black uppercase text-gray-400">Arquivo de Imagem Carregado</p>
                <button onClick={() => setSelectedImage(null)} className="ml-auto w-10 h-10 flex items-center justify-center bg-white border rounded-full text-red-500 shadow-sm">✕</button>
              </div>
            )}
            <div className="flex items-end gap-3 bg-gray-50 rounded-[28px] p-2 transition-all focus-within:bg-white focus-within:ring-4 ring-lime/10">
              <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 hover:scale-105 active:scale-95 transition-all">
                📎
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} />
              
              <textarea 
                rows={1} 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                placeholder={`Descreva sua ideia para ${mode}...`} 
                className="flex-1 bg-transparent border-none outline-none p-4 text-sm font-bold resize-none max-h-40" 
              />

              <button 
                onClick={handleSend} 
                disabled={isLoading || (!input.trim() && !selectedImage)} 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isLoading ? 'bg-gray-100' : 'bg-lime text-black shadow-xl shadow-lime/20 hover:scale-105 active:scale-95'}`}
              >
                {isLoading ? <div className="w-6 h-6 border-4 border-black/10 border-t-black rounded-full animate-spin"></div> : <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>}
              </button>
            </div>
            <div className="flex justify-between items-center mt-4 px-4">
               <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">Servidor Maçã ART 2025 v2.5 Online</p>
               {!user.isSubscribed && (
                 <p className="text-[9px] font-black text-lime-600 uppercase tracking-widest">{user.dailyCredits} créditos restantes hoje</p>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
