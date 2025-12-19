import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  className?: string;
  delay?: number;
}

export const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features = [],
  className,
  delay = 0 
}: ServiceCardProps) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-2 border-border/50 bg-card",
        "transition-all duration-300 ease-out",
        "hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <CardContent className="relative p-6 md:p-8">
        {/* Icon container */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
            <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>

        {/* Features list */}
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li 
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
