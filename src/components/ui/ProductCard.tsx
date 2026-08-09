import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import type { ApiProduct } from "@/types/api";

interface ProductCardProps {
  product: ApiProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Handle prices (sometimes string from DB, sometimes number)
  const price = Number(product.discount_price || product.price);
  const originalPrice = product.discount_price ? Number(product.price) : undefined;
  
  // Find primary image or fallback
  const primaryImage = product.images?.find(img => img.is_primary)?.file_path 
    || product.images?.[0]?.file_path 
    || "/images/hero-bouquet.png";

  const isOutOfStock = product.stock <= 0;

  // Mock rating since backend doesn't have reviews yet
  const rating = 4.8;
  const reviewCount = 24;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#DCCFC0]/30 ${isOutOfStock ? 'opacity-80' : ''}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F8F6F2]">
        <img
          src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + primaryImage : primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
        />

        {/* Badge */}
        {product.featured && !isOutOfStock && (
          <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase bg-[#1F2937] text-white rounded-full">
            Featured
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase bg-red-600 text-white rounded-full">
            Out of Stock
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-300 hover:scale-110 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#1F2937]"
            }`}
          />
        </button>

        {/* Quick Add Overlay */}
        <div className={`absolute inset-x-0 bottom-0 ${isOutOfStock ? '' : 'translate-y-full group-hover:translate-y-0'} transition-transform duration-500 ease-out p-4`}>
          <button 
            disabled={isOutOfStock}
            onClick={() => {
              if (isOutOfStock) return;
              addItem({
                product_id: product.id,
                name: product.name,
                price: price,
                image: primaryImage
              });
              navigate('/checkout');
            }}
            className={`w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-medium rounded-xl transition-colors duration-300 ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1F2937] hover:bg-[#C89B3C] cursor-pointer'}`}
          >
            {isOutOfStock ? (
              <><AlertCircle className="w-4 h-4" /> Out of Stock</>
            ) : (
              <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-5">
        <p className="text-[10px] font-semibold tracking-wider uppercase text-[#C89B3C] mb-1 font-sans">
          {product.category_name || "Hooks & Knots"}
        </p>
        <h3 className="font-serif text-lg font-semibold text-[#1F2937] group-hover:text-[#C89B3C] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(rating)
                  ? "fill-[#C89B3C] text-[#C89B3C]"
                  : "text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-[#5A5A5A] ml-1 font-sans">
            ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-[#1F2937] font-sans">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && (
            <span className="text-sm text-[#999] line-through font-sans">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {originalPrice && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
