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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PerformanceCriteriaTable } from "@/components/PerformanceCriteriaTable";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Project Portfolio Management",
      description: "Track and manage multiple IT projects with comprehensive oversight and real-time status updates."
    },
    {
      icon: Users,
      title: "Task Assignment & Tracking",
      description: "Assign tasks to team members with multi-owner support and track progress across different views."
    },
    {
      icon: Calendar,
      title: "Milestone Timeline",
      description: "Visualize project milestones and deadlines with interactive timeline views and progress tracking."
    },
    {
      icon: BarChart3,
      title: "RAG Status Reporting",
      description: "Monitor project health with Red-Amber-Green status indicators for timeline, budget, and scope."
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Create and manage project documents with version control and collaborative editing capabilities."
    },
    {
      icon: Lightbulb,
      title: "Idea Management",
      description: "Capture and prioritize innovative ideas to drive project success and continuous improvement."
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Identify, assess, and mitigate project risks with comprehensive risk tracking and mitigation plans."
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with your team through real-time updates and collaborative features."
    }
  ];

  const bestPractices = [
    {
      title: "Define Clear Objectives",
      description: "Establish SMART goals and success criteria at project initiation. Document your project blueprint with purpose, validation criteria, and success metrics.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop"
    },
    {
      title: "Track Progress with RAG Status",
      description: "Use Red-Amber-Green indicators to monitor timeline, budget, and scope. Regular status updates keep stakeholders informed and enable early intervention.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
    },
    {
      title: "Manage Risks Proactively",
      description: "Identify potential risks early, assess their impact, and develop mitigation strategies. Regular risk reviews ensure nothing falls through the cracks.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"
    },
    {
      title: "Foster Team Collaboration",
      description: "Enable transparent communication through shared documents, task assignments, and milestone tracking. Keep everyone aligned on project goals.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                ProjectHub
              </h1>
              <div className="hidden md:flex gap-6">
                <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
                <Button variant="ghost" onClick={() => navigate("/projects")}>Projects</Button>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>Tasks</Button>
                <Button variant="ghost" onClick={() => navigate("/settings")}>Settings</Button>
              </div>
            </div>
            <Button onClick={() => navigate("/projects")} size="lg">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* How PMs Use ProjectHub - Complete Workflow */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How Project Managers Use ProjectHub
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A complete portal designed for IT Project Managers to plan, execute, track, and deliver digital initiatives on time and within budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-xl">Create Project Blueprint</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed space-y-2">
                  <p>• Define project purpose and validation criteria</p>
                  <p>• Set success metrics and budget</p>
                  <p>• Identify stakeholders and sponsors</p>
                  <p>• Establish timeline and go-live date</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-xl">Plan & Break Down Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed space-y-2">
                  <p>• Create milestones and key deliverables</p>
                  <p>• Break down work into manageable tasks</p>
                  <p>• Assign tasks to team members</p>
                  <p>• Set dependencies and priorities</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-xl">Track Progress Daily</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed space-y-2">
                  <p>• Monitor task completion in Kanban or Table view</p>
                  <p>• Update RAG status (Red/Amber/Green)</p>
                  <p>• Review milestone timelines</p>
                  <p>• Track performance metrics</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  4
                </div>
                <CardTitle className="text-xl">Manage Risks Proactively</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed space-y-2">
                  <p>• Identify and log potential risks</p>
                  <p>• Assess probability and impact</p>
                  <p>• Define mitigation strategies</p>
                  <p>• Monitor risk status continuously</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  5
                </div>
                <CardTitle className="text-xl">Collaborate & Document</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed space-y-2">
                  <p>• Create project documentation</p>
                  <p>• Share status reports with stakeholders</p>
                  <p>• Capture ideas for improvement</p>
                  <p>• Maintain communication history</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 6 */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  6
                </div>
                <CardTitle className="text-xl">Measure & Report Success</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed space-y-2">
                  <p>• Track project delay percentage</p>
                  <p>• Measure user adoption rate (post go-live)</p>
                  <p>• Generate year-end performance reports</p>
                  <p>• Demonstrate ROI and value delivered</p>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Complete Portal Features by PM Activity */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Portal Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything a Project Manager needs in one integrated platform
            </p>
          </div>

          <div className="space-y-12">
            {/* Portfolio Management */}
            <Card className="border-2 border-border">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Target className="w-8 h-8 text-primary" />
                  Portfolio Management
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Multi-Project Dashboard</p>
                      <p className="text-sm text-muted-foreground">View all projects at a glance with status indicators</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Project Blueprints</p>
                      <p className="text-sm text-muted-foreground">Structured templates for project initiation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">RAG Status Tracking</p>
                      <p className="text-sm text-muted-foreground">Red-Amber-Green indicators for timeline, budget, scope</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Performance Criteria Tracking</p>
                      <p className="text-sm text-muted-foreground">Measure against year-end evaluation criteria</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task & Milestone Management */}
            <Card className="border-2 border-border">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  Task & Milestone Management
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Multiple Views</p>
                      <p className="text-sm text-muted-foreground">Kanban board, Table view, and List view</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Multi-Owner Assignments</p>
                      <p className="text-sm text-muted-foreground">Assign multiple team members to tasks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Timeline Visualization</p>
                      <p className="text-sm text-muted-foreground">Interactive milestone timeline with progress tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Priority Management</p>
                      <p className="text-sm text-muted-foreground">Set and track task priorities (Low, Medium, High, Critical)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk & Issue Management */}
            <Card className="border-2 border-border">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Shield className="w-8 h-8 text-primary" />
                  Risk & Issue Management
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Risk Register</p>
                      <p className="text-sm text-muted-foreground">Centralized tracking of all project risks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Impact Assessment</p>
                      <p className="text-sm text-muted-foreground">Evaluate probability and impact of risks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Mitigation Planning</p>
                      <p className="text-sm text-muted-foreground">Document strategies to address risks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Status Monitoring</p>
                      <p className="text-sm text-muted-foreground">Track risk status from identification to closure</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collaboration & Documentation */}
            <Card className="border-2 border-border">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  Collaboration & Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Document Management</p>
                      <p className="text-sm text-muted-foreground">Create and organize project documents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Idea Capture</p>
                      <p className="text-sm text-muted-foreground">Log and prioritize innovative ideas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Status Reports</p>
                      <p className="text-sm text-muted-foreground">Generate comprehensive project status updates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Real-time Updates</p>
                      <p className="text-sm text-muted-foreground">Keep team aligned with instant notifications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics & Reporting */}
            <Card className="border-2 border-border">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  Analytics & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Performance Metrics</p>
                      <p className="text-sm text-muted-foreground">Track delay % and adoption rates automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Portfolio Analytics</p>
                      <p className="text-sm text-muted-foreground">View health across all projects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Year-End Reports</p>
                      <p className="text-sm text-muted-foreground">Export performance data for evaluations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Trend Analysis</p>
                      <p className="text-sm text-muted-foreground">Identify patterns and improvement areas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hero Section with Carousel */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-foreground mb-4">
              Transform Your Project Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Adopt modern best practices and streamline your project delivery with comprehensive tools designed for IT project managers.
            </p>
          </div>

          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {bestPractices.map((practice, index) => (
                <CarouselItem key={index}>
                  <Card className="border-2 border-primary/20 shadow-xl">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative h-64 md:h-full overflow-hidden rounded-l-lg">
                        <img 
                          src={practice.image} 
                          alt={practice.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-8 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                          {practice.title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {practice.description}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      {/* Call to Action for PMs */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-4xl font-bold text-foreground mb-6">
            Ready to Elevate Your Project Management?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join forward-thinking project managers who are adopting modern processes to deliver projects on time and within budget. 
            Update your project details, track progress with RAG status, and collaborate effectively with your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/projects/new")} size="lg">
              <Target className="mr-2 w-5 h-5" />
              Create Your First Project
            </Button>
            <Button onClick={() => navigate("/projects")} variant="outline" size="lg">
              View Project Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Performance Criteria Framework */}
      <PerformanceCriteriaTable />

      {/* Platform Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              Comprehensive Project Management Features
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage IT projects effectively, from planning to delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-border">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            Why Project Managers Choose ProjectHub
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Improved Visibility</h4>
                <p className="text-muted-foreground">Get real-time insights into project health with RAG status indicators and comprehensive dashboards.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Enhanced Collaboration</h4>
                <p className="text-muted-foreground">Keep your team aligned with shared documents, task assignments, and milestone tracking.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Proactive Risk Management</h4>
                <p className="text-muted-foreground">Identify and mitigate risks before they impact your project timeline or budget.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Data-Driven Decisions</h4>
                <p className="text-muted-foreground">Make informed decisions based on real-time data and comprehensive project analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Start Managing Projects Better Today
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join project managers who are delivering successful IT projects with modern tools and best practices.
          </p>
          <Button onClick={() => navigate("/projects/new")} size="lg">
            Create Your First Project
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
