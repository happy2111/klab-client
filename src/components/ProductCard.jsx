// src/components/ProductCard.jsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import process
  from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";


export function ProductCard({
                              id,
                              name,
                              description,
                              price,
                              photo,
                              category,
                              onClick, // optional (Купить)
                              seller, // Объект продавца { id, name, ... }
                              onChat, // optional (Чат с продавцом)
                              className
                            }) {
  const sellerName = seller?.name || (seller?.email ? seller.email.split('@')[0] : 'Продавец');
  const sellerId = seller?.id;


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
          // Вместо `fill` в `img` используем `w-full h-full` с `object-cover`
          <img
            src={"https://klab-server.onrender.com/" + photo}
            alt={name}
            // ⚠️ Убедитесь, что ваш Next.js Image компонент (если вы его используете)
            // настроен для внешних источников. Здесь используется обычный <img>.
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Rasm yo‘q
          </div>
        )}
      </div>

      {/* Product Info */}
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

        {/* 1. ✅ Красивое отображение продавца */}
        <div className="flex items-center gap-2 mb-3 py-1 px-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300">
          <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span className="font-medium truncate" title={sellerName}>
            Sotuvchi: {sellerName}
          </span>
        </div>

        {/* 2. ✅ Цена */}
        <p className="text-blue-600 font-bold text-xl">
          {price} so'm
        </p>
      </CardContent>

      {/* Footer - кнопки */}
      <CardFooter className="flex flex-col space-y-2 pt-0">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onClick}
        >
          Sotib olish
        </Button>

        {/* 3. ✅ Кнопка Чата */}
        {sellerId && (
          <Button
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
            // Если onChat определен, используем его, иначе просто консоль
            onClick={onChat ? () => onChat(sellerId) : () => console.log('Chat with:', sellerId)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Написать продавцу
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}