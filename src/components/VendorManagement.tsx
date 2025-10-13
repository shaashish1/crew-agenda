import { useState, useEffect } from "react";
import { Plus, Building2, FileText, Star, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { VendorDialog } from "./VendorDialog";
import { VendorContractDialog } from "./VendorContractDialog";
import { VendorDeliverableDialog } from "./VendorDeliverableDialog";
import { VendorPerformanceDialog } from "./VendorPerformanceDialog";

interface VendorManagementProps {
  projectId: string;
}

export const VendorManagement = ({ projectId }: VendorManagementProps) => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [deliverableDialogOpen, setDeliverableDialogOpen] = useState(false);
  const [performanceDialogOpen, setPerformanceDialogOpen] = useState(false);

  useEffect(() => {
    fetchVendorData();
  }, [projectId]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      
      // Fetch vendors
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (vendorsError) throw vendorsError;
      setVendors(vendorsData || []);

      // Fetch contracts for this project
      const { data: contractsData, error: contractsError } = await supabase
        .from('vendor_contracts')
        .select('*, vendors(name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;
      setContracts(contractsData || []);

      // Fetch deliverables for this project
      const { data: deliverablesData, error: deliverablesError } = await supabase
        .from('vendor_deliverables')
        .select('*, vendors(name)')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });

      if (deliverablesError) throw deliverablesError;
      setDeliverables(deliverablesData || []);

      // Fetch performance reviews for this project
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('vendor_performance_reviews')
        .select('*, vendors(name)')
        .eq('project_id', projectId)
        .order('review_date', { ascending: false });

      if (reviewsError) throw reviewsError;
      setPerformanceReviews(reviewsData || []);

    } catch (error: any) {
      toast({
        title: "Error loading vendor data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-white';
      case 'approved': return 'bg-primary text-white';
      case 'pending_approval': return 'bg-warning text-white';
      case 'expired': return 'bg-muted text-muted-foreground';
      case 'terminated': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'satisfactory': return 'text-[hsl(38,92%,60%)]';
      case 'needs_improvement': return 'text-warning';
      case 'poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading vendor data...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-3xl font-bold text-foreground">{vendors.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="group border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
                <p className="text-3xl font-bold text-success">
                  {contracts.filter(c => c.status === 'active').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="group border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Deliverables</p>
                <p className="text-3xl font-bold text-warning">
                  {deliverables.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-warning opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="group border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance Reviews</p>
                <p className="text-3xl font-bold text-accent">{performanceReviews.length}</p>
              </div>
              <Star className="w-8 h-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different vendor management sections */}
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="vendors">All Vendors</TabsTrigger>
        </TabsList>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vendor Contracts</h3>
            <Button onClick={() => setContractDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Contract
            </Button>
          </div>

          {contracts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No contracts yet. Add your first vendor contract.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {contracts.map((contract) => (
                <Card key={contract.id} className="group hover:shadow-md transition-all duration-300 border-2 hover:border-primary/40">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{contract.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Vendor: {contract.vendors?.name}
                        </CardDescription>
                      </div>
                      <Badge className={getContractStatusColor(contract.status)}>
                        {contract.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <Badge variant="outline" className="mt-1">{contract.contract_type}</Badge>
                      </div>
                      {contract.contract_number && (
                        <div>
                          <p className="text-muted-foreground">Contract #</p>
                          <p className="font-medium mt-1">{contract.contract_number}</p>
                        </div>
                      )}
                      {contract.value && (
                        <div>
                          <p className="text-muted-foreground">Value</p>
                          <p className="font-medium mt-1">${contract.value.toLocaleString()}</p>
                        </div>
                      )}
                      {contract.end_date && (
                        <div>
                          <p className="text-muted-foreground">End Date</p>
                          <p className="font-medium mt-1">{format(new Date(contract.end_date), 'dd MMM yyyy')}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Deliverables Tab */}
        <TabsContent value="deliverables" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vendor Deliverables</h3>
            <Button onClick={() => setDeliverableDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Deliverable
            </Button>
          </div>

          {deliverables.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No deliverables tracked yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {deliverables.map((deliverable) => (
                <Card key={deliverable.id} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{deliverable.deliverable_name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Vendor: {deliverable.vendors?.name}
                        </p>
                      </div>
                      <Badge variant={deliverable.status === 'completed' ? 'default' : 'secondary'}>
                        {deliverable.status}
                      </Badge>
                    </div>
                    
                    {deliverable.description && (
                      <p className="text-sm text-muted-foreground mb-3">{deliverable.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {deliverable.due_date && (
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">{format(new Date(deliverable.due_date), 'dd MMM yyyy')}</p>
                        </div>
                      )}
                      {deliverable.submission_date && (
                        <div>
                          <p className="text-muted-foreground">Submitted</p>
                          <p className="font-medium">{format(new Date(deliverable.submission_date), 'dd MMM yyyy')}</p>
                        </div>
                      )}
                      {deliverable.quality_rating && (
                        <div>
                          <p className="text-muted-foreground">Quality</p>
                          <p className={`font-medium capitalize ${getPerformanceColor(deliverable.quality_rating)}`}>
                            {deliverable.quality_rating.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                      {deliverable.reviewed_by && (
                        <div>
                          <p className="text-muted-foreground">Reviewed By</p>
                          <p className="font-medium">{deliverable.reviewed_by}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vendor Performance Reviews</h3>
            <Button onClick={() => setPerformanceDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Review
            </Button>
          </div>

          {performanceReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No performance reviews yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {performanceReviews.map((review) => (
                <Card key={review.id} className="border-2 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{review.vendors?.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Review Period: {format(new Date(review.review_period_start), 'dd MMM yyyy')} - {format(new Date(review.review_period_end), 'dd MMM yyyy')}
                        </CardDescription>
                      </div>
                      <Badge className={`${getPerformanceColor(review.overall_rating)} bg-opacity-10`}>
                        {review.overall_rating.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {review.quality_rating && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Quality</p>
                          <p className={`font-medium capitalize ${getPerformanceColor(review.quality_rating)}`}>
                            {review.quality_rating.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                      {review.timeliness_rating && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Timeliness</p>
                          <p className={`font-medium capitalize ${getPerformanceColor(review.timeliness_rating)}`}>
                            {review.timeliness_rating.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                      {review.communication_rating && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Communication</p>
                          <p className={`font-medium capitalize ${getPerformanceColor(review.communication_rating)}`}>
                            {review.communication_rating.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                      {review.cost_effectiveness_rating && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Cost Effectiveness</p>
                          <p className={`font-medium capitalize ${getPerformanceColor(review.cost_effectiveness_rating)}`}>
                            {review.cost_effectiveness_rating.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                    </div>

                    {review.strengths && (
                      <div>
                        <p className="text-sm font-medium mb-1">Strengths</p>
                        <p className="text-sm text-muted-foreground">{review.strengths}</p>
                      </div>
                    )}

                    {review.areas_for_improvement && (
                      <div>
                        <p className="text-sm font-medium mb-1">Areas for Improvement</p>
                        <p className="text-sm text-muted-foreground">{review.areas_for_improvement}</p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Reviewed by {review.reviewed_by} on {format(new Date(review.review_date), 'dd MMM yyyy')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* All Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Vendors</h3>
            <Button onClick={() => setVendorDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Vendor
            </Button>
          </div>

          {vendors.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No vendors yet. Add your first vendor.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    {vendor.contact_person && (
                      <CardDescription>Contact: {vendor.contact_person}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {vendor.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{vendor.email}</span>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.website && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Website:</span>
                        <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {vendor.website}
                        </a>
                      </div>
                    )}
                    <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                      {vendor.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <VendorDialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen} onSuccess={fetchVendorData} />
      <VendorContractDialog 
        open={contractDialogOpen} 
        onOpenChange={setContractDialogOpen} 
        onSuccess={fetchVendorData}
        projectId={projectId}
        vendors={vendors}
      />
      <VendorDeliverableDialog 
        open={deliverableDialogOpen} 
        onOpenChange={setDeliverableDialogOpen} 
        onSuccess={fetchVendorData}
        projectId={projectId}
        vendors={vendors}
        contracts={contracts}
      />
      <VendorPerformanceDialog 
        open={performanceDialogOpen} 
        onOpenChange={setPerformanceDialogOpen} 
        onSuccess={fetchVendorData}
        projectId={projectId}
        vendors={vendors}
      />
    </div>
  );
};