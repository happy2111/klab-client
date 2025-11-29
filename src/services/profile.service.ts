
import api from "@/lib/axiosInstance";
import {
  UpdateProfileDto,
  ChangePasswordDto,
  UserProfile,
} from "./schemas/profile.schema";

export class ProfileService {
  async fetchProfile(): Promise<UserProfile> {
    const res = await api.get("/profile");
    return res.data;
  }

  async updateProfile(dto: UpdateProfileDto): Promise<UserProfile> {
    const res = await api.patch("/profile", dto);
    return res.data;
  }

  async changePassword(dto: ChangePasswordDto): Promise<{ message: string }> {
    const res = await api.put("/profile/password", dto);
    return res.data;
  }
}