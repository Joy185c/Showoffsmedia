import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const ComparisonSection = () => {
  const [usFeatures, setUsFeatures] = useState<string[]>([]);
  const [bonuses, setBonuses] = useState<string[]>([]);
  const [othersFeatures, setOthersFeatures] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("comparison_features").select("*").order("sort_order").then(({ data }) => {
      setUsFeatures(data?.filter((d) => d.type === "us").map((d) => d.text) ?? []);
      setBonuses(data?.filter((d) => d.type === "bonus").map((d) => d.text) ?? []);
      setOthersFeatures(data?.filter((d) => d.type === "others").map((d) => d.text) ?? []);
    });
  }, []);

  return (
    <section className="py-20 px-4 section-glow">
      <div className="max-w-6xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">why choose us</p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-display font-bold text-center mb-16">
          Know what we <span className="gradient-text">do differently</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-8 border-primary/30 group relative overflow-hidden transition-all duration-500 hover:border-primary/60">
            {/* Glowing Hover Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-display text-lg font-bold text-foreground">ShowOffs Media</span>
                <ArrowUpRight className="w-4 h-4 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
              <ul className="space-y-4 mb-8">
                {usFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3"><Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-foreground/90 text-sm">{f}</span></li>
                ))}
              </ul>
              {bonuses.length > 0 && (
                <div className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-colors duration-500 group-hover:bg-black/20 group-hover:border-white/20">
                  <p className="text-lg font-bold text-foreground mb-4 font-display">Bonus:</p>
                  <ul className="space-y-3">
                    {bonuses.map((b) => (
                      <li key={b} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-foreground/90">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-8 group relative overflow-hidden transition-all duration-500 hover:border-destructive/40">
            {/* Glowing Hover Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/30 via-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
            
            <div className="relative z-10">
              <h3 className="font-display text-lg font-bold text-muted-foreground mb-6 transition-colors duration-300 group-hover:text-foreground">Other Agencies</h3>
              <ul className="space-y-4">
                {othersFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3"><X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" /><span className="text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground/80">{f}</span></li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-10">
          <a
            href="#book-a-call"
            className="group relative inline-flex items-center bg-white text-black h-[44px] rounded-full text-[15px] font-semibold overflow-hidden transition-all duration-500 w-[210px]"
          >
            {/* Expanding Background */}
            <div className="absolute left-[3px] top-[3px] bottom-[3px] w-[38px] bg-primary rounded-full transition-all duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:w-[calc(100%-6px)]"></div>
            
            {/* Arrow */}
            <div className="relative z-10 flex items-center justify-center w-[38px] h-[38px] ml-[3px] text-white transition-transform duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:translate-x-[166px]">
              <ArrowRight className="w-4 h-4" />
            </div>
            
            {/* Text */}
            <span className="relative z-10 ml-2 transition-all duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:text-white group-hover:-translate-x-[12px]">
              Book a 30 min call
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
