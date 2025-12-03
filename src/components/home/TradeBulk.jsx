export default function TradeBulk() {
  return (
    <section className="py-24 md:py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-0 items-stretch min-h-screen md:min-h-0">

          {/* LEFT SIDE — Text Block */}
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left px-8 md:px-16 lg:px-24 xl:px-32 py-16">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-10 tracking-tight leading-tight">
              Trade & Bulk
            </h2>

            <div className="max-w-lg space-y-6 text-primary-foreground/90">
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                Have a project? We have a plan.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                We'll create a seamless shopping experience to help bring your vision to life.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                Reach out for exclusive trade and bulk order discounts for your business, client, or event.
              </p>
            </div>

            {/* Outlined Button — modern & elegant */}
            <button className="mt-12 border-2 border-primary-foreground/80 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:border-primary-foreground px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm shadow-xl hover:shadow-2xl">
              LEARN MORE
            </button>
          </div>

          {/* RIGHT SIDE — Image with hover zoom */}
          <div className="relative overflow-hidden h-96 md:h-full">
            <img
              src="/images/TradeBulk.png"
              alt="Luxury Interior"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
            {/* Optional subtle overlay for better text contrast in light mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}