import { makeAutoObservable, runInAction } from "mobx";
import { AuthService } from "@/services/auth.service";
import { LoginDto, RegisterDto } from "@/services/schemas/auth.schema";
import { toast } from "sonner";
import {socketService} from "@/services/socket.service";
import {chatStore} from "@/stores/chat.store";

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "SELLER" | "CLIENT";
  createdAt: string;
  updatedAt: string;
  phone: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

const ACCESS_TOKEN_KEY = 'access_token';

class AuthStore {
  accessToken: string | null = null;
  user: User | null = null;
  authLoading = false;
  appLoading = false;

  private service = new AuthService();

  private isInitialized = false;
  // Fallback for environments where localStorage is unavailable (e.g., iOS Safari Private Mode)
  private memoryToken: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadTokenFromStorage();
  }

  private saveTokenToStorage(token: string) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {
      // Fallback to in-memory token if localStorage is not available
      this.memoryToken = token;
    }
  }

  private loadTokenFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      this.accessToken = token;
    } catch {
      // If localStorage is blocked, use memory token
      this.accessToken = this.memoryToken;
    }
  }

  private removeTokenFromStorage() {
    if (typeof window === 'undefined') {
      this.memoryToken = null;
      return;
    }
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch {
      // If localStorage is blocked, clear memory fallback
      this.memoryToken = null;
    }
  }


  getState() {
    return this;
  }

  get isAuth() {
    return !!this.accessToken;
  }

  async login(dto: LoginDto) {
    this.authLoading = true;
    try {
      const data = await this.service.login(dto);
      runInAction(() => {
        this.accessToken = data.accessToken;
        this.user = data.user;
        this.saveTokenToStorage(data.accessToken);
        socketService.connect();
      });
      toast.success("Тизимга кирилди!");
      return true;
    } catch {
      toast.error("Хато: логин ёки пароль нотўғри!");
      return false;
    } finally {
      runInAction(() => (this.authLoading = false));
    }
  }

  async register(dto: RegisterDto) {
    this.authLoading = true;
    try {
      const data = await this.service.register(dto);
      runInAction(() => {
        this.accessToken = data.accessToken;
        this.user = data.user;
        this.saveTokenToStorage(data.accessToken);
      });
      toast.success("Рўйхатдан ўтилди!");
      return true;
    } catch (error: any) {
      toast.error("Хато: " + (error?.message || "Рўйхатдан ўтиш муваффақиятсиз бўлди!"));
      return false;
    } finally {
      runInAction(() => (this.authLoading = false));
    }
  }

  async refresh() {
    try {
      const data = await this.service.refresh();
      runInAction(() => {
        this.accessToken = data.accessToken;
        this.user = data.user;
        this.saveTokenToStorage(data.accessToken);
      });
      return true;
    } catch {
      return false; // интерцептор сам сделает logout
    }
  }

  async logout() {
    this.authLoading = true;
    try {
      await this.service.logout();
    } catch {
      // ignore
    } finally {
      runInAction(() => {
        this.accessToken = null;
        this.user = null;
        this.removeTokenFromStorage();
        this.authLoading = false;
        chatStore.destroy();
        socketService.disconnect();
      });
      toast.success("Чиқиш амалга оширилди");
    }
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (!this.accessToken) return;

    this.appLoading = true;
    const ok = await this.refresh();
    if (!ok) {
      runInAction(() => {
        this.accessToken = null;
        this.user = null; // clear user on failed refresh
        this.removeTokenFromStorage();
        // ensure sockets are disconnected if auth is invalid
        socketService.disconnect();
      });
    }
    this.appLoading = false;
  }
}

export const authStore = new AuthStore();