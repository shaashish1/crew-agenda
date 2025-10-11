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
  Activity,
  Award,
  Rocket
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useTaskContext } from "@/contexts/TaskContext";
import { RAGStatusBadge } from "@/components/RAGStatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import heroProjects from "@/assets/hero-projects.png";
import heroPerformance from "@/assets/hero-performance.png";
import heroDelivery from "@/assets/hero-delivery.png";
import iconTarget from "@/assets/icon-target.png";
import iconGrowth from "@/assets/icon-growth.png";
import iconQuality from "@/assets/icon-quality.png";
import iconSatisfaction from "@/assets/icon-satisfaction.png";

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

  // Defaulters - projects not updated in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const projectDefaulters = projects.filter(p => {
    const lastUpdate = new Date(p.updatedAt);
    return lastUpdate < sevenDaysAgo && new Date() < new Date(p.hypercareEndDate);
  }).length;

  // Budget at risk - projects where actual spent exceeds TCO
  const overBudgetProjects = projects.filter(p => p.actualSpent > p.tco).length;

  // Tasks not progressed recently
  const taskDefaulters = tasks.filter(t => {
    if (t.status === 'done') return false;
    // Count tasks with no progress comments or not updated recently
    return !t.progressComments || t.progressComments.trim() === '';
  }).length;

  // Calculate performance metrics
  const onTimeDeliveryRate = totalProjects > 0 
    ? Math.round((completedProjects / totalProjects) * 100) 
    : 0;
  const budgetAdherenceRate = projects.length > 0 
    ? Math.round(((projects.length - overBudgetProjects) / projects.length) * 100) 
    : 100;
  const taskCompletionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  const dataQualityScore = projects.length > 0 
    ? Math.round(((projects.length - projectDefaulters) / projects.length) * 100) 
    : 100;

  const performanceMetrics = [
    {
      title: "Our Delivery Excellence",
      value: `${onTimeDeliveryRate}%`,
      trend: onTimeDeliveryRate >= 85 ? "positive" : "warning",
      description: "Projects we delivered on schedule"
    },
    {
      title: "Our Budget Performance",
      value: `${budgetAdherenceRate}%`,
      trend: budgetAdherenceRate >= 90 ? "positive" : "warning",
      description: "Projects we kept within budget"
    },
    {
      title: "Our Task Completion",
      value: `${taskCompletionRate}%`,
      trend: taskCompletionRate >= 80 ? "positive" : "warning",
      description: "Tasks we have completed"
    },
    {
      title: "Our Data Quality",
      value: `${dataQualityScore}%`,
      trend: dataQualityScore >= 90 ? "positive" : "warning",
      description: "Our projects with timely updates"
    }
  ];

  const kras = [
    {
      title: "On-Time Delivery",
      measure: "% of our projects delivered by target date",
      target: "≥ 85%",
      description: "We track milestone completion and identify delays early to keep our commitments",
      icon: iconTarget
    },
    {
      title: "Budget Adherence",
      measure: "% of our projects within approved budget",
      target: "≥ 90%",
      description: "We monitor our spending and flag budget variances proactively",
      icon: iconGrowth
    },
    {
      title: "Quality Standards",
      measure: "% of our deliverables meeting acceptance criteria",
      target: "≥ 95%",
      description: "We ensure all our outputs meet defined quality benchmarks",
      icon: iconQuality
    },
    {
      title: "Stakeholder Satisfaction",
      measure: "Average satisfaction score from our key stakeholders",
      target: "≥ 4.0/5.0",
      description: "We maintain regular feedback and transparent communication with stakeholders",
      icon: iconSatisfaction
    },
    {
      title: "Resource Utilization",
      measure: "% of team capacity effectively allocated",
      target: "≥ 80%",
      description: "We optimize our team workload to balance productivity and prevent burnout",
      icon: iconTarget
    },
    {
      title: "Change Request Management",
      measure: "Average time to assess and respond to change requests",
      target: "≤ 3 days",
      description: "We respond quickly to business needs while maintaining project stability",
      icon: iconGrowth
    },
    {
      title: "Risk Mitigation",
      measure: "% of identified risks with active mitigation plans",
      target: "100%",
      description: "We proactively identify and address risks before they impact our delivery",
      icon: iconQuality
    },
    {
      title: "Knowledge Transfer",
      measure: "% of projects with complete documentation",
      target: "≥ 95%",
      description: "We ensure proper handover and documentation for long-term sustainability",
      icon: iconSatisfaction
    },
    {
      title: "Business Value Realization",
      measure: "% of projects achieving stated business benefits",
      target: "≥ 90%",
      description: "We measure and track the actual business value our projects deliver",
      icon: iconTarget
    },
    {
      title: "Team Development",
      measure: "Average skill growth and training hours per team member",
      target: "≥ 40 hrs/year",
      description: "We invest in our team capabilities to stay current with technology trends",
      icon: iconGrowth
    }
  ];

  const bestPractices = [
    {
      icon: CheckCircle2,
      title: "DO: We Update Status Weekly",
      description: "We update our project RAG status every week with clear justifications. This enables accurate reporting and helps us detect risks early.",
      type: "do"
    },
    {
      icon: CheckCircle2,
      title: "DO: We Log All Tasks & Milestones",
      description: "We record all our work items in the system. Complete task tracking gives us visibility into our team capacity and project health.",
      type: "do"
    },
    {
      icon: CheckCircle2,
      title: "DO: We Document Risks Promptly",
      description: "We add risks to the register as soon as we identify them. Early documentation allows us to plan mitigation proactively.",
      type: "do"
    },
    {
      icon: XCircle,
      title: "DON'T: We Never Skip Status Updates",
      description: "We never skip weekly updates even if nothing changed. Outdated data leads to poor decisions and we miss opportunities to get help.",
      type: "dont"
    },
    {
      icon: XCircle,
      title: "DON'T: We Don't Update Only Before Reviews",
      description: "We avoid last-minute data entry before meetings. This creates inaccurate historical data and defeats our real-time monitoring.",
      type: "dont"
    },
    {
      icon: XCircle,
      title: "DON'T: We Don't Leave Fields Incomplete",
      description: "We don't save projects or tasks with missing critical fields. Complete data ensures our analytics and reporting are meaningful.",
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
              <Button onClick={() => navigate("/projects")} size="lg" className="btn-neon shadow-md text-white">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in">
              Our Digital IT Team Hub
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto font-medium">
              Together, we drive digital transformation through disciplined project management and data-driven decisions
            </p>
          </div>

          {/* Hero Carousel */}
          <div className="mb-16 animate-scale-in">
            <Carousel className="w-full max-w-5xl mx-auto" opts={{ loop: true }}>
              <CarouselContent>
                <CarouselItem>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img 
                      src={heroProjects} 
                      alt="Project Management Dashboard" 
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end p-8">
                      <div className="text-left">
                        <h3 className="text-3xl font-bold text-foreground mb-2">Our Unified Portfolio</h3>
                        <p className="text-lg text-muted-foreground">We track all our IT initiatives in one place with real-time insights</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img 
                      src={heroPerformance} 
                      alt="Team Performance Analytics" 
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end p-8">
                      <div className="text-left">
                        <h3 className="text-3xl font-bold text-foreground mb-2">How We Perform</h3>
                        <p className="text-lg text-muted-foreground">We measure our success with comprehensive KPIs and track our team performance</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img 
                      src={heroDelivery} 
                      alt="Value Delivery" 
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end p-8">
                      <div className="text-left">
                        <h3 className="text-3xl font-bold text-foreground mb-2">The Value We Deliver</h3>
                        <p className="text-lg text-muted-foreground">We transform IT operations into strategic business enablers with measurable outcomes</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          {/* Performance Highlights */}
          <div className="mb-8 text-center animate-fade-in">
            <Badge className="mb-3 text-base py-2 px-4" variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              How We Measure Our Performance
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-3">Our Current Performance</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              These metrics are calculated in real-time from the data we enter into the system. Our accuracy depends on our timely updates.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
            {performanceMetrics.map((metric, index) => (
              <Card 
                key={index}
                className={`stat-card-neon border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  metric.trend === 'positive' 
                    ? 'border-success/30 bg-success/5' 
                    : 'border-warning/30 bg-warning/5'
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                    {metric.trend === 'positive' ? (
                      <Award className="w-5 h-5 text-success icon-neon" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-warning icon-neon" />
                    )}
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl font-bold mb-3 ${
                    metric.trend === 'positive' ? 'text-success' : 'text-warning'
                  }`}>
                    {metric.value}
                  </div>
                  <div className="progress-neon h-2 mb-3">
                    <div 
                      className="progress-neon-bar" 
                      style={{ width: metric.value }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Measurement Methodology */}
          <Card className="mb-12 border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20 animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-primary" />
                <CardTitle className="text-2xl">How We Calculate These Numbers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Delivery Excellence Box */}
                <div className="stat-card-neon border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-primary/20">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary icon-neon" />
                    </div>
                    <h4 className="font-bold text-xl text-foreground">Delivery Excellence</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Formula</div>
                      <div className="text-sm text-foreground font-mono bg-primary/5 p-2 rounded">
                        (Completed ÷ Total Projects) × 100
                      </div>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Data Source</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Go-Live Date vs Hypercare End Date comparison. Projects past hypercare = complete.
                      </p>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">What We Track</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Project status, Go-Live dates, Hypercare End dates
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget Performance Box */}
                <div className="stat-card-neon border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-accent/20">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-accent icon-neon" />
                    </div>
                    <h4 className="font-bold text-xl text-foreground">Budget Performance</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-background/50 rounded-lg p-4 border border-accent/10">
                      <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">Formula</div>
                      <div className="text-sm text-foreground font-mono bg-accent/5 p-2 rounded">
                        ((Total - Over Budget) ÷ Total) × 100
                      </div>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-accent/10">
                      <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">Data Source</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Actual Spent vs TCO comparison. When actual exceeds TCO, it's flagged.
                      </p>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-accent/10">
                      <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">What We Track</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        TCO, Actual Spent, Budget variance data
                      </p>
                    </div>
                  </div>
                </div>

                {/* Task Completion Box */}
                <div className="stat-card-neon border-2 border-success/30 bg-gradient-to-br from-success/5 to-transparent rounded-xl p-6 hover:border-success/50 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-success/20">
                    <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success icon-neon" />
                    </div>
                    <h4 className="font-bold text-xl text-foreground">Task Completion</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-background/50 rounded-lg p-4 border border-success/10">
                      <div className="text-xs font-semibold text-success uppercase tracking-wide mb-2">Formula</div>
                      <div className="text-sm text-foreground font-mono bg-success/5 p-2 rounded">
                        (Status = Done ÷ Total Tasks) × 100
                      </div>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-success/10">
                      <div className="text-xs font-semibold text-success uppercase tracking-wide mb-2">Data Source</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Every task created and marked as done in our task management system.
                      </p>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-success/10">
                      <div className="text-xs font-semibold text-success uppercase tracking-wide mb-2">What We Track</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Task status changes, completion dates, assignments
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Quality Box */}
                <div className="stat-card-neon border-2 border-warning/30 bg-gradient-to-br from-warning/5 to-transparent rounded-xl p-6 hover:border-warning/50 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-warning/20">
                    <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-warning icon-neon" />
                    </div>
                    <h4 className="font-bold text-xl text-foreground">Data Quality Score</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-background/50 rounded-lg p-4 border border-warning/10">
                      <div className="text-xs font-semibold text-warning uppercase tracking-wide mb-2">Formula</div>
                      <div className="text-sm text-foreground font-mono bg-warning/5 p-2 rounded">
                        ((Total - Not Updated 7d) ÷ Total) × 100
                      </div>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-warning/10">
                      <div className="text-xs font-semibold text-warning uppercase tracking-wide mb-2">Data Source</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Last updated timestamp on each project record vs current date.
                      </p>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-warning/10">
                      <div className="text-xs font-semibold text-warning uppercase tracking-wide mb-2">What We Track</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Project update timestamps for weekly discipline
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Why Transparency Matters</p>
                    <p className="text-sm text-muted-foreground">
                      By clearly showing how we calculate our metrics, everyone on our team understands what data we need to maintain and why. 
                      Each metric directly reflects our collective discipline in updating project information, tracking tasks, and managing budgets. 
                      When we see a metric drop, we know exactly which data quality issue to address.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Summary Cards */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Our Portfolio at a Glance</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Live data from all our project updates, task tracking, and team inputs. Updated automatically as we work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            <Card className="stat-card-neon border-2 border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary icon-neon" />
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-1">{totalProjects}</div>
                <div className="progress-neon h-2 mb-2 mt-3">
                  <div className="progress-neon-bar" style={{ width: `${(activeProjects / Math.max(totalProjects, 1)) * 100}%` }} />
                </div>
                <p className="text-base text-muted-foreground mt-1">{activeProjects} active</p>
              </CardContent>
            </Card>

            <Card className="stat-card-neon border-2 border-success/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-success icon-neon" />
                  Project Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-success mb-1">{greenProjects}</div>
                    <div className="text-sm text-muted-foreground">Green</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-warning mb-1">{amberProjects}</div>
                    <div className="text-sm text-muted-foreground">Amber</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-destructive mb-1">{redProjects}</div>
                    <div className="text-sm text-muted-foreground">Red</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card-neon border-2 border-accent/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent icon-neon" />
                  Task Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-1">{completedTasks}/{totalTasks}</div>
                <div className="progress-neon h-2 mb-2 mt-3">
                  <div className="progress-neon-bar" style={{ width: `${taskCompletionRate}%` }} />
                </div>
                <p className="text-base text-muted-foreground mt-1">
                  {taskCompletionRate}% complete
                </p>
              </CardContent>
            </Card>

            <Card className="stat-card-neon border-2 border-destructive/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive icon-neon" />
                  Overdue Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-destructive mb-1">{overdueTasks}</div>
                <p className="text-base text-muted-foreground mt-1">Require attention</p>
              </CardContent>
            </Card>

            <Card className="stat-card-neon border-2 border-warning/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warning icon-neon" />
                  Project Defaulters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-warning mb-1">{projectDefaulters}</div>
                <p className="text-base text-muted-foreground mt-1">Not updated in 7 days</p>
              </CardContent>
            </Card>

            <Card className="stat-card-neon border-2 border-destructive/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-destructive icon-neon" />
                  Over Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-destructive mb-1">{overBudgetProjects}</div>
                <p className="text-base text-muted-foreground mt-1">Projects exceeding budget</p>
              </CardContent>
            </Card>

            <Card className="stat-card-neon border-2 border-warning/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-warning icon-neon" />
                  Task Defaulters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-warning mb-1">{taskDefaulters}</div>
                <p className="text-base text-muted-foreground mt-1">Tasks need updates</p>
              </CardContent>
            </Card>

            <Card className="stat-card-neon border-2 border-destructive/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive icon-neon" />
                  High Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-destructive mb-1">{redProjects}</div>
                <p className="text-base text-muted-foreground mt-1">Red status projects</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button onClick={() => navigate("/projects")} size="lg" className="btn-neon shadow-lg text-lg py-6 px-8 hover:scale-105 transition-transform text-white">
              Update Our Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button onClick={() => navigate("/dashboard")} size="lg" className="btn-neon-purple text-lg py-6 px-8 hover:scale-105 transition-transform text-white">
              Update Our Tasks
            </Button>
          </div>

          {/* Data Flow Explanation */}
          <Card className="mt-12 border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-background animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="w-7 h-7 text-accent" />
                <CardTitle className="text-2xl">From Our Data Entry to These Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                    <h4 className="font-semibold text-foreground">We Enter Data</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-10">
                    <li>• Create and update projects</li>
                    <li>• Set Go-Live and Hypercare dates</li>
                    <li>• Track budget (TCO vs Actual)</li>
                    <li>• Create and complete tasks</li>
                    <li>• Update RAG status weekly</li>
                    <li>• Log risks and milestones</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                    <h4 className="font-semibold text-foreground">System Calculates</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-10">
                    <li>• Counts completed vs total</li>
                    <li>• Compares actual vs planned dates</li>
                    <li>• Checks budget adherence</li>
                    <li>• Identifies overdue items</li>
                    <li>• Detects stale updates</li>
                    <li>• Aggregates portfolio health</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                    <h4 className="font-semibold text-foreground">We See Results</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-10">
                    <li>• Real-time performance scores</li>
                    <li>• Instant portfolio overview</li>
                    <li>• Team accountability metrics</li>
                    <li>• Data quality indicators</li>
                    <li>• Risk and budget alerts</li>
                    <li>• Progress visibility</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">The Bottom Line:</strong> Every metric on this page is a direct reflection of our team&apos;s 
                  discipline in maintaining accurate, timely project data. When we update projects weekly, mark tasks complete promptly, 
                  and track budgets accurately, these numbers tell our success story to leadership. When we don&apos;t, the gaps show 
                  immediately—giving us clear signals about where to improve our data habits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* KRA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/50 to-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 text-base py-2 px-4">Our Performance Framework</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How We Measure Our Success
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-6">
              These are the Key Result Areas (KRAs) that we use to measure our team performance and drive organizational value
            </p>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto">
              Each KRA is measured using specific data points we maintain in our project management system. Our consistent data entry directly impacts these measurements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kras.map((kra, index) => (
              <Card key={index} className="stat-card-neon border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">{kra.title}</CardTitle>
                      <Badge variant="outline" className="text-sm py-1 px-3 font-semibold">Target: {kra.target}</Badge>
                    </div>
                    <img src={kra.icon} alt={kra.title} className="w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity icon-neon animate-float" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base font-medium text-muted-foreground mb-3">
                    <strong className="text-foreground">Measure:</strong> {kra.measure}
                  </p>
                  <p className="text-base text-muted-foreground">{kra.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 text-base py-2 px-4" variant="outline">
              <Rocket className="w-4 h-4 mr-2" />
              Our Team Excellence
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How We Keep Our Data Quality High
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Accurate, timely data enables us to make better decisions, allocate our resources effectively, and demonstrate our team value to the organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {bestPractices.map((practice, index) => (
              <Card 
                key={index} 
                className={`border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in ${
                  practice.type === 'do' 
                    ? 'border-success/40 bg-success/5 hover:bg-success/10' 
                    : 'border-destructive/40 bg-destructive/5 hover:bg-destructive/10'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                      practice.type === 'do' 
                        ? 'bg-success/20' 
                        : 'bg-destructive/20'
                    }`}>
                      <practice.icon className={`w-7 h-7 ${
                        practice.type === 'do' ? 'text-success' : 'text-destructive'
                      }`} />
                    </div>
                    <CardTitle className="text-xl leading-tight">{practice.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground leading-relaxed">{practice.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Activity className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Why Our Data Quality Matters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-4 group">
                <TrendingUp className="w-7 h-7 text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <p className="text-base text-muted-foreground">
                  <strong className="text-foreground text-lg">Better Reporting:</strong> Our leadership can make informed decisions about our priorities and resource allocation with accurate, real-time data
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <Shield className="w-7 h-7 text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <p className="text-base text-muted-foreground">
                  <strong className="text-foreground text-lg">Proactive Risk Management:</strong> Early visibility into issues allows us to address our problems before they escalate into critical situations
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <Users className="w-7 h-7 text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <p className="text-base text-muted-foreground">
                  <strong className="text-foreground text-lg">Our Team Credibility:</strong> Our consistent, accurate updates demonstrate our professionalism and build stakeholder trust across the organization
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <BarChart3 className="w-7 h-7 text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <p className="text-base text-muted-foreground">
                  <strong className="text-foreground text-lg">Our Performance Visibility:</strong> Accurate data showcases our team contributions, achievements, and the value we deliver to the organization
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Quick Actions
            </h2>
            <p className="text-xl text-muted-foreground">Jump straight to what we need to work on</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/30 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 animate-fade-in group" onClick={() => navigate("/projects")}>
              <CardHeader>
                <Target className="w-14 h-14 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">Our Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">View our portfolio, update RAG status, track our budgets and milestones</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 animate-fade-in group" onClick={() => navigate("/dashboard")}>
              <CardHeader>
                <CheckCircle2 className="w-14 h-14 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">Our Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">Manage our assignments, update our progress, and close completed items</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 animate-fade-in group" onClick={() => navigate("/features")}>
              <CardHeader>
                <BarChart3 className="w-14 h-14 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">Our Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">Access our dashboards, generate status reports, and analyze our performance</p>
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
