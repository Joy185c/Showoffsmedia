import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const ClientResultsSection = () => {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("client_results").select("*").eq("is_active", true).order("sort_order").then(({ data }) => setClients(data ?? []));
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">feedback</p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-display font-bold text-center mb-16">
          How we <span className="gradient-text">Benefit Our Clients</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client, i) => (
            <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-primary mb-4">{client.name.charAt(0)}</div>
              <h3 className="text-foreground font-display font-bold text-lg">{client.name}</h3>
              <p className="text-primary text-sm mb-4">{client.niche}</p>
              <div className="flex gap-4">
                <div className="bg-secondary rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-foreground text-sm font-semibold">{client.views}</p>
                  <p className="text-muted-foreground text-xs">Generated</p>
                </div>
                <div className="bg-secondary rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-foreground text-sm font-semibold">{client.subs}</p>
                  <p className="text-muted-foreground text-xs">Subscribers</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientResultsSection;
