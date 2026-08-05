import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { bestSellers } from "@/data/homepage";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BestSellers() {
  return (
    <section id="best-sellers" className="py-20 md:py-28 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Most Popular"
          title="Best Sellers"
          description="Our customers' favorites — the pieces that keep coming back for more."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#1F2937] text-[#1F2937] text-sm font-semibold rounded-full hover:bg-[#1F2937] hover:text-white transition-all duration-300 font-sans"
          >
            Shop All Best Sellers
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
