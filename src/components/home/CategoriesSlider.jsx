// src/components/CategoriesSlider.jsx  ← to‘liq shuni qo‘y

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoriesSlider() {
  const categories = [
    { name: "New",            img: "/images/featured.png" },
    { name: "Rugs",           img: "/images/featured2.png" },
    { name: "Furniture",      img: "/images/featured3.png" },
    { name: "Outdoor",        img: "/images/featured4.png" },
    { name: "Lighting",       img: "/images/featured5.png" },
    { name: "Couture",        img: "/images/featured6.png" },
    { name: "Pillows & Decor",img: "/images/featured7.png" },
    { name: "Sale",           img: "/images/featured8.png" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Sarlavha */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-800">Holiday hosting made easy.</h2>
          <p className="text-gray-600 mt-2">Discover our curated collections</p>
        </div>

        {/* Kategoriyalar grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="text-center group cursor-pointer">
              <div className="overflow-hidden rounded-xl bg-white shadow-md">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <p className="mt-4 text-lg font-medium text-gray-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}