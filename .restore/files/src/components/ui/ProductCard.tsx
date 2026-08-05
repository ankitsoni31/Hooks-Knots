import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star } from "lucide-react";
import type { Product } from "@/data/homepage";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#DCCFC0]/30"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F8F6F2]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase bg-[#1F2937] text-white rounded-full">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-300 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#1F2937]"
            }`}
          />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-4">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#1F2937] text-white text-sm font-medium rounded-xl hover:bg-[#C89B3C] transition-colors duration-300 cursor-pointer">
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-5">
        <p className="text-[10px] font-semibold tracking-wider uppercase text-[#C89B3C] mb-1 font-sans">
          {product.category}
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
                i < Math.floor(product.rating)
                  ? "fill-[#C89B3C] text-[#C89B3C]"
                  : "text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-[#5A5A5A] ml-1 font-sans">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-[#1F2937] font-sans">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#999] line-through font-sans">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {product.originalPrice && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              % OFF
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
