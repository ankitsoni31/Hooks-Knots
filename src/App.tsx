import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Category from "@/pages/Category";
import Shop from "@/pages/Shop";
import Contact from "@/pages/Contact";
import CustomOrders from "@/pages/CustomOrders";
import ScrollToTop from "@/components/layout/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F8F6F2] overflow-x-hidden flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:categoryId" element={<Category />} />
            <Route path="/custom-orders" element={<CustomOrders />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
