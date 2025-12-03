import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext, PaginationEllipsis,
} from "@/components/ui/pagination";

export default function FeaturedProducts() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const products = [
    { img: "/images/featured.png", name: "VINTAGE LEATHER WATCH", price: "89.99" },
    { img: "/images/featured2.png", name: "HANDCRAFTED CERAMIC VASE", price: "34.99" },
    { img: "/images/featured3.png", name: "MODERN TABLE LAMP", price: "149.00" },
    { img: "/images/featured4.png", name: "ORGANIC GREEN TEA SET", price: "25.00" },
    { img: "/images/featured5.png", name: "MINIMALIST WALL CLOCK", price: "75.50" },
    { img: "/images/featured6.png", name: "SCANDINAVIAN CHAIR", price: "189.99" },
    { img: "/images/featured7.png", name: "DESIGNER THROW PIL  LOW", price: "45.00" },
    { img: "/images/featured8.png", name: "ARTISAN COFFEE MUG", price: "28.50" },
  ];

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(4);
      else if (window.innerWidth >= 640) setItemsPerPage(2);
      else setItemsPerPage(1);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentPage = Math.floor(currentSlide / itemsPerPage) + 1;

  const goToPage = (page) => {
    setCurrentSlide((page - 1) * itemsPerPage);
  };

  const prevPage = () => currentPage > 1 && goToPage(currentPage - 1);
  const nextPage = () => currentPage < totalPages && goToPage(currentPage + 1);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hand-picked items just for you
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * (100 / itemsPerPage)}%)` }}
            >
              {products.map((product, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-3 sm:px-4"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div className="group cursor-pointer">
                    <div className="overflow-hidden rounded-xl bg-card shadow-lg ring-1 ring-border hover:ring-primary/40 transition-all duration-300">
                      <div className="aspect-[3/4] bg-muted/50 overflow-hidden">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
                        {product.name}
                      </p>
                      <p className="mt-3 text-2xl font-bold text-foreground">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-all z-10"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* shadcn/ui Pagination */}
        <div className="flex justify-center mt-16">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={prevPage}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => goToPage(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={nextPage}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
}