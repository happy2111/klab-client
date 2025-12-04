import { makeAutoObservable, runInAction, computed } from "mobx";
import { toast } from "sonner";
import { CreateProductDto } from "@/services/schemas/product.schema";


type ProductBase = Pick<CreateProductDto, 'name' | 'price' | 'photo'>;

interface CartItem extends ProductBase {
  id: string;
  quantity: number;
}

class CartStore {
  cartItems: CartItem[] = [];
  loading = false;
  constructor() {
    makeAutoObservable(this);
    this.loadCartFromStorage();
  }

  get itemCount(): number {
    return this.cartItems.length;
  }

  get totalAmount(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  addToCart(product: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    const existingItem = this.cartItems.find(item => item.id === product.id);

    runInAction(() => {
      if (quantity <= 0) {
        toast.error("Количество должно быть положительным.");
        return;
      }

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cartItems.push({
          ...product,
          quantity: quantity,
        });
      }
      this.saveCartToStorage();
      toast.success(`${product.name} добавлен в корзину`);
    });
  }

  setQuantity(id: string, newQuantity: number) {
    const item = this.cartItems.find(i => i.id === id);

    if (!item) {
      toast.error("Товар не найден в корзине.");
      return;
    }

    runInAction(() => {
      if (newQuantity <= 0) {
        // Если количество <= 0, удаляем товар
        this.removeFromCart(id);
      } else {
        item.quantity = newQuantity;
        this.saveCartToStorage();
      }
    });
  }


  removeFromCart(id: string) {
    runInAction(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== id);
      this.saveCartToStorage();
      toast.info("Товар удален из корзины");
    });
  }


  clearCart() {
    runInAction(() => {
      this.cartItems = [];
      this.saveCartToStorage();
      toast.info("Корзина очищена");
    });
  }

  private saveCartToStorage() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }

  private loadCartFromStorage() {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        runInAction(() => {
          this.cartItems = parsedCart;
        });
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }

  async checkout() {
    if (this.cartItems.length === 0) {
      toast.error("Корзина пуста. Добавьте товары для оформления заказа.");
      return false;
    }

    this.loading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      runInAction(() => {
        this.clearCart();
      });
      toast.success("Заказ успешно оформлен!");
      return true;
    } catch {
      toast.error("Ошибка при оформлении заказа.");
      return false;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }
}

export const cartStore = new CartStore();