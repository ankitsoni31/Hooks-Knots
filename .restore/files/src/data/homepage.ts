// ─── Products ────────────────────────────────────────────────────────────────

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviewCount: number;
}

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Eternal Rose Bouquet",
    price: 1499,
    originalPrice: 1999,
    image: "/images/product-rose-bouquet.png",
    category: "Bouquets",
    badge: "New Arrival",
    rating: 4.9,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Cozy Bear Plushie",
    price: 899,
    image: "/images/product-plushie.png",
    category: "Plushies",
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Sunflower Keychain Set",
    price: 349,
    originalPrice: 499,
    image: "/images/product-keychain.png",
    category: "Keychains",
    badge: "Best Value",
    rating: 4.7,
    reviewCount: 256,
  },
  {
    id: "4",
    name: "Luxury Gift Box",
    price: 2499,
    image: "/images/hero-bouquet.png",
    category: "Gift Boxes",
    badge: "Premium",
    rating: 5.0,
    reviewCount: 67,
  },
];

export const bestSellers: Product[] = [
  {
    id: "5",
    name: "Pastel Dream Bouquet",
    price: 1299,
    image: "/images/hero-bouquet.png",
    category: "Bouquets",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: "6",
    name: "Mini Bunny Plushie",
    price: 649,
    originalPrice: 799,
    image: "/images/product-plushie.png",
    category: "Plushies",
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 198,
  },
  {
    id: "7",
    name: "Daisy Chain Keychain",
    price: 299,
    image: "/images/product-keychain.png",
    category: "Keychains",
    badge: "Bestseller",
    rating: 4.6,
    reviewCount: 445,
  },
  {
    id: "8",
    name: "Rose Gold Collection",
    price: 1799,
    originalPrice: 2199,
    image: "/images/product-rose-bouquet.png",
    category: "Bouquets",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 178,
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  image: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "bouquets",
    name: "Bouquets",
    description: "Everlasting floral arrangements",
    itemCount: 24,
    image: "/images/product-rose-bouquet.png",
    icon: "🌸",
  },
  {
    id: "flowers",
    name: "Flowers",
    description: "Individual stem flowers",
    itemCount: 36,
    image: "/images/hero-bouquet.png",
    icon: "🌷",
  },
  {
    id: "plushies",
    name: "Plushies",
    description: "Adorable stuffed companions",
    itemCount: 18,
    image: "/images/product-plushie.png",
    icon: "🧸",
  },
  {
    id: "keychains",
    name: "Keychains",
    description: "Cute everyday accessories",
    itemCount: 42,
    image: "/images/product-keychain.png",
    icon: "🔑",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Handmade fashion accessories",
    itemCount: 15,
    image: "/images/product-keychain.png",
    icon: "✨",
  },
  {
    id: "gift-boxes",
    name: "Gift Boxes",
    description: "Curated premium gift sets",
    itemCount: 12,
    image: "/images/hero-bouquet.png",
    icon: "🎁",
  },
];

// ─── Why Choose Us ───────────────────────────────────────────────────────────

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: "Hand",
    title: "100% Handmade",
    description:
      "Every piece is lovingly crafted by hand with meticulous attention to detail.",
  },
  {
    icon: "Sparkles",
    title: "Premium Yarn",
    description:
      "We use only the finest quality yarn for durability and a luxurious feel.",
  },
  {
    icon: "Palette",
    title: "Custom Designs",
    description:
      "Tell us your vision and we'll bring it to life with a custom creation.",
  },
  {
    icon: "Truck",
    title: "Fast Delivery",
    description:
      "Quick and careful packaging ensures your order arrives safely and on time.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure Payment",
    description:
      "Shop with confidence using our 100% secure and encrypted payment gateway.",
  },
  {
    icon: "MapPin",
    title: "Pan India Shipping",
    description:
      "We deliver our handmade creations to every corner of India.",
  },
];

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  date: string;
  location: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    text: "Absolutely stunning bouquet! My mother was in tears when she received it. The craftsmanship is incredible — every petal looks so real. Will definitely order again!",
    product: "Eternal Rose Bouquet",
    date: "2 weeks ago",
    location: "Mumbai",
  },
  {
    id: "2",
    name: "Ananya Reddy",
    avatar: "AR",
    rating: 5,
    text: "The plushie I ordered for my daughter's birthday was beyond adorable. The quality is amazing and it's so soft! She hasn't put it down since.",
    product: "Cozy Bear Plushie",
    date: "1 month ago",
    location: "Hyderabad",
  },
  {
    id: "3",
    name: "Rohit Verma",
    avatar: "RV",
    rating: 5,
    text: "Ordered a custom bouquet for my anniversary and it exceeded all expectations. The attention to detail is remarkable. My wife absolutely loved it!",
    product: "Custom Rose Bouquet",
    date: "3 weeks ago",
    location: "Delhi",
  },
  {
    id: "4",
    name: "Sneha Patel",
    avatar: "SP",
    rating: 4,
    text: "Such a unique gift! The keychains are tiny works of art. I bought a set for my friends and they all went crazy over them. Amazing craftsmanship.",
    product: "Sunflower Keychain Set",
    date: "1 week ago",
    location: "Ahmedabad",
  },
  {
    id: "5",
    name: "Kavita Nair",
    avatar: "KN",
    rating: 5,
    text: "The gift box was beautifully curated and packaged. It felt so premium opening it. Perfect for gifting — you can feel the love in every piece.",
    product: "Luxury Gift Box",
    date: "2 months ago",
    location: "Bangalore",
  },
  {
    id: "6",
    name: "Meera Joshi",
    avatar: "MJ",
    rating: 5,
    text: "I've ordered from many crochet shops but Hooks x Knots is on another level. The quality, packaging, and communication were all top-notch!",
    product: "Pastel Dream Bouquet",
    date: "1 month ago",
    location: "Pune",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "How long does it take to receive my order?",
    answer:
      "Standard orders are dispatched within 3-5 business days. Custom orders may take 7-10 business days depending on complexity. We'll keep you updated throughout the process!",
  },
  {
    question: "Can I place a custom order?",
    answer:
      "Absolutely! We love creating custom pieces. Simply reach out to us via WhatsApp or our Contact form with your idea, preferred colors, and any reference images. We'll provide a quote within 24 hours.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "Yes! We offer Pan India shipping. Your order will be carefully packaged to ensure it arrives in perfect condition, no matter where you are in India.",
  },
  {
    question: "How do I care for my crochet products?",
    answer:
      "Our crochet items are made with premium yarn and are quite durable. Keep them away from direct sunlight for prolonged periods. For cleaning, gently spot-clean with mild soap and water, then air dry.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "Since all our products are handmade, we don't accept returns. However, if your item arrives damaged, please contact us within 48 hours with photos and we'll arrange a replacement.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Yes! All our products come beautifully packaged. For an extra special touch, you can upgrade to our premium gift wrapping with a personalized note card at checkout.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, credit/debit cards, net banking, and popular wallets. All transactions are processed through our secure payment gateway.",
  },
  {
    question: "Can I get a bulk order or corporate gifting?",
    answer:
      "Yes! We offer special pricing for bulk and corporate orders. Contact us via WhatsApp or email with your requirements for a customized quote.",
  },
];

// ─── Instagram Gallery ───────────────────────────────────────────────────────

export const instagramPosts = [
  { id: "1", image: "/images/hero-bouquet.png", likes: 234 },
  { id: "2", image: "/images/product-rose-bouquet.png", likes: 189 },
  { id: "3", image: "/images/product-plushie.png", likes: 312 },
  { id: "4", image: "/images/product-keychain.png", likes: 167 },
  { id: "5", image: "/images/product-rose-bouquet.png", likes: 278 },
  { id: "6", image: "/images/product-plushie.png", likes: 145 },
];

// ─── Navigation ──────────────────────────────────────────────────────────────

export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Shop", href: "#featured" },
  { name: "Categories", href: "#categories" },
  { name: "Custom Orders", href: "#contact" },
  { name: "About", href: "#why-choose-us" },
  { name: "Contact", href: "#contact" },
];

// ─── Footer ──────────────────────────────────────────────────────────────────

export const footerLinks = {
  quickLinks: [
    { name: "Home", href: "#home" },
    { name: "Shop All", href: "#featured" },
    { name: "Categories", href: "#categories" },
    { name: "Best Sellers", href: "#best-sellers" },
    { name: "New Arrivals", href: "#featured" },
  ],
  customerService: [
    { name: "FAQ", href: "#faq" },
    { name: "Shipping Info", href: "#faq" },
    { name: "Return Policy", href: "#faq" },
    { name: "Custom Orders", href: "#contact" },
    { name: "Contact Us", href: "#contact" },
  ],
  social: [
    { name: "Instagram", href: "https://instagram.com/hooksxknots", icon: "Instagram" },
    { name: "WhatsApp", href: "https://wa.me/919876543210", icon: "MessageCircle" },
    { name: "Email", href: "mailto:hello@hooksxknots.com", icon: "Mail" },
  ],
};
