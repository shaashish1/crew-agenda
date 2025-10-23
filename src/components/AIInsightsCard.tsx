import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Info, TrendingUp, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  severity: string;
  affected_projects: string[];
  action_items: string[];
  generated_at: string;
  status: string;
}

interface AIInsightsCardProps {
  insight: AIInsight;
  onStatusChange?: () => void;
}

export const AIInsightsCard = ({ insight, onStatusChange }: AIInsightsCardProps) => {
  const { toast } = useToast();

  const getIcon = () => {
    switch (insight.insight_type) {
      case 'risk_alert':
        return <AlertCircle className="h-4 w-4" />;
      case 'opportunity':
        return <TrendingUp className="h-4 w-4" />;
      case 'recommendation':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    switch (insight.severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleAcknowledge = async () => {
    try {
      const { error } = await supabase
        .from('ai_insights' as any)
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: 'Current User' // In a real app, this would be the actual user
        })
        .eq('id', insight.id);

      if (error) throw error;

      toast({
        title: "Insight acknowledged",
        description: "The insight has been marked as acknowledged",
      });

      onStatusChange?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to acknowledge insight",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = async () => {
    try {
      const { error } = await supabase
        .from('ai_insights' as any)
        .update({ status: 'dismissed' })
        .eq('id', insight.id);

      if (error) throw error;

      toast({
        title: "Insight dismissed",
        description: "The insight has been dismissed",
      });

      onStatusChange?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to dismiss insight",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-l-4" style={{
      borderLeftColor: insight.severity === 'critical' || insight.severity === 'high' 
        ? 'hsl(var(--destructive))' 
        : insight.severity === 'medium' 
        ? 'hsl(var(--warning))' 
        : 'hsl(var(--primary))'
    }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            {getIcon()}
            <div>
              <CardTitle className="text-base">{insight.title}</CardTitle>
              <CardDescription className="text-xs">
                {new Date(insight.generated_at).toLocaleDateString()} at{' '}
                {new Date(insight.generated_at).toLocaleTimeString()}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getSeverityVariant()}>
              {insight.severity}
            </Badge>
            {insight.status === 'new' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleDismiss}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{insight.description}</p>
        
        {insight.affected_projects && insight.affected_projects.length > 0 && (
          <div className="text-xs">
            <span className="font-medium">Affected Projects: </span>
            <span className="text-muted-foreground">
              {insight.affected_projects.join(', ')}
            </span>
          </div>
        )}

        {insight.action_items && insight.action_items.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium">Action Items:</p>
            <ul className="list-disc list-inside space-y-1">
              {insight.action_items.map((item, index) => (
                <li key={index} className="text-xs text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {insight.status === 'new' && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={handleAcknowledge}
            >
              Acknowledge
            </Button>
          </div>
        )}

        {insight.status !== 'new' && (
          <Badge variant="outline" className="mt-2">
            Status: {insight.status}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
