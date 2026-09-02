import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', skipSnaps: false, containScroll: false },
    [Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoPlayOnCenter, setAutoPlayOnCenter] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setTestimonials(data ?? []));
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    
    // Auto-play the video if we clicked it from the side
    setTestimonials((prevTestimonials) => {
      const newActiveId = prevTestimonials[newIndex]?.id;
      if (newActiveId) {
        setAutoPlayOnCenter((prevTarget) => {
          if (prevTarget === newActiveId) {
            setPlayingVideoId(newActiveId);
            return null;
          }
          return prevTarget;
        });
      }
      return prevTestimonials;
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleCloseModal = () => {
    setPlayingVideoId(null);
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (playingVideoId) {
        const target = e.target as Element;
        // If they clicked the video card or the close button, do nothing
        if (target.closest('.video-card') || target.closest('.close-modal-btn')) {
          return;
        }
        handleCloseModal();
      }
    };
    
    if (playingVideoId) {
      // Use setTimeout to avoid catching the initial play click that triggered this
      const timer = setTimeout(() => {
        window.addEventListener('click', handleGlobalClick);
      }, 100);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('click', handleGlobalClick);
      };
    }
  }, [playingVideoId]);

  const activeVideoId = testimonials[selectedIndex]?.id;

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;
    
    if (playingVideoId) {
      autoplay.stop();
    } else {
      // Ensure Embla has processed the slides before playing
      if (emblaApi.slideNodes().length > 0) {
        autoplay.play();
      }
    }
  }, [emblaApi, playingVideoId, testimonials]);

  return (
    <section id="testimonials" className="py-24 px-4 relative">
      {/* Focus Mode Overlay Background */}
      <div 
        className={`fixed inset-0 bg-black/90 backdrop-blur-md z-40 transition-all duration-700 pointer-events-none ${playingVideoId ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Global Close Button for Modal View */}
      <button 
        className={`close-modal-btn fixed top-6 right-6 sm:top-10 sm:right-10 z-[100] w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-500 shadow-xl ${playingVideoId ? 'opacity-100 scale-100 cursor-pointer pointer-events-auto' : 'opacity-0 scale-50 pointer-events-none'}`}
        onClick={handleCloseModal}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className={`max-w-[1400px] mx-auto relative z-50 transition-all duration-700 ${playingVideoId ? 'scale-[1.02] sm:scale-105' : 'scale-100'}`}>
        
        {/* Header - Hides when playing video */}
        <div className={`transition-opacity duration-500 ${playingVideoId ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">Client testimonials</p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
          >
            Hear what they're <span className="gradient-text">Saying about us</span>
          </motion.h2>
        </div>

        {/* 3-Card Carousel */}
        <div className="relative max-w-5xl mx-auto group">
          <div className="overflow-hidden py-10" ref={emblaRef}>
            <div className="flex -ml-4 items-center">
              {testimonials.map((t, i) => {
                const isActive = i === selectedIndex;
                const isPlayingNode = playingVideoId === t.id && activeVideoId === t.id;
                
                const cardClasses = isActive 
                  ? `scale-100 opacity-100 shadow-[0_0_60px_rgba(var(--primary),0.2)] z-30 cursor-default ${playingVideoId ? 'shadow-[0_0_100px_rgba(0,0,0,1)]' : ''}`
                  : `scale-90 cursor-pointer z-20 ${
                      playingVideoId 
                        ? 'opacity-10 blur-[8px] hover:opacity-30 hover:blur-[4px]' 
                        : 'opacity-50 blur-[2px] hover:opacity-100 hover:blur-none'
                    }`;

                return (
                  <div 
                    key={t.id} 
                    className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] pl-4 min-w-0 transition-all duration-700 ease-out"
                    onClick={() => {
                      if (!isActive && emblaApi) {
                        emblaApi.scrollTo(i);
                        setAutoPlayOnCenter(t.id);
                      }
                    }}
                  >
                      <div 
                      className={`video-card relative rounded-[2rem] overflow-hidden aspect-[9/16] transition-all duration-700 ease-out border border-white/10 bg-black ${cardClasses}`}
                    >
                      {/* Video Player */}
                      {t.video_url ? (
                        <div className="absolute inset-0 z-0 h-full w-full">
                          <VideoPlayer 
                            src={t.video_url} 
                            isActiveCard={isActive}
                            isPlayingProp={isPlayingNode}
                            className="w-full h-full [&>video]:object-cover [&>video]:h-full" 
                            onPlayStateChange={(playing) => {
                              if (playing) {
                                setPlayingVideoId(t.id);
                                if (!isActive && emblaApi) {
                                  emblaApi.scrollTo(i);
                                }
                              } else if (playingVideoId === t.id) {
                                setPlayingVideoId(null);
                              }
                            }} 
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-white/50">
                          No Video URL
                        </div>
                      )}

                      {/* Minimalist Overlay (hidden when playing) */}
                      <div 
                        className={`absolute inset-0 z-10 pointer-events-none flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/50 via-30% to-transparent to-50% transition-opacity duration-500 ${isPlayingNode ? 'opacity-0' : 'opacity-100'}`}
                      >
                        <h3 className="text-2xl font-bold text-white mb-1 shadow-black drop-shadow-md">{t.name}</h3>
                        <p className="text-sm text-primary font-medium tracking-wide shadow-black drop-shadow-md">{t.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating Carousel Controls (Hidden when playing) */}
          <div className={`absolute top-1/2 -translate-y-1/2 left-4 right-4 sm:-left-4 sm:-right-4 md:-left-8 md:-right-8 xl:-left-12 xl:-right-12 flex justify-between pointer-events-none z-40 transition-opacity duration-500 ${playingVideoId ? 'opacity-0' : 'opacity-100'}`}>
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:text-primary transition-all focus:outline-none pointer-events-auto hover:scale-110 shadow-xl"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:text-primary transition-all focus:outline-none pointer-events-auto hover:scale-110 shadow-xl"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
