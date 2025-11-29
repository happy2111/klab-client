// src/types/chat.types.ts
export interface UserPreview {
  id: string;
  name: string | null;
  email: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: UserPreview;
  isPending?: boolean;
  tempId?: string;
}

export interface Chat {
  id: string;
  clientId: string;
  sellerId: string;
  client: UserPreview;
  seller: UserPreview;
  messages: Message[];
  updatedAt: string;
}