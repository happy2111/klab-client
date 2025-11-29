import api from "@/lib/axiosInstance";
import { CreateCategoryDto, UpdateCategoryDto } from "./schemas/category.schema";

export class CategoryService {
  // === CREATE ===
  async create(dto: CreateCategoryDto) {
    return (await api.post("/categories", dto)).data.data;
  }

  // === GET ALL ===
  static async  getAll() {
    const res = await api.get("/categories");
    return res.data; // вернет массив категорий
  }

  // === GET ONE ===
  async getOne(id: string) {
    const res = await api.get(`/categories/${id}`);
    return res.data?.data;
  }

  // === UPDATE ===
  async update(id: string, dto: UpdateCategoryDto) {
    return (await api.patch(`/categories/${id}`, dto)).data;
  }

  // === DELETE ===
  async delete(id: string) {
    const res = await api.delete(`/categories/${id}`);
    return res.data?.data;
  }

}
