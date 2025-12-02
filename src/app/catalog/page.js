import ProductList from "@/components/product/PdoductList";
import {ProductFilterBar} from "@/components/product/ProductFilterBar";

export default function Catalog () {
  return (
    <div className="flex mt-6 min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className=" min-h-screen w-full container">
        <ProductFilterBar/>
        <ProductList/>
      </main>
    </div>
  );
}
