import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_content").select("*").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((item) => {
        map[item.key] = item.value;
      });
      setContent(map);
    });
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 pt-32 pb-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-[1200px] mx-auto"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-display font-bold tracking-tight leading-[1.1] mb-6">
          <span className="text-foreground">
            {content.hero_title_1 || "Get More Leads"}
          </span>
          <br />
          <span className="gradient-text">
            {content.hero_title_2 || "Using Quality Video Content"}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {content.hero_subtitle ||
            "We help entrepreneurs and businesses with Done-For-You organic content systems that generate leads on autopilot."}
        </p>

        {/* SOCIAL PROOF SECTION */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex -space-x-3">
            {[
              "/avatars/client1.jpeg",
              "/avatars/client2.jpeg",
              "/avatars/client3.jpeg",
              "/avatars/client4.jpeg",
            ].map((src, i) => (
              <div
                key={src}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-background shadow-md"
              >
                <img
                  src={src}
                  alt={`client-${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              {content.hero_social_proof || "Loved by 500+ Businesses worldwide."}
            </p>
            <p className="text-xs text-muted-foreground">
              {content.hero_social_sub || "Our Clients Speak for Us"}
            </p>
          </div>
        </div>

        <a
          href="#book-a-call"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(var(--primary),0.6)] transition-all duration-300 mb-12"
        >
          Book A Call <ArrowUpRight className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
