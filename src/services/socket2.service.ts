import { io, Socket } from "socket.io-client";
import { authStore } from "@/stores/auth.store";
import { chatStore } from "@/stores/chat2.store";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    console.log("CONNECTING SOCKET...");
    if (this.socket?.connected) return;

    const token = authStore.accessToken;
    if (!token) return;

    const baseUrl = "http://localhost:5000";
    this.socket = io(`${baseUrl}/chat`, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });


    this.socket.on("connect", () => {
      console.log("УСПЕШНО ПОДКЛЮЧЕНО К /chat! ID:", this.socket?.id);
    });

    this.socket.on("connected", (data) => {
      console.log("Gateway auth success:", data);
    });

    this.socket.on("error", (err) => {
      console.error("Socket error event:", err);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("newMessage", (message) => {
      chatStore.handleIncomingMessage(message);
    });

    this.socket.on("typing", ({ userId, isTyping }) => {
      chatStore.setTyping(userId, isTyping);
    });

    this.socket.on("userOnline", ({ userId }) => {
      chatStore.setUserOnline(userId, true);
    });

    this.socket.on("userLeft", ({ userId }) => {
      chatStore.setUserOnline(userId, false);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });



  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinChat(chatId: string) {
    this.socket?.emit("joinChat", { chatId });
  }

  leaveChat(chatId: string) {
    this.socket?.emit("leaveChat", { chatId });
  }

  sendMessageService(chatId: string, content: string) {
    console.log("SEND:", chatId, content);
    console.log("SOCKET:", this.socket);
    this.socket?.emit("sendMessage", { chatId, content });
  }

  sendTyping(chatId: string, isTyping: boolean) {
    this.socket?.emit("typing", { chatId, isTyping });
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();