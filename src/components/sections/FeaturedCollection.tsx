import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";
import type { ApiProduct, ApiPaginatedResponse } from "@/types/api";

export default function FeaturedCollection() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<{ data: ApiPaginatedResponse<ApiProduct> }>('/products?featured=true&limit=4');
        setProducts(res.data.data.items);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        setError("Failed to load featured collection.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section id="featured" className="py-20 md:py-28 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Curated for You"
          title="Featured Collection"
          description="Discover our most loved handcrafted crochet pieces, each made with premium yarn and endless love."
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-[#C89B3C] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-[#5A5A5A] py-12">No featured products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="/shop"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#1F2937] text-white text-sm font-semibold rounded-full hover:bg-[#C89B3C] transition-all duration-300 font-sans"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
