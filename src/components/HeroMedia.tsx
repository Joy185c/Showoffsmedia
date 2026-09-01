import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import VideoPlayer from "./VideoPlayer";
import heroBg from "@/assets/hero-bg.jpg";

const HeroMedia = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "hero_video_url")
      .maybeSingle()
      .then(({ data }) => {
        setVideoUrl(data?.value || null);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 -mt-8 mb-20 relative z-10">
      <div className="relative group perspective-1000">
        {/* Animated background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-[#00f2fe] to-primary rounded-[2rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-300"></div>
        
        {/* Main container */}
        <div className="relative rounded-[1.5rem] overflow-hidden bg-black/40 p-2 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.01] transition-all duration-700">
          <div className="rounded-xl overflow-hidden shadow-inner">
            {videoUrl ? (
              <VideoPlayer src={videoUrl} autoPlay muted loop className="w-full aspect-video" />
            ) : (
              <img src={heroBg} alt="ShowOffs Media hero visual" className="w-full h-auto" loading="lazy" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroMedia;
