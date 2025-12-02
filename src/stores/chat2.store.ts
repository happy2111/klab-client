import { makeAutoObservable, runInAction, toJS } from "mobx";
import { chatService } from "@/services/chat2.service";
import { socketService } from "@/services/socket2.service";
import { authStore } from "@/stores/auth.store";
import type { Chat, Message } from "../services/schemas/chat.schema";
import { toast } from "sonner";

class ChatStore {
  chats: Chat[] = [];
  currentChat: Chat | null = null;
  messages: Message[] = [];
  loading = false;
  typingUsers = new Map<string, boolean>();
  onlineUsers = new Set<string>();

  private typingTimeout: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadMyChats() {
    this.loading = true;
    try {
      const chats = await chatService.getMyChats();
      runInAction(() => {
        this.chats = chats;
      });
    } catch (e) {
      toast.error("Не удалось загрузить чаты");
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  async openChat(chatId: string) {
    this.loading = true;
    try {
      const chat = await chatService.getChatMessages(chatId);
      runInAction(() => {
        this.currentChat = chat;
        this.messages = chat.messages || [];
        this.scrollToBottom();
      });

      // Ensure socket is connected before joining a chat
      socketService.connect();

      socketService.joinChat(chatId);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Не удалось открыть чат");
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  async createAndOpenChat(sellerId: string) {
    try {
      const chat = await chatService.createChat(sellerId);
      await this.loadMyChats(); // обновим список
      this.openChat(chat.id);
    } catch (e) {
      toast.error("Не удалось создать чат");
    }
  }

  sendMessage(content: string) {
    if (!this.currentChat ) return;

    socketService.sendMessageService(this.currentChat.id, content);
  }

  handleIncomingMessage(message: Message) {
    if (message.chatId !== this.currentChat?.id) {
      this.markChatAsUnread(message.chatId);
      return;
    }

    runInAction(() => {
      this.messages.push(message);
      this.scrollToBottom();
    });
  }

  private markChatAsUnread(chatId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      // Можно добавить поле unreadCount в интерфейс
      // chat.unreadCount = (chat.unreadCount || 0) + 1;
      this.chats = [...this.chats]; // триггер обновления
    }
  }

  setTyping(userId: string, isTyping: boolean) {
    if (userId === authStore.user?.id) return;

    runInAction(() => {
      if (isTyping) {
        this.typingUsers.set(userId, true);
      } else {
        this.typingUsers.delete(userId);
      }
    });
  }

  setUserOnline(userId: string, online: boolean) {
    runInAction(() => {
      if (online) {
        this.onlineUsers.add(userId);
      } else {
        this.onlineUsers.delete(userId);
      }
    });
  }

  startTyping() {
    if (!this.currentChat) return;

    socketService.sendTyping(this.currentChat.id, true);

    if (this.typingTimeout) clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      socketService.sendTyping(this.currentChat!.id, false);
    }, 1000);
  }

  get typingText(): string {
    const users = Array.from(this.typingUsers.keys())
      .filter(id => this.typingUsers.get(id))
      .map(id => this.getUserNameById(id))
      .filter(Boolean);

    if (users.length === 0) return "";
    if (users.length === 1) return `${users[0]} печатает...`;
    return "Несколько человек печатают...";
  }

  get interlocutor() {
    if (!this.currentChat || !authStore.user) return null;
    const { clientId, sellerId } = this.currentChat;
    const interlocutorId = clientId === authStore.user.id ? sellerId : clientId;
    return this.currentChat.client.id === interlocutorId
      ? this.currentChat.client
      : this.currentChat.seller;
  }

  get isInterlocutorOnline(): boolean {
    return this.interlocutor ? this.onlineUsers.has(this.interlocutor.id) : false;
  }

  private getUserNameById(userId: string): string {
    if (!this.currentChat) return "";
    if (this.currentChat.client.id === userId) return this.currentChat.client.name || "Клиент";
    if (this.currentChat.seller.id === userId) return this.currentChat.seller.name || "Продавец";
    return "Пользователь";
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector(".messages-container");
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  leaveCurrentChat() {
    if (this.currentChat) {
      socketService.leaveChat(this.currentChat.id);
      this.currentChat = null;
      this.messages = [];
      this.typingUsers.clear();
    }
  }

  destroy() {
    this.leaveCurrentChat();
    this.chats = [];
    this.typingUsers.clear();
    this.onlineUsers.clear();
  }

  interlocutorFromChat(chat: Chat) {
    if (!authStore.user) return null;
    return chat.clientId === authStore.user.id ? chat.seller : chat.client;
  }
}

export const chatStore = new ChatStore();