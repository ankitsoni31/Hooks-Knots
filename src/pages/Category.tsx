import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import api from "@/services/api";
import type { ApiCategory, ApiProduct, ApiPaginatedResponse } from "@/types/api";

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 1. Fetch Categories to find the ID based on the slug
        const catRes = await api.get<{ data: ApiCategory[] }>('/categories');
        const allCats = catRes.data.data;
        const foundCat = allCats.find((c) => c.slug === categoryId);
        
        if (!foundCat) {
          setCategory(null);
          return;
        }
        
        setCategory(foundCat);
        
        // 2. Fetch Products for this category
        const prodRes = await api.get<{ data: ApiPaginatedResponse<ApiProduct> }>(`/products?category_id=${foundCat.id}&limit=100`);
        setProducts(prodRes.data.data.items);
      } catch (err) {
        console.error("Failed to load category data:", err);
        setError("Failed to load category.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-[#F8F6F2]">
        <Loader2 className="w-12 h-12 text-[#C89B3C] animate-spin" />
      </div>
    );
  }

  if (error || !category) {
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
            <span className="text-3xl" role="img" aria-label={category.name}>🌸</span>
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
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-9 max-w-4xl mx-auto">
            {products.map((product, index) => {
              const price = Number(product.discount_price || product.price);
              const primaryImage = product.images?.find(img => img.is_primary)?.file_path 
                || product.images?.[0]?.file_path 
                || "/images/hero-bouquet.png";
              const isOutOfStock = product.stock <= 0;
              
              return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group bg-white rounded-2xl overflow-hidden border border-[#DCCFC0]/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full ${isOutOfStock ? 'opacity-80' : ''}`}
              >
                <div className="relative aspect-[10/9] overflow-hidden bg-[#F8F6F2]">
                  {product.featured && !isOutOfStock && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1F2937] uppercase tracking-wider shadow-sm">
                      Featured
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-600 rounded-full text-xs font-semibold text-white uppercase tracking-wider shadow-sm">
                      Out of Stock
                    </div>
                  )}
                  <img
                    src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + primaryImage : primaryImage}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale' : ''}`}
                  />
                  
                  {/* Quick Add Overlay */}
                  <div className={`absolute inset-x-0 bottom-0 p-4 opacity-0 ${isOutOfStock ? '' : 'group-hover:opacity-100'} translate-y-4 group-hover:translate-y-0 transition-all duration-300`}>
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
                      className={`w-full text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1F2937] hover:bg-[#C89B3C]'}`}
                    >
                      {isOutOfStock ? <><AlertCircle className="w-4 h-4" /> Out of Stock</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
                    </button>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif text-xl font-bold text-[#1F2937] mb-1">{product.name}</h3>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="font-sans font-bold text-lg text-[#1F2937]">₹{price.toLocaleString("en-IN")}</span>
                    {product.discount_price && (
                      <span className="font-sans text-sm text-[#999] line-through">₹{Number(product.price).toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
              </motion.div>
              );
            })}
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
