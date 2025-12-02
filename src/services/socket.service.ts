// src/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import {Message} from "@/types/chat.types";
import {authStore} from "@/stores/auth.store";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class SocketService {
  private static instance: SocketService;
  private socket: Socket;
  private lastChatId?: string;

  private constructor() {
    // Подключаемся к namespace /chat, как на бэкенде (@WebSocketGateway({ namespace: 'chat' }))
    this.socket = io(`${SOCKET_URL}/chat`, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket подключён к /chat');
      if (this.lastChatId) {
        this.joinChat(this.lastChatId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket отключён — пытаемся переподключиться...');
    });

    this.socket.on('connect_error', (err) => {
      console.error('WS Error:', err.message);
    });
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect() {
    if (!this.socket.connected) {
      // Достаём актуальный access token из store (или функцию, возвращающую токен)
      const token = authStore.user?.accessToken || authStore.accessToken || null;
      if (token) {
        // Важно: socket.auth может быть задан как объект — сокет.io читает его при (re)connect
        this.socket.auth = { token };
      }
      this.socket.connect();
    }
  }

  setToken(token: string | null) {
    this.socket.auth = token ? { token } : {};
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinChat(chatId: string) {
    this.lastChatId = chatId;
    this.socket.emit('joinChat', { chatId });
  }

  leaveChat(chatId: string) {
    this.socket.emit('leaveChat', { chatId });
    if (this.lastChatId === chatId) {
      this.lastChatId = undefined;
    }
  }

  sendMessage(dto: { chatId: string; senderId: string; content: string; tempId?: string }) {
    // На сервер отправляем только необходимые поля
    this.socket.emit('sendMessage', { chatId: dto.chatId, content: dto.content });
  }

  onNewMessage(callback: (message: Message) => void): () => void {
    const handler = (data: Message) => callback(data);
    this.socket.on('newMessage', handler);
    return () => this.socket.off('newMessage', handler);
  }
}

export const socketService = SocketService.getInstance();