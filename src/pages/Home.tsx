import Hero from "@/components/sections/Hero";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import ShopByCategory from "@/components/sections/ShopByCategory";
import BestSellers from "@/components/sections/BestSellers";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import MeetFounder from "@/components/sections/MeetFounder";
import CustomerReviews from "@/components/sections/CustomerReviews";
import InstagramGallery from "@/components/sections/InstagramGallery";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollection />
      <ShopByCategory />
      <BestSellers />
      <WhyChooseUs />
      <MeetFounder />
      <CustomerReviews />
      <InstagramGallery />
      <FAQ />
      <Contact />
    </>
  );
}
