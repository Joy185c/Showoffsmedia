import { motion } from "framer-motion";

const stats = [
  { value: "211%", label: "More Engagement", sub: "Viral Edits" },
  { value: "5X", label: "More Reach", sub: "Strategic Distribution" },
  { value: "51%", label: "More Leads", sub: "Automated Systems" },
];

const StatsSection = () => {
  return (
    <section className="py-20 px-4 section-glow">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-4"
        >
          Tired of boring video content that
          <br />
          <span className="gradient-text">don't stand out?</span>
        </motion.h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          It's time to upgrade the game with us!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 text-center"
            >
              <p className="text-5xl md:text-6xl font-display font-bold gradient-text mb-3">
                {stat.value}
              </p>
              <p className="text-foreground font-semibold text-lg mb-1">{stat.label}</p>
              <p className="text-muted-foreground text-sm">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
