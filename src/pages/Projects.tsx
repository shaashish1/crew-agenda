import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjectContext } from "@/contexts/ProjectContext";
import { RAGStatusBadge } from "@/components/RAGStatusBadge";
import { PerformanceRatingBadge } from "@/components/PerformanceRatingBadge";
import { format } from "date-fns";

const Projects = () => {
  const navigate = useNavigate();
  const { projects, getPerformanceStats } = useProjectContext();
  const [searchQuery, setSearchQuery] = useState("");
  
  const performanceStats = getPerformanceStats();

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.projectManager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Project Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Manage and track all IT projects
          </p>
        </div>
        <Button onClick={() => navigate("/projects/new")} size="lg">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects by name or manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Button size="lg" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Project Stats - RAG Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-muted">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Projects</p>
                <div className="text-3xl font-bold text-foreground">{projects.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success bg-success/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">On Track</p>
                <div className="text-3xl font-bold text-success">
                  {projects.filter(p => p.overallRAG === 'green').length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-success"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning bg-warning/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">At Risk</p>
                <div className="text-3xl font-bold text-warning">
                  {projects.filter(p => p.overallRAG === 'amber').length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-warning"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive bg-destructive/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Delayed</p>
                <div className="text-3xl font-bold text-destructive">
                  {projects.filter(p => p.overallRAG === 'red').length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-destructive"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Stats */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-t-4 border-t-success">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-success">{performanceStats.low}</div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">Excellent</Badge>
              </div>
              <p className="text-sm font-medium text-foreground">Excellent Performance</p>
              <p className="text-xs text-muted-foreground mt-1">&lt;5% delay, &gt;90% adoption</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-ratingMedium">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-ratingMedium">{performanceStats.medium}</div>
                <Badge variant="outline" className="bg-ratingMedium/10 text-ratingMedium border-ratingMedium/20">Good</Badge>
              </div>
              <p className="text-sm font-medium text-foreground">Medium Performance</p>
              <p className="text-xs text-muted-foreground mt-1">5-10% delay, 80-90% adoption</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-warning">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-warning">{performanceStats.high}</div>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">High Risk</Badge>
              </div>
              <p className="text-sm font-medium text-foreground">High Risk Performance</p>
              <p className="text-xs text-muted-foreground mt-1">10-20% delay, 70-80% adoption</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-destructive">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-destructive">{performanceStats.critical}</div>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>
              </div>
              <p className="text-sm font-medium text-foreground">Critical Performance</p>
              <p className="text-xs text-muted-foreground mt-1">&gt;20% delay, &lt;70% adoption</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">All Projects</h2>
        <div className="grid grid-cols-1 gap-3">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {searchQuery ? "No projects found" : "No projects yet"}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery ? "Try adjusting your search criteria." : "Create your first project to get started."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => navigate("/projects/new")} size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredProjects.map(project => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                        {project.performanceMetrics && (
                          <PerformanceRatingBadge 
                            rating={project.performanceMetrics.performanceRating}
                            delayPercentage={project.performanceMetrics.projectDelayPercentage}
                            adoptionRate={project.performanceMetrics.userAdoptionRate}
                            size="sm"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span><span className="font-medium text-foreground">PM:</span> {project.projectManager}</span>
                        <span>•</span>
                        <span><span className="font-medium text-foreground">Owner:</span> {project.businessOwner}</span>
                      </div>
                    </div>
                    <RAGStatusBadge status={project.overallRAG} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                      <p className="font-medium text-foreground">{format(new Date(project.startDate), 'dd MMM yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Go Live</p>
                      <p className="font-medium text-foreground">{format(new Date(project.goLiveDate), 'dd MMM yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <p className="font-medium text-foreground">${project.tco.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Spent</p>
                      <p className="font-medium text-foreground">${project.actualSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget Usage</p>
                      <p className="font-medium text-foreground">{Math.round((project.actualSpent / project.tco) * 100)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Timeline:</span>
                      <RAGStatusBadge status={project.timelineRAG} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Budget:</span>
                      <RAGStatusBadge status={project.budgetRAG} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Scope:</span>
                      <RAGStatusBadge status={project.scopeRAG} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
