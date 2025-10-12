import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Briefcase,
  Activity,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { PortfolioHealthChart } from "@/components/PortfolioHealthChart";
import { EnhancedAnalyticsCharts } from "@/components/EnhancedAnalyticsCharts";

const Landing = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const kpiAnimation = useScrollAnimation({ threshold: 0.15 });
  const metricsAnimation = useScrollAnimation({ threshold: 0.15 });

  return (
    <div className="min-h-screen">
      <ScrollProgress />

      {/* Hero Section - Executive Dashboard */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="container mx-auto relative z-10">
          <div 
            ref={heroAnimation.elementRef}
            className={`max-w-6xl mx-auto space-y-6 transition-all duration-1000 ${
              heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-8">
              <h1 className="text-display font-inter mb-4">
                DIT CTO Portfolio
                <span className="block mt-2 text-gradient glow">
                  Executive Dashboard
                </span>
              </h1>
              <p className="text-body-large text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Real-time insights into project performance, resource utilization, and portfolio health across all DIT initiatives.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild size="lg" className="btn-premium text-btn-lg shadow-premium-lg hover:shadow-premium-xl hover-lift">
                <Link to="/projects">View All Projects</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-btn-lg border-2 hover:bg-primary/5 hover-lift">
                <Link to="/dashboard">Live Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio KPIs */}
      <section className="py-20 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto">
          <div 
            ref={kpiAnimation.elementRef}
            className={`transition-all duration-1000 ${
              kpiAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-h2 font-inter mb-4">Portfolio Performance Overview</h2>
              <p className="text-body-large text-muted-foreground">
                Key metrics tracking project delivery, budget, and resource utilization across DIT CTO portfolio
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
              <GlassCard variant="premium" className="text-center hover-lift group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center shadow-premium-md group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 text-gradient glow">
                  <AnimatedCounter end={42} />
                </div>
                <div className="text-h4 font-semibold mb-1">Active Projects</div>
                <p className="text-sm text-muted-foreground">Currently in progress</p>
              </GlassCard>

              <GlassCard variant="premium" className="text-center hover-lift group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium-md group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 text-gradient glow">
                  <AnimatedCounter end={87.5} decimals={1} suffix="%" />
                </div>
                <div className="text-h4 font-semibold mb-1">On-Time Delivery</div>
                <p className="text-sm text-muted-foreground">Projects on schedule</p>
              </GlassCard>

              <GlassCard variant="premium" className="text-center hover-lift group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center shadow-premium-md group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 text-gradient glow">
                  <AnimatedCounter end={92.3} decimals={1} suffix="%" />
                </div>
                <div className="text-h4 font-semibold mb-1">Budget Health</div>
                <p className="text-sm text-muted-foreground">Within budget allocation</p>
              </GlassCard>

              <GlassCard variant="premium" className="text-center hover-lift group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-premium-md group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 text-gradient glow">
                  <AnimatedCounter end={78} suffix="%" />
                </div>
                <div className="text-h4 font-semibold mb-1">Resource Utilization</div>
                <p className="text-sm text-muted-foreground">Team capacity usage</p>
              </GlassCard>
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
              <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter end={156} />
                    </div>
                    <div className="text-xs text-muted-foreground">Total Projects</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter end={114} />
                    </div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter end={8} />
                    </div>
                    <div className="text-xs text-muted-foreground">At Risk</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter end={3} />
                    </div>
                    <div className="text-xs text-muted-foreground">Delayed</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Budget & Financial Metrics */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div 
            ref={metricsAnimation.elementRef}
            className={`transition-all duration-1000 ${
              metricsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-h2 font-inter mb-4">Financial Performance</h2>
              <p className="text-body-large text-muted-foreground">
                Portfolio-wide budget tracking, CAPEX/OPEX allocation, and cost efficiency metrics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <GlassCard variant="premium" className="hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Portfolio Budget</p>
                    <div className="text-3xl font-bold text-gradient">
                      $<AnimatedCounter end={45.2} decimals={1} suffix="M" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CAPEX:</span>
                    <span className="font-semibold">$28.5M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">OPEX:</span>
                    <span className="font-semibold">$16.7M</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard variant="premium" className="hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Actual Spend (YTD)</p>
                    <div className="text-3xl font-bold text-gradient">
                      $<AnimatedCounter end={38.7} decimals={1} suffix="M" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget Used:</span>
                    <span className="font-semibold text-success">85.6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-semibold">$6.5M</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard variant="premium" className="hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cost Efficiency</p>
                    <div className="text-3xl font-bold text-gradient">
                      <AnimatedCounter end={94.2} decimals={1} suffix="%" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-warning" />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Under Budget:</span>
                    <span className="font-semibold">28 projects</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Over Budget:</span>
                    <span className="font-semibold text-warning">5 projects</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 shadow-card">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Resource Utilization by Department
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Engineering</span>
                        <span className="font-semibold">82%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '82%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Product</span>
                        <span className="font-semibold">76%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '76%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Design</span>
                        <span className="font-semibold">68%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '68%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>QA</span>
                        <span className="font-semibold">91%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-warning to-destructive" style={{ width: '91%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Operations</span>
                        <span className="font-semibold">73%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '73%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-card">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Project Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span className="font-medium">On Track</span>
                      </div>
                      <span className="text-2xl font-bold">28</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-warning" />
                        <span className="font-medium">At Risk</span>
                      </div>
                      <span className="text-2xl font-bold">11</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="font-medium">Delayed</span>
                      </div>
                      <span className="text-2xl font-bold">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Analytics */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-inter mb-4">Portfolio Analytics & Trends</h2>
            <p className="text-body-large text-muted-foreground">
              Historical data and predictive insights for strategic decision-making
            </p>
          </div>

          <div className="space-y-6">
            <PortfolioHealthChart />
            <EnhancedAnalyticsCharts />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-h2 font-inter mb-6">Explore Detailed Insights</h2>
          <p className="text-body-large text-muted-foreground leading-relaxed mb-8">
            Access comprehensive project dashboards, team performance metrics, and advanced analytics to drive data-informed decisions across the DIT CTO portfolio.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="btn-premium text-btn-lg shadow-premium-lg hover:shadow-premium-xl hover-lift">
              <Link to="/projects">View All Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-btn-lg border-2 hover:bg-primary/5 hover-lift">
              <Link to="/dashboard">Executive Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

