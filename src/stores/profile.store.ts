import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "sonner";
import { ProfileService } from "@/services/profile.service";
import {
  UpdateProfileDto,
  ChangePasswordDto,
  UserProfile,
} from "@/services/schemas/profile.schema";

class ProfileStore {
  profile: UserProfile | null = null;
  loading = false;
  service = new ProfileService();

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProfile() {
    this.loading = true;
    try {
      const data = await this.service.fetchProfile();
      runInAction(() => (this.profile = data));
      return true;
    } catch (e) {
      toast.error("Хато: Профиль маълумотларини юклаб бўлмади.");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  async updateProfile(dto: UpdateProfileDto) {
    this.loading = true;
    try {
      const updatedProfile = await this.service.updateProfile(dto);
      runInAction(() => {
        this.profile = updatedProfile;
      });
      toast.success("Профиль муваффақиятли янгиланди!");
      return true;
    } catch (e) {
      // Здесь можно добавить более детальную обработку ошибок (например, "Email занят")
      toast.error("Хато: Профилни янгилашда муаммо юзага келди.");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  async changePassword(dto: ChangePasswordDto) {
    this.loading = true;
    try {
      await this.service.changePassword(dto);
      toast.success("Пароль муваффақиятли ўзгартирилди!");
      return true;
    } catch (e) {
      // Здесь важна детальная обработка ошибки (например, неверный текущий пароль)
      toast.error("Хато: Паролни ўзгартиришда муаммо юзага келди.");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  clearProfile() {
    runInAction(() => (this.profile = null));
  }
}

export const profileStore = new ProfileStore();