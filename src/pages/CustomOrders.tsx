import { motion } from "framer-motion";
import ContactSection from "@/components/sections/Contact";

export default function CustomOrders() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-28 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="block h-[1px] w-8 bg-[#C89B3C]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C89B3C] font-sans">
              Custom Orders
            </span>
            <span className="block h-[1px] w-8 bg-[#C89B3C]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-6"
          >
            Bring Your Vision to <span className="text-[#C89B3C] italic">Life</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-[#5A5A5A] leading-relaxed font-sans"
          >
            Whether it's a personalized plushie, a custom floral arrangement, or a unique accessory, we can craft it exclusively for you. 
          </motion.p>
        </div>
      </div>
      
      <ContactSection />
    </div>
  );
}
