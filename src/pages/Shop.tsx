import FeaturedCollection from "@/components/sections/FeaturedCollection";
import BestSellers from "@/components/sections/BestSellers";
import ShopByCategory from "@/components/sections/ShopByCategory";

export default function Shop() {
  return (
    <div className="pt-20">
      <FeaturedCollection />
      <BestSellers />
      <ShopByCategory />
    </div>
  );
}
