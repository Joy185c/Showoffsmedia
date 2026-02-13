import { Check, X, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const usFeatures = [
  "In house team of 40+ Experts",
  "Results oriented",
  "Experience with 500+ Clients",
  "Proven DFY Content Funnel",
  "Personalised CRM",
  "24/7 Support, Anytime You Need Us",
];

const bonuses = [
  "Free Go High Level Subscription",
  "Free 1-on-1 Consultancy",
];

const othersFeatures = [
  "Unreliable Freelancers with slow turnarounds",
  "Edits that fail to convert or perform",
  "Weak thumbnails and titles with no CTR strategy",
  "Lack of proper distribution systems",
  "No expertise in funnels or lead capture",
  "Limited revisions with no client-focused approach",
  "Guesswork instead of data-driven decisions",
  "Delayed responses and poor communication",
];

const ComparisonSection = () => {
  return (
    <section className="py-20 px-4 section-glow">
      <div className="max-w-6xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">
          why choose us
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
        >
          Know what we <span className="gradient-text">do differently</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Us */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-lg font-bold text-foreground">ShowOffs Media</span>
              <ArrowUpRight className="w-4 h-4 text-primary" />
            </div>

            <ul className="space-y-4 mb-8">
              {usFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90 text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm font-semibold text-foreground mb-3">Bonuses you get with us:</p>
            <ul className="space-y-2">
              {bonuses.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Others */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h3 className="font-display text-lg font-bold text-muted-foreground mb-6">Other Agencies</h3>
            <ul className="space-y-4">
              {othersFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="text-center mt-10">
          <a
            href="#book-a-call"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-primary/90 transition-all"
          >
            Book a 30-min call <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
