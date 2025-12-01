import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "sonner";
import { ProfileService } from "@/services/profile.service";

class ProfileStore {
  profile = null;

  profileLoading = false;
  updateLoading = false;
  passwordLoading = false;

  hasFetched = false;

  private service = new ProfileService();

  constructor() {
    makeAutoObservable(this);
  }

  private log(...args: any) {
    console.log("%c[ProfileStore]", "color:#4F46E5; font-weight:bold;", ...args);
    alert(args.map(a => JSON.stringify(a)).join("\n"));
  }

  private handleError(error: any, defaultMessage: any) {
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
    this.log("fetchProfile() called");

    if (this.profileLoading) {
      this.log("fetchProfile() aborted → profileLoading already TRUE");
      return;
    }

    if (this.hasFetched) {
      this.log("fetchProfile() aborted → already fetched");
      return;
    }

    this.profileLoading = true;
    this.log("profileLoading = true");

    try {
      const data = await this.service.fetchProfile();
      runInAction(() => {
        this.profile = data;
        this.hasFetched = true;
      });

      this.log("Profile fetched:", data);

      return true;
    } catch (e) {
      this.log("fetchProfile() error:", e);

      this.hasFetched = false;
      this.handleError(e, "Профиль юкланмади");
      return false;
    } finally {
      this.profileLoading = false;
      this.log("profileLoading = false (finally)");
    }
  }

  async updateProfile(dto) {
    this.log("updateProfile() called:", dto);

    this.updateLoading = true;
    this.log("updateLoading = true");

    try {
      const updated = await this.service.updateProfile(dto);
      runInAction(() => {
        this.profile = updated;
      });

      this.log("Profile updated:", updated);

      toast.success("Профиль янгиланди!");
      return true;
    } catch (e) {
      this.log("updateProfile() error:", e);

      this.handleError(e, "Хато");
      return false;
    } finally {
      this.updateLoading = false;
      this.log("updateLoading = false (finally)");
    }
  }

  async changePassword(dto) {
    this.log("changePassword() called");

    this.passwordLoading = true;
    this.log("passwordLoading = true");

    try {
      await this.service.changePassword(dto);

      this.log("Password successfully changed");

      toast.success("Пароль ўзгартирилди!");
      return true;
    } catch (e) {
      this.log("changePassword() error:", e);

      this.handleError(e, "Пароль ўзгартиришда хато");
      return false;
    } finally {
      this.passwordLoading = false;
      this.log("passwordLoading = false (finally)");
    }
  }

  clearProfile() {
    this.log("clearProfile() called");

    runInAction(() => {
      this.profile = null;
      this.hasFetched = false;
    });

    this.log("profile cleared");
  }
}

export const profileStore = new ProfileStore();
