import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Mail,
  ArrowUp,
  Heart,
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { footerLinks } from "@/data/homepage";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1F2937] text-white relative">
      {/* Back to Top */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <button
          onClick={scrollToTop}
          className="p-3 bg-[#C89B3C] text-white rounded-full shadow-lg hover:bg-[#B8892F] transition-all duration-300 hover:-translate-y-1"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold tracking-tight">
                Hooks{" "}
                <span className="text-[#C89B3C]">&amp;</span>{" "}
                Knots
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-sans max-w-xs">
              Premium handmade crochet creations crafted with love, designed to
              bring warmth and elegance into your life. Every stitch tells a
              story.
            </p>
            <div className="flex items-center gap-3">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-[#C89B3C] text-white/70 hover:text-white transition-all duration-300"
                >
                  {social.icon === "Instagram" && (
                    <Instagram className="w-4 h-4" />
                  )}
                  {social.icon === "MessageCircle" && (
                    <MessageCircle className="w-4 h-4" />
                  )}
                  {social.icon === "Mail" && <Mail className="w-4 h-4" />}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/90 mb-5 font-sans">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/50 hover:text-[#C89B3C] transition-colors duration-300 font-sans"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/90 mb-5 font-sans">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/50 hover:text-[#C89B3C] transition-colors duration-300 font-sans"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/90 mb-5 font-sans">
              Stay Connected
            </h3>
            <p className="text-sm text-white/50 mb-4 font-sans">
              Subscribe to get updates on new collections and exclusive offers.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C89B3C]/50 transition-colors font-sans"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C89B3C] text-white text-sm font-medium rounded-xl hover:bg-[#B8892F] transition-colors duration-300 font-sans"
              >
                Join
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40 font-sans">
              © {new Date().getFullYear()} Hooks & Knots. All rights reserved.
            </p>
            <p className="text-xs text-white/40 font-sans flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-[#C89B3C] fill-[#C89B3C]" /> in India
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40 font-sans">
                Privacy Policy
              </span>
              <span className="text-xs text-white/20">|</span>
              <span className="text-xs text-white/40 font-sans">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
