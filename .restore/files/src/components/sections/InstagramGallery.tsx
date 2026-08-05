import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { instagramPosts } from "@/data/homepage";
import { Heart, ExternalLink } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";

export default function InstagramGallery() {
  return (
    <section id="instagram" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Follow Us"
          title="Instagram Gallery"
          description="Peek behind the scenes and see our latest creations. Join our community of crochet lovers!"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://instagram.com/hooksxknots"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F8F6F2]"
            >
              <img
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#1F2937]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                <Instagram className="w-6 h-6 text-white" />
                <div className="flex items-center gap-1 text-white text-sm font-sans">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  {post.likes}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href="https://instagram.com/hooksxknots"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 font-sans"
          >
            <Instagram className="w-4 h-4" />
            Follow @hooksxknots
            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
