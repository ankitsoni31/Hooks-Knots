import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqItems } from "@/data/homepage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-[#F8F6F2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Need Help?"
          title="Frequently Asked Questions"
          description="Everything you need to know about ordering, shipping, and caring for your crochet pieces."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
          >
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-[#DCCFC0]/30 rounded-xl px-6 data-[state=open]:shadow-md data-[state=open]:border-[#C89B3C]/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-serif text-base font-semibold text-[#1F2937] hover:text-[#C89B3C] py-5 hover:no-underline [&[data-state=open]]:text-[#C89B3C]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#5A5A5A] leading-relaxed pb-5 font-sans">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
