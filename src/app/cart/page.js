'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

// Предполагается, что cartStore экспортируется из '@/stores/cart.store'
import { cartStore } from '@/stores/сart.store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Предполагаем, что у вас есть компонент Input
import Link from 'next/link';
import {useRouter} from "next/navigation";

// Вспомогательная функция для форматирования цены
const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD', // Или 'UZS'/'RUB' в зависимости от вашей валюты
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

// --- Компонент элемента корзины ---

const CartItemRow = observer(({ item }) => {
  const { id, name, price, quantity, photo } = item;
  const router = useRouter();

  const handleSetQuantity = (newQuantity) => {
    cartStore.setQuantity(id, newQuantity);
  };

  const handleRemove = () => {
    cartStore.removeFromCart(id);
  };

  const totalPrice = price * quantity;

  return (
    <div className="relative flex items-center justify-between border-b dark:border-border py-4 last:border-b-0">

      {/* Изображение и Название */}
      <div className="flex items-center gap-4 w-1/2">
        <img
          src={photo || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0533%2F2089%2Ffiles%2Fplaceholder-images-product-4_large.png%3Fv%3D1530129360&f=1&nofb=1&ipt=2377d1403541ca8fc8d1464f10e8b9b90ca3d8b662f498035f8715b10f03afeb'}
          alt={name}
          className="w-16 h-16 object-cover rounded-md border border-border"
        />
        <span className="font-semibold text-foreground">{name}</span>
      </div>

      {/* Количество (Controls) */}
      <div className="flex items-center absolute top-0 left-1/2 gap-2 w-1/4 justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSetQuantity(quantity - 1)}
          className="h-8 w-8 text-foreground"
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val >= 0) {
              handleSetQuantity(val);
            }
          }}
          className="w-16 text-center h-8"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSetQuantity(quantity + 1)}
          className="h-8 w-8 text-foreground"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Общая цена за товар и Удаление */}
      <div className="flex items-center gap-4 w-1/4 justify-end">
        <span className="font-bold min-w-[80px] text-right text-primary">{formatPrice(totalPrice)}</span>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleRemove}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

// --- Основной компонент страницы ---

const CartPage = observer(() => {
  const { cartItems, totalAmount, checkout, itemCount, loading, clearCart } = cartStore;
  const router = useRouter();
  const handleCheckout = async () => {
    // Вызываем имитацию оформления заказа из MobX Store
    await checkout();
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-extrabold text-foreground mb-6 flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-primary" />
        Ваша корзина ({itemCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Левая колонка: Список товаров */}
        <div className="lg:col-span-2">
          <div className="bg-card shadow-lg rounded-lg p-6 border border-border">

            {itemCount === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground text-lg mb-4">
                  Ваша корзина пуста.
                </p>
                <Link href="/catalog">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Перейти в каталог
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                {cartItems.map(item => (
                  <CartItemRow key={item.id} item={item} />
                ))}

                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    Очистить корзину
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Итог и Оформление */}
        <div className="lg:col-span-1">
          <div className="bg-card shadow-lg rounded-lg p-6 border border-border sticky top-20">
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b pb-3 dark:border-border">
              Сводка заказа
            </h2>

            <div className="flex justify-between text-lg mb-2">
              <span className="text-muted-foreground">Количество товаров:</span>
              <span className="font-semibold text-foreground">{itemCount}</span>
            </div>

            <div className="flex justify-between text-2xl font-extrabold mt-4 pt-4 border-t dark:border-border">
              <span className="text-foreground">ИТОГО:</span>
              <span className="text-primary">{formatPrice(totalAmount)}</span>
            </div>

            <Button
              onClick={() => {
                router.replace('checkout');
                handleCheckout()
              }}
              className="w-full mt-6 py-6 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold"
              disabled={itemCount === 0 || loading}
            >
              {loading ? 'Обработка...' : 'Оформить заказ'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
});

export default CartPage;