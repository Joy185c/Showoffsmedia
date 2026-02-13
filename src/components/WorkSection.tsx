import { useState } from "react";
import { motion } from "framer-motion";

const tabs = ["Youtube Videos", "Shorts", "SAAS Videos", "Ad Creatives & VSL"];

const workItems: Record<string, { title: string; description: string }[]> = {
  "Youtube Videos": [
    { title: "Market Analysis Deep Dive", description: "Full-length YouTube breakdown with motion graphics" },
    { title: "Personal Brand Story", description: "Engaging storytelling with cinematic edits" },
    { title: "Tutorial & Education", description: "Clear, engaging educational content" },
    { title: "Podcast Highlights", description: "Best moments compiled with dynamic transitions" },
  ],
  Shorts: [
    { title: "Viral Hook Shorts", description: "Attention-grabbing vertical content" },
    { title: "Quick Tips Series", description: "Bite-sized value-packed shorts" },
    { title: "Trend-Jacking Edits", description: "Leveraging trends for maximum reach" },
    { title: "Behind the Scenes", description: "Authentic content that builds trust" },
  ],
  "SAAS Videos": [
    { title: "Product Demo", description: "Clean walkthrough of features and benefits" },
    { title: "Explainer Video", description: "Simplified complex concepts with animations" },
    { title: "Onboarding Flow", description: "Guided user experience videos" },
    { title: "Feature Launch", description: "Exciting announcements with impact" },
  ],
  "Ad Creatives & VSL": [
    { title: "VSL Production", description: "High-converting video sales letters" },
    { title: "Facebook Ad Creative", description: "Scroll-stopping ad content" },
    { title: "YouTube Pre-Roll", description: "Compelling pre-roll advertisements" },
    { title: "Retargeting Ads", description: "Re-engagement video campaigns" },
  ],
};

const WorkSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section id="work" className="py-20 px-4 section-glow">
      <div className="max-w-6xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">
          our work
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-12"
        >
          Some of our <span className="gradient-text">featured projects</span>
        </motion.h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {workItems[activeTab].map((item, i) => (
            <div
              key={i}
              className="glass-card p-6 group hover:border-primary/30 transition-colors"
            >
              <div className="aspect-video bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" 
                    style={{ borderLeftWidth: '14px' }}
                  />
                </div>
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
