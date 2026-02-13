import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Honestly, they are the best in the game, and I highly recommend them to anyone serious about content.",
    name: "Nick Barner",
    role: "Content Creator",
  },
  {
    quote: "I have nothing but great things to say. They definitely helped me kickstart everything that I've done on YouTube.",
    name: "Spencer Pawliw",
    role: "Skool Games Winner",
  },
  {
    quote: "ShowOffs Media is the most reliable editing partner you could ask for in your content creation ventures.",
    name: "Josh Faulkner",
    role: "Entrepreneur",
  },
  {
    quote: "Very quick turnaround and high quality videos. Once I provide feedback, the revisions get done very fast.",
    name: "Lucy Wang",
    role: "Educator",
  },
  {
    quote: "It's rare to find a team that nails both speed and quality—they did. As a software company, that saved us time.",
    name: "Dreikobe",
    role: "Founder",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider text-center mb-3">
          Client testimonials
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
        >
          Hear what they're <span className="gradient-text">Saying about us</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
