import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Globe, 
  Smartphone, 
  Cloud, 
  Brain,
  CheckCircle2,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroScene3D } from "@/components/HeroScene3D";
import { ServiceCard } from "@/components/ServiceCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ContactForm } from "@/components/ContactForm";

const Landing = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Build modern, responsive web applications with cutting-edge technologies and best practices.",
      features: ["React & Next.js", "Progressive Web Apps", "E-commerce Solutions"],
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Create native and cross-platform mobile applications that deliver exceptional user experiences.",
      features: ["iOS & Android", "React Native", "Flutter Development"],
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      description: "Optimize your infrastructure with cloud-native solutions and automated deployment pipelines.",
      features: ["AWS & Azure", "CI/CD Pipelines", "Kubernetes"],
    },
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Leverage artificial intelligence to automate processes and gain actionable insights from data.",
      features: ["Predictive Analytics", "Natural Language Processing", "Computer Vision"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient cursor-pointer hover:opacity-80 transition-opacity">
              Syngene ProjectHub
            </h1>
            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Services</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button onClick={() => navigate("/projects")} variant="blue">
                Get Started
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden hero-bg">
        <HeroScene3D />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Trusted by 500+ Enterprises</span>
            </div>
            
            <h1 className="text-display text-gradient">
              Transforming Ideas Into Digital Reality
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We build innovative IT solutions that drive business growth and deliver measurable results.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" variant="blue" onClick={() => navigate("/projects")} className="min-w-[180px]">
                View Our Work
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter end={10} suffix="+" label="Years Experience" />
            <AnimatedCounter end={500} suffix="+" label="Projects Delivered" />
            <AnimatedCounter end={98} suffix="%" label="Client Satisfaction" />
            <AnimatedCounter end={50} suffix="+" label="Team Members" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 section-container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-h2 text-gradient">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive IT solutions tailored to your business needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 100} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-h2 text-gradient">Why Choose Us</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We combine technical excellence with strategic thinking to deliver solutions that not only meet your current needs but scale for the future.
              </p>
              <ul className="space-y-4">
                {[
                  "Agile methodology for faster delivery",
                  "24/7 support and maintenance",
                  "Transparent communication and reporting",
                  "Security-first development approach",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="blue" onClick={() => navigate("/projects")}>
                Explore Our Portfolio
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-card border border-border shadow-card">
                  <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                  <p className="text-muted-foreground">Uptime Guarantee</p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border shadow-card">
                  <div className="text-3xl font-bold text-primary mb-2">ISO</div>
                  <p className="text-muted-foreground">27001 Certified</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="p-6 rounded-xl bg-card border border-border shadow-card">
                  <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                  <p className="text-muted-foreground">Client Rating</p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border shadow-card">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-muted-foreground">Expert Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 section-container">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-h2 text-gradient mb-4">Let's Build Something Great</h2>
              <p className="text-lg text-muted-foreground">
                Ready to start your next project? Get in touch and let's discuss how we can help.
              </p>
            </div>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "contact@syngene.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Address", value: "123 Tech Park, Innovation City" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 Syngene International. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
