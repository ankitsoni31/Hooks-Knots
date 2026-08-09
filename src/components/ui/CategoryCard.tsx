import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ApiCategory } from "@/types/api";

interface CategoryCardProps {
  category: ApiCategory;
  index: number;
}

const MotionLink = motion.create(Link);

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <MotionLink
      to={`/shop/${category.slug}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group flex flex-col bg-white rounded-3xl border border-[#DCCFC0]/30 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
    >
      {/* Category Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F8F6F2]">
        <img
          src="/images/hero-bouquet.png"
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 pb-6 md:pb-6 flex flex-col items-center text-center relative bg-white">
        {/* Icon Floating */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-sm">
          <span className="text-xl" role="img" aria-label={category.name}>
            🌸
          </span>
        </div>

        {/* Text */}
        <h3 className="font-serif text-xl font-bold text-[#1F2937] mb-1 mt-3">
          {category.name}
        </h3>
        <p className="text-sm text-[#5A5A5A] font-sans mb-2 line-clamp-2">
          {category.description}
        </p>
        <span className="text-xs font-semibold tracking-wider text-[#C89B3C] uppercase font-sans">
          {category.product_count || 0} Products
        </span>

        {/* Arrow on hover */}
        <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#1F2937] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-sans">
          Explore Collection
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </MotionLink>
  );
}
