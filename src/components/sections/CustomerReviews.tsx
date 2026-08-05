import SectionHeading from "@/components/ui/SectionHeading";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviews } from "@/data/homepage";

export default function CustomerReviews() {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Love Letters"
          title="What Our Customers Say"
          description="Real stories from real people who found something special in our handmade creations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
