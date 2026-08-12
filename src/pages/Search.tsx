import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import api from "@/services/api";
import type { ApiProduct, ApiPaginatedResponse } from "@/types/api";
import ProductCard from "@/components/ui/ProductCard";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }
      
      try {
        setIsLoading(true);
        const res = await api.get<{ data: ApiPaginatedResponse<ApiProduct> }>(`/products?search=${encodeURIComponent(query)}&limit=100`);
        setProducts(res.data.data.items);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);

  return (
    <div className="pt-24 pb-16 md:pt-28 md:pb-20 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-sm border border-[#DCCFC0]/30 mb-4"
          >
            <SearchIcon className="w-6 h-6 text-[#C89B3C]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight mb-2"
          >
            Search Results
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-[#5A5A5A] font-sans"
          >
            {query ? (
              <>Showing results for "<span className="font-semibold text-[#1F2937]">{query}</span>"</>
            ) : (
              "Please enter a search term"
            )}
          </motion.p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-10 h-10 text-[#C89B3C] animate-spin" />
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && query && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && query && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-[#DCCFC0]/20 shadow-sm max-w-3xl mx-auto"
          >
            <SearchIcon className="w-12 h-12 text-[#DCCFC0] mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1F2937] mb-2">No products found</h3>
            <p className="text-[#5A5A5A] font-sans mb-6">We couldn't find anything matching "{query}". Try different keywords.</p>
            <Link to="/#categories" className="inline-block px-8 py-3 bg-[#1F2937] text-white font-semibold rounded-xl hover:bg-[#C89B3C] transition-colors font-sans shadow-sm">
              Explore Collections
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
