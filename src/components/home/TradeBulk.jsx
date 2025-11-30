export default function TradeBulk() {
  return (
    <section className="py-24 md:py-32 bg-stone-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-0 items-stretch min-h-screen md:min-h-0">

          {/* CHAP TARAF – TO‘G‘RI JIGARRANG BLOK */}
          <div className="bg-stone-300 flex flex-col justify-center items-center md:items-start text-center md:text-left px-9 md:px-16 lg:px-24 xl:px-32 py-16">
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-10 tracking-tight">
              Trade & Bulk
            </h2>

            <div className="max-w-lg space-y-6 text-white">
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                Have a project? We have a plan.
              </p>
              <p className="text-base md:text-lg leading-relaxed opacity-95">
                We'll create a seamless shopping experience to help bring your vision to life.
              </p>
              <p className="text-base md:text-lg leading-relaxed opacity-90">
                Reach out for exclusive trade and bulk order discounts for your business, client, or event.
              </p>
            </div>

            {/* TUGMA – RASMDAGIDEK OQ KONTURLI */}
            <button className="mt-12 border-2 border-white text-white bg-transparent hover:bg-white hover:text-stone-700 px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg">
              LEARN MORE
            </button>
          </div>

          {/* O‘NG TARAF – RASM + HOVERDA KATTALASHADI */}
          <div className="relative overflow-hidden h-96 md:h-full">
            <img
              src="/images/TradeBulk.png"   
              alt="Luxury Interior"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>

        </div>
      </div>
    </section>
  );
}