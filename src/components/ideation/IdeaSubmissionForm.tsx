import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Department } from "@/types/ideation";

interface IdeaSubmissionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  projectId?: string;
}

export function IdeaSubmissionForm({ onSuccess, onCancel, projectId }: IdeaSubmissionFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem_statement: "",
    proposed_solution: "",
    expected_benefits: "",
    category: "innovation",
    priority: "medium",
    department_id: "",
    submitter_name: "",
    submitter_email: "",
    submitter_employee_id: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error loading departments:", error);
    } else {
      setDepartments(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter an idea title");
      return;
    }

    if (!formData.department_id) {
      toast.error("Please select a department");
      return;
    }

    if (!formData.submitter_name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("ideas").insert({
        title: formData.title,
        description: formData.description,
        problem_statement: formData.problem_statement,
        proposed_solution: formData.proposed_solution,
        expected_benefits: formData.expected_benefits,
        category: formData.category,
        priority: formData.priority,
        status: "new",
        department_id: formData.department_id,
        submitter_name: formData.submitter_name,
        submitter_email: formData.submitter_email,
        submitter_employee_id: formData.submitter_employee_id,
        evaluation_stage: "L1",
        stage_status: "pending",
        submission_date: new Date().toISOString(),
        project_id: projectId || null,
      });

      if (error) throw error;

      toast.success("Idea submitted successfully! It will enter L1 for initial review.");
      onSuccess();
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast.error("Failed to submit idea");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-xl">Submit New Idea</DialogTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Your idea will enter L1 (Submission) stage for initial review
        </p>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Submitter Information */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Submitter Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="submitter_name">Your Name *</Label>
              <Input
                id="submitter_name"
                value={formData.submitter_name}
                onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="submitter_email">Email</Label>
              <Input
                id="submitter_email"
                type="email"
                value={formData.submitter_email}
                onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="submitter_employee_id">Employee ID</Label>
              <Input
                id="submitter_employee_id"
                value={formData.submitter_employee_id}
                onChange={(e) => setFormData({ ...formData, submitter_employee_id: e.target.value })}
                placeholder="EMP001"
              />
            </div>
          </div>
        </div>

        {/* Idea Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) => setFormData({ ...formData, department_id: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="innovation">Innovation</SelectItem>
                  <SelectItem value="process-improvement">Process Improvement</SelectItem>
                  <SelectItem value="cost-reduction">Cost Reduction</SelectItem>
                  <SelectItem value="quality">Quality Enhancement</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Idea Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief, descriptive title for your idea"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Brief overview of your idea"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem_statement">Problem Statement *</Label>
            <Textarea
              id="problem_statement"
              value={formData.problem_statement}
              onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
              rows={3}
              placeholder="What problem or opportunity does this idea address?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposed_solution">Proposed Solution *</Label>
            <Textarea
              id="proposed_solution"
              value={formData.proposed_solution}
              onChange={(e) => setFormData({ ...formData, proposed_solution: e.target.value })}
              rows={3}
              placeholder="How would you implement this idea? What approach do you suggest?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_benefits">Expected Benefits *</Label>
            <Textarea
              id="expected_benefits"
              value={formData.expected_benefits}
              onChange={(e) => setFormData({ ...formData, expected_benefits: e.target.value })}
              rows={3}
              placeholder="What outcomes or improvements do you expect?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High - Urgent implementation needed</SelectItem>
                <SelectItem value="medium">Medium - Normal priority</SelectItem>
                <SelectItem value="low">Low - Can wait</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Idea"}
          </Button>
        </div>
      </form>
    </div>
  );
}
