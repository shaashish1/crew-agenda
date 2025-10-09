import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProjectContext } from "@/contexts/ProjectContext";
import { RAGStatusBadge } from "@/components/RAGStatusBadge";
import { format } from "date-fns";

interface RiskManagementProps {
  projectId: string;
}

export const RiskManagement = ({ projectId }: RiskManagementProps) => {
  const { getRisksByProject } = useProjectContext();
  const risks = getRisksByProject(projectId);

  return (
    <Card>
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <CardTitle>Risk & Mitigation Plan</CardTitle>
          <Button size="sm" variant="secondary" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Risk
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {risks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No risks identified yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-3 text-left text-sm font-medium">Risk #</th>
                  <th className="p-3 text-left text-sm font-medium">Risk Details</th>
                  <th className="p-3 text-left text-sm font-medium">Mitigation Plan</th>
                  <th className="p-3 text-left text-sm font-medium">Risk Reported Date</th>
                  <th className="p-3 text-left text-sm font-medium">Target Completion Date</th>
                  <th className="p-3 text-left text-sm font-medium">Owner</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((risk, idx) => (
                  <tr key={risk.id} className={idx % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="p-3 text-sm font-medium">{risk.riskNumber}</td>
                    <td className="p-3 text-sm">{risk.riskDetails}</td>
                    <td className="p-3 text-sm">{risk.mitigationPlan}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {format(new Date(risk.riskReportedDate), 'dd MMM yyyy')}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {format(new Date(risk.targetCompletionDate), 'dd MMM yyyy')}
                    </td>
                    <td className="p-3 text-sm">{risk.owner}</td>
                    <td className="p-3">
                      <RAGStatusBadge status={risk.ragStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-6 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-success rounded"></div>
            <span className="text-muted-foreground">On track - goes live on or before planned Go-Live date</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-destructive rounded"></div>
            <span className="text-muted-foreground">Delayed - misses planned Go-Live date</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
