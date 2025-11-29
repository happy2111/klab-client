import ProductList from "@/components/PdoductList";
import {ProductFilterBar} from "@/components/ProductFilterBar";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" min-h-screen w-full container bg-white dark:bg-black sm:items-start">
        <ProductFilterBar/>
        <ProductList/>
      </main>
    </div>
  );
}
