import { motion } from "framer-motion";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {subtitle && (
        <span className="inline-block mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#C89B3C] font-sans">
          {subtitle}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight">
        {title}
      </h2>
      <div className="mt-4 flex items-center gap-2 justify-center">
        <span className="block h-[1px] w-8 bg-[#C89B3C]/40" />
        <span className="block h-1.5 w-1.5 rounded-full bg-[#C89B3C]" />
        <span className="block h-[1px] w-8 bg-[#C89B3C]/40" />
      </div>
      {description && (
        <p className="mt-4 max-w-2xl mx-auto text-[#5A5A5A] text-base md:text-lg leading-relaxed font-sans">
          {description}
        </p>
      )}
    </motion.div>
  );
}
