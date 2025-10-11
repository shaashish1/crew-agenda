import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Target, 
  BarChart3, 
  FileText, 
  Lightbulb,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  XCircle,
  Activity
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useTaskContext } from "@/contexts/TaskContext";
import { RAGStatusBadge } from "@/components/RAGStatusBadge";
import { Badge } from "@/components/ui/badge";

const Landing = () => {
  const navigate = useNavigate();
  const { projects } = useProjectContext();
  const { tasks } = useTaskContext();

  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => {
    const goLiveDate = new Date(p.goLiveDate);
    const hypercareEndDate = new Date(p.hypercareEndDate);
    const now = new Date();
    return now < hypercareEndDate;
  }).length;
  const completedProjects = projects.filter(p => {
    const hypercareEndDate = new Date(p.hypercareEndDate);
    return new Date() >= hypercareEndDate;
  }).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const overdueTasks = tasks.filter(t => t.status !== 'done' && t.targetDate && new Date(t.targetDate) < new Date()).length;
  
  const redProjects = projects.filter(p => p.overallRAG === 'red').length;
  const amberProjects = projects.filter(p => p.overallRAG === 'amber').length;
  const greenProjects = projects.filter(p => p.overallRAG === 'green').length;

  const kras = [
    {
      title: "On-Time Delivery",
      measure: "% of projects delivered by target date",
      target: "≥ 85%",
      description: "Track milestone completion and identify delays early"
    },
    {
      title: "Budget Adherence",
      measure: "% of projects within approved budget",
      target: "≥ 90%",
      description: "Monitor spending and flag budget variances proactively"
    },
    {
      title: "Quality Standards",
      measure: "% of deliverables meeting acceptance criteria",
      target: "≥ 95%",
      description: "Ensure all outputs meet defined quality benchmarks"
    },
    {
      title: "Stakeholder Satisfaction",
      measure: "Average satisfaction score from key stakeholders",
      target: "≥ 4.0/5.0",
      description: "Regular feedback and transparent communication"
    }
  ];

  const bestPractices = [
    {
      icon: CheckCircle2,
      title: "DO: Update Status Weekly",
      description: "Update project RAG status every week with clear justifications. This enables accurate reporting and early risk detection.",
      type: "do"
    },
    {
      icon: CheckCircle2,
      title: "DO: Log All Tasks & Milestones",
      description: "Record all work items in the system. Complete task tracking provides visibility into team capacity and project health.",
      type: "do"
    },
    {
      icon: CheckCircle2,
      title: "DO: Document Risks Promptly",
      description: "Add risks to the register as soon as identified. Early documentation allows for proactive mitigation planning.",
      type: "do"
    },
    {
      icon: XCircle,
      title: "DON'T: Skip Status Updates",
      description: "Never skip weekly updates even if 'nothing changed'. Outdated data leads to poor decisions and missed opportunities to help.",
      type: "dont"
    },
    {
      icon: XCircle,
      title: "DON'T: Update Only Before Reviews",
      description: "Avoid last-minute data entry before meetings. This creates inaccurate historical data and defeats real-time monitoring.",
      type: "dont"
    },
    {
      icon: XCircle,
      title: "DON'T: Leave Fields Incomplete",
      description: "Don't save projects or tasks with missing critical fields. Complete data ensures meaningful analytics and reporting.",
      type: "dont"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                ProjectHub
              </h1>
              <div className="hidden md:flex gap-4">
                <Button variant="ghost" onClick={() => navigate("/projects")}>Projects</Button>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>Tasks</Button>
                <Button variant="ghost" onClick={() => navigate("/features")}>Features</Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button onClick={() => navigate("/projects")} size="lg" className="shadow-md">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Welcome to Digital IT PMO
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your central hub for managing IT projects, tracking performance, and delivering value across the organization
            </p>
          </div>

          {/* Portfolio Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{totalProjects}</div>
                <p className="text-sm text-muted-foreground mt-1">{activeProjects} active</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-success/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">Project Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-success">{greenProjects}</div>
                    <div className="text-xs text-muted-foreground">Green</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-warning">{amberProjects}</div>
                    <div className="text-xs text-muted-foreground">Amber</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-destructive">{redProjects}</div>
                    <div className="text-xs text-muted-foreground">Red</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">Task Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{completedTasks}/{totalTasks}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% complete
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">Overdue Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{overdueTasks}</div>
                <p className="text-sm text-muted-foreground mt-1">Require attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/projects")} size="lg" className="shadow-lg">
              View All Projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="outline" size="lg">
              Manage Tasks
            </Button>
          </div>
        </div>
      </section>

      {/* KRA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Key Result Areas (KRAs) & Performance Measurement
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our Digital IT team's success is measured by these critical performance indicators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {kras.map((kra, index) => (
              <Card key={index} className="border-2 border-primary/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{kra.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">Target: {kra.target}</Badge>
                    </div>
                    <Target className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    <strong>Measure:</strong> {kra.measure}
                  </p>
                  <p className="text-sm text-muted-foreground">{kra.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Data Quality is Everyone's Responsibility
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Accurate, timely data enables better decision-making, effective resource allocation, and demonstrates our team's value to the organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {bestPractices.map((practice, index) => (
              <Card 
                key={index} 
                className={`border-2 ${
                  practice.type === 'do' 
                    ? 'border-success/30 bg-success/5' 
                    : 'border-destructive/30 bg-destructive/5'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      practice.type === 'do' 
                        ? 'bg-success/20' 
                        : 'bg-destructive/20'
                    }`}>
                      <practice.icon className={`w-5 h-5 ${
                        practice.type === 'do' ? 'text-success' : 'text-destructive'
                      }`} />
                    </div>
                    <CardTitle className="text-lg">{practice.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{practice.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" />
                <CardTitle>Why Data Quality Matters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Better Reporting:</strong> Leadership can make informed decisions about priorities and resource allocation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Proactive Risk Management:</strong> Early visibility into issues allows us to address problems before they escalate
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Team Credibility:</strong> Consistent, accurate updates demonstrate professionalism and build stakeholder trust
                </p>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Performance Visibility:</strong> Accurate data showcases our team's contributions and value to the organization
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/projects")}>
              <CardHeader>
                <Target className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-lg">Manage Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View portfolio, update RAG status, track budgets and milestones</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/dashboard")}>
              <CardHeader>
                <CheckCircle2 className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-lg">Track Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage assignments, update progress, and close completed items</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/features")}>
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-lg">View Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Access dashboards, generate status reports, and analyze performance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 ProjectHub. Built for IT Project Managers and PMO Offices.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
