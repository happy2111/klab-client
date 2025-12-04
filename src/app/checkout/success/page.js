'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CheckCircle2, ShoppingBag, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { cartStore } from '@/stores/сart.store';
import { toast } from 'sonner';

const SuccessPage = observer(() => {
  useEffect(() => {
    if (cartStore.itemCount > 0) {
      cartStore.clearCart();
      toast.success('Корзина очищена после успешного заказа');
    }
  }, []);

  return (
    <div className="container py-16 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        {/* Большая иконка успеха с анимацией */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <CheckCircle2 className="w-32 h-32 text-green-500 animate-in fade-in zoom-in duration-700" />
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-green-500/20 animate-ping" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
          Заказ успешно оформлен!
        </h1>

        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Спасибо за ваш заказ! Мы уже начали его обработку.
          В ближайшее время с вами свяжется менеджер для подтверждения деталей.
        </p>

        <div className="bg-card border border-border rounded-lg p-8 shadow-lg mb-12">
          <div className="flex items-center justify-center gap-4 text-2xl font-semibold text-foreground">
            <ShoppingBag className="w-10 h-10 text-primary" />
            <span>Ваш заказ принят и будет доставлен в ближайшее время</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              Продолжить покупки
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/public">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Home className="mr-2 h-5 w-5" />
              На главную
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-12">
          Если у вас есть вопросы — пишите в чат или звоните по номеру в шапке сайта.
        </p>
      </div>
    </div>
  );
});

export default SuccessPage;