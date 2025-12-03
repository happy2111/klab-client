import api from "@/lib/axiosInstance";
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductDto,
} from "./schemas/product.schema";

export class ProductService {
  async create(dto: CreateProductDto) {
    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return (await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  }

  async getAll(filter?: FilterProductDto) {
    const res = await api.get("/products", { params: filter });
    return res.data;
  }

  async getOne(id: string) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  }

  async update(id: string, dto: UpdateProductDto) {
    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return (await api.patch(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  }

  async delete(id: string) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  }
}
