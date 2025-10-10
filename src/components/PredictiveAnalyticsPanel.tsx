import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, TrendingUp, AlertTriangle, Calendar, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MilestonePrediction {
  phase_id: string;
  phase_name: string;
  original_target: string;
  predicted_completion: string;
  confidence_score: number;
  risk_factors: string[];
  recommendations: string[];
}

interface RiskForecast {
  risk_category: string;
  risk_description: string;
  probability: number;
  potential_impact: string;
  early_warning_signals: string[];
  preventive_actions: string[];
}

interface PredictiveAnalyticsPanelProps {
  projectId: string;
}

export const PredictiveAnalyticsPanel = ({ projectId }: PredictiveAnalyticsPanelProps) => {
  const [milestones, setMilestones] = useState<MilestonePrediction[]>([]);
  const [risks, setRisks] = useState<RiskForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPredictions = async () => {
    try {
      setLoading(true);

      // Fetch milestone predictions
      const { data: milestoneData, error: milestoneError } = await supabase.functions.invoke(
        'ai-predict-milestones',
        { body: { projectId } }
      );

      if (milestoneError) throw milestoneError;
      if (milestoneData?.predictions?.predictions) {
        setMilestones(milestoneData.predictions.predictions);
      }

      // Fetch risk forecasts
      const { data: riskData, error: riskError } = await supabase.functions.invoke(
        'ai-forecast-risks',
        { body: { projectId } }
      );

      if (riskError) throw riskError;
      if (riskData?.risk_forecast?.predicted_risks) {
        setRisks(riskData.risk_forecast.predicted_risks);
      }

    } catch (error: any) {
      console.error('Error fetching predictions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch predictions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [projectId]);

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getImpactVariant = (impact: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (impact) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predictive Analytics
            </CardTitle>
            <CardDescription>AI-powered forecasts and risk analysis</CardDescription>
          </div>
          <Button onClick={fetchPredictions} variant="outline" size="sm">
            Refresh Predictions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="milestones" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="milestones">
              <Calendar className="h-4 w-4 mr-2" />
              Milestone Forecasts
            </TabsTrigger>
            <TabsTrigger value="risks">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Risk Forecasts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-4 mt-4">
            {milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No milestone predictions available yet
              </p>
            ) : (
              milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{milestone.phase_name}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Original: {new Date(milestone.original_target).toLocaleDateString()}</span>
                        <span>→</span>
                        <span>Predicted: {new Date(milestone.predicted_completion).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getConfidenceColor(milestone.confidence_score)}`}>
                        {milestone.confidence_score}% Confidence
                      </div>
                    </div>
                  </div>

                  {milestone.risk_factors && milestone.risk_factors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2">Risk Factors:</p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.risk_factors.map((risk, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {milestone.recommendations && milestone.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2">Recommendations:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {milestone.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-muted-foreground">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="risks" className="space-y-4 mt-4">
            {risks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No risk forecasts available yet
              </p>
            ) : (
              risks.map((risk, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{risk.risk_category}</h4>
                        <Badge variant={getImpactVariant(risk.potential_impact)}>
                          {risk.potential_impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{risk.risk_description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-warning">{risk.probability}%</div>
                      <div className="text-xs text-muted-foreground">Probability</div>
                    </div>
                  </div>

                  {risk.early_warning_signals && risk.early_warning_signals.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Early Warning Signals:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {risk.early_warning_signals.map((signal, i) => (
                          <li key={i} className="text-xs text-muted-foreground">{signal}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {risk.preventive_actions && risk.preventive_actions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2 flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Preventive Actions:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {risk.preventive_actions.map((action, i) => (
                          <li key={i} className="text-xs text-muted-foreground">{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
