import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "sonner";
import { ProfileService } from "@/services/profile.service";
import { authStore } from "@/stores/auth.store";
import type {
  UpdateProfileDto,
  ChangePasswordDto,
  UserProfile,
} from "@/services/schemas/profile.schema";

class ProfileStore {
  profile: UserProfile | null = null;
  isLoading = false;

  private service = new ProfileService();
  private hasFetched = false;

  constructor() {
    makeAutoObservable(this);
  }

  private handleError(error: any, defaultMessage: string) {
    const msg = error?.response?.data?.message;
    if (typeof msg === "string") {
      toast.error(msg);
    } else if (Array.isArray(msg) && msg.length > 0) {
      toast.error(msg[0]);
    } else {
      toast.error(defaultMessage);
    }
  }

  async fetchProfile() {
    if (this.hasFetched) return;

    this.isLoading = true;
    try {
      const data = await this.service.fetchProfile();
      runInAction(() => {
        this.profile = data;
        this.hasFetched = true; // mark fetched only on success
        // Синхронизация с authStore
        if (authStore.user) {
          authStore.user = { ...authStore.user, ...data };
        }
      });
      return true;
    } catch (e: any) {
      runInAction(() => {
        this.hasFetched = false; // allow retry on failure
      });
      this.handleError(e, "Профиль маълумотларини юклаб бўлмади");
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async updateProfile(dto: UpdateProfileDto) {
    this.isLoading = true;
    try {
      const updated = await this.service.updateProfile(dto);
      runInAction(() => {
        this.profile = updated;
        if (authStore.user) {
          authStore.user = { ...authStore.user, ...updated };
        }
      });
      toast.success("Профиль муваффақиятли янгиланди!");
      return true;
    } catch (e: any) {
      this.handleError(e, "Профилни янгилашда хатолик");
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async changePassword(dto: ChangePasswordDto) {
    this.isLoading = true;
    try {
      await this.service.changePassword(dto);
      toast.success("Пароль муваффақиятли ўзгартирилди!");
      return true;
    } catch (e: any) {
      this.handleError(e, "Жорий пароль нотўғри ёки янги пароль хавфсиз эмас");
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  clearProfile() {
    runInAction(() => {
      this.profile = null;
      this.hasFetched = false;
    });
  }
}

export const profileStore = new ProfileStore();