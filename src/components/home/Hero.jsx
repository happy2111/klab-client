"use client"

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from "next/link";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      img: "/images/hero.png",
      title: "Modern Comfort",
      subtitle: "Discover contemporary furniture and decor",
      logoText: "OSMON"
    },
    {
      img: "/images/hero1.png",
      title: "Timeless Elegance",
      subtitle: "Curated collections for every room",
      logoText: "OSMON"
    },
    {
      img: "/images/hero2.png",
      title: "Outdoor Living",
      subtitle: "Elevate your space with style and comfort",
      logoText: "OSMON"
    },
    {
      img: "/images/hero3.png",
      title: "Workspace Wonders",
      subtitle: "Inspiring designs for productive environments",
      logoText: "OSMON"
    }
  ];
  
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Har bir slayd */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Rasm */}
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Matnlar */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-cyan-400 text-lg md:text-xl font-light tracking-widest mb-6">
              {slide.logoText}
            </h3>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white tracking-wider mb-6 leading-tight">
              {slide.title}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl">
              {slide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href={'/catalog'} className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-xl">
                Shop Collection
              </Link>
              <Link href={'/catalog'} className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition">
                Explore More
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Chap-o‘ng strelkalar */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/40 transition z-10"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/40 transition z-10"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Nuqtalar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-300 ${
              i === currentSlide 
                ? "w-12 h-3 bg-white rounded-full" 
                : "w-3 h-3 bg-white/60 rounded-full hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}