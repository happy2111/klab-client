// src/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import {Message} from "@/types/chat.types";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class SocketService {
  private static instance: SocketService;
  private socket: Socket;
  private lastChatId?: string;

  private constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket подключён');
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
      this.socket.connect();
    }
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinChat(chatId: string) {
    this.lastChatId = chatId;
    this.socket.emit('join_chat', chatId)
  }

  leaveChat(chatId: string) {
    this.socket.emit('leave_chat', chatId);
    if (this.lastChatId === chatId) {
      this.lastChatId = undefined;
    }
  }

  sendMessage(dto: { chatId: string; senderId: string; content: string; tempId?: string }) {
    this.socket.emit('send_message', dto);
  }

  onNewMessage(callback: (message: Message) => void): () => void {
    const handler = (data: Message) => callback(data);
    this.socket.on('new_message', handler);
    return () => this.socket.off('new_message', handler);
  }
}

export const socketService = SocketService.getInstance();