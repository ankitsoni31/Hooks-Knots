import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function MeetFounder() {
  const badges = [
    "100% Handmade",
    "Made with Love",
    "Custom Orders Available",
    "Pan India Delivery"
  ];

  return (
    <section id="meet-founder" className="py-20 md:py-28 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 w-full group">
              {/* Decorative offset border */}
              <div className="absolute inset-0 border border-[#DCCFC0] transform -translate-x-4 translate-y-4 transition-transform duration-500 group-hover:-translate-x-6 group-hover:translate-y-6" />
              
              {/* Image Container */}
              <div className="absolute inset-0 bg-[#DCCFC0]/20 overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
                  alt="Founder of Hooks & Knots" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="block h-[1px] w-8 bg-[#C89B3C]" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C89B3C] font-sans">
                Meet the Founder
              </span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight mb-2">
              Jinal
            </h2>
            <p className="text-sm font-semibold tracking-wider text-[#8A7964] uppercase font-sans mb-8">
              Founder, Hooks & Knots
            </p>

            <div className="space-y-4 text-base text-[#5A5A5A] leading-relaxed font-sans mb-10">
              <p>
                Hooks & Knots was founded by Jinal with a passion for creating beautiful handmade crochet gifts that bring happiness to every special moment. Every bouquet, plushie, keychain, and custom creation is handcrafted with patience, creativity, and love. The goal is to transform simple threads into meaningful keepsakes that last forever.
              </p>
            </div>

            {/* Highlight Badges */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C89B3C]" />
                  <span className="text-sm text-[#1F2937] font-medium font-sans">{badge}</span>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1F2937] text-white text-sm font-semibold tracking-wide uppercase rounded-none hover:bg-[#C89B3C] transition-colors duration-400 font-sans"
            >
              Read Our Story
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
