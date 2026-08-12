import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import api from "@/services/api";
import type { ApiProduct } from "@/types/api";
import ProductCard from "@/components/ui/ProductCard";
import type { AxiosResponse } from "axios";

export default function Wishlist() {
  const { items: wishlistIds } = useWishlist();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch products one by one, or if there's a batch endpoint use it.
        const productPromises = wishlistIds.map(id => api.get<{ data: ApiProduct }>(`/products/${id}`));
        const responses = await Promise.allSettled(productPromises);

        const fetchedProducts = responses
          .filter((res): res is PromiseFulfilledResult<AxiosResponse<{ data: ApiProduct }>> => res.status === 'fulfilled')
          .map(res => res.value.data.data);

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to load wishlist products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-[#F8F6F2]">
        <Loader2 className="w-12 h-12 text-[#C89B3C] animate-spin" />
      </div>
    );
  }

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
            <Heart className="w-6 h-6 text-[#C89B3C] fill-[#C89B3C]/10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-2"
          >
            Your Wishlist
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-[#5A5A5A] font-sans"
          >
            Items you've loved and saved for later.
          </motion.p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-[#DCCFC0]/20 shadow-sm max-w-3xl mx-auto"
          >
            <Heart className="w-12 h-12 text-[#DCCFC0] mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1F2937] mb-2">Your wishlist is empty</h3>
            <p className="text-[#5A5A5A] font-sans mb-6">Explore our collections and find something you love!</p>
            <Link to="/#categories" className="inline-block px-8 py-3 bg-[#1F2937] text-white font-semibold rounded-xl hover:bg-[#C89B3C] transition-colors font-sans shadow-sm">
              Explore Collections
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
