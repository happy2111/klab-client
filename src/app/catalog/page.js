import ProductList from "@/components/product/PdoductList";
import {ProductFilterBar} from "@/components/product/ProductFilterBar";

export default function Catalog () {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" min-h-screen w-full container">
        <ProductFilterBar/>
        <ProductList/>
      </main>
    </div>
  );
}
