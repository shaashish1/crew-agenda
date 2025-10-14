import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, Users } from "lucide-react";
import { PERFORMANCE_CRITERIA_DATA } from "@/utils/performanceCalculations";

interface PerformanceCriteriaTableProps {
  compact?: boolean;
}

export const PerformanceCriteriaTable = ({ compact = false }: PerformanceCriteriaTableProps) => {
  if (compact) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Year-End Performance Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PERFORMANCE_CRITERIA_DATA.map((criterion, idx) => (
              <div key={idx} className="text-sm">
                <p className="font-semibold text-foreground mb-1">{criterion.driver}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs">
                    Critical: {criterion.critical}
                  </div>
                  <div className="bg-success text-success-foreground px-2 py-1 rounded text-xs">
                    Low: {criterion.low}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-card/50 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Year-End Performance Measurement Framework
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every project will be evaluated against these critical success metrics. Track your performance throughout the year to ensure excellent ratings.
          </p>
        </div>

        <Card className="border-2 border-primary/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-b-2 border-primary/30">
            <CardTitle className="text-2xl text-center">Performance Criteria Matrix</CardTitle>
            <CardDescription className="text-center text-base">
              Understand the benchmarks that define project success
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-4 font-bold text-foreground bg-muted/50">Driver</th>
                    <th className="text-left p-4 font-bold text-foreground bg-muted/50">Criteria</th>
                    <th className="text-center p-4 font-bold text-destructive-foreground bg-destructive/90">Critical</th>
                    <th className="text-center p-4 font-bold text-destructive-foreground bg-destructive/90">High</th>
                    <th className="text-center p-4 font-bold bg-[hsl(38,92%,60%)] text-[hsl(260,35%,12%)]">Medium</th>
                    <th className="text-center p-4 font-bold text-success-foreground bg-success/90">Low (Target)</th>
                  </tr>
                </thead>
                <tbody>
                  {PERFORMANCE_CRITERIA_DATA.map((criterion, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {criterion.driver === 'Project Delay' ? (
                            <TrendingDown className="w-5 h-5 text-primary" />
                          ) : (
                            <Users className="w-5 h-5 text-accent" />
                          )}
                          <span className="font-semibold text-foreground">{criterion.driver}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{criterion.criteria}</td>
                      <td className="p-4 text-center">
                        <div className="bg-destructive/20 text-destructive px-3 py-2 rounded-lg font-medium text-sm border border-destructive/30">
                          {criterion.critical}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="bg-destructive/20 text-destructive px-3 py-2 rounded-lg font-medium text-sm border border-destructive/30">
                          {criterion.high}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="bg-[hsl(38,92%,60%)]/20 text-[hsl(260,35%,12%)] dark:text-foreground px-3 py-2 rounded-lg font-medium text-sm border border-[hsl(38,92%,60%)]/30">
                          {criterion.medium}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="bg-success/20 text-success px-3 py-2 rounded-lg font-medium text-sm border border-success/30">
                          {criterion.low}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {PERFORMANCE_CRITERIA_DATA.map((criterion, idx) => (
                <Card key={idx} className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {criterion.driver === 'Project Delay' ? (
                        <TrendingDown className="w-5 h-5 text-primary" />
                      ) : (
                        <Users className="w-5 h-5 text-accent" />
                      )}
                      {criterion.driver}
                    </CardTitle>
                    <CardDescription className="text-xs">{criterion.criteria}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded text-sm font-medium">
                      Critical: {criterion.critical}
                    </div>
                    <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded text-sm font-medium">
                      High: {criterion.high}
                    </div>
                    <div className="bg-[hsl(38,92%,60%)] text-[hsl(260,35%,12%)] px-3 py-2 rounded text-sm font-medium">
                      Medium: {criterion.medium}
                    </div>
                    <div className="bg-success text-success-foreground px-3 py-2 rounded text-sm font-medium">
                      Low (Target): {criterion.low}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-success/30">
            <CardHeader>
              <CardTitle className="text-lg text-success flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Project Delay Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Keep project delays under 5% to achieve an excellent rating. Monitor milestone progress closely and address blockers immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/30">
            <CardHeader>
              <CardTitle className="text-lg text-accent flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Adoption Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aim for over 90% user adoption rate measured 6 months post go-live. Invest in change management, training, and user support programs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
