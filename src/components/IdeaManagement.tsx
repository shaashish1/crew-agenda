import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Lightbulb, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Idea } from "@/types/database";

interface IdeaManagementProps {
  projectId?: string;
}

const IdeaManagement: React.FC<IdeaManagementProps> = ({ projectId }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
    status: "new"
  });

  useEffect(() => {
    loadIdeas();
  }, [projectId]);

  const loadIdeas = async () => {
    const query = supabase.from("ideas").select("*");
    if (projectId) {
      query.eq("project_id", projectId);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Error loading ideas", description: error.message, variant: "destructive" });
    } else {
      setIdeas(data || []);
    }
  };

  const handleSubmit = async () => {
    const { error } = await supabase.from("ideas").insert({
      ...formData,
      project_id: projectId || null
    });

    if (error) {
      toast({ title: "Error creating idea", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Idea added", description: "Your idea has been added to the parking lot" });
      setOpen(false);
      setFormData({ title: "", description: "", category: "general", priority: "medium", status: "new" });
      loadIdeas();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("ideas").delete().eq("id", id);
    
    if (error) {
      toast({ title: "Error deleting idea", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Idea deleted" });
      loadIdeas();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h2 className="text-2xl font-bold">Idea Parking Lot</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Idea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Idea</DialogTitle>
              <DialogDescription>Capture ideas for future consideration</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What's your idea?"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your idea..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} className="text-white">Add Idea</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <Card key={idea.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{idea.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(idea.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{idea.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="outline">{idea.category}</Badge>
                <Badge className={getPriorityColor(idea.priority)}>{idea.priority}</Badge>
                <Badge variant="secondary">{idea.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ideas.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No ideas yet. Start capturing your thoughts!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IdeaManagement;
