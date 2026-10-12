import HeroSection from "./homepage/HeroSection";
import ValueGrid from "./homepage/valuegrid";
import StatsSection from "./homepage/StatsSection";
import ProgramSection from "./homepage/ProgramSection";
import ReviewsSection from "./homepage/ReviewsSection";
import Footer from "./homepage/Footer";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <ValueGrid />
      <StatsSection />
      <ProgramSection />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
