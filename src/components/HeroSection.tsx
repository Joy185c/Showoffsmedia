import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
          <span className="text-muted-foreground">Get More Leads</span>
          <br />
          Using <span className="gradient-text">Quality Video Content</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          We help entrepreneurs and businesses with Done-For-You organic content
          systems that generate leads on autopilot.
        </p>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Loved by 500+ Businesses worldwide.</p>
            <p className="text-xs text-muted-foreground">Our Clients Speak for Us</p>
          </div>
        </div>

        <a
          href="#book-a-call"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-primary/90 transition-all glow-blue"
        >
          Book A Call <ArrowUpRight className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
