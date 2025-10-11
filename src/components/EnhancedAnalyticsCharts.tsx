import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ResourceUtilization } from "@/types/project";

// Sample data - in production, this would come from the AI insights
const projectPerformanceData = [
  { month: 'Jan', onTrack: 65, atRisk: 20, critical: 15 },
  { month: 'Feb', onTrack: 70, atRisk: 18, critical: 12 },
  { month: 'Mar', onTrack: 68, atRisk: 22, critical: 10 },
  { month: 'Apr', onTrack: 75, atRisk: 15, critical: 10 },
  { month: 'May', onTrack: 72, atRisk: 18, critical: 10 },
  { month: 'Jun', onTrack: 80, atRisk: 12, critical: 8 },
];

const budgetVarianceData = [
  { month: 'Jan', planned: 4000, actual: 4200, variance: -200 },
  { month: 'Feb', planned: 3800, actual: 3600, variance: 200 },
  { month: 'Mar', planned: 4200, actual: 4500, variance: -300 },
  { month: 'Apr', planned: 4500, actual: 4400, variance: 100 },
  { month: 'May', planned: 4800, actual: 4700, variance: 100 },
  { month: 'Jun', planned: 5000, actual: 4900, variance: 100 },
];

const radarData = [
  { metric: 'Time', value: 85, fullMark: 100 },
  { metric: 'Budget', value: 78, fullMark: 100 },
  { metric: 'Quality', value: 92, fullMark: 100 },
  { metric: 'Resources', value: 73, fullMark: 100 },
  { metric: 'Risks', value: 88, fullMark: 100 },
  { metric: 'Stakeholder', value: 95, fullMark: 100 },
];

const projectTypeDistribution = [
  { name: 'Infrastructure', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Applications', value: 28, color: 'hsl(var(--accent))' },
  { name: 'Security', value: 20, color: 'hsl(var(--success))' },
  { name: 'Data', value: 17, color: 'hsl(var(--warning))' },
];

const resourceUtilizationData = [
  { dept: 'Engineering', allocated: 85, available: 15 },
  { dept: 'Design', allocated: 72, available: 28 },
  { dept: 'QA', allocated: 90, available: 10 },
  { dept: 'DevOps', allocated: 68, available: 32 },
  { dept: 'Data', allocated: 80, available: 20 },
];

interface EnhancedAnalyticsChartsProps {
  resourceData?: ResourceUtilization[];
}

export const EnhancedAnalyticsCharts = ({ resourceData }: EnhancedAnalyticsChartsProps) => {
  // Transform resource data for the chart
  const chartResourceData = resourceData && resourceData.length > 0
    ? resourceData.map(r => ({
        dept: r.department,
        allocated: r.allocatedPercentage,
        available: 100 - r.allocatedPercentage
      }))
    : resourceUtilizationData;
  return (
    <div className="space-y-6">
      {/* Project Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance Trends</CardTitle>
          <CardDescription>6-month project status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={projectPerformanceData}>
              <defs>
                <linearGradient id="colorOnTrack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="onTrack" stackId="1" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorOnTrack)" name="On Track %" />
              <Area type="monotone" dataKey="atRisk" stackId="1" stroke="hsl(var(--warning))" fillOpacity={1} fill="url(#colorAtRisk)" name="At Risk %" />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorCritical)" name="Critical %" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Health Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Health Radar</CardTitle>
            <CardDescription>Multi-dimensional performance assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Radar 
                  name="Performance" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Type Distribution</CardTitle>
            <CardDescription>Portfolio composition by project category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {projectTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Variance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Variance Analysis</CardTitle>
          <CardDescription>Planned vs Actual spending with variance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetVarianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Legend />
              <Bar dataKey="planned" fill="hsl(var(--primary))" name="Planned ($K)" />
              <Bar dataKey="actual" fill="hsl(var(--accent))" name="Actual ($K)" />
              <Bar dataKey="variance" fill="hsl(var(--success))" name="Variance ($K)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resource Utilization by Department */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization by Department</CardTitle>
          <CardDescription>Current allocation across teams</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartResourceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="dept" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Legend />
              <Bar dataKey="allocated" stackId="a" fill="hsl(var(--primary))" name="Allocated %" />
              <Bar dataKey="available" stackId="a" fill="hsl(var(--muted))" name="Available %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
