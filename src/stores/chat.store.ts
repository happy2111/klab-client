// src/stores/chat.store.ts
import { makeAutoObservable, runInAction } from "mobx";
import { ChatService } from "@/services/chat.service";
import { socketService } from "@/services/socket.service";
import { authStore } from "./auth.store";
import { toast } from "sonner";
import type { Chat, Message } from "@/types/chat.types";

class ChatStore {
  chats: Chat[] = [];
  currentChatId: string | null = null;
  messages: Message[] = [];
  loadingChats = false;
  loadingMessages = false;

  private chatService = new ChatService();
  private removeMessageListener?: () => void;

  constructor() {
    makeAutoObservable(this);
    this.setupSocketListener();
  }

  private setupSocketListener() {
    this.removeMessageListener = socketService.onNewMessage(this.handleIncomingMessage);
  }

  private listeners = new Set<() => void>();

  onChange(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

// Например, в activateChat, sendMessage, handleNewIncomingMessage — в конце:

  private handleIncomingMessage = (message: Message) => {
    runInAction(() => {
      if (message.chatId !== this.currentChatId) return;

      // Если это подтверждение нашего сообщения — заменяем
      if (message.tempId) {
        const index = this.messages.findIndex(m => m.id === message.tempId);
        if (index !== -1) {
          this.messages[index] = { ...message, isPending: false, tempId: undefined };
          return;
        }
      }

      // Новое входящее сообщение
      this.messages.push(message);
      this.notify();

    });
  };

  async fetchChats() {
    if (!authStore.isAuth) return;

    this.loadingChats = true;
    try {
      const data = await this.chatService.fetchMyChats();
      runInAction(() => {
        this.chats = data;
      });
    } catch {
      toast.error("Ошибка загрузить чаты");
    } finally {
      runInAction(() => (this.loadingChats = false));
    }
  }

  async openChat(sellerId: string) {
    if (!authStore.isAuth || !authStore.user?.id) {
      toast.error("Войдите в систему");
      return;
    }

    this.loadingMessages = true;
    try {
      const chat = await this.chatService.createChat({
        clientId: authStore.user.id,
        sellerId,
      });

      await this.activateChat(chat.id);
    } catch {
      toast.error("Не удалось открыть чат");
    } finally {
      runInAction(() => (this.loadingMessages = false));
    }
  }

  async sendMessage(content: string) {
    if (!this.currentChatId || !authStore.user?.id || !content.trim()) return;

    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const optimisticMessage: Message = {
      id: tempId,
      chatId: this.currentChatId,
      senderId: authStore.user.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      sender: {
        id: authStore.user.id,
        name: authStore.user.name || "Вы",
        email: authStore.user.email,
      },
      isPending: true,
      tempId,
    };

    runInAction(() => this.messages.push(optimisticMessage));

    socketService.sendMessage({
      chatId: this.currentChatId,
      senderId: authStore.user.id,
      content: content.trim(),
      tempId,
    });

    this.notify();

  }

  async activateChat(chatId: string) {
    if (this.currentChatId === chatId) return;

    // Очистка старого чата
    if (this.currentChatId) {
      socketService.leaveChat(this.currentChatId);
    }

    runInAction(() => {
      this.currentChatId = chatId;
      this.messages = [];
      this.loadingMessages = true;
    });

    socketService.joinChat(chatId);

    try {
      const messages = await this.chatService.fetchMessages(chatId);
      runInAction(() => {
        this.messages = messages;
      });

      this.notify();

    } catch {
      toast.error("Не удалось загрузить сообщения");
    } finally {
      runInAction(() => (this.loadingMessages = false));
    }
  }

  closeChat() {
    if (this.currentChatId) {
      socketService.leaveChat(this.currentChatId);
    }
    if (this.removeMessageListener) {
      this.removeMessageListener();
    }

    runInAction(() => {
      this.currentChatId = null;
      this.messages = [];
    });
  }

  // Вызывать при логауте
  destroy() {
    this.closeChat();
    socketService.disconnect();
  }
}

export const chatStore = new ChatStore();