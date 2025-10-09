import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { DocumentRecord as Document } from "@/types/database";

interface DocumentEditorProps {
  projectId: string;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ projectId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "requirements",
    phase: "planning",
    status: "draft",
    version: "1.0",
    content: ""
  });

  useEffect(() => {
    loadDocuments();
  }, [projectId]);

  const loadDocuments = async () => {
    // @ts-ignore - Type will be available after Supabase types regeneration
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("project_id", projectId)
      .order("upload_date", { ascending: false });

    if (error) {
      toast({ title: "Error loading documents", description: error.message, variant: "destructive" });
    } else {
      setDocuments((data as any) || []);
    }
  };

  const handleCreate = async () => {
    // @ts-ignore - Type will be available after Supabase types regeneration
    const { error } = await supabase.from("documents").insert({
      ...formData,
      project_id: projectId,
      upload_date: new Date().toISOString()
    });

    if (error) {
      toast({ title: "Error creating document", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Document created" });
      setOpen(false);
      setFormData({ name: "", type: "requirements", phase: "planning", status: "draft", version: "1.0", content: "" });
      loadDocuments();
    }
  };

  const handleSave = async () => {
    if (!selectedDoc) return;

    // @ts-ignore - Type will be available after Supabase types regeneration
    const { error } = await supabase
      .from("documents")
      .update({ content: selectedDoc.content })
      .eq("id", selectedDoc.id);

    if (error) {
      toast({ title: "Error saving document", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Document saved" });
      loadDocuments();
    }
  };

  const handleDelete = async (id: string) => {
    // @ts-ignore - Type will be available after Supabase types regeneration
    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting document", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Document deleted" });
      if (selectedDoc?.id === id) setSelectedDoc(null);
      loadDocuments();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "review": return "bg-blue-100 text-blue-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Documents</h3>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
                <DialogDescription>Create a new project document</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Document Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Requirements Specification"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="requirements">Requirements</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="specification">Specification</SelectItem>
                        <SelectItem value="plan">Plan</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phase">Phase</Label>
                    <Select value={formData.phase} onValueChange={(val) => setFormData({ ...formData, phase: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="deployment">Deployment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className={`cursor-pointer transition-colors ${
                selectedDoc?.id === doc.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedDoc(doc)}
            >
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{doc.name}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                      <Badge className={`text-xs ${getStatusColor(doc.status)}`}>{doc.status}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="h-6 w-6"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedDoc ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedDoc.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    v{selectedDoc.version} • {selectedDoc.phase}
                  </p>
                </div>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={selectedDoc.content || ""}
                onChange={(e) => setSelectedDoc({ ...selectedDoc, content: e.target.value })}
                placeholder="Start writing your document..."
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a document to edit or create a new one</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;
