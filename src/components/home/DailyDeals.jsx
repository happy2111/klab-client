'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DailyDeals() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-12-31") - +new Date();
    if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateVisible = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1024) setVisibleCount(4);
      else if (window.innerWidth >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const deals = [
    { img: "/images/dailydeals.png", title: "VINTAGE LEATHER WATCH", old: "99.99", new: "59.99" },
    { img: "/images/dailydeals1.png", title: "HANDCRAFTED CERAMIC VASE", old: "34.99", new: "24.99" },
    { img: "/images/dailydeals2.png", title: "SMART HOME HUB", old: "149.00", new: "99.00" },
    { img: "/images/dailydeals3.png", title: "RETRO BLUETOOTH SPEAKER", old: "75.50", new: "55.50" },
    { img: "/images/dailydeals4.png", title: "MODERN TABLE LAMP", old: "209.00", new: "99.00" },
    { img: "/images/dailydeals5.png", title: "DESIGNER THROW PILLOW", old: "89.00", new: "45.00" },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % deals.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + deals.length) % deals.length);

  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          Daily Deals
        </h2>
        <p className="text-muted-foreground text-lg mb-10">
          Limited time offers — Hurry before they're gone
        </p>

        {/* Global Countdown */}
        <div className="inline-block px-8 py-4 bg-destructive/10 rounded-xl border border-destructive/20">
          <div className="text-4xl md:text-5xl font-mono font-bold text-destructive tracking-wider">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / visibleCount)}%)` }}
            >
              {deals.map((deal, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="bg-card rounded-xl shadow-xl overflow-hidden border border-border hover:shadow-2xl transition-shadow">
                    <div className="relative aspect-[4/3] bg-muted">
                      <img
                        src={deal.img}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md text-sm font-bold shadow-lg">
                        SALE
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                        {deal.title}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-primary">
                          ${deal.new}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          ${deal.old}
                        </span>
                      </div>

                      <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-card transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-card transition"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: Math.ceil(deals.length / visibleCount) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i * visibleCount)}
                className={`transition-all duration-300 rounded-full ${
                  i === Math.floor(currentSlide / visibleCount)
                    ? 'bg-primary w-10 h-3'
                    : 'bg-muted-foreground/40 w-3 h-3'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}