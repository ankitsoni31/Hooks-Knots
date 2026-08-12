import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DCCFC0]/30"
          >
            <div className="flex items-center p-4 border-b border-[#DCCFC0]/20">
              <Search className="w-6 h-6 text-[#1F2937]/50 ml-2" />
              <form onSubmit={handleSubmit} className="flex-1 ml-4">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for crochet pieces..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full text-lg md:text-xl font-sans text-[#1F2937] placeholder:text-[#1F2937]/40 outline-none bg-transparent"
                />
              </form>
              <button
                onClick={onClose}
                className="p-2 mr-1 rounded-full text-[#1F2937]/50 hover:text-[#1F2937] hover:bg-[#F8F6F2] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 bg-[#F8F6F2]/50 text-center text-[#5A5A5A] text-sm font-sans">
              Press <span className="font-semibold text-[#1F2937]">Enter</span> to search.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
