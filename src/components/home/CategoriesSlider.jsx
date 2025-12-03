// src/components/CategoriesSlider.jsx

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoriesSlider() {
  const categories = [
    { name: "New",             img: "/images/featured.png" },
    { name: "Rugs",            img: "/images/featured2.png" },
    { name: "Furniture",       img: "/images/featured3.png" },
    { name: "Outdoor",         img: "/images/featured4.png" },
    { name: "Lighting",        img: "/images/featured5.png" },
    { name: "Couture",         img: "/images/featured6.png" },
    { name: "Pillows & Decor", img: "/images/featured7.png" },
    { name: "Sale",            img: "/images/featured8.png" },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Holiday hosting made easy.
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Discover our curated collections
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group cursor-pointer text-center"
            >
              <div className="relative overflow-hidden rounded-xl bg-card shadow-md ring-1 ring-border hover:ring-primary/50 transition-all duration-300">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Optional overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <p className="mt-5 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}