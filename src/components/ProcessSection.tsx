import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    label: "Ideation",
    title: "Idea Analysis",
    description: "We take your ideas and analyze them thoroughly based on our experience and existing market standards.",
  },
  {
    num: "02",
    label: "Scripting",
    title: "Writing Content",
    description: "We will give you proven script frameworks that the biggest creators and companies use.",
  },
  {
    num: "03",
    label: "Editing",
    title: "Editing the Video",
    description: "We make the best quality videos using advanced motion graphics that bring your message to life.",
  },
  {
    num: "04",
    label: "Thumbnail",
    title: "Creating Thumbnail",
    description: "We analyze other thumbnails in your niche and replicate best performing results.",
  },
  {
    num: "05",
    label: "Post",
    title: "Post the Video",
    description: "All that's left now is to post the video and start counting the leads that come in.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">
          our process
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
        >
          Our strategy to get <span className="gradient-text">you leads with content</span>
        </motion.h2>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-start gap-6"
            >
              <div className="flex items-center gap-4 md:min-w-[180px]">
                <span className="text-3xl font-display font-bold gradient-text">{step.num}</span>
                <span className="text-xs uppercase tracking-wider text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                  {step.label}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#book-a-call"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-primary/90 transition-all"
          >
            Book a 30-min call <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
