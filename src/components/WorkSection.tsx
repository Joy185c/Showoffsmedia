import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import VideoPlayer from "./VideoPlayer";

const WorkSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data: cats } = await supabase.from("work_categories").select("*").order("sort_order");
      const { data: works } = await supabase.from("work_items").select("*").order("sort_order");
      setCategories(cats ?? []);
      setItems(works ?? []);
      if (cats?.length) setActiveTab(cats[0].id);
    };
    fetch();
  }, []);

  const filtered = items.filter((i) => i.category_id === activeTab);

  return (
    <section id="work" className="py-20 px-4 section-glow">
      <div className="max-w-6xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">our work</p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-display font-bold text-center mb-12">
          Some of our <span className="gradient-text">featured projects</span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card p-6 group hover:border-primary/30 transition-colors">
              <div className="aspect-video bg-secondary rounded-lg mb-4 overflow-hidden">
                {item.video_url ? (
                  <VideoPlayer src={item.video_url} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent ml-1" style={{ borderLeftWidth: '14px', borderLeftColor: 'hsl(var(--primary))' }} />
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-foreground font-semibold mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WorkSection;
