import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("faqs").select("*").eq("is_active", true).order("sort_order").then(({ data }) => setFaqs(data ?? []));
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">Any queries you have</p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-display font-bold text-center mb-12">
          Questions you may <span className="gradient-text">Ask</span>
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.id} value={`faq-${i}`} className="glass-card px-6 border-none">
              <AccordionTrigger className="text-foreground hover:no-underline text-left font-medium py-5">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
