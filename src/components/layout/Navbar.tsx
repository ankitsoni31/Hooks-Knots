import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react";
import { navLinks } from "@/data/homepage";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { items: wishlistItems } = useWishlist();
  
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#DCCFC0]/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-10">
              <span className="font-serif text-xl md:text-2xl font-bold text-[#1F2937] tracking-tight">
                Hooks{" "}
                <span className="text-[#C89B3C]">&amp;</span>{" "}
                Knots
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-medium transition-colors duration-300 group font-sans ${
                      isActive && link.href !== "/#categories"
                        ? "text-[#1F2937]"
                        : "text-[#1F2937]/80 hover:text-[#1F2937]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#C89B3C] transition-all duration-300 ${
                          isActive && link.href !== "/#categories"
                            ? "w-6"
                            : "w-0 group-hover:w-6"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1">
              <button className="p-2.5 rounded-full text-[#1F2937]/70 hover:text-[#1F2937] hover:bg-[#DCCFC0]/20 transition-all duration-300">
                <Search className="w-[18px] h-[18px]" />
              </button>
              <Link to="/wishlist" className="p-2.5 rounded-full text-[#1F2937]/70 hover:text-[#1F2937] hover:bg-[#DCCFC0]/20 transition-all duration-300 relative block">
                <Heart className="w-[18px] h-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C89B3C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="p-2.5 rounded-full text-[#1F2937]/70 hover:text-[#1F2937] hover:bg-[#DCCFC0]/20 transition-all duration-300 relative block">
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C89B3C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              {isAuthenticated && user ? (
                <Link to="/profile" className="ml-2 px-5 py-2 text-sm font-medium bg-[#1F2937] text-white rounded-full hover:bg-[#C89B3C] transition-all duration-300 font-sans">
                  <User className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                  {user.first_name}
                </Link>
              ) : (
                <Link to="/login" className="ml-2 px-5 py-2 text-sm font-medium bg-[#1F2937] text-white rounded-full hover:bg-[#C89B3C] transition-all duration-300 font-sans">
                  <User className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link to="/cart" className="p-2 rounded-full text-[#1F2937]/70 hover:text-[#1F2937] transition-colors relative block">
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C89B3C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full text-[#1F2937]/70 hover:text-[#1F2937] transition-colors z-10"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full pt-20 px-6">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <NavLink
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 font-sans ${
                            isActive && link.href !== "/#categories"
                              ? "text-[#C89B3C] bg-[#F8F6F2]"
                              : "text-[#1F2937] hover:text-[#C89B3C] hover:bg-[#F8F6F2]"
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-[#DCCFC0]/30 space-y-3">
                  <div className="flex items-center gap-4 px-4">
                    <button className="p-2.5 rounded-full text-[#1F2937]/70 hover:text-[#1F2937] hover:bg-[#F8F6F2] transition-all">
                      <Search className="w-5 h-5" />
                    </button>
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-full text-[#1F2937]/70 hover:text-[#1F2937] hover:bg-[#F8F6F2] transition-all relative block">
                      <Heart className="w-5 h-5" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C89B3C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </div>
                  {isAuthenticated && user ? (
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="w-full px-5 py-3 text-sm font-medium bg-[#1F2937] text-white rounded-xl hover:bg-[#C89B3C] transition-all duration-300 font-sans block text-center">
                      <User className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                      {user.first_name}
                    </Link>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full px-5 py-3 text-sm font-medium bg-[#1F2937] text-white rounded-xl hover:bg-[#C89B3C] transition-all duration-300 font-sans block text-center">
                      <User className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
