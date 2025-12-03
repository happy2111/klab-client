export default function TrendingNow() {
  const items = [
    { img: "/images/TrendingNow.png", name: "VELVET ARMCHAIR" },
    { img: "/images/TrendingNow2.png", name: "CERAMIC TABLE LAMP" },
    { img: "/images/TrendingNow3.png", name: "MARBLE COFFEE TABLE" },
    { img: "/images/TrendingNow4.png", name: "DECORATIVE MIRROR" },
    { img: "/images/TrendingNow5.png", name: "TEXTURED THROW PILLOW" },
    { img: "/images/TrendingNow6.png", name: "BOTANICAL WALL ART" },
    { img: "/images/TrendingNow7.png", name: "WOVEN AREA RUG" },
    { img: "/images/TrendingNow8.png", name: "CRYSTAL CHANDELIER" },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Trending Now
        </h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Most popular items this season
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
          {items.map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4 bg-muted">
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full aspect-square bg-muted border-2 border-dashed border-border rounded-xl" />
                )}
              </div>

              <p className="text-sm uppercase tracking-wider font-medium text-foreground/80 group-hover:text-foreground transition">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}