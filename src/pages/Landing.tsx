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
  DollarSign
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Landing = () => {
  const navigate = useNavigate();

  const keyBenefits = [
    {
      icon: TrendingUp,
      title: "Increase Project Success Rate by 40%",
      description: "Data-driven insights and proactive risk management ensure your projects stay on track and deliver results."
    },
    {
      icon: Clock,
      title: "Save 15+ Hours Per Week",
      description: "Automated workflows, integrated tools, and centralized dashboards eliminate manual reporting and admin work."
    },
    {
      icon: DollarSign,
      title: "Reduce Budget Overruns by 30%",
      description: "Real-time budget tracking and predictive analytics help you stay within budget and optimize resource allocation."
    }
  ];

  const coreFeatures = [
    {
      icon: Target,
      title: "Portfolio Management",
      description: "Manage multiple IT projects with RAG status tracking, performance metrics, and executive dashboards."
    },
    {
      icon: Users,
      title: "Task & Team Management",
      description: "Assign tasks with multi-owner support, track progress in Kanban/Table views, and manage milestones."
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Identify, assess, and mitigate risks proactively with comprehensive risk registers and mitigation plans."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Generate automated status reports, track KPIs, and visualize resource utilization across portfolios."
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
      <section className="py-20 px-4 bg-gradient-to-b from-card/30 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            IT Project Management
            <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Made Simple & Effective
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            The complete PMO platform for CTO offices to plan, track, and deliver digital initiatives on time and within budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button onClick={() => navigate("/projects")} size="lg" className="text-lg px-8 shadow-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button onClick={() => navigate("/features")} variant="outline" size="lg" className="text-lg px-8">
              Explore Features
            </Button>
          </div>

          {/* Key Benefits - Top Priority */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {keyBenefits.map((benefit, index) => (
              <Card key={index} className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-center">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features - Simplified */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for IT project managers and PMO offices
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="border border-border shadow-md hover:shadow-lg transition-all bg-card">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Streamlined */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From project setup to delivery tracking - all in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/20 bg-card shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-xl">Create Project Blueprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Define objectives, budget, timeline, and stakeholders. Set RAG status criteria and success metrics.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-card shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-xl">Plan & Execute Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Break down work into tasks, assign to team members, track milestones, and manage risks proactively.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-card shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-xl">Monitor & Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Track performance with dashboards, generate automated reports, and optimize resource utilization.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlights - Bootstrap Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Feature Set
            </h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="d-flex align-items-start gap-3 mb-4">
                <CheckCircle2 className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="fw-bold mb-1">RAG Status Tracking</h5>
                  <p className="text-muted-foreground small mb-0">Red-Amber-Green indicators with justification and corrective actions</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start gap-3 mb-4">
                <CheckCircle2 className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="fw-bold mb-1">Multi-Owner Tasks</h5>
                  <p className="text-muted-foreground small mb-0">Assign multiple team members to collaborative tasks</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start gap-3 mb-4">
                <CheckCircle2 className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="fw-bold mb-1">Resource Utilization</h5>
                  <p className="text-muted-foreground small mb-0">Track department allocation and capacity planning</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start gap-3 mb-4">
                <CheckCircle2 className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="fw-bold mb-1">Risk Register</h5>
                  <p className="text-muted-foreground small mb-0">Comprehensive risk assessment and mitigation planning</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start gap-3 mb-4">
                <CheckCircle2 className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="fw-bold mb-1">AI-Powered Insights</h5>
                  <p className="text-muted-foreground small mb-0">Smart recommendations and predictive analytics</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start gap-3 mb-4">
                <CheckCircle2 className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="fw-bold mb-1">Executive Dashboards</h5>
                  <p className="text-muted-foreground small mb-0">Portfolio-level health reporting for leadership</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your PMO?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join leading CTO offices managing successful digital transformations with ProjectHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/projects")} size="lg" className="text-lg px-8 shadow-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button onClick={() => navigate("/features")} variant="outline" size="lg" className="text-lg px-8">
              View All Features
            </Button>
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
