import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type Font = "inter" | "roboto" | "opensans" | "poppins" | "lato" | "montserrat";

const fontLabels: Record<Font, string> = {
  inter: "Inter",
  roboto: "Roboto",
  opensans: "Open Sans",
  poppins: "Poppins",
  lato: "Lato",
  montserrat: "Montserrat",
};

export const FontSelector = () => {
  const [font, setFont] = useState<Font>("inter");

  useEffect(() => {
    const savedFont = (localStorage.getItem("font") as Font) || "inter";
    applyFont(savedFont);
  }, []);

  const applyFont = (newFont: Font) => {
    setFont(newFont);
    localStorage.setItem("font", newFont);
    document.documentElement.style.fontFamily = `var(--font-${newFont})`;
    document.documentElement.classList.remove("font-inter", "font-roboto", "font-opensans", "font-poppins", "font-lato", "font-montserrat");
    document.documentElement.classList.add(`font-${newFont}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Select font"
        >
          <Type className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        {(Object.keys(fontLabels) as Font[]).map((fontKey) => (
          <DropdownMenuItem
            key={fontKey}
            onClick={() => applyFont(fontKey)}
            className={`font-${fontKey}`}
          >
            <Type className="mr-2 h-4 w-4" />
            {fontLabels[fontKey]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
