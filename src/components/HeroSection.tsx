import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Star } from "lucide-react";
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
          <span className="animated-gradient-text">
            {content.hero_title_2 || "Using Quality Video Content"}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {content.hero_subtitle ||
            "We help entrepreneurs and businesses with Done-For-You organic content systems that generate leads on autopilot."}
        </p>

        <div className="flex flex-col items-center">
          {/* SOCIAL PROOF MARQUEE */}
          <div className="flex items-center gap-4 p-1.5 pr-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8 shadow-lg w-[90vw] max-w-[500px] overflow-hidden">
            <div className="flex -space-x-3 shrink-0 pl-2">
              {[
                "/avatars/client1.jpeg",
                "/avatars/client2.jpeg",
                "/avatars/client3.jpeg",
                "/avatars/client4.jpeg",
              ].map((src, i) => (
                <div
                  key={src}
                  className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-background shadow-sm z-10"
                >
                  <img
                    src={src}
                    alt={`client-${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="relative w-9 h-9 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-primary border-2 border-background z-20">
                40+
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex whitespace-nowrap animate-scroll-left w-max">
                <span className="text-sm font-medium text-foreground px-4">
                  {content.hero_social_proof || "Value And Guarantee. Don't Miss Out - Secure Your Brand's Future Today. Why Risk It."}
                </span>
                <span className="text-sm font-medium text-foreground px-4">
                  {content.hero_social_proof || "Value And Guarantee. Don't Miss Out - Secure Your Brand's Future Today. Why Risk It."}
                </span>
              </div>
            </div>
          </div>

          <a
            href="#book-a-call"
            className="glow-button inline-flex items-center gap-2 text-white px-10 py-4 rounded-2xl text-lg font-bold mb-12"
          >
            Book A Call <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
