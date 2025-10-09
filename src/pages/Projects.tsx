import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useProjectContext } from "@/contexts/ProjectContext";
import { RAGStatusBadge } from "@/components/RAGStatusBadge";
import { format } from "date-fns";

const Projects = () => {
  const navigate = useNavigate();
  const { projects } = useProjectContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.projectManager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all IT projects
          </p>
        </div>
        <Button onClick={() => navigate("/projects/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{projects.length}</div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              {projects.filter(p => p.overallRAG === 'green').length}
            </div>
            <p className="text-sm text-muted-foreground">On Track</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              {projects.filter(p => p.overallRAG === 'amber').length}
            </div>
            <p className="text-sm text-muted-foreground">At Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {projects.filter(p => p.overallRAG === 'red').length}
            </div>
            <p className="text-sm text-muted-foreground">Delayed</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "No projects found matching your search." : "No projects yet. Create your first project to get started."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map(project => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <CardDescription className="mt-2">
                      <span className="font-medium">PM:</span> {project.projectManager} | 
                      <span className="font-medium ml-2">Owner:</span> {project.businessOwner}
                    </CardDescription>
                  </div>
                  <RAGStatusBadge status={project.overallRAG} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{format(new Date(project.startDate), 'dd MMM yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Go Live</p>
                    <p className="font-medium">{format(new Date(project.goLiveDate), 'dd MMM yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium">${project.tco.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spent</p>
                    <p className="font-medium">${project.actualSpent.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Timeline: </span>
                    <RAGStatusBadge status={project.timelineRAG} className="ml-1" />
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Budget: </span>
                    <RAGStatusBadge status={project.budgetRAG} className="ml-1" />
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Scope: </span>
                    <RAGStatusBadge status={project.scopeRAG} className="ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
