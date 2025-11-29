// src/services/socket.service.ts

import { io, Socket } from 'socket.io-client';

// Определяем, где находится ваш WebSocket-сервер (например, тот же URL, что и API)
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class SocketService {
  private socket: Socket;

  constructor() {
    // 💡 Важно:
    // Если ваш бэкенд требует JWT для подключения,
    // его нужно передать через 'auth' или 'extraHeaders'.
    // Для простоты, мы будем использовать соединение без явного токена,
    // если бэкенд полагается на сессии/куки.
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true, // Для отправки куки, если JWT хранится там
      // Если токен в localStorage, добавьте:
      // auth: { token: localStorage.getItem('erp_access_token') }
    });
  }

  /** Подключается к комнате чата */
  joinChat(chatId: string) {
    if (this.socket.connected) {
      this.socket.emit('join_chat', chatId);
    }
  }

  /** Отправляет сообщение */
  sendMessage(dto: { chatId: string, senderId: string, content: string }) {
    if (this.socket.connected) {
      this.socket.emit('send_message', dto);
    }
  }

  /** Подписывается на новые сообщения */
  onNewMessage(callback: (message: any) => void) { // TODO: Replace 'any' with Message type
    this.socket.on('new_message', callback);
  }

  /** Отключается от сокета */
  disconnect() {
    this.socket.disconnect();
  }
}