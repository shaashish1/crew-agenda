import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type Theme = "light" | "light-grey" | "dark";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "dark";
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Remove all theme classes
    document.documentElement.classList.remove("dark", "light-grey");
    
    // Apply new theme class
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light-grey") {
      document.documentElement.classList.add("light-grey");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : theme === "light-grey" ? (
            <Palette className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        <DropdownMenuItem onClick={() => applyTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("light-grey")}>
          <Palette className="mr-2 h-4 w-4" />
          Light Grey
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
