'use client';
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const hide = pathname.startsWith('/chat');

  if (hide) return null;

  return (
    <footer className="bg-[var(--background)] pt-16 pb-8 mt-10 text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* 1. CUSTOMER SERVICE */}
          <div>
            <h4 className="font-bold mb-5 uppercase tracking-wider text-[var(--foreground)]">
              Customer Service
            </h4>
            <ul className="space-y-3 text-[var(--muted-foreground)] text-sm">
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Contact Us</li>
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Track My Order</li>
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Shipping & Returns</li>
            </ul>
          </div>

          {/* 2. MY ACCOUNT */}
          <div>
            <h4 className="font-bold mb-5 uppercase tracking-wider text-[var(--foreground)]">
              My Account
            </h4>
            <ul className="space-y-3 text-[var(--muted-foreground)] text-sm">
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Create an Account</li>
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Account Login</li>
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Wishlist</li>
            </ul>
          </div>

          {/* 3. OUR COMPANY */}
          <div>
            <h4 className="font-bold mb-5 uppercase tracking-wider text-[var(--foreground)]">
              Our Company
            </h4>
            <ul className="space-y-3 text-[var(--muted-foreground)] text-sm">
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Our Story</li>
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Designers & Trade</li>
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Partnerships</li>
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Reviews</li>
              <li className="hover:text-[var(--foreground)] cursor-pointer transition">Our Blog</li>
            </ul>
          </div>

          {/* 4. VIP + FOLLOW + CONTACT */}
          <div className="space-y-8">
            {/* VIP */}
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-base text-[var(--foreground)]">
                Join our VIP list for exclusive offers, new arrivals & more.
              </h4>
              <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
                Enjoy $50 off your first purchase of $250 or more when you sign up to receive emails.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-3 border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)/0.5] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm rounded-[var(--radius)]"
                />
                <button className="bg-[var(--primary)] text-[var(--primary-foreground)] px-8 py-3 hover:bg-[var(--primary)/0.9] transition whitespace-nowrap rounded-[var(--radius)]">
                  SIGN UP
                </button>
              </div>
            </div>

            {/* FOLLOW US */}
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-[var(--foreground)]">
                Follow Us
              </h4>
              <div className="flex gap-5">
                {/* Instagram */}
                <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.469h3.047v-2.638c0-3.001 1.784-4.662 4.506-4.662 1.308 0 2.676.26 2.676.26v2.943h-1.504c-1.486 0-1.95.923-1.95 1.867v2.23h3.328l-.532 3.469h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-16.87l8.764-10.003-7.827-8.947h-3.308l7.227-8.26-8.502-11.24h16.87l-8.764 10.003z"/>
                  </svg>
                </a>
                {/* Pinterest */}
                <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0c-6.627 0-12.017 5.39-12.017 12.017 0 5.073 3.167 9.395 7.617 11.173-.105-.949-.199-2.403.041-3.439.216-.935 1.418-5.947 1.418-5.947s-.362-.725-.362-1.797c0-1.684.977-2.941 2.195-2.941 1.035 0 1.536.777 1.536 1.709 0 1.041-.661 2.594-.999 4.034-.281 1.205.605 2.188 1.791 2.188 2.149 0 3.799-2.266 3.799-5.531 0-2.896-2.082-4.92-5.057-4.92-3.441 0-5.462 2.578-5.462 5.242 0 1.039.399 2.154.898 2.758.098.119.112.224.085.346-.086.384-.279 1.228-.317 1.4-.049.221-.162.267-.374.161-1.391-.699-2.261-2.886-2.261-4.643 0-3.777 2.744-7.243 7.917-7.243 4.157 0 7.39 2.958 7.39 6.914 0 4.127-2.606 7.46-6.229 7.46-1.219 0-2.367-.633-2.761-1.379 0 0-.605 2.307-.753 2.872-.274 1.047-1.124 2.361-1.672 3.158.463.143 1.258.224 1.988.224 6.627 0 12.017-5.39 12.017-12.017 0-6.627-5.39-12.017-12.017-12.017z"/>
                  </svg>
                </a>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-3">
                Share your style with <span className="font-semibold">#osmon</span>
              </p>
            </div>

            {/* CONTACT US */}
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-[var(--foreground)]">
                Contact Us
              </h4>
              <div className="space-y-3 text-sm text-[var(--muted-foreground)]">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884l10 6.667 9.997-6.667v-12.667l-9.997 6.667-10-6.667z"/>
                  </svg>
                  <span>info@osmon.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 18.354v-1.708c0-4.156-3.372-7.528-7.528-7.528h-1.944c-4.156 0 7.528-3.372 7.528-7.528v-1.708c0-.552-.448-1-1-1h-12c-.552 0-1 .448-1 1v1.708c0 4.156 3.372 7.528 7.528 7.528h1.944c-4.156 0-7.528 3.372-7.528 7.528v1.708c0 .552.448 1 1 1h12c.552 0 1-.448 1-1z"/>
                  </svg>
                  <div>
                    <div>516-945-8000</div>
                    <div className="text-xs">Monday – Friday 9am – 4pm EST</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h-16c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h16c1.104 0 2-.896 2-2v-12c0-1.104-.896-2-2-2zm0 2v.5l-8 5-8-5v-.5h16zm0 3.5l-8 5-8-5v8h16v-8z"/>
                  </svg>
                  <span>Live Chat Assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] text-center">
          <h2 className="text-3xl font-bold mb-2 text-[var(--foreground)]">OSMON</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Copyright © 2025 by OSMON.
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mb-6">
            osmon.com has a Shopper Approved rating of 4.8/5 based on 2832 ratings and reviews.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-[var(--muted-foreground)]">
            {["Terms of Use", "Privacy", "Site Index", "Ad Choices", "Cookie Settings", "Do Not Sell My Info"].map((item, i, arr) => (
              <span key={i}>
                <a href="#" className="hover:text-[var(--foreground)] transition">
                  {item}
                </a>
                {i < arr.length - 1 && <span className="mx-2">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}