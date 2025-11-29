import { makeAutoObservable, runInAction } from "mobx";
import { AuthService } from "@/services/auth.service";
import { LoginDto, RegisterDto } from "@/services/schemas/auth.schema";
import { toast } from "sonner";

const ACCESS_TOKEN_KEY = 'erp_access_token';

class AuthStore {
  accessToken: string | null = null;
  loading = false;
  service = new AuthService();

  constructor() {
    makeAutoObservable(this);
    this.loadTokenFromStorage();
  }

  private saveTokenToStorage(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      this.accessToken = token;
    }
  }

  private removeTokenFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }


  getState() {
    return this;
  }

  get isAuth() {
    return !!this.accessToken;
  }

  async login(dto: LoginDto) {
    this.loading = true;
    try {
      const data = await this.service.login(dto);
      runInAction(() => {
        this.accessToken = data.accessToken;
        // 2. ✅ Сохранение токена
        this.saveTokenToStorage(data.accessToken);
      });
      toast.success("Тизимга кирилди!");
      return true;
    } catch {
      toast.error("Хато: логин ёки пароль нотўғри!");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  async register(dto: RegisterDto) {
    this.loading = true;
    try {
      const data = await this.service.register(dto);
      runInAction(() => {
        this.accessToken = data.accessToken;
        // 2. ✅ Сохранение токена
        this.saveTokenToStorage(data.accessToken);
      });
      toast.success("Рўйхатдан ўтилди!");
      return true;
    } catch {
      toast.error("Хато: рўйхатдан ўтиш муваффақиятсиз!");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  async refresh() {
    try {
      const data = await this.service.refresh();
      runInAction(() => {
        this.accessToken = data.accessToken;
        this.saveTokenToStorage(data.accessToken); // Обновляем токен
      });
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  logout() {
    this.service.logout();
    runInAction(() => {
      this.accessToken = null;
      // 3. ✅ Удаление токена
      this.removeTokenFromStorage();
    });
    toast.success("Чиқиш амалга оширилди");
  }
}

export const authStore = new AuthStore();