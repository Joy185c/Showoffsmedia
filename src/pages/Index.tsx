import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HeroMedia from "@/components/HeroMedia";
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HeroMedia />
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
