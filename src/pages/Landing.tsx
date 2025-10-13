import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2,
  Code2,
  Lightbulb,
  MessageSquare,
  Github,
  Linkedin,
  Mail,
  Layout,
  Calendar,
  Users,
  Target,
  Trophy,
  Award,
  TrendingUp,
  BarChart3,
  Sparkles
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useProjectContext } from "@/contexts/ProjectContext";

const Landing = () => {
  const navigate = useNavigate();
  const { projects } = useProjectContext();

  const featuredProjects = projects.slice(0, 3);

  const skills = [
    "Agile & Scrum",
    "Risk Management",
    "Stakeholder Communication",
    "Budget Optimization",
    "Team Leadership",
    "Strategic Planning"
  ];

  const tools = [
    { name: "Jira", icon: Layout },
    { name: "Asana", icon: CheckCircle2 },
    { name: "MS Project", icon: Calendar },
    { name: "Slack", icon: MessageSquare },
    { name: "Notion", icon: Code2 },
    { name: "Trello", icon: BarChart3 }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechCorp",
      quote: "Exceptional project leadership. Delivered our most complex initiative 2 weeks ahead of schedule.",
      avatar: "SC"
    },
    {
      name: "Michael Torres",
      role: "CTO",
      company: "InnovateLabs",
      quote: "A rare combination of technical depth and people skills. Transformed our delivery process.",
      avatar: "MT"
    },
    {
      name: "Emily Parker",
      role: "Director of Operations",
      company: "GlobalTech",
      quote: "Outstanding communication and problem-solving. Our go-to PM for mission-critical projects.",
      avatar: "EP"
    }
  ];

  const methodology = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "Define objectives, scope, and success criteria with stakeholders"
    },
    {
      step: "02",
      title: "Team Alignment",
      description: "Build consensus, establish workflows, and empower team members"
    },
    {
      step: "03",
      title: "Execution & Monitoring",
      description: "Track progress, mitigate risks, and maintain transparent communication"
    },
    {
      step: "04",
      title: "Delivery & Optimization",
      description: "Ensure quality standards, gather feedback, and document learnings"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-playfair font-bold text-foreground">
              Project Portfolio
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/projects")}>
                Projects
              </Button>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_60%)]" />
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-8 animate-fade-in-up">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/30">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Project Management Professional
            </Badge>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-playfair font-bold leading-tight">
              Turning Complexity<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                into Clarity
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Project Manager crafting strategies that deliver on time, every time.
              Building bridges between vision and execution.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Button 
                size="lg" 
                onClick={() => {
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-6 text-lg group"
              >
                View My Projects
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-6 text-lg"
              >
                Get in Touch
                <Mail className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-playfair font-bold">
                About Me
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a seasoned Project Manager with a passion for transforming complex challenges 
                into streamlined, successful outcomes. With expertise in Agile methodologies, 
                stakeholder management, and strategic planning, I've led diverse teams to deliver 
                high-impact projects across industries.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                My approach combines data-driven decision making with empathetic leadership, 
                ensuring that every project not only meets its goals but also empowers the team 
                behind it.
              </p>
              
              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-4">Core Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{projects.length}+</div>
                    <div className="text-muted-foreground">Projects Delivered</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-success/10">
                    <Target className="w-8 h-8 text-success" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-muted-foreground">On-Time Delivery</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-accent/10">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50+</div>
                    <div className="text-muted-foreground">Team Members Led</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-playfair font-bold">Featured Projects</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A showcase of strategic initiatives delivered with precision and excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <Card 
                  key={project.id}
                  className="group cursor-pointer hover:shadow-premium-lg transition-all duration-300"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline">{project.overallRAG}</Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">${project.tco.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeline:</span>
                        <span className="font-medium">
                          {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>PM:</span>
                        <span className="font-medium">{project.projectManager}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-primary/10 transition-colors"
                    >
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No projects available yet</p>
                <Button 
                  onClick={() => navigate("/projects")} 
                  className="mt-4"
                >
                  Create Your First Project
                </Button>
              </div>
            )}
          </div>

          {featuredProjects.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/projects")}
              >
                View All Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-playfair font-bold">My Approach</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A proven methodology refined through years of successful delivery
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {methodology.map((phase, idx) => (
              <div key={idx} className="relative">
                <div className="space-y-4">
                  <div className="text-6xl font-playfair font-bold text-primary/20">
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {phase.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {phase.description}
                  </p>
                </div>
                
                {idx < methodology.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-playfair font-bold">What People Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by leaders across diverse industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="hover:shadow-premium-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Award key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Certifications */}
      <section className="py-24 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-playfair font-bold">Tools & Technologies</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Leveraging industry-leading platforms for optimal results
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {tools.map((tool) => (
              <Card 
                key={tool.name}
                className="group hover:shadow-premium-md transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                    <tool.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-medium text-sm">{tool.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex flex-wrap gap-3 justify-center">
              <Badge variant="secondary" className="px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                PMP Certified
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Scrum Master
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Agile Coach
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <div className="container mx-auto max-w-4xl relative text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-playfair font-bold">
            Let's Build Something<br />Great Together
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your next project into a success story? Let's connect.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Button 
              size="lg"
              onClick={() => window.location.href = 'mailto:your.email@example.com'}
              className="px-8 py-6 text-lg group"
            >
              <Mail className="mr-2 w-5 h-5" />
              Send a Message
            </Button>
            
            <div className="flex gap-3">
              <Button 
                size="icon"
                variant="outline"
                className="w-12 h-12"
                onClick={() => window.open('https://linkedin.com', '_blank')}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button 
                size="icon"
                variant="outline"
                className="w-12 h-12"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-playfair font-bold mb-2">Project Portfolio</h3>
              <p className="text-sm text-muted-foreground">
                © 2025 All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://linkedin.com', '_blank')}
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
