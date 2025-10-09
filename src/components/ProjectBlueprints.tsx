import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectBlueprint as Blueprint } from "@/types/database";

interface ProjectBlueprintsProps {
  projectId: string;
}

const ProjectBlueprints: React.FC<ProjectBlueprintsProps> = ({ projectId }) => {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    purpose: "",
    validation_criteria: [""],
    success_metrics: [""],
    assumptions: [""],
    constraints: [""]
  });

  useEffect(() => {
    loadBlueprint();
  }, [projectId]);

  const loadBlueprint = async () => {
    const { data, error } = await supabase
      .from("project_blueprints")
      .select("*")
      .eq("project_id", projectId)
      .single();

    if (error && error.code !== "PGRST116") {
      toast({ title: "Error loading blueprint", description: error.message, variant: "destructive" });
    } else if (data) {
      setBlueprint(data);
      setFormData({
        purpose: data.purpose,
        validation_criteria: data.validation_criteria,
        success_metrics: data.success_metrics,
        assumptions: data.assumptions,
        constraints: data.constraints
      });
    }
  };

  const handleSave = async () => {
    const dataToSave = {
      project_id: projectId,
      ...formData,
      validation_criteria: formData.validation_criteria.filter(v => v.trim()),
      success_metrics: formData.success_metrics.filter(v => v.trim()),
      assumptions: formData.assumptions.filter(v => v.trim()),
      constraints: formData.constraints.filter(v => v.trim())
    };

    if (blueprint) {
      const { error } = await supabase
        .from("project_blueprints")
        .update(dataToSave)
        .eq("id", blueprint.id);
      
      if (error) {
        toast({ title: "Error updating blueprint", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Blueprint updated" });
        setIsEditing(false);
        loadBlueprint();
      }
    } else {
      const { error } = await supabase
        .from("project_blueprints")
        .insert(dataToSave);
      
      if (error) {
        toast({ title: "Error creating blueprint", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Blueprint created" });
        setIsEditing(false);
        loadBlueprint();
      }
    }
  };

  const addArrayItem = (field: keyof typeof formData) => {
    setFormData({
      ...formData,
      [field]: [...formData[field] as string[], ""]
    });
  };

  const updateArrayItem = (field: keyof typeof formData, index: number, value: string) => {
    const newArray = [...formData[field] as string[]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const newArray = (formData[field] as string[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const renderArrayField = (field: keyof typeof formData, label: string, placeholder: string) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {isEditing && (
          <Button variant="outline" size="sm" onClick={() => addArrayItem(field)}>
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>
      {(formData[field] as string[]).map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => updateArrayItem(field, index, e.target.value)}
            placeholder={placeholder}
            disabled={!isEditing}
          />
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeArrayItem(field, index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Project Blueprint</h2>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            {blueprint ? "Edit" : "Create"} Blueprint
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              if (blueprint) loadBlueprint();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Purpose & Validation</CardTitle>
          <CardDescription>Define the core purpose and validation framework for this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="What is the core purpose of this project?"
              rows={3}
              disabled={!isEditing}
            />
          </div>

          {renderArrayField("validation_criteria", "Validation Criteria", "How will we validate this project?")}
          {renderArrayField("success_metrics", "Success Metrics", "What metrics define success?")}
          {renderArrayField("assumptions", "Assumptions", "What assumptions are we making?")}
          {renderArrayField("constraints", "Constraints", "What constraints exist?")}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectBlueprints;
