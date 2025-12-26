
import { UserProfile } from "../types";
import { API_BASE_URL } from "../constants";

// Fallback seguro com 10 créditos diários conforme solicitado
const MOCK_USER: UserProfile = {
  id: "temp-user",
  email: "usuario@teste.com",
  companyName: "Minha Empresa",
  companyType: "Geral",
  description: "Um negócio crescendo nas redes sociais.",
  isSubscribed: false,
  dailyCredits: 10,
  lastCreditReset: new Date().toISOString()
};

export const authService = {
  register: async (data: any): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erro ao realizar cadastro.");
      
      if (result.token) localStorage.setItem('maca_art_session_token', result.token);
      return result.user;
    } catch (error: any) {
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        console.warn("Servidor offline. Criando sessão local segura...");
        const localUser = { ...MOCK_USER, email: data.email, companyName: data.companyName };
        localStorage.setItem('maca_art_session_token', 'offline-token');
        localStorage.setItem('maca_art_local_user', JSON.stringify(localUser));
        return localUser;
      }
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "E-mail ou senha incorretos.");

      if (result.token) localStorage.setItem('maca_art_session_token', result.token);
      return result.user;
    } catch (error: any) {
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        const savedLocal = localStorage.getItem('maca_art_local_user');
        if (savedLocal) {
          const user = JSON.parse(savedLocal);
          if (user.email === email) {
             localStorage.setItem('maca_art_session_token', 'offline-token');
             return user;
          }
        }
        throw new Error("Não foi possível conectar ao servidor. Verifique sua internet.");
      }
      throw error;
    }
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    const token = localStorage.getItem('maca_art_session_token');
    if (!token) return null;

    if (token === 'offline-token') {
      const saved = localStorage.getItem('maca_art_local_user');
      return saved ? JSON.parse(saved) : null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        localStorage.removeItem('maca_art_session_token');
        return null;
      }
      const result = await response.json();
      return result.user;
    } catch {
      return null;
    }
  },

  updateUser: async (updatedUser: UserProfile): Promise<UserProfile> => {
    const token = localStorage.getItem('maca_art_session_token');
    if (!token) throw new Error("Usuário não autenticado.");

    if (token === 'offline-token') {
      localStorage.setItem('maca_art_local_user', JSON.stringify(updatedUser));
      return updatedUser;
    }

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(updatedUser)
    });

    if (!response.ok) throw new Error("Não foi possível salvar os dados no servidor.");
    const result = await response.json();
    return result.user;
  },

  logout: () => {
    localStorage.removeItem('maca_art_session_token');
    localStorage.removeItem('maca_art_local_user');
  }
};
