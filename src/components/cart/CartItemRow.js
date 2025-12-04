import {observer} from "mobx-react-lite";
import {cartStore} from "@/stores/сart.store";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import React from "react";
import { Minus, Plus, Trash2 } from 'lucide-react';
import {Input} from "@/components/ui/input";
import {formatPrice} from "@/lib/formatPrice";



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

      <div className="flex items-center gap-4 w-1/2">
        <img
          src={"https://klab-server.onrender.com/" + photo || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0533%2F2089%2Ffiles%2Fplaceholder-images-product-4_large.png%3Fv%3D1530129360&f=1&nofb=1&ipt=2377d1403541ca8fc8d1464f10e8b9b90ca3d8b662f498035f8715b10f03afeb'}
          alt={name}
          className="w-16 h-16 object-cover rounded-md border border-border"
        />
        <span className="font-semibold text-foreground">{name}</span>
      </div>

      <div className="flex items-center max-sm:absolute top-0 left-1/2 gap-2 w-1/4 justify-center">
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

export default CartItemRow;