import { Moon, Sun, Palette, Waves, Sunset, Trees, Sparkles, Briefcase, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type Theme = "light" | "light-grey" | "dark" | "ocean" | "sunset" | "forest" | "purple" | "corporate" | "material3" | "syngene";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "syngene";
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Remove all theme classes
    document.documentElement.classList.remove("dark", "light-grey", "ocean", "sunset", "forest", "purple", "corporate", "material3", "syngene");
    
    // Apply new theme class (light is default, no class needed)
    if (newTheme !== "light") {
      document.documentElement.classList.add(newTheme);
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
          {theme === "syngene" ? (
            <Briefcase className="h-5 w-5" />
          ) : theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : theme === "light-grey" ? (
            <Palette className="h-5 w-5" />
          ) : theme === "ocean" ? (
            <Waves className="h-5 w-5" />
          ) : theme === "sunset" ? (
            <Sunset className="h-5 w-5" />
          ) : theme === "forest" ? (
            <Trees className="h-5 w-5" />
          ) : theme === "purple" ? (
            <Sparkles className="h-5 w-5" />
          ) : theme === "corporate" ? (
            <Briefcase className="h-5 w-5" />
          ) : theme === "material3" ? (
            <Layers className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        <DropdownMenuItem onClick={() => applyTheme("syngene")}>
          <Briefcase className="mr-2 h-4 w-4" />
          Syngene
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("light-grey")}>
          <Palette className="mr-2 h-4 w-4" />
          Light Grey
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("ocean")}>
          <Waves className="mr-2 h-4 w-4" />
          Ocean
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("sunset")}>
          <Sunset className="mr-2 h-4 w-4" />
          Sunset
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("forest")}>
          <Trees className="mr-2 h-4 w-4" />
          Forest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("purple")}>
          <Sparkles className="mr-2 h-4 w-4" />
          Purple
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("corporate")}>
          <Briefcase className="mr-2 h-4 w-4" />
          Corporate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("material3")}>
          <Layers className="mr-2 h-4 w-4" />
          Material 3
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
