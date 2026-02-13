import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const BookCallSection = () => {
  return (
    <section id="book-a-call" className="py-20 px-4 section-glow">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
          work with us
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold mb-6"
        >
          Let's level up <span className="gradient-text">Your Business!</span>
        </motion.h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Schedule a free 30-minute discovery call to see how we can help you generate
          more leads through quality video content.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8 justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              S
            </div>
            <div className="text-left">
              <p className="text-foreground font-semibold">ShowOffs Media</p>
              <p className="text-muted-foreground text-sm">Discovery Call · 30 min</p>
            </div>
          </div>

          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all glow-blue"
          >
            Schedule Your Call <ArrowUpRight className="w-5 h-5" />
          </a>

          <p className="text-muted-foreground text-xs mt-6">No commitment required · 100% free</p>
        </motion.div>
      </div>
    </section>
  );
};

export default BookCallSection;
