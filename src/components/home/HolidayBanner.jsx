
export default function HolidayBanner() {
  return (
    <section className="relative h-96 md:h-screen min-h-96 flex items-center justify-center text-center overflow-hidden my-12 md:my-0">
      
      {/* Rasm konteyneri */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/HolidayBanner.png"
          alt="Good Tidings Are Coming"
          className="w-full h-full object-cover transition-transform duration-[12000ms] ease-out scale-100 
                     hover:scale-110"
        />
        {/* Qorong‘i overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hoverni faollashtiruvchi shaffof qatlam */}
      <div className="absolute inset-0 -z-10 hover:scale-110 pointer-events-none" 
           style={{ transition: 'transform 12s ease-out' }} 
      />

      {/* Matnlar */}
      <div className="px-6 max-w-4xl mx-auto z-20">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-thin text-white tracking-widest mb-6 drop-shadow-2xl">
          GOOD TIDINGS ARE COMING
        </h2>
        <p className="text-lg md:text-2xl text-white/90 mb-10 font-light max-w-3xl mx-auto">
          Festive season starts whenever the spirit moves you. Go ahead, suit your fancy.
        </p>
        <button className="border-2 border-white text-white px-14 py-5 text-lg font-medium tracking-wider hover:bg-white hover:text-black transition duration-500 rounded-full shadow-2xl">
          SHOP HOLIDAY
        </button>
      </div>

      {/* Scroll tugmasi */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-4 bg-white rounded-full mt-3"></div>
        </div>
      </div>
    </section>
  );
}