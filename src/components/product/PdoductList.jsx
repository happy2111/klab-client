"use client";

import { observer } from "mobx-react-lite";
import { productStore } from "@/stores/product.store";
import { cartStore } from "@/stores/сart.store";
import { ProductCard } from "@/components/product/ProductCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatStore } from "@/stores/chat2.store";

function ProductList() {
  const router = useRouter();

  const handleChatClick = (sellerId) => {
    chatStore.createAndOpenChat(sellerId);
    router.push('/chat-v2');
  };

  const handleAddToCart = (productData) => {
    cartStore.addToCart(productData);
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
          // Предполагаем, что p.photo может быть undefined,
          // и это обработано в CartStore/ProductCard.
          photo={p.photo}
          category={p.category?.name}
          seller={p.seller}
          onClick={() => router.push('/cart')}
          onChat={handleChatClick}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}

export default observer(ProductList);