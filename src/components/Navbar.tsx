import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Reviews", href: "#testimonials" },
  { label: "Work", href: "#work" },
  { label: "Case Study", href: "#case-studies" },
  { label: "Process", href: "#process" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="glass-card flex items-center justify-between px-6 py-3">
        <a href="#" className="font-display text-xl font-bold text-foreground tracking-tight">
          ShowOffs<span className="text-primary"> Media</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#book-a-call"
          className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Book A Call <ArrowUpRight className="w-4 h-4" />
        </a>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card mt-2 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book-a-call"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              Book A Call <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
