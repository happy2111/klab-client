import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "sonner";
import { ProductService } from "@/services/product.service";
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductDto,
} from "@/services/schemas/product.schema";

class ProductStore {
  products: any[] = [];
  product: any = null;
  loading = false;

  page = 1;
  limit = 10;
  total = 0;
  pages = 0;
  search = '';

  service = new ProductService();

  constructor() {
    makeAutoObservable(this);
  }

  getState() {
    return this;
  }

  async getAll(filter?: FilterProductDto) {
    this.loading = true;
    try {
      const finalFilter = {
        page: this.page,
        limit: this.limit,
        search: this.search,
        ...filter,
      };
      const data = await this.service.getAll(finalFilter);
      console.log("data: ")
      data.data.map(({ name, price }) => console.log(name, price))
      runInAction(() => {
        this.products = data.data;
        this.page = data.page;
        this.limit = data.limit;
        this.total = data.total;
        this.pages = data.pages;
      });
      console.log("products: ")
      this.products.map(({ name, price }) => console.log(name, price))
      return true;
    } catch {
      toast.error("Mahsulotlarni olishda xatolik yuz berdi");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  // === GET ONE ===
  async getOne(id: string) {
    this.loading = true;
    try {
      const data = await this.service.getOne(id);
      runInAction(() => (this.product = data));
      return true;
    } catch {
      toast.error("Mahsulot topilmadi");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  // === CREATE ===
  async create(dto: CreateProductDto) {
    this.loading = true;
    try {
      const data = await this.service.create(dto);
      runInAction(() => this.products.unshift(data));
      toast.success("Mahsulot yaratildi!");
      return true;
    } catch {
      toast.error("Mahsulot yaratishda xatolik");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  // === UPDATE ===
  async update(id: string, dto: UpdateProductDto) {
    this.loading = true;
    try {
      const updated = await this.service.update(id, dto);
      runInAction(() => {
        this.products = this.products.map((p) => (p.id === id ? updated : p));
        if (this.product?.id === id) this.product = updated;
      });
      toast.success("Mahsulot yangilandi!");
      return true;
    } catch {
      toast.error("Mahsulotni yangilashda xatolik");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  // === DELETE ===
  async delete(id: string) {
    this.loading = true;
    try {
      await this.service.delete(id);
      runInAction(() => {
        this.products = this.products.filter((p) => p.id !== id);
        if (this.product?.id === id) this.product = null;
      });
      toast.success("Mahsulot o‘chirildi!");
      return true;
    } catch {
      toast.error("Mahsulotni o‘chirishda xatolik");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  setPage(page: number) {
    this.page = page;
    this.getAll({ page, limit: this.limit });
  }

  setLimit(limit: number) {
    this.limit = limit;
    this.getAll({ page: this.page, limit });
  }

  setSearch(search: string) {
    this.search = search;
    this.page = 1;
    this.getAll();
  }
}

let store: ProductStore | null = null;

export function getProductStore() {
  if (!store) {
    store = new ProductStore();
  }
  return store;
}

export const productStore = getProductStore();


