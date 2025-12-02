// services/chat.service.ts
import api from "@/lib/axiosInstance";
import { Chat, Message } from "./schemas/chat.schema";

export class ChatService {
  async getMyChats(): Promise<Chat[]> {
    const res = await api.get("/chats/me");
    return res.data;
  }

  async createChat(sellerId: string): Promise<Chat> {
    const res = await api.post("/chats", { sellerId });
    return res.data;
  }

  async getChatMessages(chatId: string): Promise<Chat> {
    const res = await api.get(`/chats/${chatId}/messages`);
    return res.data;
  }
}

export const chatService = new ChatService();