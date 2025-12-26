
import React, { useState, useEffect, useRef } from 'react';
import { PIX_CONFIG, LOGO_URL, SUPPORT_NUMBER, SUPPORT_WHATSAPP } from '../constants';
import { gemini } from '../services/geminiService';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  image?: string;
}

interface PaymentChatProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentChat: React.FC<PaymentChatProps> = ({ onClose, onSuccess }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMessage = (role: 'bot' | 'user', text: string, image?: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, text, image }]);
  };

  useEffect(() => {
    const sequence = [
      { t: "Bem-vindo ao sistema Financeiro Maçã ART. 🍏" },
      { t: "Para ativar o PRO, realize o PIX para a conta oficial." },
      { t: "AVISO IMPORTANTE: Nossa IA verifica o pagamento, mas o link final de acesso é liberado após a confirmação bancária. Se você já pagou, mande um 'oi' para o nosso suporte." },
      { t: "WhatsApp Suporte: +55 82 98815-3084. O envio manual pode demorar um pouquinho, tenha paciência!" },
      { t: `CHAVE PIX COPIA E COLA:\n${PIX_CONFIG.payload}` }
    ];
    sequence.forEach((item, i) => setTimeout(() => addMessage('bot', item.t), i * 800));
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleSend("Enviando comprovante para análise do servidor...", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSend = async (textInput: string = input, imageInput?: string) => {
    if (!textInput.trim() && !imageInput) return;
    addMessage('user', textInput, imageInput);
    setInput('');
    setIsVerifying(true);

    try {
      addMessage('bot', "Conectando ao banco de dados... Verificando destino do PIX.");
      const result = await gemini.verifyPaymentProof(textInput, imageInput);
      
      if (result.verified) {
        addMessage('bot', `PAGAMENTO CONFIRMADO! Destinatário correto identificado. Ativando sua assinatura VIP...`);
        setTimeout(() => setIsSuccess(true), 1500);
      } else {
        addMessage('bot', "Não consegui identificar o pagamento para ROBERIA ARAUJO DE LEMOS. Certifique-se de que o nome no comprovante está correto e envie novamente.");
        setIsVerifying(false);
      }
    } catch (e) {
      addMessage('bot', "Erro no processamento bancário. Tente novamente mais tarde.");
      setIsVerifying(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[600] bg-white flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-lime rounded-full flex items-center justify-center mb-6 shadow-2xl">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-black leading-none">ASSINATURA <br/> <span className="text-lime-500">CONCLUÍDA!</span></h2>
        <p className="text-gray-500 font-bold mb-8 text-sm">Seu plano Pro 2025 está agora ativo em nossa base de dados local.</p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={onSuccess} 
            className="bg-black text-white py-5 rounded-[28px] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-transform"
          >
            ENTRAR NO APP VIP
          </button>
          
          <a 
            href={SUPPORT_WHATSAPP} 
            target="_blank" 
            className="bg-lime text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
          >
            Link Manual WhatsApp
          </a>
        </div>
        
        <p className="mt-12 text-[9px] font-black text-gray-300 uppercase tracking-widest">Servidor: vercel/github/telavipapp</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[500] bg-white flex flex-col">
      <div className="p-6 bg-black text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2">✕</button>
          <div className="flex flex-col">
            <span className="font-black text-xs uppercase tracking-tighter leading-none">Validador Robéria</span>
            <span className="text-[7px] text-lime font-bold uppercase tracking-widest">Segurança de Dados Ativa</span>
          </div>
        </div>
        <div className="w-2 h-2 bg-lime rounded-full animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-bold shadow-sm ${m.role === 'user' ? 'bg-black text-white' : 'bg-white text-black border border-gray-100'}`}>
              {m.image && <img src={m.image} className="w-full rounded-lg mb-2 shadow-md" alt="Anexo" />}
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {isVerifying && <div className="p-4 text-[10px] font-black text-lime animate-pulse uppercase tracking-widest">Consultando Banco Central...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">📎</button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Mande o comprovante aqui..." 
            className="flex-1 bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none focus:bg-white border border-transparent focus:border-lime/20 transition-all" 
          />
          <button onClick={() => handleSend()} className="w-12 h-12 bg-lime text-black rounded-2xl flex items-center justify-center shadow-lg shadow-lime/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>
        <div className="mt-4 flex justify-center items-center gap-4">
           <a href={SUPPORT_WHATSAPP} target="_blank" className="text-[8px] font-black uppercase text-gray-400 hover:text-black">WhatsApp Suporte {SUPPORT_NUMBER}</a>
           <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
           <p className="text-[8px] font-black uppercase text-gray-400">Ativação Instantânea</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentChat;
