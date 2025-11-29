import api from "@/lib/axiosInstance";
import type { Chat, Message } from "@/types/chat.types";

export class ChatService {
  async createChat(dto: { clientId: string; sellerId: string }): Promise<Chat> {
    const res = await api.post("/chats", dto);
    return res.data;
  }

  async fetchMyChats(): Promise<Chat[]> {
    const res = await api.get("/chats");
    return res.data;
  }

  async fetchMessages(chatId: string): Promise<Message[]> {
    const res = await api.get(`/chats/${chatId}/messages`);
    return res.data;
  }
}