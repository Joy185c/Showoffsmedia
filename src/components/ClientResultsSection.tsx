import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

const ClientResultsSection = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, containScroll: false },
    [Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    supabase
      .from("client_results")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        let items = data ?? [];
        if (items.length > 0 && items.length <= 3) {
          // duplicate to allow smooth looping
          items = [...items.map(t => ({...t, uniqueId: t.id + '-1'})), ...items.map(t => ({...t, uniqueId: t.id + '-2'}))];
        } else {
          items = items.map(t => ({...t, uniqueId: t.id}));
        }
        setClients(items);
      });
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-24 px-4 bg-black relative">
      {/* Video Modal */}
      {playingVideoUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer" onClick={() => setPlayingVideoUrl(null)} />
          <button 
            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-[210] transition-colors"
            onClick={() => setPlayingVideoUrl(null)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative z-[210] w-full max-w-lg aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <VideoPlayer src={playingVideoUrl} autoPlay={true} className="w-full h-full [&>video]:object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto">
        <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] text-center mb-4">FEEDBACK</p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-display font-bold text-center mb-16 text-white">
          How we <span className="text-[#c084fc]">Benefit Our Clients</span>
        </motion.h2>

        <div className="relative max-w-6xl mx-auto group">
          <div className="overflow-hidden py-4" ref={emblaRef}>
            <div className="flex -ml-4">
              {clients.map((client, i) => {
                const isActive = i === selectedIndex;
                return (
                  <div key={client.uniqueId} className="flex-[0_0_90%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 transition-opacity duration-300">
                    <div className={`bg-[#0c0c0e] border ${isActive ? 'border-primary/30 shadow-[0_0_40px_rgba(var(--primary),0.1)]' : 'border-white/[0.04] opacity-50 hover:opacity-100'} rounded-2xl p-8 flex flex-col h-full transition-all duration-500`}>
                      
                      <div className="flex justify-between items-start mb-6">
                        <svg className="w-10 h-10 text-[#4c1d95]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        {client.video_url && (
                          <button 
                            onClick={() => setPlayingVideoUrl(client.video_url)}
                            className="w-10 h-10 rounded-full bg-[#1e1e24] hover:bg-primary/20 flex items-center justify-center text-[#c084fc] transition-colors cursor-pointer group-hover:scale-105"
                          >
                            <Play className="w-4 h-4 ml-1 fill-current" />
                          </button>
                        )}
                      </div>

                      <p className="text-[#a1a1aa] text-sm leading-relaxed mb-8 flex-grow font-medium">
                        {client.quote || "This client achieved amazing results by working with our team."}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                          {client.picture_url ? (
                            <img src={client.picture_url} alt={client.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#1e1e24] flex items-center justify-center text-lg font-bold text-primary">
                              {client.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="text-white font-bold text-sm">{client.name}</h4>
                            <p className="text-[#71717a] text-xs font-medium">{client.niche}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="bg-[#2d1b4e]/50 border border-primary/20 rounded-full px-3 py-1 flex items-center gap-1.5 justify-center min-w-[90px]">
                            <span className="text-[#d8b4fe] text-[10px] font-bold uppercase tracking-wider">{client.views} VIEWS</span>
                          </div>
                          <div className="bg-[#18181b] rounded-full px-3 py-1 flex items-center gap-1.5 border border-white/5 justify-center min-w-[90px]">
                            <span className="text-[#a1a1aa] text-[10px] font-bold uppercase tracking-wider">{client.subs} SUBS</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 sm:-left-6 sm:-right-6 lg:-left-12 lg:-right-12 flex justify-between pointer-events-none z-10">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-[#0c0c0e] flex items-center justify-center text-white hover:bg-white/10 hover:text-[#c084fc] transition-all pointer-events-auto hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-[#0c0c0e] flex items-center justify-center text-white hover:bg-white/10 hover:text-[#c084fc] transition-all pointer-events-auto hover:scale-110 shadow-lg"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ClientResultsSection;
