import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ArrowRight
} from "lucide-react";

const Features = () => {
  const navigate = useNavigate();

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
      <div className="relative py-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-50" />
        <div className="relative max-w-4xl mx-auto space-y-6">
          <Badge className="mb-4" variant="outline">Complete IT Project Management Platform</Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ProjectHub Features
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to manage IT projects from initiation to closeout
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={() => navigate("/projects/new")} size="lg" className="gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigate("/projects")} variant="outline" size="lg">
              View Projects
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-16">
        {/* Feature Categories */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Comprehensive Features</h2>
            <p className="text-muted-foreground">Built specifically for IT Project Managers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureCategories.map((category) => (
              <Card key={category.title} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 ${category.color}`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.features.map((feature) => (
                    <div key={feature.name} className="flex gap-3">
                      <feature.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${category.color}`} />
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-sm text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">How Project Managers Use ProjectHub</h2>
            <p className="text-muted-foreground">6 simple steps to manage your IT projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usageSteps.map((step) => (
              <Card key={step.step} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary to-accent opacity-10" />
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {step.step}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <step.icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Why Choose ProjectHub?</CardTitle>
            <CardDescription>Designed specifically for IT project management excellence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Fast Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Get started in minutes with pre-defined templates and workflows
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Shield className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Enterprise Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in vendor management, compliance tracking, and governance
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Data-Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Automated performance tracking with real-time metrics and insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold">Ready to Transform Your Project Management?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join leading IT project managers who use ProjectHub to deliver successful projects on time and within budget
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/projects/new")} size="lg" className="gap-2">
              Create Your First Project
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="outline" size="lg">
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
