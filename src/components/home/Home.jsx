import React from 'react'
import Hero from "@/components/home/Hero";
import CategoriesSlider from "@/components/home/CategoriesSlider";
import Navbar from "@/components/home/Navbar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HolidayBanner from "@/components/home/HolidayBanner";
import DailyDeals from "@/components/home/DailyDeals";
import TrendingNow from "@/components/home/TrendingNow";
import TradeBulk from "@/components/home/TradeBulk";
import BlogSection from "@/components/home/BlogSection";
import Footer from "@/components/home/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <CategoriesSlider />
      <Navbar />
      <FeaturedProducts />
      <HolidayBanner />
      <DailyDeals />
      <TrendingNow />
      <TradeBulk />
      <BlogSection />
      <Footer />
    </div>
  )
}
export default Home
