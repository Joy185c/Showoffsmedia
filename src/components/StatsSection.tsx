import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const StatsSection = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("stats").select("*").order("sort_order").then(({ data }) => setStats(data ?? []));
    supabase.from("site_content").select("*").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((item) => { map[item.key] = item.value; });
      setContent(map);
    });
  }, []);

  return (
    <section className="py-20 px-4 section-glow">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-4"
        >
          {content.stats_heading || "Tired of boring video content that"}
          <br />
          <span className="gradient-text">{content.stats_heading_highlight || "don't stand out?"}</span>
        </motion.h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          {content.stats_subheading || "It's time to upgrade the game with us!"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 text-center"
            >
              <p className="text-5xl md:text-6xl font-display font-bold gradient-text mb-3">{stat.value}</p>
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
