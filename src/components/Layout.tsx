import { Link, useLocation } from "react-router-dom";
import { CheckSquare, Settings, LayoutDashboard, FolderKanban, BrainCircuit, Lightbulb, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FontSelector } from "@/components/FontSelector";
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
      <div className="w-64 bg-white border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center shadow-sm">
              <CheckSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-primary">Syngene ProjectHub</h1>
              <p className="text-xs text-muted-foreground">IT Portfolio Management</p>
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
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 font-medium text-sm",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center justify-center gap-2">
            <ThemeToggle />
            <FontSelector />
          </div>
          <p className="text-xs text-muted-foreground text-center">
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
