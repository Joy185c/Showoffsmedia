import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Work", href: "#work" },
  { label: "Roadmap", href: "#case-studies" },
  { label: "Process", href: "#process" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="bg-background/40 backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-2xl flex items-center justify-between px-6 py-4">
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
          className="group relative hidden md:inline-flex items-center bg-white text-black h-[44px] rounded-full text-[15px] font-semibold overflow-hidden transition-all duration-500 w-[160px]"
        >
          {/* Expanding Background */}
          <div className="absolute left-[3px] top-[3px] bottom-[3px] w-[38px] bg-primary rounded-full transition-all duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:w-[calc(100%-6px)]"></div>
          
          {/* Arrow */}
          <div className="relative z-10 flex items-center justify-center w-[38px] h-[38px] ml-[3px] text-white transition-transform duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:translate-x-[116px]">
            <ArrowRight className="w-4 h-4" />
          </div>
          
          {/* Text */}
          <span className="relative z-10 ml-2 transition-all duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:text-white group-hover:-translate-x-[18px]">
            Book a Call
          </span>
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
              className="group relative inline-flex items-center bg-white text-black h-[44px] rounded-full text-[15px] font-semibold overflow-hidden transition-all duration-500 w-[160px] mx-auto"
            >
              <div className="absolute left-[3px] top-[3px] bottom-[3px] w-[38px] bg-primary rounded-full transition-all duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:w-[calc(100%-6px)]"></div>
              <div className="relative z-10 flex items-center justify-center w-[38px] h-[38px] ml-[3px] text-white transition-transform duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:translate-x-[116px]">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="relative z-10 ml-2 transition-all duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] group-hover:text-white group-hover:-translate-x-[18px]">
                Book a Call
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
