import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, useInView, animate } from "framer-motion";

const AnimatedCounter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!value) return;
    
    // Parse the value to separate prefix, number, and suffix (e.g. "+", "211", "%")
    const match = value.match(/^(\D*)(\d+[\.,]?\d*)(\D*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const targetNumber = parseFloat(match[2].replace(/,/g, ''));
    const suffix = match[3] || "";
    const isDecimal = match[2].includes('.');

    if (isInView) {
      const controls = animate(0, targetNumber, {
        duration: 2,
        ease: "easeOut",
        onUpdate(v) {
          const formattedNum = isDecimal ? v.toFixed(1) : Math.floor(v).toString();
          setDisplayValue(`${prefix}${formattedNum}${suffix}`);
        },
      });

      return () => controls.stop();
    }
  }, [value, isInView]);

  return <span ref={ref}>{displayValue}</span>;
};

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
              <p className="text-5xl md:text-6xl font-display font-bold gradient-text mb-3">
                <AnimatedCounter value={stat.value} />
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
