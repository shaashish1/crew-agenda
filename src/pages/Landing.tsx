import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  ClipboardList,
  Zap,
  Rocket,
  LineChart,
  Award,
  Sparkles,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SectionDivider } from "@/components/SectionDivider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import Image from "../assets/images/dashboard-preview.png";
import Image2 from "../assets/images/kanban-preview.png";
import Image3 from "../assets/images/reporting-preview.png";
import Avatar1 from "../assets/images/avatars/avatar-1.jpg";
import Avatar2 from "../assets/images/avatars/avatar-2.jpg";
import Avatar3 from "../assets/images/avatars/avatar-3.jpg";
import Avatar4 from "../assets/images/avatars/avatar-4.jpg";
import Avatar5 from "../assets/images/avatars/avatar-5.jpg";
import Avatar6 from "../assets/images/avatars/avatar-6.jpg";

const testimonials = [
  {
    id: 1,
    quote:
      "This project management tool has revolutionized our workflow. The intuitive interface and powerful features have made collaboration seamless and increased our team's productivity.",
    author: "Sarah Johnson",
    title: "Project Manager at Tech Solutions Inc.",
    avatar: Avatar1,
  },
  {
    id: 2,
    quote:
      "I've tried many project management tools, but this one stands out. The real-time tracking and reporting capabilities have given us unprecedented visibility into our projects, allowing us to make data-driven decisions.",
    author: "David Smith",
    title: "CEO of Innovate Marketing Agency",
    avatar: Avatar2,
  },
  {
    id: 3,
    quote:
      "The Gantt chart feature is a game-changer. It allows us to visualize project timelines, identify critical paths, and allocate resources effectively. Our projects are now completed on time and within budget.",
    author: "Emily White",
    title: "Operations Manager at Global Enterprises Ltd.",
    avatar: Avatar3,
  },
  {
    id: 4,
    quote:
      "The task management features are incredibly useful. We can easily assign tasks, set deadlines, and track progress. The notifications and reminders ensure that nothing falls through the cracks.",
    author: "Michael Brown",
    title: "Team Lead at Creative Designs Co.",
    avatar: Avatar4,
  },
  {
    id: 5,
    quote:
      "The collaboration tools are fantastic. We can share files, leave comments, and have discussions within the platform. It has greatly improved communication and reduced the need for endless email threads.",
    author: "Jessica Davis",
    title: "Marketing Director at Digital Media Group",
    avatar: Avatar5,
  },
  {
    id: 6,
    quote:
      "The reporting and analytics features are invaluable. We can generate detailed reports on project performance, resource utilization, and budget adherence. This has helped us identify areas for improvement and optimize our processes.",
    author: "Kevin Wilson",
    title: "Finance Manager at Corporate Investments Inc.",
    avatar: Avatar6,
  },
];

const Landing = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const kpiAnimation = useScrollAnimation({ threshold: 0.15 });
  const metricsAnimation = useScrollAnimation({ threshold: 0.15 });

  const processSteps = [
    {
      title: "Strategic Planning",
      description: "We start by understanding your goals and defining clear success metrics. Every project begins with a comprehensive roadmap that aligns with your business objectives.",
      icon: <Target className="w-8 h-8 text-white" />,
    },
    {
      title: "Agile Execution",
      description: "Our team works in focused sprints, delivering incremental value while maintaining flexibility. Regular checkpoints ensure we're always aligned with your vision.",
      icon: <Rocket className="w-8 h-8 text-white" />,
    },
    {
      title: "Continuous Monitoring",
      description: "Real-time dashboards track every KPI. We measure what matters and adjust our approach based on data, not assumptions.",
      icon: <LineChart className="w-8 h-8 text-white" />,
    },
    {
      title: "Quality Assurance",
      description: "Rigorous testing and review processes ensure every deliverable meets our high standards. We don't just ship features, we ship excellence.",
      icon: <Award className="w-8 h-8 text-white" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <ScrollProgress />

      {/* Enhanced Hero with animations */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="container mx-auto relative z-10">
          <div 
            ref={heroAnimation.elementRef}
            className={`max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000 ${
              heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Trusted by Industry Leaders</span>
            </div>
            <h1 className="text-display font-inter">
              Project Management
              <span className="block mt-2 text-gradient glow">
                Built for Teams That Deliver
              </span>
            </h1>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We track every metric that matters. Real performance data from real projects,
              showing you exactly how we deliver excellence every single day.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild size="lg" className="btn-premium text-btn-lg shadow-premium-lg hover:shadow-premium-xl hover-lift">
                <Link to="/projects">View Live Projects</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-btn-lg border-2 hover:bg-primary/5 hover-lift">
                <Link to="/features">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Animated KPIs */}
      <section className="py-32 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <GlassCard variant="premium" className="text-center hover-lift group fade-in-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-bold mb-3 text-gradient glow">
                <AnimatedCounter end={94.2} decimals={1} suffix="%" />
              </div>
              <div className="text-h3 font-semibold mb-2">On-Time Delivery</div>
              <p className="text-body-md text-muted-foreground">
                Projects delivered within agreed timelines
              </p>
            </GlassCard>

            <GlassCard variant="premium" className="text-center hover-lift group fade-in-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-bold mb-3 text-gradient glow">
                <AnimatedCounter end={450} suffix="+" />
              </div>
              <div className="text-h3 font-semibold mb-2">Active Projects</div>
              <p className="text-body-md text-muted-foreground">
                Number of projects currently being managed
              </p>
            </GlassCard>

            <GlassCard variant="premium" className="text-center hover-lift group fade-in-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-bold mb-3 text-gradient glow">
                <AnimatedCounter end={120} suffix="+" />
              </div>
              <div className="text-h3 font-semibold mb-2">Dedicated Experts</div>
              <p className="text-body-md text-muted-foreground">
                Experts available to drive your projects to success
              </p>
            </GlassCard>

            <GlassCard variant="premium" className="text-center hover-lift group fade-in-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-bold mb-3 text-gradient glow">
                <AnimatedCounter end={25} suffix="%" />
              </div>
              <div className="text-h3 font-semibold mb-2">Cost Savings</div>
              <p className="text-body-md text-muted-foreground">
                Average cost reduction achieved through efficient management
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" />

      {/* Process Timeline */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-h2 font-inter mb-6">How We Work</h2>
            <p className="text-body-large text-muted-foreground leading-relaxed">
              Our proven methodology combines agile principles with rigorous quality control.
            </p>
          </div>
          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      <SectionDivider variant="dots" />

      {/* Project Showcase */}
      <section className="py-32 px-6 bg-muted">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-h2 font-inter mb-6">See Our Work in Action</h2>
            <p className="text-body-large text-muted-foreground leading-relaxed">
              Explore real-world examples of how we transform project management for our clients.
            </p>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem className="md:basis-1/3">
                <div className="p-4">
                  <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl">Dashboard Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="aspect-video overflow-hidden rounded-md">
                      <img
                        src={Image}
                        alt="Dashboard Preview"
                        className="object-cover w-full h-full"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-1/3">
                <div className="p-4">
                  <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl">Kanban Boards</CardTitle>
                    </CardHeader>
                    <CardContent className="aspect-video overflow-hidden rounded-md">
                      <img
                        src={Image2}
                        alt="Kanban Preview"
                        className="object-cover w-full h-full"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-1/3">
                <div className="p-4">
                  <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl">Reporting and Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="aspect-video overflow-hidden rounded-md">
                      <img
                        src={Image3}
                        alt="Reporting Preview"
                        className="object-cover w-full h-full"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-1/3">
                <div className="p-4">
                  <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl">Dashboard Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="aspect-video overflow-hidden rounded-md">
                      <img
                        src={Image}
                        alt="Dashboard Preview"
                        className="object-cover w-full h-full"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="w-10 h-10 text-muted-foreground bg-secondary/50 rounded-full shadow-md hover:bg-secondary/80" />
            <CarouselNext className="w-10 h-10 text-muted-foreground bg-secondary/50 rounded-full shadow-md hover:bg-secondary/80" />
          </Carousel>
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-h2 font-inter mb-6">What Our Clients Say</h2>
            <p className="text-body-large text-muted-foreground leading-relaxed">
              Don't just take our word for it. See how we've helped businesses like yours achieve
              their project management goals.
            </p>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <CardTitle className="text-lg">{testimonial.author}</CardTitle>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-body-md text-muted-foreground italic">
                          "{testimonial.quote}"
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="w-10 h-10 text-muted-foreground bg-secondary/50 rounded-full shadow-md hover:bg-secondary/80" />
            <CarouselNext className="w-10 h-10 text-muted-foreground bg-secondary/50 rounded-full shadow-md hover:bg-secondary/80" />
          </Carousel>
        </div>
      </section>

      <SectionDivider variant="gradient" />

      {/* Call to Action */}
      <section className="py-32 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-h1 font-inter mb-8">Ready to Transform Your Projects?</h2>
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
            Join the industry leaders who trust us to deliver excellence every single day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="btn-premium text-btn-lg shadow-premium-lg hover:shadow-premium-xl hover-lift">
              <Link to="/projects">View Live Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-btn-lg border-2 hover:bg-primary/5 hover-lift">
              <Link to="/features">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

