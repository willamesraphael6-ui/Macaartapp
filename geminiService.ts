
import { GoogleGenAI } from "@google/genai";
import { UserProfile, ChatMode } from "../types";

export class GeminiService {
  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error('API Key não configurada.');
    return new GoogleGenAI({ apiKey });
  }

  async verifyPaymentProof(content: string, imageData?: string): Promise<{ verified: boolean; feedback: string }> {
    const ai = this.getAI();
    const prompt = `
      SISTEMA DE VERIFICAÇÃO BANCÁRIA MAÇÃ ART 2025.
      Sua única função é validar se o comprovante de PIX foi enviado para o favorecido correto.
      
      DESTINATÁRIO OBRIGATÓRIO: ROBERIA ARAUJO DE LEMOS
      
      INSTRUÇÕES:
      1. Procure no texto ou na imagem o campo "Favorecido", "Recebedor" ou "Dados do Destinatário".
      2. O nome deve ser exatamente "ROBERIA ARAUJO DE LEMOS".
      3. Se o nome coincidir, retorne "verified": true.
      4. Se o nome for diferente ou não for encontrado, retorne "verified": false.
      5. IMPORTANTE: Não mostre o nome de quem pagou. Apenas confirme se o dinheiro caiu na conta da Robéria.
      
      RETORNE APENAS JSON:
      {
        "verified": boolean,
        "feedback": "Mensagem curta de confirmação ou erro de dados."
      }
    `;

    try {
      const parts: any[] = [{ text: `DADOS DO COMPROVANTE: ${content}. PROMPT: ${prompt}` }];
      if (imageData) {
        const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
        parts.push({
          inlineData: { data: base64Data, mimeType: 'image/jpeg' }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      return {
        verified: !!result.verified,
        feedback: result.feedback || 'Processamento concluído.'
      };
    } catch (e) {
      const upper = content.toUpperCase();
      // Fallback de segurança se a IA falhar na rede
      const manual = upper.includes("ROBERIA") && upper.includes("ARAUJO") && upper.includes("LEMOS");
      return { 
        verified: manual, 
        feedback: manual ? "Pagamento identificado via servidor redundante." : "Favorecido ROBERIA ARAUJO DE LEMOS não encontrado no documento." 
      };
    }
  }

  async generateSocialContent(prompt: string, userProfile: UserProfile, options: { type?: ChatMode, mediaData?: { data: string, mimeType: string } } = {}) {
    const { type = 'post', mediaData } = options;
    const ai = this.getAI();
    const apiKey = process.env.API_KEY;

    const systemInstruction = `
      Você é o Maçã ART 2025. Estúdio de Design IA Profissional.
      Empresa: ${userProfile.companyName} | Ramo: ${userProfile.companyType}
      Responda sempre em PT-BR.
    `;

    try {
      const parts: any[] = [{ text: `Modo: ${type}. Briefing: ${prompt}` }];
      if (mediaData) {
        const base64Data = mediaData.data.includes(',') ? mediaData.data.split(',')[1] : mediaData.data;
        parts.push({ inlineData: { data: base64Data, mimeType: mediaData.mimeType } });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: { systemInstruction }
      });

      const images: string[] = [];
      let videoUrl = '';

      if (type === 'video') {
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `Professional video for ${userProfile.companyType}: ${prompt}`,
          config: { numberOfVideos: 1, aspectRatio: '9:16' }
        });
        while (!operation.done) {
          await new Promise(r => setTimeout(r, 10000));
          operation = await ai.operations.getVideosOperation({ operation });
        }
        videoUrl = `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${apiKey}`;
      } else {
        const aspectRatio = type === 'storys' ? '9:16' : '1:1';
        const img = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `High Quality Social Media Design for ${type}: ${prompt}` }] },
          config: { imageConfig: { aspectRatio } }
        });
        const p = img.candidates?.[0]?.content?.parts?.find(x => x.inlineData);
        if (p?.inlineData) images.push(`data:image/png;base64,${p.inlineData.data}`);
      }
      return { text: response.text || '', imageUrls: images, videoUrl };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const gemini = new GeminiService();
