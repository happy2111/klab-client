// src/stores/chat.store.ts

import { makeAutoObservable, runInAction } from "mobx";
import { ChatService } from "@/services/chat.service";
import { SocketService } from "@/services/socket.service";
import { authStore } from "./auth.store"; // Для получения ID текущего пользователя
import { toast } from "sonner";
import {profileStore} from "@/stores/profile.store";

// TODO: Определите типы Chat и Message, используя Prisma-схемы

class ChatStore {

  // REST/DB состояние
  chats: any[] = [];
  currentChatId: string | null = null;
  messages: any[] = [];
  loadingChats = false;
  loadingMessages = false;

  // Сервисы
  private chatService = new ChatService();
  private socketService: SocketService;

  constructor() {
    makeAutoObservable(this);
    // Инициализация SocketService при создании стора
    this.socketService = new SocketService();
    // Настройка слушателя для входящих сообщений
    this.setupSocketListener();
  }

  // --- WebSocket Setup ---

  private setupSocketListener() {
    this.socketService.onNewMessage(this.handleNewIncomingMessage);
  }

  /** Обрабатывает входящее сообщение от WS и добавляет его в текущий чат */
  handleNewIncomingMessage = (message: any) => {
    runInAction(() => {
      // Проверяем, относится ли сообщение к текущему активному чату
      if (message.chatId === this.currentChatId) {
        this.messages.push(message);
      }

      // 💡 Дополнительно: обновить предпросмотр чата в списке 'chats'
    });
  };

  // --- REST / API Actions ---

  /** Получает список чатов для текущего пользователя */
  async fetchChats() {
    if (!authStore.isAuth) return;

    this.loadingChats = true;
    try {
      const data = await this.chatService.fetchMyChats();
      runInAction(() => {
        this.chats = data;
      });
    } catch (e) {
      toast.error("Не удалось загрузить список чатов.");
    } finally {
      runInAction(() => (this.loadingChats = false));
    }
  }

  /** * Открывает чат с продавцом, создавая его при необходимости,
   * и загружает историю сообщений.
   */
  async openChat(sellerId: string) {
    if (!authStore.isAuth) {
      toast.error("Для начала чата необходимо войти в систему.");
      return;
    }

    // ⚠️ Убедитесь, что ProfileStore загрузил данные
    if (!profileStore.profile?.id) {
      toast.error("Не удалось получить ID текущего пользователя. Пожалуйста, обновите страницу.");
      return;
    }

    const clientId = profileStore.profile.id;
    this.loadingMessages = true;
    try {
      // 1. Создание/получение чата. Отправляем оба ID!
      // 🚨 Измените ChatService.createChat, чтобы принимал оба ID
      const chat = await this.chatService.createChat({ clientId, sellerId });
      const chatId = chat.id;

      await this.activateChat(chatId);

    } catch (e) {
      toast.error("Не удалось открыть чат.");
    } finally {
      runInAction(() => (this.loadingMessages = false));
    }
  }

  /** Отправляет сообщение (REST + WS) */
  async sendMessage(content: string) {
    if (!this.currentChatId || !authStore.accessToken) return;

    const senderId = profileStore.profile.id; // ⚠️ Предполагается, что ProfileStore загрузил ID

    const dto = {
      chatId: this.currentChatId,
      senderId: senderId,
      content: content,
    };

    // 💡 ВАЖНО: В реальной жизни, сообщение отправляется только через WS,
    // а бэкенд-Gateway сохраняет его в БД и рассылает.
    // Если бэкенд устроен так, что WS просто отправляет, а REST сохраняет,
    // то можно вызвать REST, но лучше использовать чистый WS, как ниже:

    // Отправляем через WebSocket
    this.socketService.sendMessage(dto);

    // 💡 Оптимистическое обновление: добавляем сообщение в UI сразу
    runInAction(() => {
      this.messages.push({
        ...dto,
        createdAt: new Date().toISOString(),
        sender: { id: senderId, name: profileStore.profile?.name || 'Вы' }, // Мок данных отправителя
        isPending: true // Флаг для UI, пока не придет подтверждение через WS
      });
    });
  }

  // --- Cleanup ---

  /** Закрывает текущий чат и отключает сокет */
  closeChat() {
    runInAction(() => {
      this.currentChatId = null;
      this.messages = [];
    });
    this.socketService.disconnect();
    // 💡 Обычно, при закрытии чата, не нужно отключать сокет полностью,
    // а просто покидать комнату ('leave_chat'), но для простоты оставим так.
  }

  async activateChat(chatId: string) {
    if (this.currentChatId === chatId) return;

    this.loadingMessages = true;
    try {
      runInAction(() => {
        this.currentChatId = chatId;
        this.messages = [];
      });

      // 1. Подключение к WS-комнате (обязательно)
      this.socketService.joinChat(chatId);

      // 2. Загрузка истории сообщений
      const messages = await this.chatService.fetchMessages(chatId);

      runInAction(() => {
        this.messages = messages;
      });

    } catch (e) {
      toast.error("Не удалось загрузить историю чата.");
    } finally {
      runInAction(() => (this.loadingMessages = false));
    }
  }

}

export const chatStore = new ChatStore();