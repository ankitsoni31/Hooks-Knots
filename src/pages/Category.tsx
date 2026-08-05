import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { categories, allProducts } from "@/data/homepage";

export default function Category() {
  const { categoryId } = useParams();
  
  // Find the category details
  const category = categories.find((c) => c.id === categoryId);
  
  // Find products belonging to this category
  const categoryProducts = allProducts.filter(
    (product) => product.category.toLowerCase() === category?.name.toLowerCase()
  );

  if (!category) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 bg-[#F8F6F2]">
        <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-4">Category not found</h1>
        <Link to="/" className="text-[#C89B3C] font-semibold hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 md:pt-28 md:pb-20 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 md:mb-6"
        >
          <Link to="/#categories" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A5A5A] hover:text-[#C89B3C] transition-colors font-sans">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
        </motion.div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-sm border border-[#DCCFC0]/30 mb-4"
          >
            <span className="text-3xl" role="img" aria-label={category.name}>{category.icon}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-2"
          >
            {category.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-[#5A5A5A] font-sans"
          >
            {category.description}
          </motion.p>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-9 max-w-4xl mx-auto">
            {categoryProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-[#DCCFC0]/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="relative aspect-[10/9] overflow-hidden bg-[#F8F6F2]">
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1F2937] uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <button className="w-full bg-[#1F2937] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#C89B3C] transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif text-lg font-bold text-[#1F2937] mb-2 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-[#C89B3C]">★ {product.rating}</span>
                    <span className="text-xs text-[#5A5A5A]">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#1F2937]">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-[#5A5A5A] line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-[#DCCFC0]/20 shadow-sm"
          >
            <ShoppingBag className="w-12 h-12 text-[#DCCFC0] mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1F2937] mb-2">No products available in this category yet.</h3>
            <p className="text-[#5A5A5A] font-sans">We are currently crafting new pieces. Please check back later.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
