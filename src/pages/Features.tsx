import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  FolderKanban, 
  ListChecks, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Calendar,
  CheckCircle2,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  Clock,
  Target,
  DollarSign,
  Activity,
  PieChart,
  TrendingDown,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RePieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const Features = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for charts - inspired by reference design
  const projectStatusData = [
    { name: 'On Track', value: 45, color: 'hsl(var(--success))' },
    { name: 'At Risk', value: 30, color: 'hsl(var(--warning))' },
    { name: 'Critical', value: 15, color: 'hsl(var(--destructive))' },
    { name: 'Completed', value: 10, color: 'hsl(var(--primary))' }
  ];

  const monthlyProgressData = [
    { month: 'Jan', completed: 12, onTrack: 18, atRisk: 8, critical: 3 },
    { month: 'Feb', completed: 15, onTrack: 20, atRisk: 6, critical: 2 },
    { month: 'Mar', completed: 18, onTrack: 22, atRisk: 7, critical: 4 },
    { month: 'Apr', completed: 22, onTrack: 25, atRisk: 5, critical: 2 },
    { month: 'May', completed: 28, onTrack: 27, atRisk: 6, critical: 3 },
    { month: 'Jun', completed: 32, onTrack: 30, atRisk: 4, critical: 1 }
  ];

  const performanceTrendData = [
    { month: 'Jan', performance: 72, budget: 85, timeline: 68 },
    { month: 'Feb', performance: 75, budget: 82, timeline: 73 },
    { month: 'Mar', performance: 78, budget: 88, timeline: 76 },
    { month: 'Apr', performance: 82, budget: 90, timeline: 80 },
    { month: 'May', performance: 85, budget: 87, timeline: 83 },
    { month: 'Jun', performance: 88, budget: 92, timeline: 87 }
  ];

  const documentMetrics = [
    { phase: 'Initiation', total: 25, completed: 22, pending: 3 },
    { phase: 'Planning', total: 45, completed: 38, pending: 7 },
    { phase: 'Execution', total: 60, completed: 42, pending: 18 },
    { phase: 'Monitoring', total: 35, completed: 28, pending: 7 },
    { phase: 'Closeout', total: 20, completed: 12, pending: 8 }
  ];

  const radarMetrics = [
    { metric: 'Budget', value: 85 },
    { metric: 'Timeline', value: 78 },
    { metric: 'Quality', value: 92 },
    { metric: 'Resources', value: 75 },
    { metric: 'Risk', value: 88 },
    { metric: 'Stakeholder', value: 90 }
  ];

  const statsCards = [
    {
      title: "Active Projects",
      value: "42",
      change: "+12%",
      trend: "up",
      icon: FolderKanban,
      color: "text-primary"
    },
    {
      title: "On-Time Delivery",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: Clock,
      color: "text-success"
    },
    {
      title: "Budget Health",
      value: "92%",
      change: "+3%",
      trend: "up",
      icon: DollarSign,
      color: "text-accent"
    },
    {
      title: "Team Utilization",
      value: "76%",
      change: "-2%",
      trend: "down",
      icon: Users,
      color: "text-warning"
    }
  ];

  const featureCategories = [
    {
      title: "Project Management",
      icon: FolderKanban,
      color: "text-primary",
      features: [
        {
          name: "Multi-Project Portfolio",
          description: "Manage multiple IT projects from a centralized dashboard",
          icon: FolderKanban
        },
        {
          name: "8-Phase Project Lifecycle",
          description: "Structured phases from Initiation to Closeout with gate approvals",
          icon: CheckCircle2
        },
        {
          name: "Phase-Based Workflows",
          description: "Track progress through each project phase with completion metrics",
          icon: Calendar
        }
      ]
    },
    {
      title: "Document Management",
      icon: FileText,
      color: "text-accent",
      features: [
        {
          name: "100+ Document Templates",
          description: "Pre-defined templates for all project phases and deliverables",
          icon: FileText
        },
        {
          name: "Document Checklist",
          description: "Select and track required documents per project phase",
          icon: ListChecks
        },
        {
          name: "Critical Milestone Tracking",
          description: "Identify and monitor critical document deliverables",
          icon: AlertTriangle
        }
      ]
    },
    {
      title: "Performance Tracking",
      icon: TrendingUp,
      color: "text-success",
      features: [
        {
          name: "Performance Ratings",
          description: "Automated performance evaluation: Critical, High, Medium, Low",
          icon: TrendingUp
        },
        {
          name: "Project Delay Tracking",
          description: "Monitor milestone delays and calculate delay percentages",
          icon: BarChart3
        },
        {
          name: "User Adoption Metrics",
          description: "Track post-deployment user adoption rates",
          icon: Users
        }
      ]
    },
    {
      title: "Vendor Management",
      icon: Shield,
      color: "text-warning",
      features: [
        {
          name: "Vendor Contracts",
          description: "Track NDA, MSA, SOW, SLA and other vendor agreements",
          icon: Shield
        },
        {
          name: "Vendor Deliverables",
          description: "Monitor vendor document submissions and approvals",
          icon: CheckCircle2
        },
        {
          name: "Vendor Performance",
          description: "Evaluate vendor performance throughout project lifecycle",
          icon: BarChart3
        }
      ]
    }
  ];

  const usageSteps = [
    {
      step: 1,
      title: "Create Your Project",
      description: "Define project basics: name, PM, budget, timeline, and RAG status",
      icon: FolderKanban
    },
    {
      step: 2,
      title: "Select Project Phase",
      description: "Choose current phase from 8-phase lifecycle (Initiation to Closeout)",
      icon: Calendar
    },
    {
      step: 3,
      title: "Choose Document Deliverables",
      description: "Multi-select required documents from 100+ templates for your phase",
      icon: ListChecks
    },
    {
      step: 4,
      title: "Track Milestones",
      description: "Add key milestones, track completion, and monitor delays",
      icon: CheckCircle2
    },
    {
      step: 5,
      title: "Manage Risks",
      description: "Log project risks, mitigation plans, and monitor RAG status",
      icon: AlertTriangle
    },
    {
      step: 6,
      title: "Monitor Performance",
      description: "View automated performance ratings based on delays and adoption",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative py-16 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-50" />
        <div className="relative max-w-4xl mx-auto space-y-6">
          <Badge className="mb-4 animate-fade-in" variant="outline">Complete IT Project Management Platform</Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            ProjectHub Features & Analytics
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in">
            Real-time insights and comprehensive management tools for IT excellence
          </p>
          <div className="flex gap-4 justify-center pt-4 animate-fade-in">
            <Button onClick={() => navigate("/projects/new")} size="lg" className="gap-2 group">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button onClick={() => navigate("/projects")} variant="outline" size="lg">
              View Projects
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-12">
        {/* Stats Overview - Inspired by reference design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {statsCards.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="border-2 hover:shadow-premium-lg transition-all duration-300 hover:scale-105 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <div className="flex items-center gap-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                      <span className={`text-sm font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="py-3">Overview</TabsTrigger>
            <TabsTrigger value="projects" className="py-3">Project Management</TabsTrigger>
            <TabsTrigger value="documents" className="py-3">Document Management</TabsTrigger>
            <TabsTrigger value="performance" className="py-3">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Status Distribution */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    Project Status Distribution
                  </CardTitle>
                  <CardDescription>Current portfolio health overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Radar */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Portfolio Health Radar
                  </CardTitle>
                  <CardDescription>Multi-dimensional performance view</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarMetrics}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="metric" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar 
                        name="Performance" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Progress Trends */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-success" />
                  Monthly Project Progress
                </CardTitle>
                <CardDescription>Tracking project completion and status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
                    <Bar dataKey="onTrack" fill="hsl(var(--success))" name="On Track" />
                    <Bar dataKey="atRisk" fill="hsl(var(--warning))" name="At Risk" />
                    <Bar dataKey="critical" fill="hsl(var(--destructive))" name="Critical" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Management Tab */}
          <TabsContent value="projects" className="space-y-6">
            {/* Performance Trend Line Chart */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Project Performance Trends
                </CardTitle>
                <CardDescription>Track key metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={performanceTrendData}>
                    <defs>
                      <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTimeline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorPerformance)" 
                      name="Performance Score"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="budget" 
                      stroke="hsl(var(--success))" 
                      fillOpacity={1} 
                      fill="url(#colorBudget)" 
                      name="Budget Health"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="timeline" 
                      stroke="hsl(var(--accent))" 
                      fillOpacity={1} 
                      fill="url(#colorTimeline)" 
                      name="Timeline Score"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Project Management Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform">
                      <FolderKanban className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Multi-Project Portfolio</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={87} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Portfolio Health</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Centralized management across all IT projects</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-success/10 to-primary/10 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-success" />
                    </div>
                    <CardTitle className="text-lg">8-Phase Lifecycle</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={62} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Phase</span>
                    <span className="font-semibold">Phase 5/8</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Structured phases with gate approvals</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-warning/10 group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">Milestone Tracking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={78} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Milestones Met</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Real-time milestone and deadline monitoring</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Document Management Tab */}
          <TabsContent value="documents" className="space-y-6">
            {/* Document Completion by Phase */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Document Completion by Phase
                </CardTitle>
                <CardDescription>Track document deliverables across project phases</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={documentMetrics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis 
                      dataKey="phase" 
                      type="category" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="hsl(var(--success))" name="Completed" stackId="a" />
                    <Bar dataKey="pending" fill="hsl(var(--warning))" name="Pending" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Document Management Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">100+ Templates</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">185</div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Total Documents</p>
                      <Progress value={92} className="h-2 mt-1" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Pre-defined templates for all phases</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-success/10 to-primary/10 group-hover:scale-110 transition-transform">
                      <ListChecks className="w-6 h-6 text-success" />
                    </div>
                    <CardTitle className="text-lg">Smart Checklist</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">142</div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Tracked Documents</p>
                      <Progress value={76} className="h-2 mt-1" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Phase-based document tracking</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-destructive/10 to-warning/10 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <CardTitle className="text-lg">Critical Tracking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">28</div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Critical Docs</p>
                      <Progress value={89} className="h-2 mt-1" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Monitor critical deliverables</p>
                </CardContent>
              </Card>
            </div>

            {/* Document Status Table */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-accent" />
                  Document Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentMetrics.map((phase, index) => (
                    <div key={phase.phase} className="space-y-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="min-w-[100px]">{phase.phase}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {phase.completed} of {phase.total} completed
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          {Math.round((phase.completed / phase.total) * 100)}%
                        </span>
                      </div>
                      <Progress value={(phase.completed / phase.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="w-8 h-8 text-success" />
                    <Badge variant="outline" className="bg-success/10">+8%</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <h3 className="text-3xl font-bold mt-1">94%</h3>
                  </div>
                  <Progress value={94} className="h-2" />
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Clock className="w-8 h-8 text-primary" />
                    <Badge variant="outline" className="bg-primary/10">+5%</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                    <h3 className="text-3xl font-bold mt-1">87%</h3>
                  </div>
                  <Progress value={87} className="h-2" />
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <DollarSign className="w-8 h-8 text-accent" />
                    <Badge variant="outline" className="bg-accent/10">+3%</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Adherence</p>
                    <h3 className="text-3xl font-bold mt-1">92%</h3>
                  </div>
                  <Progress value={92} className="h-2" />
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-premium-lg transition-all duration-300">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Users className="w-8 h-8 text-warning" />
                    <Badge variant="outline" className="bg-warning/10">-1%</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resource Efficiency</p>
                    <h3 className="text-3xl font-bold mt-1">76%</h3>
                  </div>
                  <Progress value={76} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Risk & Issues Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Risk Management
                  </CardTitle>
                  <CardDescription>Active risks across portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-destructive" />
                      <div>
                        <p className="font-medium">Critical Risks</p>
                        <p className="text-sm text-muted-foreground">Immediate attention required</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-destructive">8</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <div>
                        <p className="font-medium">High Risks</p>
                        <p className="text-sm text-muted-foreground">Monitor closely</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-warning">15</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium">Mitigated Risks</p>
                        <p className="text-sm text-muted-foreground">Successfully resolved</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-success">42</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Performance Ratings
                  </CardTitle>
                  <CardDescription>Automated project evaluations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive">Critical</Badge>
                      <span className="text-sm font-medium">5 projects</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-warning/10 text-warning">High</Badge>
                      <span className="text-sm font-medium">12 projects</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-primary/10 text-primary">Medium</Badge>
                      <span className="text-sm font-medium">18 projects</span>
                    </div>
                    <Progress value={43} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-success/10 text-success">Low</Badge>
                      <span className="text-sm font-medium">7 projects</span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureCategories.map((category, index) => (
            <Card 
              key={category.title} 
              className="border-2 hover:shadow-premium-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.features.map((feature) => (
                  <div key={feature.name} className="flex gap-3 group">
                    <feature.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${category.color} group-hover:scale-110 transition-transform`} />
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">{feature.name}</div>
                      <div className="text-sm text-muted-foreground">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <CardContent className="text-center space-y-6 py-12">
            <h2 className="text-3xl font-bold">Ready to Transform Your Project Management?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join leading IT project managers who use ProjectHub to deliver successful projects on time and within budget
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={() => navigate("/projects/new")} size="lg" className="gap-2 group px-14 py-4 hover:-translate-y-1 duration-300 animate-fade-in">
                Create Your First Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => navigate("/dashboard")} variant="outline" size="lg" className="px-14 py-4 hover:-translate-y-1 duration-300 animate-fade-in">
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Features;
