
import React, { useState, useRef, useEffect } from 'react';

interface ImageEditorProps {
  imageUrl: string;
  onClose: () => void;
  onSave: (newUrl: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [overlayText, setOverlayText] = useState('');
  const [textSize, setTextSize] = useState(48);
  const [textColor, setTextColor] = useState('#ffffff');
  const [isProcessing, setIsProcessing] = useState(true);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Aplicar filtros
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
      ctx.drawImage(img, 0, 0);
      
      // Resetar filtro para o texto
      ctx.filter = 'none';
      
      if (overlayText) {
        ctx.font = `bold ${textSize}px Inter, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText(overlayText, canvas.width / 2, canvas.height - 100);
      }
      setIsProcessing(false);
    };
  };

  useEffect(() => {
    draw();
  }, [brightness, contrast, grayscale, overlayText, textSize, textColor]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-10 items-center">
        
        {/* Visualização */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          <div className="bg-white/5 p-4 rounded-[40px] border border-white/10 shadow-2xl relative max-h-[70vh] flex items-center justify-center overflow-auto">
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark/50">
                <div className="w-10 h-10 border-4 border-lime/30 border-t-lime rounded-full animate-spin"></div>
              </div>
            )}
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-[24px] shadow-2xl" />
          </div>
        </div>

        {/* Controles */}
        <div className="w-full md:w-96 space-y-8 bg-white/5 p-8 rounded-[40px] border border-white/10 overflow-y-auto max-h-[85vh] scrollbar-hide">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase">Ajustar Arte</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Ajustes Básicos */}
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                <span>Brilho</span>
                <span className="text-lime">{brightness}%</span>
              </label>
              <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-lime" />
            </div>

            <div>
              <label className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                <span>Contraste</span>
                <span className="text-lime">{contrast}%</span>
              </label>
              <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-lime" />
            </div>

            <div>
              <label className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                <span>Preto e Branco</span>
                <span className="text-lime">{grayscale}%</span>
              </label>
              <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-lime" />
            </div>
          </div>

          <div className="h-[1px] bg-white/10"></div>

          {/* Texto Overlay */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Adicionar Texto</label>
              <input 
                type="text" 
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                placeholder="Digite algo..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold text-sm outline-none focus:border-lime transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Tamanho</label>
                <input type="number" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Cor</label>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-xl p-1 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button onClick={handleSave} className="w-full py-5 rounded-[24px] bg-lime text-dark font-black uppercase text-xs tracking-widest shadow-xl shadow-lime/20 hover:scale-105 active:scale-95 transition-all">
              Finalizar e Baixar
            </button>
            <button onClick={onClose} className="w-full py-5 rounded-[24px] bg-white/5 text-gray-400 font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">
              Descartar
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ImageEditor;
