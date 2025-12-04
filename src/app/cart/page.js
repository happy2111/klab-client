'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import {  ShoppingCart } from 'lucide-react';

import { cartStore } from '@/stores/сart.store';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import {useRouter} from "next/navigation";
import  CartItemRow  from '@/components/cart/CartItemRow';

import {formatPrice} from "@/lib/formatPrice";


const CartPage = observer(() => {
  const { cartItems, totalAmount, checkout, itemCount, loading, clearCart } = cartStore;
  const router = useRouter();
  const handleCheckout = async () => {
    await checkout();
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-extrabold text-foreground mb-6 flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-primary" />
        Ваша корзина ({itemCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

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