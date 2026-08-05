import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#F8F6F2]"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C89B3C]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#DCCFC0]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C89B3C]/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C89B3C]/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#C89B3C]" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C89B3C] font-sans">
                Handcrafted with Love
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold text-[#1F2937] leading-[1.1] tracking-tight"
            >
              Wrapped in{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Elegance</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#C89B3C]/20 -z-0" />
              </span>
              <br />
              <span className="text-[#C89B3C]">Stitched</span> with Soul
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-base md:text-lg text-[#5A5A5A] leading-relaxed max-w-lg mx-auto lg:mx-0 font-sans"
            >
              Discover our collection of premium handmade crochet bouquets,
              flowers, plushies, and accessories. Each piece is a unique work of
              art, crafted to last forever.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <a
                href="#featured"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1F2937] text-white text-sm font-semibold rounded-full hover:bg-[#C89B3C] transition-all duration-400 shadow-lg shadow-[#1F2937]/20 hover:shadow-[#C89B3C]/30 font-sans"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#1F2937] text-sm font-semibold rounded-full border-2 border-[#C89B3C]/30 hover:border-[#C89B3C] hover:text-[#C89B3C] transition-all duration-300 font-sans"
              >
                Custom Order
                <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-10 flex items-center gap-8 justify-center lg:justify-start"
            >
              {[
                { value: "2000+", label: "Happy Customers" },
                { value: "500+", label: "Products Crafted" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-[#1F2937] font-serif">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#5A5A5A] font-sans mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C89B3C]/20 animate-spin [animation-duration:30s]" />
              <div className="absolute inset-4 rounded-full border border-[#DCCFC0]/40" />

              {/* Main image */}
              <div className="absolute inset-8 rounded-full overflow-hidden bg-[#DCCFC0]/20 shadow-2xl">
                <img
                  src="/images/hero-bouquet.png"
                  alt="Premium handmade crochet bouquet by Hooks & Knots"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-12 -left-4 md:left-0 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#DCCFC0]/20"
              >
                <p className="text-xs font-semibold text-[#1F2937] font-sans">
                  ✨ Premium Quality
                </p>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-16 -right-4 md:right-0 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#DCCFC0]/20"
              >
                <p className="text-xs font-semibold text-[#1F2937] font-sans">
                  🎁 Gift Ready
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
