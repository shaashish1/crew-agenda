import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

// Mock data - in a real app, this would come from project_metrics_history table
const mockData = [
  { date: '2024-01', health_score: 72, on_time: 68, budget: 85 },
  { date: '2024-02', health_score: 75, on_time: 70, budget: 82 },
  { date: '2024-03', health_score: 78, on_time: 75, budget: 88 },
  { date: '2024-04', health_score: 82, on_time: 78, budget: 90 },
  { date: '2024-05', health_score: 80, on_time: 76, budget: 87 },
  { date: '2024-06', health_score: 85, on_time: 82, budget: 92 },
  { date: '2024-07', health_score: 87, on_time: 85, budget: 94 },
];

export const PortfolioHealthChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Portfolio Health Trends
        </CardTitle>
        <CardDescription>
          Historical performance metrics across the portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="health_score" 
              stroke="hsl(var(--primary))" 
              name="Health Score"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="on_time" 
              stroke="hsl(var(--success))" 
              name="On-Time %"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="hsl(var(--warning))" 
              name="Budget %"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
