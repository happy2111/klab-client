import api from "@/lib/axiosInstance";
// Предположим, что у нас есть типы для чатов и сообщений,
// которые мы определим позже (Chat, Message).

export class ChatService {
  /** Создает новый чат или возвращает существующий */
  async createChat(dto: { clientId: string, sellerId: string }): Promise<any> {
    const res = await api.post("/chats", dto);
    return res.data;
  }

  /** Получает список чатов текущего пользователя */
  async fetchMyChats(): Promise<any[]> { // TODO: Replace 'any[]' with Chat[] type
    const res = await api.get("/chats");
    return res.data;
  }

  /** Получает историю сообщений для конкретного чата */
  async fetchMessages(chatId: string): Promise<any[]> { // TODO: Replace 'any[]' with Message[] type
    const res = await api.get(`/chats/${chatId}/messages`);
    return res.data;
  }
}