import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectContext } from "@/contexts/ProjectContext";
import { RAGStatusBadge } from "@/components/RAGStatusBadge";
import { PerformanceRatingBadge } from "@/components/PerformanceRatingBadge";
import { PerformanceCriteriaTable } from "@/components/PerformanceCriteriaTable";
import { format } from "date-fns";
import { useState } from "react";
import { MilestoneTimeline } from "@/components/MilestoneTimeline";
import { RiskManagement } from "@/components/RiskManagement";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getPerformanceInsights, canMeasureAdoption, getAdoptionMeasurementDate } from "@/utils/performanceCalculations";
import { RefreshCw, TrendingDown, Users, Calendar } from "lucide-react";
import { PhaseSelector } from "@/components/PhaseSelector";
import { PhaseManagement } from "@/components/PhaseManagement";
import { DocumentChecklist } from "@/components/DocumentChecklist";
import { PredictiveAnalyticsPanel } from "@/components/PredictiveAnalyticsPanel";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, getMilestonesByProject, updateProjectPerformanceMetrics, setUserAdoptionRate } = useProjectContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [adoptionInput, setAdoptionInput] = useState("");
  const [currentPhase, setCurrentPhase] = useState("Phase 0: Initiation");

  const handlePhaseChange = (phase: string) => {
    setCurrentPhase(phase);
    toast({
      title: "Phase Updated",
      description: `Project phase changed to ${phase}`,
    });
  };

  const project = getProjectById(id || "");
  const milestones = getMilestonesByProject(id || "");

  const handleRecalculate = () => {
    if (id) {
      updateProjectPerformanceMetrics(id);
      toast({
        title: "Metrics Updated",
        description: "Performance metrics have been recalculated.",
      });
    }
  };

  const handleAdoptionSubmit = () => {
    const rate = parseFloat(adoptionInput);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid adoption rate between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    if (id) {
      setUserAdoptionRate(id, rate, new Date().toISOString());
      toast({
        title: "Adoption Rate Saved",
        description: `User adoption rate set to ${rate}%. Performance rating updated.`,
      });
      setAdoptionInput("");
    }
  };

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

      {/* Phase Selector */}
      <PhaseSelector 
        currentPhase={currentPhase} 
        onPhaseChange={handlePhaseChange}
      />

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
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="phases">Phases</TabsTrigger>
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
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Current Status Description</p>
                      <p className="text-sm whitespace-pre-wrap">{project.currentStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="ai-insights" className="space-y-4">
              <PredictiveAnalyticsPanel projectId={id!} />
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4">
              {project.performanceMetrics ? (
                <>
                  {/* Current Performance Card */}
                  <Card className={`border-2 ${
                    project.performanceMetrics.performanceRating === 'critical' ? 'border-destructive/50 bg-destructive/5' :
                    project.performanceMetrics.performanceRating === 'high' ? 'border-warning/50 bg-warning/5' :
                    project.performanceMetrics.performanceRating === 'medium' ? 'border-[hsl(38,92%,60%)]/50 bg-[hsl(38,92%,60%)]/5' :
                    'border-success/50 bg-success/5'
                  }`}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Current Performance Rating</CardTitle>
                        <Button onClick={handleRecalculate} variant="outline" size="sm" className="gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Recalculate
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center">
                        <PerformanceRatingBadge
                          rating={project.performanceMetrics.performanceRating}
                          delayPercentage={project.performanceMetrics.projectDelayPercentage}
                          adoptionRate={project.performanceMetrics.userAdoptionRate}
                          size="lg"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Last calculated: {format(new Date(project.performanceMetrics.lastCalculated), 'dd MMM yyyy, HH:mm')}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Project Delay Tracking */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-primary" />
                        Project Delay Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Delay Percentage</span>
                          <span className="font-bold text-lg">{project.performanceMetrics.projectDelayPercentage}%</span>
                        </div>
                        <Progress value={project.performanceMetrics.projectDelayPercentage} className="h-3" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-muted-foreground">Total Milestones</p>
                          <p className="text-2xl font-bold text-foreground">{milestones.length}</p>
                        </div>
                        <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                          <p className="text-muted-foreground">Delayed</p>
                          <p className="text-2xl font-bold text-destructive">
                            {Math.ceil((project.performanceMetrics.projectDelayPercentage / 100) * milestones.length)}
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2 text-sm">Target Rating Thresholds</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span>Low (Excellent):</span>
                            <span className="font-medium text-success">&lt;5% delayed</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Medium:</span>
                            <span className="font-medium">5-10% delayed</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>High:</span>
                            <span className="font-medium text-warning">10-20% delayed</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Critical:</span>
                            <span className="font-medium text-destructive">&gt;20% delayed</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* User Adoption Tracking */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-accent" />
                        User Adoption Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      {canMeasureAdoption(project.goLiveDate) ? (
                        <>
                          {project.performanceMetrics.userAdoptionRate !== null ? (
                            <>
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-muted-foreground">Adoption Rate</span>
                                  <span className="font-bold text-lg">{project.performanceMetrics.userAdoptionRate}%</span>
                                </div>
                                <Progress value={project.performanceMetrics.userAdoptionRate} className="h-3" />
                              </div>
                              {project.performanceMetrics.adoptionMeasurementDate && (
                                <p className="text-sm text-muted-foreground">
                                  Measured on: {format(new Date(project.performanceMetrics.adoptionMeasurementDate), 'dd MMM yyyy')}
                                </p>
                              )}
                            </>
                          ) : (
                            <div className="space-y-3">
                              <Label htmlFor="adoption-rate">Enter User Adoption Rate (%)</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="adoption-rate"
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="e.g., 85"
                                  value={adoptionInput}
                                  onChange={(e) => setAdoptionInput(e.target.value)}
                                />
                                <Button onClick={handleAdoptionSubmit}>Save</Button>
                              </div>
                            </div>
                          )}
                          <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-2 text-sm">Target Rating Thresholds</h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between items-center">
                                <span>Low (Excellent):</span>
                                <span className="font-medium text-success">&gt;90% adoption</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Medium:</span>
                                <span className="font-medium">80-90% adoption</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>High:</span>
                                <span className="font-medium text-warning">70-80% adoption</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Critical:</span>
                                <span className="font-medium text-destructive">&lt;70% adoption</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="bg-info/10 border border-info/30 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-info mt-0.5" />
                            <div>
                              <p className="font-medium text-foreground mb-1">Adoption Measurement Pending</p>
                              <p className="text-sm text-muted-foreground">
                                User adoption can be measured 6 months after go-live.
                              </p>
                              <p className="text-sm font-medium text-info mt-2">
                                Available from: {format(getAdoptionMeasurementDate(project.goLiveDate), 'dd MMM yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Performance Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actionable Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getPerformanceInsights(project.performanceMetrics, project, milestones.length).map((insight, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <span className="text-lg">{insight.charAt(0)}</span>
                            <p className="text-sm text-foreground flex-1">{insight.slice(2)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Criteria Reference */}
                  <PerformanceCriteriaTable compact />
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      Performance metrics will be calculated automatically based on project milestones.
                    </p>
                    <Button onClick={handleRecalculate} className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Calculate Performance Metrics
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones">
              <MilestoneTimeline projectId={project.id} milestones={milestones} />
            </TabsContent>

            {/* Phases Tab */}
            <TabsContent value="phases" className="space-y-6">
              <PhaseManagement projectId={project.id} currentPhaseName={currentPhase} />
              <DocumentChecklist projectId={project.id} phaseName={currentPhase} />
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
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Document Repository</CardTitle>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Document upload and management coming soon
                  </p>
                </CardContent>
              </Card>
              <DocumentChecklist projectId={project.id} phaseName={currentPhase} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
