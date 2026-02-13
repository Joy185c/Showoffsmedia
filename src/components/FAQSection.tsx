import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Tell me about your agency?",
    a: "At ShowOffs Media, we help coaches and trainers build their personal brand through high quality video editing and social media marketing.",
  },
  {
    q: "Tell me about your content plan?",
    a: "We analyze your existing content, identify your niche and offer a comprehensive content plan catering to your personal brand.",
  },
  {
    q: "What services will you provide?",
    a: "We offer a range of video editing services including YouTube videos, Shorts, Instagram Reels, TikTok and Facebook Reels, Promotional Videos, and more. Our social media marketing services have a proven record of growing sales through creating engaging posts, and running social media ads.",
  },
  {
    q: "What if I don't get the results?",
    a: "We have replicated our strategies for multiple brands, channels, and companies and have successfully scaled their businesses through their social media. It is very unlikely that what has worked for everyone else, will not work for you.",
  },
  {
    q: "Why wouldn't I hire a freelancer?",
    a: "We have a dedicated team of 30+ editors. Our quality of work will always outperform any sole freelancer working on their own.",
  },
  {
    q: "Tell me about your workflow?",
    a: "We understand your project, your consumer base, and your businesses, and then schedule a discovery call with you to understand your requirements. Afterwards, our team takes care of task management, delegation, editing, and running feedback loops with you to ensure best results.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">
          Any queries you have
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-12"
        >
          Questions you may <span className="gradient-text">Ask</span>
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-card px-6 border-none"
            >
              <AccordionTrigger className="text-foreground hover:no-underline text-left font-medium py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
