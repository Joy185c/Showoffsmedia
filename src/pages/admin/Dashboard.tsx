import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, MessageSquare, HelpCircle, Users, Briefcase } from "lucide-react";

const Dashboard = () => {
  const { user, role } = useAuth();
  const [counts, setCounts] = useState({
    testimonials: 0,
    faqs: 0,
    clients: 0,
    services: 0,
    work_items: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [t, f, c, s, w] = await Promise.all([
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("faqs").select("id", { count: "exact", head: true }),
        supabase.from("client_results").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("work_items").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        testimonials: t.count ?? 0,
        faqs: f.count ?? 0,
        clients: c.count ?? 0,
        services: s.count ?? 0,
        work_items: w.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  const cards = [
    { label: "Testimonials", value: counts.testimonials, icon: MessageSquare },
    { label: "FAQs", value: counts.faqs, icon: HelpCircle },
    { label: "Clients", value: counts.clients, icon: Users },
    { label: "Services", value: counts.services, icon: BarChart3 },
    { label: "Work Items", value: counts.work_items, icon: Briefcase },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome back, {user?.email}. You're logged in as <span className="capitalize text-primary font-semibold">{role}</span>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <card.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
