import HeroSection from "./homepage/HeroSection";
import ProgramScope from "./homepage/ProgramScope";
import ApproachSection from "./homepage/ApproachSection";
import AboutSection from "./homepage/AboutSection";
import ValuesSection from "./homepage/ValuesSection";
import WaitlistSection from "./homepage/WaitlistSection";
import FaqSection from "./homepage/FaqSection";
import Footer from "./homepage/Footer";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <ProgramScope />
      <ApproachSection />
      <AboutSection />
      <ValuesSection />
      <WaitlistSection />
      <FaqSection />
      <Footer />
    </main>
  );
}

