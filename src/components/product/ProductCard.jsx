"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, MessageSquare, ShoppingCart } from 'lucide-react';
import {observer} from "mobx-react-lite"; // Импортируем ShoppingCart

export const ProductCard = observer(({
                              id,
                              name,
                              description,
                              price,
                              photo,
                              category,
                              onClick,
                              onChat,
                              seller,
                              className,
                              onAddToCart,
                            }) => {
  const sellerName = seller?.name || (seller?.email ? seller.email.split('@')[0] : 'Продавец');
  const sellerId = seller?.id;

  const productData = {
    id,
    name,
    price,
    photo,
  };

  return (
    <Card
      className={cn(
        "w-full max-w-xs py-0 pb-6 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative w-full h-60 bg-gray-100 dark:bg-white/10">
        {photo ? (
          <img
            // Исправлена проблема с корневым путем, если он был
            src={process.env.NEXT_PUBLIC_API_URL +"/" + photo} // Использование переменной окружения
            alt={name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Rasm yo‘q
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-black dark:text-white text-lg font-semibold line-clamp-1">
          {name}
        </CardTitle>

        {category && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {category}
          </p>
        )}
      </CardHeader>

      <CardContent>
        {description && (
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3 py-1 px-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300">
          <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span className="font-medium truncate" title={sellerName}>
            Sotuvchi: {sellerName}
          </span>
        </div>

        <p className="text-blue-600 font-bold text-xl">
          {price} so&apos;m
        </p>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-0">

        <div className="flex gap-2 w-full">

          <Button
            variant="outline"
            className="flex-grow hover:text-primary border-blue-600 text-blue-600 hover:bg-blue-600/30 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
            onClick={onAddToCart ? () => onAddToCart(productData) : () => console.log('Add to cart:', productData.id)}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>

          {/* Кнопка Sotib olish (Купить) */}
          <Button
            className="flex-grow-[3] bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onClick}
          >
            Savatga o&apos;tish
          </Button>

        </div>


        {/* Кнопка Чата */}
        {sellerId && (
          <Button
            variant="outline"
            className=" w-full flex-grow hover:text-primary border-blue-600 text-blue-600 hover:bg-blue-600/30 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
            onClick={onChat ? () => onChat(sellerId) : () => console.log('Chat with:', sellerId)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Написать продавцу
          </Button>
        )}
      </CardFooter>
    </Card>
  );
})