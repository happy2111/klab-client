import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
export default function FeaturedProducts() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    { img: "/images/featured.png", name: "VINTAGE LEATHER WATCH", price: "89.99" },
    { img: "/images/featured2.png", name: "HANDCRAFTED CERAMIC VASE", price: "34.99" },
    { img: "/images/featured3.png", name: "MODERN TABLE LAMP", price: "149.00" },
    { img: "/images/featured4.png", name: "ORGANIC GREEN TEA SET", price: "25.00" },
    { img: "/images/featured5.png", name: "MINIMALIST WALL CLOCK", price: "75.50" },
    { img: "/images/featured6.png", name: "SCANDINAVIAN CHAIR", price: "189.99" },
    { img: "/images/featured7.png", name: "DESIGNER THROW PILLOW", price: "45.00" },
    { img: "/images/featured8.png", name: "ARTISAN COFFEE MUG", price: "28.50" },
  ];

  // Responsive: desktop 4, tablet 2, mobile 1
  const [itemsPerPage, setItemsPerPage] = useState(4);

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
    const newSlide = (page - 1) * itemsPerPage;
    setCurrentSlide(newSlide);
  };

  const nextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl text-gray-800">
            Featured Products
          </h2>
          <p className="text-gray-600 mt-3">Hand-picked items just for you</p>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * (100 / itemsPerPage)}%)` }}
          >
            {products.map((p, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <div className="group cursor-pointer">
                  <div className="overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm uppercase tracking-wider text-gray-600">
                      {p.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      ${p.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chap-o‘ng strelkalar */}
          <button
            onClick={prevPage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition z-10"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextPage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition z-10"
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* shadcn/ui Pagination */}
        <div className="flex justify-center mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={prevPage}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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