import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  MessageCircle,
  Mail,
  Send,
  MapPin,
  Clock,
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Future: connect to backend
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Get in Touch"
          title="Contact Us"
          description="Have a question, custom order request, or just want to say hello? We'd love to hear from you!"
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                  value: "@hooksxknots",
                  href: "https://instagram.com/hooksxknots",
                  description: "Follow us for the latest creations",
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: "+91 98765 43210",
                  href: "https://wa.me/919876543210",
                  description: "Chat with us for custom orders",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "hello@hooksxknots.com",
                  href: "mailto:hello@hooksxknots.com",
                  description: "For business inquiries",
                },
              ].map((contact, index) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-5 bg-[#F8F6F2] rounded-2xl border border-[#DCCFC0]/20 hover:border-[#C89B3C]/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#C89B3C]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C89B3C]/20 transition-colors duration-300">
                    <contact.icon className="w-5 h-5 text-[#C89B3C]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[#C89B3C] mb-0.5 font-sans">
                      {contact.label}
                    </p>
                    <p className="text-sm font-semibold text-[#1F2937] font-sans">
                      {contact.value}
                    </p>
                    <p className="text-xs text-[#5A5A5A] mt-0.5 font-sans">
                      {contact.description}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Additional info */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center gap-3 text-sm text-[#5A5A5A] font-sans">
                <Clock className="w-4 h-4 text-[#C89B3C]" />
                <span>Mon - Sat: 10am - 7pm</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#5A5A5A] font-sans">
                <MapPin className="w-4 h-4 text-[#C89B3C]" />
                <span>India</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-[#F8F6F2] rounded-2xl p-6 md:p-8 border border-[#DCCFC0]/20 space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#1F2937]/60 mb-2 font-sans"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white border border-[#DCCFC0]/30 rounded-xl text-sm text-[#1F2937] placeholder:text-[#999] focus:outline-none focus:border-[#C89B3C]/50 focus:ring-2 focus:ring-[#C89B3C]/10 transition-all font-sans"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#1F2937]/60 mb-2 font-sans"
                >
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white border border-[#DCCFC0]/30 rounded-xl text-sm text-[#1F2937] placeholder:text-[#999] focus:outline-none focus:border-[#C89B3C]/50 focus:ring-2 focus:ring-[#C89B3C]/10 transition-all font-sans"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#1F2937]/60 mb-2 font-sans"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  placeholder="Tell us about your requirements, custom order ideas, or any questions..."
                  className="w-full px-4 py-3 bg-white border border-[#DCCFC0]/30 rounded-xl text-sm text-[#1F2937] placeholder:text-[#999] focus:outline-none focus:border-[#C89B3C]/50 focus:ring-2 focus:ring-[#C89B3C]/10 transition-all resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1F2937] text-white text-sm font-semibold rounded-xl hover:bg-[#C89B3C] transition-all duration-300 shadow-lg shadow-[#1F2937]/10 hover:shadow-[#C89B3C]/20 font-sans"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
