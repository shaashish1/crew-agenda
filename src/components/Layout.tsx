import { Link, useLocation } from "react-router-dom";
import { CheckSquare, Settings, LayoutDashboard, FolderKanban, BrainCircuit, Lightbulb, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIAssistant } from "@/components/AIAssistant";

const navigation = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "AI Executive", href: "/dashboard/executive", icon: BrainCircuit },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/dashboard", icon: CheckSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center shadow-sm">
              <CheckSquare className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">Syngene ProjectHub</h1>
              <p className="text-xs text-sidebar-foreground/70">IT Portfolio Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-background",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
          <p className="text-xs text-sidebar-foreground/60 text-center">
            © 2025 Syngene International
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
        <AIAssistant />
      </div>
    </div>
  );
};
