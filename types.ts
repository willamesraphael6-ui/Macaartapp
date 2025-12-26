
export interface UserProfile {
  id: string;
  email: string;
  companyName: string;
  companyType: string;
  companyLogo?: string;
  description: string;
  isSubscribed: boolean;
  dailyCredits: number;
  lastCreditReset: string; // ISO Date String
  subscriptionExpiry?: string; // ISO Date String
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  imageUrls?: string[]; 
  videoUrl?: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: Date;
}

export enum AppRoute {
  LANDING = 'landing',
  LOGIN = 'login',
  REGISTER = 'register',
  CHAT = 'chat',
  SETTINGS = 'settings',
  TELAVIPAPP = 'telavipapp'
}

export type ChatMode = 'post' | 'carousel' | 'storys' | 'video' | 'menu' | 'logo';
