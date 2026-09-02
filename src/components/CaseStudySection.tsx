import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import VideoPlayer from "./VideoPlayer";

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
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">ROADMAP</p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-display font-bold text-center mb-16">
          Content  <span className="gradient-text">Blueprint</span>
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
            <div className="flex-1 aspect-video rounded-xl overflow-hidden bg-secondary">
              {cs.video_url ? (
                <VideoPlayer src={cs.video_url} className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-transparent border-b-transparent ml-1" style={{ borderLeftWidth: '18px', borderLeftColor: 'hsl(var(--primary))', borderTopWidth: '12px', borderBottomWidth: '12px' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudySection;
