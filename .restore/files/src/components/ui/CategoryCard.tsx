import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/homepage";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.a
      href={`#${category.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group relative flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-2xl border border-[#DCCFC0]/30 hover:border-[#C89B3C]/40 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer overflow-hidden"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C89B3C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Category Image */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4 rounded-2xl overflow-hidden bg-[#F8F6F2]">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Icon */}
      <span className="text-2xl mb-2" role="img" aria-label={category.name}>
        {category.icon}
      </span>

      {/* Text */}
      <h3 className="font-serif text-lg font-semibold text-[#1F2937] mb-1">
        {category.name}
      </h3>
      <p className="text-sm text-[#5A5A5A] font-sans mb-2">
        {category.description}
      </p>
      <span className="text-xs text-[#C89B3C] font-medium font-sans">
        {category.itemCount} Products
      </span>

      {/* Arrow on hover */}
      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-[#C89B3C] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-sans">
        Explore
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </motion.a>
  );
}
