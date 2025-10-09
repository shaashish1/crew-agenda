import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectContext } from "@/contexts/ProjectContext";
import { RAGStatus } from "@/types/project";
import { toast } from "sonner";

const NewProject = () => {
  const navigate = useNavigate();
  const { addProject } = useProjectContext();
  
  const [formData, setFormData] = useState({
    name: "",
    projectManager: "",
    businessOwner: "",
    projectTeam: "",
    tco: "",
    capex: "",
    opex: "",
    actualSpent: "0",
    startDate: "",
    goLiveDate: "",
    hypercareEndDate: "",
    projectOverview: "",
    businessBenefits: "",
    projectValueDelivery: "",
    currentStatus: "",
    keyActivities: "",
    overallRAG: "green" as RAGStatus,
    timelineRAG: "green" as RAGStatus,
    budgetRAG: "green" as RAGStatus,
    scopeRAG: "green" as RAGStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.projectManager || !formData.businessOwner) {
      toast.error("Please fill in all required fields");
      return;
    }

    addProject({
      ...formData,
      projectTeam: formData.projectTeam.split(',').map(m => m.trim()).filter(Boolean),
      tco: Number(formData.tco) || 0,
      capex: Number(formData.capex) || 0,
      opex: Number(formData.opex) || 0,
      actualSpent: Number(formData.actualSpent) || 0,
    });

    toast.success("Project created successfully!");
    navigate("/projects");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Project</h1>
          <p className="text-muted-foreground mt-1">Create a new IT project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="projectManager">Project Manager *</Label>
                  <Input
                    id="projectManager"
                    value={formData.projectManager}
                    onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
                    placeholder="Enter PM name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="businessOwner">Business Owner *</Label>
                  <Input
                    id="businessOwner"
                    value={formData.businessOwner}
                    onChange={(e) => setFormData({ ...formData, businessOwner: e.target.value })}
                    placeholder="Enter owner name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="projectTeam">Project Team (comma separated)</Label>
                  <Textarea
                    id="projectTeam"
                    value={formData.projectTeam}
                    onChange={(e) => setFormData({ ...formData, projectTeam: e.target.value })}
                    placeholder="Member 1, Member 2, Member 3"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Cost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tco">TCO ($)</Label>
                  <Input
                    id="tco"
                    type="number"
                    value={formData.tco}
                    onChange={(e) => setFormData({ ...formData, tco: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="capex">Capex ($)</Label>
                  <Input
                    id="capex"
                    type="number"
                    value={formData.capex}
                    onChange={(e) => setFormData({ ...formData, capex: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="opex">Opex ($)</Label>
                  <Input
                    id="opex"
                    type="number"
                    value={formData.opex}
                    onChange={(e) => setFormData({ ...formData, opex: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="actualSpent">Actual Spent ($)</Label>
                  <Input
                    id="actualSpent"
                    type="number"
                    value={formData.actualSpent}
                    onChange={(e) => setFormData({ ...formData, actualSpent: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="goLiveDate">Go Live Date</Label>
                  <Input
                    id="goLiveDate"
                    type="date"
                    value={formData.goLiveDate}
                    onChange={(e) => setFormData({ ...formData, goLiveDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="hypercareEndDate">Hypercare End Date</Label>
                  <Input
                    id="hypercareEndDate"
                    type="date"
                    value={formData.hypercareEndDate}
                    onChange={(e) => setFormData({ ...formData, hypercareEndDate: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.projectOverview}
                  onChange={(e) => setFormData({ ...formData, projectOverview: e.target.value })}
                  placeholder="Describe the project overview..."
                  rows={8}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.businessBenefits}
                  onChange={(e) => setFormData({ ...formData, businessBenefits: e.target.value })}
                  placeholder="Describe the business benefits..."
                  rows={8}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Value Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.projectValueDelivery}
                  onChange={(e) => setFormData({ ...formData, projectValueDelivery: e.target.value })}
                  placeholder="Describe the value delivery..."
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RAG Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="overallRAG">Overall Status</Label>
                  <Select value={formData.overallRAG} onValueChange={(value) => setFormData({ ...formData, overallRAG: value as RAGStatus })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green - On Track</SelectItem>
                      <SelectItem value="amber">Amber - At Risk</SelectItem>
                      <SelectItem value="red">Red - Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timelineRAG">Timeline Status</Label>
                  <Select value={formData.timelineRAG} onValueChange={(value) => setFormData({ ...formData, timelineRAG: value as RAGStatus })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green - On Track</SelectItem>
                      <SelectItem value="amber">Amber - At Risk</SelectItem>
                      <SelectItem value="red">Red - Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budgetRAG">Budget Status</Label>
                  <Select value={formData.budgetRAG} onValueChange={(value) => setFormData({ ...formData, budgetRAG: value as RAGStatus })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green - On Track</SelectItem>
                      <SelectItem value="amber">Amber - At Risk</SelectItem>
                      <SelectItem value="red">Red - Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scopeRAG">Scope Status</Label>
                  <Select value={formData.scopeRAG} onValueChange={(value) => setFormData({ ...formData, scopeRAG: value as RAGStatus })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green - On Track</SelectItem>
                      <SelectItem value="amber">Amber - At Risk</SelectItem>
                      <SelectItem value="red">Red - Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.currentStatus}
                  onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                  placeholder="Enter current project status..."
                  rows={8}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Activities Planned</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.keyActivities}
                  onChange={(e) => setFormData({ ...formData, keyActivities: e.target.value })}
                  placeholder="Enter key activities..."
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate("/projects")}>
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;
