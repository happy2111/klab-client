import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {Package, ShoppingBag} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {profileStore} from "@/stores/profile.store";
import {observer} from "mobx-react-lite";

const ProfileProducts = ({products}) => {
  return (
    <>
      {products.length > 0 && (
        <Card className="w-full  mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <ShoppingBag className="h-7 w-7 text-green-600" />
              Мои товары ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block border rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-48 group-hover:opacity-90 transition-opacity">
                    {product.images?.[0] ? (
                      <img
                        src={"https://klab-server.onrender.com/" + product.photo}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white dark:bg-black/20">
                    <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {product.price.toLocaleString()} сум
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.stock || 0} dona
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full"
            >
              <Link href="/sell">
                + Добавить первый товар
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {products.length === 0 && profileStore.profile?.role === 'SELLER' && (
        <Card className="w-full max-w-2xl mx-auto mt-8 text-center py-12">
          <Package className="h-20 w-20 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">У вас пока нет товаров</p>
          <Button
            asChild
            className="mt-6"
          >
            <Link href="/sell">
              Добавить первый товар
            </Link>
          </Button>
        </Card>
      )}
    </>
  )
}
export default observer(ProfileProducts)
