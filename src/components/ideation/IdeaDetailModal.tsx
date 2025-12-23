import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedIdea, IdeaComment, IdeaStageHistory, IdeaReview } from "@/types/ideation";
import { StageProgressIndicator } from "./StageProgressIndicator";
import { L2EvaluationForm } from "./L2EvaluationForm";
import { L3BusinessCaseForm } from "./L3BusinessCaseForm";
import { L4ExecutiveReviewForm } from "./L4ExecutiveReviewForm";
import { 
  User, 
  Calendar, 
  Building2, 
  MessageSquare, 
  History,
  FileText,
  TrendingUp,
  DollarSign,
  Rocket,
  Send
} from "lucide-react";
import { format } from "date-fns";

interface IdeaDetailModalProps {
  idea: EnhancedIdea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function IdeaDetailModal({ idea, open, onOpenChange, onUpdate }: IdeaDetailModalProps) {
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [history, setHistory] = useState<IdeaStageHistory[]>([]);
  const [reviews, setReviews] = useState<IdeaReview[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (idea && open) {
      loadComments();
      loadHistory();
      loadReviews();
    }
  }, [idea, open]);

  const loadComments = async () => {
    if (!idea) return;
    const { data } = await supabase
      .from("idea_comments")
      .select("*")
      .eq("idea_id", idea.id)
      .order("created_at", { ascending: true });
    setComments(data || []);
  };

  const loadHistory = async () => {
    if (!idea) return;
    const { data } = await supabase
      .from("idea_stage_history")
      .select("*")
      .eq("idea_id", idea.id)
      .order("created_at", { ascending: false });
    setHistory(data || []);
  };

  const loadReviews = async () => {
    if (!idea) return;
    const { data } = await supabase
      .from("idea_reviews")
      .select("*")
      .eq("idea_id", idea.id)
      .order("created_at", { ascending: false });
    setReviews(data || []);
  };

  const handleAddComment = async () => {
    if (!idea || !newComment.trim() || !commentAuthor.trim()) {
      toast.error("Please enter both author name and comment");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const { error } = await supabase.from("idea_comments").insert({
        idea_id: idea.id,
        author_name: commentAuthor,
        content: newComment,
      });

      if (error) throw error;

      setNewComment("");
      loadComments();
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!idea) return null;

  const getStageStatusBadge = () => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      approved: "bg-green-500/10 text-green-600 border-green-500/20",
      rejected: "bg-red-500/10 text-red-600 border-red-500/20",
      on_hold: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    };

    return (
      <Badge variant="outline" className={statusColors[idea.stage_status] || ""}>
        {idea.stage_status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="p-6 border-b bg-muted/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {idea.evaluation_stage}
                </Badge>
                {getStageStatusBadge()}
                <Badge variant="secondary">{idea.category}</Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground">{idea.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {idea.submitter_name && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {idea.submitter_name}
                  </span>
                )}
                {idea.department && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {idea.department.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(idea.created_at), "PPP")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <StageProgressIndicator
              currentStage={idea.evaluation_stage}
              stageStatus={idea.stage_status}
              completedStages={{
                l1: idea.l1_completed_at,
                l2: idea.l2_completed_at,
                l3: idea.l3_completed_at,
                l4: idea.l4_completed_at,
                l5: idea.l5_completed_at,
              }}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 max-h-[calc(90vh-200px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <FileText className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="l2-review"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                L2 Review
              </TabsTrigger>
              <TabsTrigger
                value="l3-feasibility"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                L3 Feasibility
              </TabsTrigger>
              <TabsTrigger
                value="l4-business"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                L4 Business Case
              </TabsTrigger>
              <TabsTrigger
                value="l5-implementation"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Rocket className="h-4 w-4 mr-2" />
                L5 Implementation
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments ({comments.length})
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid gap-4">
                  {idea.problem_statement && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Problem Statement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground whitespace-pre-wrap">{idea.problem_statement}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.proposed_solution && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Proposed Solution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground whitespace-pre-wrap">{idea.proposed_solution}</p>
                      </CardContent>
                    </Card>
                  )}

                  {idea.expected_benefits && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Expected Benefits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground whitespace-pre-wrap">{idea.expected_benefits}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Stage History */}
                <Separator />
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Stage History
                  </h4>
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No stage transitions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {history.map((h) => (
                        <div key={h.id} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          <div>
                            <p className="text-foreground">
                              {h.from_stage ? `${h.from_stage} → ${h.to_stage}` : `Started at ${h.to_stage}`}
                              {" • "}
                              <span className="text-muted-foreground">{h.to_status}</span>
                            </p>
                            {h.change_reason && (
                              <p className="text-muted-foreground">{h.change_reason}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              By {h.changed_by} on {format(new Date(h.created_at), "PPp")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* L2 Review Tab */}
              <TabsContent value="l2-review" className="mt-0">
                <L2EvaluationForm idea={idea} onUpdate={onUpdate} />
              </TabsContent>

              {/* L3 Feasibility Tab */}
              <TabsContent value="l3-feasibility" className="mt-0">
                <L3BusinessCaseForm idea={idea} onUpdate={onUpdate} />
              </TabsContent>

              {/* L4 Business Case Tab */}
              <TabsContent value="l4-business" className="mt-0">
                <L4ExecutiveReviewForm idea={idea} onUpdate={onUpdate} />
              </TabsContent>

              {/* L5 Implementation Tab */}
              <TabsContent value="l5-implementation" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>L5 Implementation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['L1', 'L2', 'L3'].includes(idea.evaluation_stage) ? (
                      <p className="text-muted-foreground">
                        Complete L4 business case approval first.
                      </p>
                    ) : (
                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Project Lead</Label>
                            <p className="mt-1">{idea.l5_project_lead || "Not assigned"}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Implementation Status</Label>
                            <p className="mt-1">{idea.l5_implementation_status || "Not started"}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Progress</Label>
                          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${idea.l5_progress_percentage || 0}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {idea.l5_progress_percentage || 0}% complete
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments" className="mt-0 space-y-4">
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No comments yet. Be the first to add one!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{comment.author_name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(comment.created_at), "PPp")}
                                </span>
                              </div>
                              <p className="mt-1 text-foreground whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Add Comment</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Your name"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                    />
                    <Textarea
                      placeholder="Write your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={handleAddComment} 
                      disabled={isSubmittingComment}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmittingComment ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
