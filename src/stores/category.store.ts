import { makeAutoObservable, runInAction } from "mobx";
import { CategoryService } from "@/services/category.service";

class CategoryStore {
  categories: any[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAll() {
    this.loading = true;
    try {
      const data = await CategoryService.getAll();
      runInAction(() => (this.categories = data));
    } catch (e) {
      console.error(e);
    } finally {
      runInAction(() => (this.loading = false));
    }
  }
}

export const categoryStore = new CategoryStore();
