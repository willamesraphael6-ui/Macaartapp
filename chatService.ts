
import { Conversation, ChatMessage } from "../types";
import { API_BASE_URL } from "../constants";

export const chatService = {
  getConversations: async (userId: string): Promise<Conversation[]> => {
    const token = localStorage.getItem('maca_art_session_token');
    if (!token || token === 'offline-token') return [];

    try {
      const response = await fetch(`${API_BASE_URL}/api/chats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  },

  saveMessage: async (conversationId: string, message: ChatMessage): Promise<void> => {
    const token = localStorage.getItem('maca_art_session_token');
    if (!token || token === 'offline-token') return;

    try {
      await fetch(`${API_BASE_URL}/api/chats/${conversationId}/messages`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(message)
      });
    } catch (e) {
      console.error("Erro ao salvar no banco:", e);
    }
  },

  createConversation: async (title: string): Promise<Conversation | null> => {
    const token = localStorage.getItem('maca_art_session_token');
    if (!token || token === 'offline-token') return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/chats`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ title })
      });
      return await response.json();
    } catch {
      return null;
    }
  }
};
