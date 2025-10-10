import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  DollarSign,
  Users,
  Target,
  Sparkles,
  RefreshCw,
  BrainCircuit
} from "lucide-react";
import { AIInsightsCard } from "./AIInsightsCard";
import { PortfolioHealthChart } from "./PortfolioHealthChart";
import { EnhancedAnalyticsCharts } from "./EnhancedAnalyticsCharts";

interface PortfolioInsights {
  executive_summary: string;
  portfolio_health_score: number;
  health_justification: string;
  critical_attention_count: number;
  critical_projects: Array<{
    project_id: string;
    reason: string;
    urgency: 'immediate' | 'this_week' | 'this_month';
  }>;
  opportunities: string[];
  recommended_interventions: Array<{
    action: string;
    expected_impact: string;
    urgency: 'immediate' | 'this_week' | 'this_month';
    affected_projects: string[];
  }>;
  trend_analysis: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
}

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

export const AIExecutiveDashboard = () => {
  const [insights, setInsights] = useState<PortfolioInsights | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchPortfolioInsights = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase.functions.invoke('ai-portfolio-insights');

      if (error) throw error;

      if (data?.insights) {
        setInsights(data.insights);
      }

      // Fetch stored insights from database
      const { data: dbInsights, error: dbError } = await supabase
        .from('ai_insights' as any)
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(10);

      if (dbError) throw dbError;

      if (dbInsights) {
        setAIInsights(dbInsights as any as AIInsight[]);
      }

      toast({
        title: "Insights refreshed",
        description: "Portfolio analysis updated successfully",
      });

    } catch (error: any) {
      console.error('Error fetching insights:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch portfolio insights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPortfolioInsights();
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return "bg-success/10 border-success/20";
    if (score >= 60) return "bg-warning/10 border-warning/20";
    return "bg-destructive/10 border-destructive/20";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'destructive';
      case 'this_week': return 'warning';
      case 'this_month': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">AI-Powered Executive Dashboard</h1>
            <p className="text-muted-foreground">Real-time portfolio analytics and predictive insights</p>
          </div>
        </div>
        <Button 
          onClick={fetchPortfolioInsights} 
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      {/* Portfolio Health Score */}
      {insights && (
        <Card className={`border-2 ${getHealthBgColor(insights.portfolio_health_score)}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Portfolio Health Score
              </span>
              <span className={`text-4xl font-bold ${getHealthColor(insights.portfolio_health_score)}`}>
                {insights.portfolio_health_score}/100
              </span>
            </CardTitle>
            <CardDescription>{insights.health_justification}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{insights.executive_summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Projects</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.critical_attention_count}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improving</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.trend_analysis?.improving?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Projects on upward trend</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <TrendingDown className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.trend_analysis?.declining?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Declining performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.opportunities?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Growth opportunities identified</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Attention Required */}
      {insights && insights.critical_projects && insights.critical_projects.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Critical Attention Required
            </CardTitle>
            <CardDescription>Projects that need immediate executive intervention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.critical_projects.map((project, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg bg-card">
                  <div className="flex-1">
                    <p className="font-medium">Project {project.project_id}</p>
                    <p className="text-sm text-muted-foreground mt-1">{project.reason}</p>
                  </div>
                  <Badge variant={getUrgencyColor(project.urgency) as any}>
                    {project.urgency.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {insights && insights.recommended_interventions && insights.recommended_interventions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Actionable insights to improve portfolio performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.recommended_interventions.map((intervention, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <p className="font-medium">{intervention.action}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{intervention.expected_impact}</p>
                    {intervention.affected_projects && intervention.affected_projects.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Affects: {intervention.affected_projects.join(', ')}
                      </p>
                    )}
                  </div>
                  <Badge variant={getUrgencyColor(intervention.urgency) as any}>
                    {intervention.urgency.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities */}
      {insights && insights.opportunities && insights.opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-success" />
              Growth Opportunities
            </CardTitle>
            <CardDescription>Areas for potential optimization and improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.opportunities.map((opportunity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">{opportunity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recent AI Insights */}
      {aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Insights</CardTitle>
            <CardDescription>Latest automated insights from portfolio analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.slice(0, 5).map((insight) => (
                <AIInsightsCard key={insight.id} insight={insight} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Health Chart */}
      <PortfolioHealthChart />

      {/* Enhanced Analytics and Charts */}
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold mb-6">Advanced Analytics Dashboard</h2>
        <EnhancedAnalyticsCharts />
      </div>
    </div>
  );
};
