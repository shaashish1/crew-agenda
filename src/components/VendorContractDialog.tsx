import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VendorContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  projectId: string;
  vendors: any[];
}

export const VendorContractDialog = ({ open, onOpenChange, onSuccess, projectId, vendors }: VendorContractDialogProps) => {
  const [formData, setFormData] = useState<{
    vendor_id: string;
    contract_type: "NDA" | "MSA" | "SOW" | "SLA" | "Other";
    title: string;
    description: string;
    contract_number: string;
    start_date: string;
    end_date: string;
    value: string;
    status: "draft" | "pending_approval" | "approved" | "active" | "expired" | "terminated";
  }>({
    vendor_id: "",
    contract_type: "MSA",
    title: "",
    description: "",
    contract_number: "",
    start_date: "",
    end_date: "",
    value: "",
    status: "draft",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vendor_id || !formData.title) {
      toast({
        title: "Validation Error",
        description: "Vendor and title are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.from('vendor_contracts').insert([{
        ...formData,
        project_id: projectId,
        value: formData.value ? parseFloat(formData.value) : null,
      }]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Contract added successfully",
      });
      
      setFormData({
        vendor_id: "",
        contract_type: "MSA",
        title: "",
        description: "",
        contract_number: "",
        start_date: "",
        end_date: "",
        value: "",
        status: "draft",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Vendor Contract</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="vendor_id">Vendor *</Label>
              <Select value={formData.vendor_id} onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={vendors.length === 0 ? "No vendors available - Add one from the Vendors tab first" : "Select vendor"} />
                </SelectTrigger>
                <SelectContent>
                  {vendors.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                      No vendors available. Please add a vendor from the Vendors tab first.
                    </div>
                  ) : (
                    vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contract_type">Contract Type *</Label>
              <Select value={formData.contract_type} onValueChange={(value) => setFormData({ ...formData, contract_type: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NDA">NDA - Non-Disclosure Agreement</SelectItem>
                  <SelectItem value="MSA">MSA - Master Service Agreement</SelectItem>
                  <SelectItem value="SOW">SOW - Statement of Work</SelectItem>
                  <SelectItem value="SLA">SLA - Service Level Agreement</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Contract Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter contract title"
                required
              />
            </div>

            <div>
              <Label htmlFor="contract_number">Contract Number</Label>
              <Input
                id="contract_number"
                value={formData.contract_number}
                onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                placeholder="e.g., CNTR-2025-001"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Contract description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Contract Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Contract"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};