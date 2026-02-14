import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const CaseStudySection = () => {
  const [studies, setStudies] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("case_studies").select("*").eq("is_active", true).order("sort_order").then(({ data }) => setStudies(data ?? []));
  }, []);

  if (!studies.length) return null;
  const cs = studies[0];

  return (
    <section id="case-studies" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">case studies</p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-display font-bold text-center mb-16">
          Some solid <span className="gradient-text">Case studies</span>
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <span className="text-primary text-sm font-semibold">{cs.number} — Case study</span>
              <h3 className="text-2xl md:text-3xl font-display font-bold mt-4 mb-6 text-foreground">"{cs.headline}"</h3>
              <div className="flex gap-8 mb-8">
                <div>
                  <p className="text-3xl font-display font-bold gradient-text">{cs.stat1_value}</p>
                  <p className="text-sm text-muted-foreground">{cs.stat1_label}</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold gradient-text">{cs.stat2_value}</p>
                  <p className="text-sm text-muted-foreground">{cs.stat2_label}</p>
                </div>
              </div>
              <a href="#book-a-call" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Book a 30 min call <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex-1 aspect-video bg-secondary rounded-xl flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-0 h-0 border-t-transparent border-b-transparent ml-1" style={{ borderLeftWidth: '18px', borderLeftColor: 'hsl(230 80% 60%)', borderTopWidth: '12px', borderBottomWidth: '12px' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudySection;
