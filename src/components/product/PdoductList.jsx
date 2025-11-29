"use client";


import { observer } from "mobx-react-lite";
import { productStore } from "@/stores/product.store";
import {ProductCard} from "@/components/product/ProductCard";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {chatStore} from "@/stores/chat.store";

function ProductList() {
  const router = useRouter();

  // Функция для открытия чата
  const handleChatClick = (sellerId) => {
    // 1. Открываем чат в MobX Store (создание/загрузка)
    chatStore.openChat(sellerId);
    // 2. Перенаправляем пользователя на страницу чатов
    router.push('/chat');
  };

  useEffect(() => {
    productStore.getAll();
  }, []);


  if (productStore.loading)
    return <p className="text-center text-xl text-blue-600">Yuklanmoqda...</p>;

  if (!productStore.products.length)
    return <p className="text-center text-lg text-gray-500">Hozircha mahsulotlar yo‘q</p>;

  return (
    <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto">
      {productStore.products.map(p => (
        <ProductCard
          key={p.id}
          id={p.id}
          name={p.name}
          description={p.description}
          price={p.price}
          photo={p.photo}
          category={p.category?.name}
          seller={p.seller}
          onClick={() => console.log("Buy:", p.id)}
          onChat={handleChatClick}
        />
      ))}
    </div>
  );
}

export default observer(ProductList);
