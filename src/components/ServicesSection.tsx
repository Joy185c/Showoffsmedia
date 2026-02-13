import { motion } from "framer-motion";
import { Play, Film, Monitor, Megaphone } from "lucide-react";

const services = [
  {
    icon: Play,
    title: "Youtube Videos",
    description: "Grow a personal brand in any niche with our trendy edits.",
  },
  {
    icon: Film,
    title: "Short Form Videos",
    description: "Byte sized top of the funnel videos for Instagram Reels and TikTok.",
  },
  {
    icon: Monitor,
    title: "SAAS Videos",
    description: "Organic podcasts to build trust and create credibility among your audience.",
  },
  {
    icon: Megaphone,
    title: "Ad Creatives & VSLs",
    description: "Create dynamic content and convert more leads with paid ads.",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 px-4 section-glow">
      <div className="max-w-6xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">
          Core services
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
        >
          Types of work <span className="gradient-text">We do</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center group hover:border-primary/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-foreground font-display font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
