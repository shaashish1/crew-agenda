import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Target, 
  TrendingUp,
  DollarSign,
  Activity,
  Award,
  Rocket,
  Users,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
  Heart,
  Star,
  Sparkles,
  TrendingDown,
  Filter,
  ChevronRight,
  XCircle,
  AlertTriangle,
  FileText,
  BarChart3
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useTaskContext } from "@/contexts/TaskContext";
import { RAGStatusBadge } from "@/components/RAGStatusBadge";
import { Badge } from "@/components/ui/badge";
import { PerformanceCriteriaTable } from "@/components/PerformanceCriteriaTable";
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
    },
    {
      title: "Defect Management",
      measure: "Average time to resolve critical defects",
      target: "≤ 24 hours",
      description: "We respond rapidly to production issues and maintain system stability",
      icon: iconQuality
    },
    {
      title: "Innovation Index",
      measure: "Number of new technologies/methodologies adopted",
      target: "≥ 3 per year",
      description: "We continuously explore and implement innovative solutions to improve our delivery",
      icon: iconSatisfaction
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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Digital Transformation",
      content: "The project tracking system has transformed how we manage our IT portfolio. Real-time visibility into every initiative gives us confidence in our delivery.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Torres",
      role: "CTO",
      content: "Outstanding performance metrics and accountability. Our team's efficiency has increased by 40% since implementing this comprehensive approach.",
      rating: 5,
      avatar: "MT"
    },
    {
      name: "Emily Parker",
      role: "Project Director",
      content: "The data-driven insights help us make better decisions faster. Budget adherence and on-time delivery have never been better.",
      rating: 5,
      avatar: "EP"
    }
  ];

  const categories = [
    { id: "all", label: "All Metrics" },
    { id: "delivery", label: "Delivery" },
    { id: "financial", label: "Financial" },
    { id: "quality", label: "Quality" }
  ];

  const filteredKRAs = selectedCategory === "all" 
    ? kras 
    : kras.filter(kra => {
        if (selectedCategory === "delivery") return kra.title.includes("On-Time") || kra.title.includes("Change Request");
        if (selectedCategory === "financial") return kra.title.includes("Budget");
        if (selectedCategory === "quality") return kra.title.includes("Quality") || kra.title.includes("Knowledge");
        return true;
      });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-premium-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
                Syngene ProjectHub
              </h1>
              <div className="hidden md:flex gap-2">
                <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all" onClick={() => navigate("/projects")}>
                  Projects
                </Button>
                <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all" onClick={() => navigate("/dashboard")}>
                  Tasks
                </Button>
                <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all" onClick={() => navigate("/features")}>
                  Features
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button 
                onClick={() => navigate("/projects")} 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-premium-md hover:shadow-premium-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-white px-16 py-4 animate-fade-in"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium & Warm */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(var(--accent)/0.06),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center mb-16 animate-fade-in-up space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4 hover:bg-primary/15 transition-all">
              <Sparkles className="w-4 h-4" />
              <span>Excellence in Digital Delivery</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent leading-tight">
              Transforming Digital<br />IT Excellence
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              We're a passionate team driving innovation through disciplined project management, delivering measurable business value with every initiative
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button 
                size="lg" 
                onClick={() => navigate("/projects")}
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-premium-lg hover:shadow-premium-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-14 py-4 text-white group animate-fade-in"
              >
                Explore Our Portfolio
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-14 py-4 group animate-fade-in"
              >
                View Dashboard
                <Activity className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Stats Grid - Live Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20 animate-fade-in">
            {[
              { label: "Active Projects", value: activeProjects, icon: Rocket, color: "primary" },
              { label: "On-Time Delivery", value: `${onTimeDeliveryRate}%`, icon: Target, color: "success" },
              { label: "Budget Health", value: `${budgetAdherenceRate}%`, icon: DollarSign, color: "info" },
              { label: "Team Excellence", value: `${taskCompletionRate}%`, icon: Users, color: "accent" }
            ].map((stat, idx) => (
              <Card 
                key={idx} 
                className="relative overflow-hidden border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-premium-lg group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <stat.icon className={`w-8 h-8 mb-3 text-${stat.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Our Philosophy - Behind the Scenes */}
          <div className="mb-20 animate-fade-in">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Our Digital Excellence Philosophy
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We believe in transparency, accountability, and continuous improvement—driving every decision with data and delivering every project with heart.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Passion for Excellence",
                  description: "We don't just manage projects—we craft experiences. Every metric, every milestone represents our commitment to delivering exceptional value to our stakeholders."
                },
                {
                  icon: Shield,
                  title: "Trust Through Transparency",
                  description: "Real-time visibility into project health, budgets, and risks. No surprises, no hidden issues—just honest, open communication that builds lasting partnerships."
                },
                {
                  icon: Zap,
                  title: "Innovation at Speed",
                  description: "Combining agile methodologies with robust governance, we deliver transformative solutions faster without compromising quality or security."
                }
              ].map((item, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/40 transition-all hover:shadow-premium-lg group cursor-pointer">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl mb-3">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Year-End Performance Evaluation Criteria */}
          <div className="mb-16 animate-fade-in">
            <div className="text-center mb-8 space-y-4">
              <Badge className="mb-3 text-base py-2 px-6" variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Year-End Performance Evaluation
              </Badge>
              <h2 className="text-heading mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                How We Evaluate Project Success
              </h2>
              <p className="text-body-large text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our projects are evaluated against two key drivers: delivery timeliness and user adoption. These criteria help us measure our impact and identify areas for improvement.
              </p>
            </div>
            <PerformanceCriteriaTable />
          </div>

          {/* Portfolio Summary Cards */}
          <div className="mb-12 text-center space-y-4">
            <h2 className="text-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Portfolio at a Glance
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Live data from all our project updates, task tracking, and team inputs. Updated automatically as we work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-fade-in">
            <Card className="glass-card-premium border-primary/30 transition-all duration-300">
              <CardHeader className="pb-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-premium-sm">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-5xl font-bold text-foreground tracking-tight">{totalProjects}</div>
                <div className="progress-neon h-3 bg-secondary/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                  <div className="progress-neon-bar h-full rounded-full" style={{ width: `${(activeProjects / Math.max(totalProjects, 1)) * 100}%` }} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{activeProjects} active projects</p>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-success/30 transition-all duration-300">
              <CardHeader className="pb-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center shadow-premium-sm">
                  <Activity className="w-7 h-7 text-success" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  Project Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="text-center flex-1">
                    <div className="text-3xl font-bold text-success mb-2 tracking-tight">{greenProjects}</div>
                    <div className="text-xs text-muted-foreground font-medium">Green</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-3xl font-bold text-warning mb-2 tracking-tight">{amberProjects}</div>
                    <div className="text-xs text-muted-foreground font-medium">Amber</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-3xl font-bold text-destructive mb-2 tracking-tight">{redProjects}</div>
                    <div className="text-xs text-muted-foreground font-medium">Red</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-accent/30 transition-all duration-300">
              <CardHeader className="pb-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center shadow-premium-sm">
                  <CheckCircle2 className="w-7 h-7 text-accent" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  Task Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-5xl font-bold text-foreground tracking-tight">{completedTasks}/{totalTasks}</div>
                <div className="progress-neon h-3 bg-secondary/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                  <div className="progress-neon-bar h-full rounded-full" style={{ width: `${taskCompletionRate}%` }} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {taskCompletionRate}% complete
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-destructive/30 transition-all duration-300">
              <CardHeader className="pb-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center shadow-premium-sm">
                  <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  Overdue Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-5xl font-bold text-destructive tracking-tight">{overdueTasks}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">Require attention</p>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-warning/30 transition-all duration-300">
              <CardHeader className="pb-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center shadow-premium-sm">
                  <Clock className="w-7 h-7 text-warning" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  Project Defaulters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-5xl font-bold text-warning tracking-tight">{projectDefaulters}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">Not updated in 7 days</p>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-destructive/30 transition-all duration-300">
              <CardHeader className="pb-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center shadow-premium-sm">
                  <DollarSign className="w-7 h-7 text-destructive" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  Over Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-5xl font-bold text-destructive tracking-tight">{overBudgetProjects}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">Projects exceeding budget</p>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-warning/30 transition-all duration-300">
              <CardHeader className="pb-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center shadow-premium-sm">
                  <FileText className="w-7 h-7 text-warning" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  Task Defaulters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-5xl font-bold text-warning tracking-tight">{taskDefaulters}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">Tasks need updates</p>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-destructive/30 transition-all duration-300">
              <CardHeader className="pb-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center shadow-premium-sm">
                  <Shield className="w-7 h-7 text-destructive" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  High Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-5xl font-bold text-destructive tracking-tight">{redProjects}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">Red status projects</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Button onClick={() => navigate("/projects")} size="lg" className="btn-neon shadow-premium-lg py-4 px-16 hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-white font-semibold group">
              Update Our Projects
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button onClick={() => navigate("/dashboard")} size="lg" className="btn-neon-purple shadow-premium-lg py-4 px-16 hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-white font-semibold group">
              Update Our Tasks
            </Button>
          </div>

          {/* Data Flow Explanation */}
          <Card className="mt-16 glass-card-premium border-accent/30 animate-fade-in">
            <CardHeader className="space-y-4 pb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-accent" />
                </div>
                <CardTitle className="text-heading">From Our Data Entry to These Metrics</CardTitle>
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

      {/* Interactive KPI Showcase with Filters */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.05),transparent_60%)]" />
        
        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center mb-12 animate-fade-in-up space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
              <Filter className="w-4 h-4" />
              <span>Interactive KPI Explorer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Key Performance Indicators
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Filter by category to explore the metrics that matter most to your team
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={`
                  px-10 py-3 rounded-full transition-all duration-300
                  ${selectedCategory === cat.id 
                    ? 'bg-gradient-to-r from-primary to-primary-dark shadow-premium-md hover:shadow-premium-lg scale-105 text-white hover:-translate-y-0.5' 
                    : 'hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:-translate-y-0.5'
                  }
                `}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Filtered KRA Grid - 3x4 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredKRAs.slice(0, 12).map((kra, index) => (
              <Card 
                key={index} 
                className="group border-2 border-border hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] cursor-pointer overflow-hidden h-full flex flex-col animate-fade-in hover:-translate-y-1"
                style={{ 
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <CardHeader className="space-y-4 relative flex-none">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{kra.title}</CardTitle>
                      <Badge variant="outline" className="text-xs py-1.5 px-3 font-semibold border-primary/30 text-primary group-hover:bg-primary/10 transition-all duration-300">
                        Target: {kra.target}
                      </Badge>
                    </div>
                    <img 
                      src={kra.icon} 
                      alt={kra.title} 
                      className="w-14 h-14 opacity-70 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500" 
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 relative flex-1 flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">
                    <strong className="text-foreground">Measure:</strong> {kra.measure}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{kra.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent)/0.08),transparent_60%)]" />
        
        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center mb-16 animate-fade-in-up space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" />
              <span>What Our Leaders Say</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Trusted by Digital Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Hear from the executives who rely on our data-driven approach every day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
            {testimonials.map((testimonial, idx) => (
              <Card 
                key={idx} 
                className="group border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-premium-xl hover:-translate-y-2 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="space-y-4 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-premium-md">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20 animate-fade-in space-y-6">
            <Badge className="mb-4 text-base py-3 px-6" variant="outline">
              <Rocket className="w-4 h-4 mr-2" />
              Our Team Excellence
            </Badge>
            <h2 className="text-heading mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              How We Keep Our Data Quality High
            </h2>
            <p className="text-body-large text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Accurate, timely data enables us to make better decisions, allocate our resources effectively, and demonstrate our team value to the organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {bestPractices.map((practice, index) => (
              <Card 
                key={index} 
                className={`glass-card-premium transition-all duration-300 animate-fade-in ${
                  practice.type === 'do' 
                    ? 'border-success/40' 
                    : 'border-destructive/40'
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

      {/* Call to Action - Premium Footer */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.12),transparent_70%)]" />
        
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
              <Rocket className="w-4 h-4" />
              <span>Join Our Journey</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent leading-tight">
              Ready to Transform<br />Digital Excellence?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the power of data-driven project management. Start tracking your portfolio today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <Button 
                size="lg" 
                onClick={() => navigate("/projects")}
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-premium-xl hover:shadow-premium-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 px-16 py-4 text-white group animate-fade-in"
              >
                Explore Projects
                <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1 px-16 py-4 group animate-fade-in"
              >
                View Dashboard
                <Activity className="ml-2 w-6 h-6 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-gradient-to-b from-card/80 to-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ProjectHub
              </h3>
              <Badge variant="outline" className="text-xs">by DIT CTO Portfolio</Badge>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate("/projects")} className="hover:text-primary transition-colors">
                Projects
              </button>
              <button onClick={() => navigate("/dashboard")} className="hover:text-primary transition-colors">
                Dashboard
              </button>
              <button onClick={() => navigate("/features")} className="hover:text-primary transition-colors">
                Features
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 ProjectHub. Empowering IT Teams with Data-Driven Project Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
