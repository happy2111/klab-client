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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl text-gray-800 mb-4">
          Trending Now
        </h2>
        <p className="text-gray-600 mb-12">Most popular items this season</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4">
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64" />
                )}
              </div>
              <p className="text-sm uppercase tracking-wider text-gray-700 font-medium">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}