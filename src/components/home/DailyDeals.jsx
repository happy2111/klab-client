import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DailyDeals() {
  // Umumiy taymer (masalan, 24 soatdan boshlanadi)
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-12-31") - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
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

  // Mobil uchun 1 ta, planshet 2 ta, desktop 4 ta ko‘rsatish
  const visibleCount = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl text-gray-800 mb-2">Daily Deals</h2>
        <p className="text-gray-600 mb-8">Limited time offers - Hurry before they're gone</p>

        {/* Umumiy taymer */}
        <div className="text-3xl font-mono text-red-600 mb-10">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / visibleCount)}%)` }}
            >
              {deals.map((deal, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 px-4`}
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative">
                      <img src={deal.img} alt={deal.title} className="w-full h-64 object-cover" />
                      {/* Har bir kartada alohida taymer */}
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                        {String(Math.floor(Math.random()*23)).padStart(2,'0')}:
                        {String(Math.floor(Math.random()*59)).padStart(2,'0')}:
                        {String(Math.floor(Math.random()*59)).padStart(2,'0')}
                      </div>
                    </div>
                    <div className="p-6 text-left">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        {deal.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-2xl font-bold text-red-600">${deal.new}</span>
                        <span className="text-lg text-gray-500 line-through">${deal.old}</span>
                      </div>
                      <button className="mt-4 w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strelkalar */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-r shadow-lg hover:bg-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-l shadow-lg hover:bg-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Nuqtalar */}
          <div className="flex justify-center gap-2 mt-8">
            {deals.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition ${
                  i === currentSlide ? 'bg-gray-800 w-8' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}