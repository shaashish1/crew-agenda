import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, Search, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { documentTemplates } from "@/data/documentTemplates";
import { useToast } from "@/hooks/use-toast";

interface DocumentChecklistProps {
  projectId: string;
  phaseName: string;
}

interface TemplateWithSelection {
  id: string;
  name: string;
  category: string;
  is_critical_milestone: boolean;
  description: string;
  typical_owner: string;
  estimated_days: number;
  isSelected: boolean;
  checklistId?: string;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({ projectId, phaseName }) => {
  const [templates, setTemplates] = useState<TemplateWithSelection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, [projectId, phaseName]);

  const loadTemplates = async () => {
    // Get templates for this phase from database
    const { data: dbTemplates } = await supabase
      .from("document_templates")
      .select("*")
      .eq("phase_name", phaseName);

    // Get existing checklist items for this project
    const { data: checklist } = await supabase
      .from("project_document_checklist")
      .select("*")
      .eq("project_id", projectId);

    // Merge with selection status
    const templatesWithSelection: TemplateWithSelection[] = (dbTemplates || []).map(t => {
      const checklistItem = checklist?.find(c => c.document_template_id === t.id);
      return {
        id: t.id,
        name: t.name,
        category: t.category,
        is_critical_milestone: t.is_critical_milestone,
        description: t.description || "",
        typical_owner: t.typical_owner || "",
        estimated_days: t.estimated_days || 0,
        isSelected: !!checklistItem,
        checklistId: checklistItem?.id
      };
    });

    setTemplates(templatesWithSelection);
  };

  const handleToggle = async (templateId: string, currentState: boolean) => {
    if (currentState) {
      // Remove from checklist
      const template = templates.find(t => t.id === templateId);
      if (template?.checklistId) {
        const { error } = await supabase
          .from("project_document_checklist")
          .delete()
          .eq("id", template.checklistId);

        if (error) {
          toast({ title: "Error removing document", description: error.message, variant: "destructive" });
          return;
        }
      }
    } else {
      // Add to checklist
      const { error } = await supabase
        .from("project_document_checklist")
        .insert({
          project_id: projectId,
          document_template_id: templateId,
          completion_status: 'not-started'
        });

      if (error) {
        toast({ title: "Error adding document", description: error.message, variant: "destructive" });
        return;
      }
    }

    loadTemplates();
  };

  const handleSelectAll = async () => {
    const unselected = templates.filter(t => !t.isSelected);
    
    const { error } = await supabase
      .from("project_document_checklist")
      .insert(
        unselected.map(t => ({
          project_id: projectId,
          document_template_id: t.id,
          completion_status: 'not-started'
        }))
      );

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "All documents added to checklist" });
      loadTemplates();
    }
  };

  const handleSelectCritical = async () => {
    const criticalUnselected = templates.filter(t => t.is_critical_milestone && !t.isSelected);
    
    const { error } = await supabase
      .from("project_document_checklist")
      .insert(
        criticalUnselected.map(t => ({
          project_id: projectId,
          document_template_id: t.id,
          completion_status: 'not-started'
        }))
      );

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Critical documents added to checklist" });
      loadTemplates();
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedByCategory = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, TemplateWithSelection[]>);

  const selectedCount = templates.filter(t => t.isSelected).length;
  const totalCount = templates.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Deliverables for {phaseName}</CardTitle>
        <CardDescription>
          Select which documents you will deliver for this project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Actions */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Button onClick={handleSelectAll} variant="outline" size="sm">
              Select All
            </Button>
            <Button onClick={handleSelectCritical} variant="outline" size="sm">
              <Star className="w-4 h-4 mr-1" />
              Critical Only
            </Button>
          </div>
          <Badge variant="secondary">
            {selectedCount} of {totalCount} documents selected
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grouped Documents */}
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <span className="capitalize">{category} Documents</span>
                  <Badge variant="outline">{items.length}</Badge>
                  <Badge variant="secondary">{items.filter(i => i.isSelected).length} selected</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {items.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={template.isSelected}
                        onCheckedChange={() => handleToggle(template.id, template.isSelected)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{template.name}</span>
                          {template.is_critical_milestone && (
                            <Star className="w-4 h-4 text-warning fill-warning" />
                          )}
                          {template.isSelected && (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Owner: {template.typical_owner}</span>
                          <span>•</span>
                          <span>~{template.estimated_days} days</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
