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
  profileLoading = false;
  updateLoading = false;
  passwordLoading = false;
  hasFetched = false;

  private service = new ProfileService();

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
    if (this.profileLoading || this.hasFetched) return;
    this.profileLoading = true;

    try {
      const data = await this.service.fetchProfile();
      runInAction(() => {
        this.profile = data;
        this.hasFetched = true;
      });
      return true;
    } catch (e) {
      this.hasFetched = false;
      this.handleError(e, "Профиль юкланмади");
      return false;
    } finally {
      this.profileLoading = false;
    }
  }

  async updateProfile(dto) {
    this.updateLoading = true;
    try {
      const updated = await this.service.updateProfile(dto);
      runInAction(() => {
        this.profile = updated;
      });
      toast.success("Профиль янгиланди!");
      return true;
    } catch (e) {
      this.handleError(e, "Хато");
      return false;
    } finally {
      this.updateLoading = false;
    }
  }

  async changePassword(dto) {
    this.passwordLoading = true;
    try {
      await this.service.changePassword(dto);
      toast.success("Пароль ўзгартирилди!");
      return true;
    } catch (e) {
      this.handleError(e, "Пароль ўзгартиришда хато");
      return false;
    } finally {
      this.passwordLoading = false;
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