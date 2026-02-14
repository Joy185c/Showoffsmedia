import { useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, MessageSquare, BarChart3, Briefcase, FolderOpen,
  GitCompare, ListOrdered, Wrench, Users, HelpCircle, Settings, LogOut, FileText
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Site Content", to: "/admin/site-content", icon: FileText },
  { label: "Stats", to: "/admin/stats", icon: BarChart3 },
  { label: "Testimonials", to: "/admin/testimonials", icon: MessageSquare },
  { label: "Work", to: "/admin/work", icon: Briefcase },
  { label: "Case Studies", to: "/admin/case-studies", icon: FolderOpen },
  { label: "Comparison", to: "/admin/comparison", icon: GitCompare },
  { label: "Process", to: "/admin/process", icon: ListOrdered },
  { label: "Services", to: "/admin/services", icon: Wrench },
  { label: "Clients", to: "/admin/clients", icon: Users },
  { label: "FAQs", to: "/admin/faqs", icon: HelpCircle },
  { label: "User Roles", to: "/admin/roles", icon: Settings },
];

const AdminLayout = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || (role !== "admin" && role !== "editor"))) {
      navigate("/admin/login");
    }
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || (role !== "admin" && role !== "editor")) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col fixed h-full">
        <div className="p-4 border-b border-border">
          <h2 className="font-display text-lg font-bold text-foreground">
            ShowOffs<span className="text-primary"> Admin</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{role} panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            if (item.label === "User Roles" && role !== "admin") return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            View Website →
          </a>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
