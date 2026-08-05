import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { features } from "@/data/homepage";
import {
  Hand,
  Sparkles,
  Palette,
  Truck,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Hand,
  Sparkles,
  Palette,
  Truck,
  ShieldCheck,
  MapPin,
};

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Our Promise"
          title="Why Choose Us"
          description="We pour our heart into every creation. Here's what makes Hooks & Knots special."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Sparkles;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group relative p-6 md:p-8 bg-[#F8F6F2] rounded-2xl border border-[#DCCFC0]/20 hover:border-[#C89B3C]/30 transition-all duration-500 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#C89B3C]/10 flex items-center justify-center mb-5 group-hover:bg-[#C89B3C]/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-[#C89B3C]" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-lg font-semibold text-[#1F2937] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed font-sans">
                  {feature.description}
                </p>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-[#C89B3C] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
