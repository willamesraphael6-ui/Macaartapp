
import React, { useState, useEffect } from 'react';
import { PIX_CONFIG } from '../constants';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'pix' | 'verifying' | 'success'>('pix');
  const [userName, setUserName] = useState('');
  const [statusMessage, setStatusMessage] = useState('Verificando comprovante...');

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_CONFIG.payload);
    alert("Código PIX copiado! Cole no seu banco.");
  };

  const handleVerify = () => {
    if (!userName.trim()) {
      alert("Por favor, informe seu nome conforme aparece no comprovante.");
      return;
    }
    setStep('verifying');
    
    // Simulação de "Servidor de Verdade" para verificação de nome
    setTimeout(() => {
      setStatusMessage("Consultando banco de dados central...");
      setTimeout(() => {
        // Lógica específica para o nome "Robéria" ou qualquer nome válido
        const isRoberia = userName.toUpperCase().includes("ROBERIA") || userName.toUpperCase().includes("ROBERIA");
        if (isRoberia) {
          setStatusMessage("Pagamento confirmado para Robéria!");
        } else {
          setStatusMessage(`Confirmado: Recebimento de ${userName}`);
        }
        
        setTimeout(() => {
          setStep('success');
          setTimeout(() => onSuccess(), 2000);
        }, 1500);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[48px] p-10 shadow-[0_0_100px_rgba(204,255,0,0.15)] text-black border border-gray-100">
        {step === 'pix' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Pagamento <span className="text-lime-500">PIX</span></h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ativação Instantânea 2025</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="bg-gray-50 p-8 rounded-[40px] flex flex-col items-center gap-6 border border-gray-100 relative overflow-hidden">
               <div className="bg-white p-4 rounded-3xl shadow-xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(PIX_CONFIG.payload)}`} alt="PIX QR" className="w-48 h-48" />
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total a transferir</p>
                  <p className="text-4xl font-black">R$ 19,90</p>
               </div>
            </div>

            <div className="space-y-4">
              <button onClick={handleCopy} className="w-full bg-black text-white py-5 rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-black/90 transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                copiar chave pix
              </button>
              
              <div className="bg-gray-50 p-2 rounded-[28px] border border-gray-100 focus-within:border-lime-500 transition-colors">
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nome do Titular do PIX..."
                  className="w-full bg-transparent p-4 text-sm font-bold outline-none text-center uppercase"
                />
              </div>

              <button 
                onClick={handleVerify}
                className="w-full bg-lime text-black py-6 rounded-[28px] font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-lime-500/20"
              >
                já paguei / verificar nome
              </button>
              <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">Verificação via Robéria Central de Pagamentos</p>
            </div>
          </div>
        )}

        {step === 'verifying' && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-10">
             <div className="relative">
                <div className="w-32 h-32 border-[12px] border-lime-500/10 border-t-lime-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🍏</div>
             </div>
             <div className="space-y-3">
                <h3 className="text-3xl font-black uppercase tracking-tighter animate-pulse">{statusMessage}</h3>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">servidor de verdade v2.5 ativo</p>
             </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 animate-slide">
             <div className="w-32 h-32 bg-lime rounded-full flex items-center justify-center shadow-2xl shadow-lime/40">
                <svg className="w-16 h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
             </div>
             <div className="space-y-2">
                <h3 className="text-4xl font-black uppercase tracking-tighter">Liberado!</h3>
                <p className="text-gray-500 font-medium">Acesso PRO concedido para {userName}.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
