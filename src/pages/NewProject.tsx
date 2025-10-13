import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MultiSelectInput } from "@/components/ui/multi-select-input";
import { useProjectContext } from "@/contexts/ProjectContext";
import { RAGStatus, Comment } from "@/types/project";
import { toast } from "sonner";
import { format } from "date-fns";

const NewProject = () => {
  const navigate = useNavigate();
  const { addProject } = useProjectContext();
  
  const [formData, setFormData] = useState({
    name: "",
    projectManager: [] as string[],
    businessOwner: [] as string[],
    projectTeam: [] as string[],
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
    overallJustification: "",
    overallCorrectiveAction: "",
    timelineJustification: "",
    timelineCorrectiveAction: "",
    budgetJustification: "",
    budgetCorrectiveAction: "",
    scopeJustification: "",
    scopeCorrectiveAction: "",
    resourceUtilization: [
      { department: "", totalResources: 0, allocatedPercentage: 0 }
    ],
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (!formData.projectManager || formData.projectManager.length === 0) {
      toast.error("Please enter Project Manager name first");
      return;
    }

    const comment: Comment = {
      id: crypto.randomUUID(),
      text: newComment.trim(),
      author: formData.projectManager[0],
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
    toast.success("Comment added to history");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.projectManager.length === 0 || formData.businessOwner.length === 0 ||
        !formData.startDate || !formData.goLiveDate || !formData.hypercareEndDate) {
      toast.error("Please fill in all required fields (marked with *)");
      return;
    }

    addProject({
      ...formData,
      projectManager: formData.projectManager.join(', '),
      businessOwner: formData.businessOwner.join(', '),
      projectTeam: formData.projectTeam,
      tco: Number(formData.tco) || 0,
      capex: Number(formData.capex) || 0,
      opex: Number(formData.opex) || 0,
      actualSpent: Number(formData.actualSpent) || 0,
      resourceUtilization: formData.resourceUtilization.filter(r => r.department),
      comments,
    });

    toast.success("Project created successfully!");
    navigate("/projects");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/projects")}
          className="hover:scale-110 hover:-translate-x-1 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            New Project
          </h1>
          <p className="text-muted-foreground mt-2">Create a new IT project with comprehensive details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Basic Information</CardTitle>
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
                  <MultiSelectInput
                    values={formData.projectManager}
                    onChange={(values) => setFormData({ ...formData, projectManager: values })}
                    placeholder="Enter PM names"
                  />
                </div>
                <div>
                  <Label htmlFor="businessOwner">Business Owner *</Label>
                  <MultiSelectInput
                    values={formData.businessOwner}
                    onChange={(values) => setFormData({ ...formData, businessOwner: values })}
                    placeholder="Enter owner names"
                  />
                </div>
                <div>
                  <Label htmlFor="projectTeam">Project Team</Label>
                  <MultiSelectInput
                    values={formData.projectTeam}
                    onChange={(values) => setFormData({ ...formData, projectTeam: values })}
                    placeholder="Enter team member names"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '80ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Project Cost</CardTitle>
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

            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '160ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="goLiveDate">Go Live Date *</Label>
                  <Input
                    id="goLiveDate"
                    type="date"
                    value={formData.goLiveDate}
                    onChange={(e) => setFormData({ ...formData, goLiveDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hypercareEndDate">Hypercare End Date *</Label>
                  <Input
                    id="hypercareEndDate"
                    type="date"
                    value={formData.hypercareEndDate}
                    onChange={(e) => setFormData({ ...formData, hypercareEndDate: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Content */}
          <div className="space-y-6">
            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '240ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Project Overview</CardTitle>
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

            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '320ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Business Benefits</CardTitle>
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

            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Project Value Delivery</CardTitle>
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
            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '480ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">RAG Status *</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Critical fields for performance tracking</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="overallRAG">Overall Status *</Label>
                    {formData.overallRAG !== "green" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" type="button">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div>
                            <Label>Justification</Label>
                            <Textarea
                              value={formData.overallJustification}
                              onChange={(e) => setFormData({ ...formData, overallJustification: e.target.value })}
                              placeholder="Enter justification for this status..."
                              rows={3}
                            />
                          </div>
                          {(formData.overallRAG === "amber" || formData.overallRAG === "red") && (
                            <div>
                              <Label>Corrective Action</Label>
                              <Textarea
                                value={formData.overallCorrectiveAction}
                                onChange={(e) => setFormData({ ...formData, overallCorrectiveAction: e.target.value })}
                                placeholder="How can this project be brought back to Green?"
                                rows={3}
                              />
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    )}
                  </div>
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
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="timelineRAG">Timeline Status *</Label>
                    {formData.timelineRAG !== "green" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" type="button">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div>
                            <Label>Justification</Label>
                            <Textarea
                              value={formData.timelineJustification}
                              onChange={(e) => setFormData({ ...formData, timelineJustification: e.target.value })}
                              placeholder="Enter justification for this status..."
                              rows={3}
                            />
                          </div>
                          {(formData.timelineRAG === "amber" || formData.timelineRAG === "red") && (
                            <div>
                              <Label>Corrective Action</Label>
                              <Textarea
                                value={formData.timelineCorrectiveAction}
                                onChange={(e) => setFormData({ ...formData, timelineCorrectiveAction: e.target.value })}
                                placeholder="How can this project be brought back to Green?"
                                rows={3}
                              />
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    )}
                  </div>
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
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="budgetRAG">Budget Status *</Label>
                    {formData.budgetRAG !== "green" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" type="button">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div>
                            <Label>Justification</Label>
                            <Textarea
                              value={formData.budgetJustification}
                              onChange={(e) => setFormData({ ...formData, budgetJustification: e.target.value })}
                              placeholder="Enter justification for this status..."
                              rows={3}
                            />
                          </div>
                          {(formData.budgetRAG === "amber" || formData.budgetRAG === "red") && (
                            <div>
                              <Label>Corrective Action</Label>
                              <Textarea
                                value={formData.budgetCorrectiveAction}
                                onChange={(e) => setFormData({ ...formData, budgetCorrectiveAction: e.target.value })}
                                placeholder="How can this project be brought back to Green?"
                                rows={3}
                              />
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    )}
                  </div>
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
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="scopeRAG">Scope Status *</Label>
                    {formData.scopeRAG !== "green" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" type="button">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div>
                            <Label>Justification</Label>
                            <Textarea
                              value={formData.scopeJustification}
                              onChange={(e) => setFormData({ ...formData, scopeJustification: e.target.value })}
                              placeholder="Enter justification for this status..."
                              rows={3}
                            />
                          </div>
                          {(formData.scopeRAG === "amber" || formData.scopeRAG === "red") && (
                            <div>
                              <Label>Corrective Action</Label>
                              <Textarea
                                value={formData.scopeCorrectiveAction}
                                onChange={(e) => setFormData({ ...formData, scopeCorrectiveAction: e.target.value })}
                                placeholder="How can this project be brought back to Green?"
                                rows={3}
                              />
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    )}
                  </div>
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

            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '560ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Current Status & Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Status Summary</Label>
                  <Textarea
                    value={formData.currentStatus}
                    onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                    placeholder="Enter current project status summary..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Comment History ({comments.length})</Label>
                  <div className="mt-2 space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/20">
                    {comments.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No comments yet. Add your first comment below.
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-card p-3 rounded-lg border shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {comment.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.timestamp), "dd MMM yyyy, HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <Label>Add Comment</Label>
                  <div className="flex gap-2 mt-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter your comment..."
                      rows={2}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          handleAddComment();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddComment}
                      size="icon"
                      className="h-auto"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Press Ctrl+Enter to add comment
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '640ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Resource Utilization by Department</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.resourceUtilization.map((resource, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
                    <div>
                      <Label htmlFor={`dept-${index}`}>Department</Label>
                      <Input
                        id={`dept-${index}`}
                        value={resource.department}
                        onChange={(e) => {
                          const updated = [...formData.resourceUtilization];
                          updated[index].department = e.target.value;
                          setFormData({ ...formData, resourceUtilization: updated });
                        }}
                        placeholder="e.g., Engineering"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`total-${index}`}>Total Resources</Label>
                      <Input
                        id={`total-${index}`}
                        type="number"
                        min="0"
                        value={resource.totalResources}
                        onChange={(e) => {
                          const updated = [...formData.resourceUtilization];
                          updated[index].totalResources = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, resourceUtilization: updated });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`allocated-${index}`}>Allocated %</Label>
                      <Input
                        id={`allocated-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={resource.allocatedPercentage}
                        onChange={(e) => {
                          const updated = [...formData.resourceUtilization];
                          updated[index].allocatedPercentage = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, resourceUtilization: updated });
                        }}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const updated = formData.resourceUtilization.filter((_, i) => i !== index);
                          setFormData({ ...formData, resourceUtilization: updated });
                        }}
                        disabled={formData.resourceUtilization.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      resourceUtilization: [
                        ...formData.resourceUtilization,
                        { department: "", totalResources: 0, allocatedPercentage: 0 }
                      ]
                    });
                  }}
                >
                  Add Department
                </Button>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-premium-lg hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: '720ms', animationFillMode: 'both' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-xl">Key Activities Planned</CardTitle>
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

        <div className="flex justify-end gap-4 mt-8 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/projects")}
            className="hover:scale-105 hover:-translate-x-1 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="hover:scale-105 hover:shadow-premium transition-all duration-300 bg-gradient-to-r from-primary to-primary/80"
          >
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;
