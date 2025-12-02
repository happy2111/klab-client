function debugLog(...args: any[]) {
  try {
    console.log(...args);
  } catch {}

  try {
    // alert(args.map(a => JSON.stringify(a)).join("\n"));
  } catch {}
}

import { makeAutoObservable, runInAction } from "mobx";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { socketService } from "@/services/socket.service";
import { chatStore } from "@/stores/chat.store";

const ACCESS_TOKEN_KEY = "access_token";

class AuthStore {
  accessToken: string | null = null;
  user: any = null;
  authLoading = false;
  appLoading = false;

  private isInitialized = false;
  private memoryToken: string | null = null;
  private service = new AuthService();

  constructor() {
    makeAutoObservable(this);
    debugLog("AuthStore: constructor start");
    this.loadTokenFromStorage();
  }

  private saveTokenToStorage(token: string) {
    debugLog("saveTokenToStorage", token);
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (e) {
      debugLog("localStorage.setItem FAILED", e);
      this.memoryToken = token;
    }
  }

  private loadTokenFromStorage() {
    debugLog("loadTokenFromStorage START");
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      debugLog("Token from localStorage:", token);
      this.accessToken = token;
    } catch (e) {
      debugLog("localStorage.getItem FAILED", e);
      this.accessToken = this.memoryToken;
    }
  }

  private removeTokenFromStorage() {
    debugLog("removeTokenFromStorage");
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch (e) {
      debugLog("localStorage.remove FAILED", e);
      this.memoryToken = null;
    }
  }

  get isAuth() {
    debugLog("isAuth check:", !!this.accessToken);
    return !!this.accessToken;
  }

  async login(dto: any) {
    debugLog("login START", dto);
    this.authLoading = true;

    try {
      const data = await this.service.login(dto);
      debugLog("login RESPONSE:", data);

      runInAction(() => {
        this.accessToken = data.accessToken;
        this.user = data.user;
        this.saveTokenToStorage(data.accessToken);
        socketService.connect();
      });

      return true;
    } catch (e) {
      debugLog("login ERROR:", e);
      toast.error("Login error");
      return false;
    } finally {
      this.authLoading = false;

    }
  }

  async refresh() {
    debugLog("refresh START");

    try {
      const data = await this.service.refresh();
      debugLog("refresh RESPONSE:", data);

      runInAction(() => {
        this.accessToken = data.accessToken;
        this.user = data.user;
        this.saveTokenToStorage(data.accessToken);
      });

      return true;
    } catch (e) {
      debugLog("refresh ERROR:", e);
      return false;
    }
  }

  async init() {
    debugLog("init START");

    if (this.isInitialized) {
      debugLog("init SKIPPED: already initialized");
      return;
    }

    this.isInitialized = true;

    if (!this.accessToken) {
      debugLog("init STOP: no accessToken");
      return;
    }

    this.appLoading = true;

    const ok = await this.refresh();
    debugLog("refresh result:", ok);

    if (!ok) {
      runInAction(() => {
        debugLog("refresh failed → clearing auth");
        this.accessToken = null;
        this.user = null;
        this.removeTokenFromStorage();
        socketService.disconnect();
      });
    }

    this.appLoading = false;
    debugLog("init END");
  }

  async logout() {
    debugLog("logout START");
    try {
      await this.service.logout();
    } catch (e) {
      debugLog("logout service error:", e);
    }

    runInAction(() => {
      debugLog("logout → clearing store");
      this.accessToken = null;
      this.user = null;
      this.removeTokenFromStorage();
      chatStore.destroy();
      socketService.disconnect();
    });
  }
}

export const authStore = new AuthStore();
