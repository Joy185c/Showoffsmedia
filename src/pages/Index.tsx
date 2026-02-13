import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WorkSection from "@/components/WorkSection";
import CaseStudySection from "@/components/CaseStudySection";
import ComparisonSection from "@/components/ComparisonSection";
import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import ClientResultsSection from "@/components/ClientResultsSection";
import BookCallSection from "@/components/BookCallSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Hero image */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 mb-8 relative z-10">
        <div className="rounded-2xl overflow-hidden border border-border/50">
          <img src={heroBg} alt="ShowOffs Media hero visual" className="w-full h-auto" loading="lazy" />
        </div>
      </div>

      <StatsSection />
      <TestimonialsSection />
      <WorkSection />
      <CaseStudySection />
      <ComparisonSection />
      <ProcessSection />
      <ServicesSection />
      <ClientResultsSection />
      <BookCallSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
