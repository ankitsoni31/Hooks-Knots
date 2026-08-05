import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import ShopByCategory from "@/components/sections/ShopByCategory";
import BestSellers from "@/components/sections/BestSellers";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import CustomerReviews from "@/components/sections/CustomerReviews";
import InstagramGallery from "@/components/sections/InstagramGallery";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

function App() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <FeaturedCollection />
        <ShopByCategory />
        <BestSellers />
        <WhyChooseUs />
        <CustomerReviews />
        <InstagramGallery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
