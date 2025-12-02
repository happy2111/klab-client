'use client';

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Предполагается, что эти сторы находятся в '@/stores/'
import { cartStore } from '@/stores/сart.store';
import { authStore } from '@/stores/auth.store';

// Предполагаем наличие компонентов UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Вспомогательная функция для форматирования цены
const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

// --- Основной компонент ---

const CheckoutPage = observer(() => {
  const router = useRouter();
  const { cartItems, totalAmount, checkout, loading } = cartStore;
  const user = authStore.user;

  // --- Состояние формы ---
  const [formData, setFormData] = useState({
    name: user?.name || user?.email || '', // Используем имя или почту из authStore
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    comments: '',
  });

  // Если корзина пуста, перенаправляем на главную или в каталог
  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      router.replace('/cart'); // Или '/catalog'
    }
  }, [cartItems.length, loading, router]);

  // Обновляем форму при изменении user (например, после инициализации authStore)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || user.email || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Фейковая валидация
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert("Пожалуйста, заполните все обязательные поля (Имя, Email, Телефон, Адрес).");
      return;
    }

    // Вызов MobX action для оформления заказа
    const success = await checkout();

    if (success) {
      // После успешного оформления, перенаправляем на страницу подтверждения
      router.push('/'); // Или '/order-success'
    }
  };

  // Если корзина пуста (идет перенаправление), показываем заглушку
  if (cartItems.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold text-foreground">Перенаправление...</h1>
        <p className="text-muted-foreground mt-2">Ваша корзина пуста.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-extrabold text-foreground mb-6 flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-primary" />
        Оформление заказа
      </h1>

      <Link href="/cart" className="flex items-center gap-1 text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Вернуться в корзину
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 1. Левая колонка: Форма контактов и доставки */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Данные для доставки</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Имя и Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Полное имя *</Label>
                    <Input id="name" type="text" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                {/* Телефон и Адрес */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес доставки *</Label>
                    <Input id="address" type="text" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>

                {/* Комментарии */}
                <div className="space-y-2">
                  <Label htmlFor="comments">Комментарии к заказу (необязательно)</Label>
                  <Textarea id="comments" value={formData.comments} onChange={handleChange} rows={3} />
                </div>

                {/* Кнопка оформления (внутри формы) */}
                <Button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold"
                  disabled={cartItems.length === 0 || loading}
                >
                  {loading ? 'Обработка...' : `Подтвердить заказ на ${formatPrice(totalAmount)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 2. Правая колонка: Сводка заказа */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-20">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">

              {/* Список товаров */}
              <div className="border-b dark:border-border pb-3 max-h-60 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span className="text-muted-foreground truncate pr-2">
                      {item.name} (x{item.quantity})
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Итоги */}
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Подытог:</span>
                <span className="font-semibold text-foreground">{formatPrice(totalAmount)}</span>
              </div>

              <div className="flex justify-between text-2xl font-extrabold pt-2 border-t dark:border-border">
                <span className="text-foreground">ВСЕГО К ОПЛАТЕ:</span>
                <span className="text-primary">{formatPrice(totalAmount)}</span>
              </div>

              <p className="text-xs text-muted-foreground pt-3">
                * Нажимая "Подтвердить заказ", вы соглашаетесь с условиями обслуживания.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
});

export default CheckoutPage;