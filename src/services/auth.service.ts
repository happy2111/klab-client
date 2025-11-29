import api from "@/lib/axiosInstance";
import { LoginDto, RegisterDto } from "./schemas/auth.schema";

export class AuthService {
  async login(dto: LoginDto) {
    const res = await api.post("/auth/login", dto);
    return res.data; // { accessToken }
  }

  async register(dto: RegisterDto) {
    const res = await api.post("/auth/register", dto);
    return res.data; // { accessToken }
  }

  async logout() {
    const res = await api.post("/auth/logout");
    return res.data;
  }

  async refresh() {
    const res = await api.post("/auth/refresh"); // cookie отправляется автоматически
    return res.data; // { accessToken }
  }
}
