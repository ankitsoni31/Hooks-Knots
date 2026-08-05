import { motion } from "framer-motion";
import { CheckCircle2, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-28 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="block h-[1px] w-8 bg-[#C89B3C]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C89B3C] font-sans">
              Our Story
            </span>
            <span className="block h-[1px] w-8 bg-[#C89B3C]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-6"
          >
            The Heart Behind the <span className="text-[#C89B3C] italic">Knots</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-[#5A5A5A] leading-relaxed font-sans"
          >
            Welcome to Hooks & Knots, where every thread tells a story of patience, passion, and creativity. We believe that true luxury lies in the warmth of handmade art.
          </motion.p>
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/5] max-w-lg mx-auto relative group">
              <div className="absolute inset-0 border border-[#DCCFC0] transform -translate-x-4 translate-y-4" />
              <div className="absolute inset-0 bg-[#EBE3D5] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
                  alt="Jinal, Founder of Hooks & Knots"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937] mb-8">
              A Journey of Threads
            </h2>
            <div className="space-y-6 text-[#5A5A5A] leading-relaxed font-sans text-base">
              <p>
                Hooks & Knots was founded by Jinal with a profound passion for creating beautiful handmade crochet gifts that bring happiness to every special moment. What started as a meditative hobby quickly blossomed into a beloved brand.
              </p>
              <p>
                Every bouquet, plushie, keychain, and custom creation is handcrafted with patience, creativity, and love. Our goal is to transform simple threads into meaningful keepsakes that last forever. We source the finest quality yarns and materials to ensure that your handmade gifts feel luxurious and stand the test of time.
              </p>
              <p>
                We pour our heart into every creation, making sure that when you gift a Hooks & Knots piece, you are gifting a piece of art that carries warmth, love, and a personal touch that mass-produced items simply cannot replicate.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4">
              {["Ethically Crafted", "Premium Materials", "Attention to Detail", "Made for You"].map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C89B3C]" />
                  <span className="text-sm text-[#1F2937] font-medium font-sans">{perk}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-10 md:p-16 text-center shadow-xl border border-[#DCCFC0]/20"
        >
          <Heart className="w-12 h-12 text-[#C89B3C] mx-auto mb-6" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937] mb-4">
            Thank you for supporting handmade.
          </h2>
          <p className="text-[#5A5A5A] font-sans max-w-2xl mx-auto">
            Your support allows us to keep the beautiful art of crochet alive. We are excited to continue crafting memories for you and your loved ones.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
