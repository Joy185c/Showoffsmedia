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
    <div className="max-w-5xl mx-auto px-4 -mt-8 mb-8 relative z-10">
      <div className="rounded-2xl overflow-hidden border border-border/50">
        {videoUrl ? (
          <VideoPlayer src={videoUrl} autoPlay muted loop className="w-full aspect-video" />
        ) : (
          <img src={heroBg} alt="ShowOffs Media hero visual" className="w-full h-auto" loading="lazy" />
        )}
      </div>
    </div>
  );
};

export default HeroMedia;
