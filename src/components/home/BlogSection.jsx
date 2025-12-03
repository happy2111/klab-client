export default function BlogSection() {
  const posts = [
    {
      img: "/images/BlogSection.png",
      title: "TOP 10 INTERIOR DESIGN TRENDS FOR 2025",
      desc: "Discover the latest trends transforming modern homes, from earthy tones to sustainable materials.",
    },
    {
      img: "/images/BlogSection2.png",
      title: "HOW TO CHOOSE THE PERFECT RUG FOR ANY ROOM",
      desc: "Expert tips on selecting the right size, style, and material to elevate your space.",
    },
    {
      img: "/images/BlogSection3.png",
      title: "5 EASY WAYS TO REFRESH YOUR HOME DECOR",
      desc: "Give your living space a new look with these simple and affordable home decor tips.",
    },
  ];

  return (
    <section className="py-20 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          From Our Blog
        </h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Stories, tips, and inspiration for your home
        </p>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {posts.map((post, i) => (
            <article
              key={i}
              className="group cursor-pointer overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-border"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-muted">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {post.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}