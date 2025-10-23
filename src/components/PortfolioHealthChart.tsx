import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ChartData {
  date: string;
  health_score: number;
  on_time: number;
  budget: number;
}

export const PortfolioHealthChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetricsHistory = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('project_metrics_history')
        .select('*')
        .order('snapshot_date', { ascending: true })
        .limit(30);

      if (error) {
        console.error('Error fetching metrics history:', error);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Transform data to chart format
        const transformed = data.map(metric => ({
          date: format(new Date(metric.snapshot_date), 'MMM dd'),
          health_score: calculateHealthScore(metric),
          on_time: metric.delay_percentage ? Math.max(0, 100 - metric.delay_percentage) : 100,
          budget: metric.budget_variance ? Math.max(0, 100 + metric.budget_variance) : 100,
        }));
        setChartData(transformed);
      }
      setIsLoading(false);
    };

    fetchMetricsHistory();
  }, []);

  const calculateHealthScore = (metric: any) => {
    // Calculate health score based on multiple factors
    const ragScore = metric.rag_status === 'Green' ? 100 : metric.rag_status === 'Amber' ? 60 : 30;
    const onTimeScore = metric.delay_percentage ? Math.max(0, 100 - metric.delay_percentage) : 100;
    const budgetScore = metric.budget_variance ? Math.max(0, 100 + metric.budget_variance) : 100;
    const riskScore = metric.critical_risks ? Math.max(0, 100 - (metric.critical_risks * 20)) : 100;
    
    return Math.round((ragScore + onTimeScore + budgetScore + riskScore) / 4);
  };
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Portfolio Health Trends
            </CardTitle>
            <CardDescription className="mt-2">
              Historical performance metrics across the portfolio
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading metrics...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No historical data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="health_score" 
              stroke="hsl(var(--primary))" 
              name="Health Score"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="on_time" 
              stroke="hsl(var(--success))" 
              name="On-Time %"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--success))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="hsl(var(--warning))" 
              name="Budget %"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--warning))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
