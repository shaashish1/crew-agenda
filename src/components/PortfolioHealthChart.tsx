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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
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
      </CardContent>
    </Card>
  );
};
