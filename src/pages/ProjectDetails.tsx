import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectContext } from "@/contexts/ProjectContext";
import { RAGStatusBadge } from "@/components/RAGStatusBadge";
import { format } from "date-fns";
import { useState } from "react";
import { MilestoneTimeline } from "@/components/MilestoneTimeline";
import { RiskManagement } from "@/components/RiskManagement";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, getMilestonesByProject } = useProjectContext();
  const [activeTab, setActiveTab] = useState("overview");

  const project = getProjectById(id || "");
  const milestones = getMilestonesByProject(id || "");

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground mt-1">Project Details & Status</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RAGStatusBadge status={project.overallRAG} />
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Project Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Project Manager & Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{project.projectManager}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Business Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{project.businessOwner}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {project.projectTeam.map((member, idx) => (
                  <p key={idx} className="text-sm">{member}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Cost */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">TCO:</span>
                <span className="font-medium">${project.tco.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capex:</span>
                <span className="font-medium">${project.capex.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Opex:</span>
                <span className="font-medium">${project.opex.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Actual Spent:</span>
                <span className="font-bold">${project.actualSpent.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date:</p>
                <p className="font-medium">{format(new Date(project.startDate), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Go Live Date:</p>
                <p className="font-medium">{format(new Date(project.goLiveDate), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hypercare End:</p>
                <p className="font-medium">{format(new Date(project.hypercareEndDate), 'dd MMM yyyy')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Project Value Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Value Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {project.projectValueDelivery || 'No value delivery information provided'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Tabs */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader className="bg-[hsl(180,50%,40%)] text-white">
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {project.projectOverview || 'No overview provided'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-[hsl(180,50%,40%)] text-white">
                  <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">Timeline Status</p>
                        <RAGStatusBadge status={project.timelineRAG} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">Budget Status</p>
                        <RAGStatusBadge status={project.budgetRAG} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">Scope Status</p>
                        <RAGStatusBadge status={project.scopeRAG} />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.currentStatus || 'No status update provided'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-[hsl(180,50%,40%)] text-white">
                  <CardTitle>Business Benefits</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {project.businessBenefits || 'No business benefits defined'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-[hsl(180,50%,40%)] text-white">
                  <CardTitle>Key Activities Planned</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {project.keyActivities || 'No key activities defined'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones">
              <MilestoneTimeline projectId={project.id} milestones={milestones} />
            </TabsContent>

            {/* Risks Tab */}
            <TabsContent value="risks">
              <RiskManagement projectId={project.id} />
            </TabsContent>

            {/* Status Tab */}
            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Status Updates</CardTitle>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Update
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Status updates feature coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Project Documents</CardTitle>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Document management feature coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
