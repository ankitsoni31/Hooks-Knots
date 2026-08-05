import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { Review } from "@/data/homepage";

interface ReviewCardProps {
  review: Review;
  index: number;
}

export default function ReviewCard({ review, index }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md border border-[#DCCFC0]/30 transition-all duration-300"
    >
      {/* Quote icon */}
      <Quote className="absolute top-5 right-5 w-8 h-8 text-[#C89B3C]/15" />

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating
                ? "fill-[#C89B3C] text-[#C89B3C]"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Review text */}
      <p className="text-[#3D3D3D] text-sm md:text-base leading-relaxed mb-6 font-sans">
        "{review.text}"
      </p>

      {/* Product tag */}
      <p className="text-xs text-[#C89B3C] font-medium mb-4 font-sans">
        Purchased: {review.product}
      </p>

      {/* Reviewer info */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#DCCFC0]/30">
        <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-white text-sm font-semibold font-sans">
          {review.avatar}
        </div>
        <div>
          <p className="font-medium text-sm text-[#1F2937] font-sans">
            {review.name}
          </p>
          <p className="text-xs text-[#5A5A5A] font-sans">
            {review.location} Â· {review.date}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
