import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Milestone } from "@/types/project";
import { format } from "date-fns";

interface MilestoneTimelineProps {
  projectId: string;
  milestones: Milestone[];
}

export const MilestoneTimeline = ({ projectId, milestones }: MilestoneTimelineProps) => {
  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'in-progress':
        return 'bg-info';
      case 'delayed':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <CardTitle>Milestones</CardTitle>
          <Button size="sm" variant="secondary" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Milestone
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {milestones.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No milestones defined yet
          </p>
        ) : (
          <div className="space-y-8">
            {/* Timeline visualization */}
            <div className="relative">
              <div className="flex justify-between items-center overflow-x-auto pb-16">
                {milestones.map((milestone, idx) => (
                  <div key={milestone.id} className="flex flex-col items-center min-w-[120px]">
                    {/* Arrow connector */}
                    {idx < milestones.length - 1 && (
                      <div className="absolute top-12 left-0 w-full h-8 flex items-center">
                        <div 
                          className="h-0 border-t-2 border-muted"
                          style={{
                            width: `calc(${100 / milestones.length}% - 40px)`,
                            marginLeft: `calc(${(idx * 100) / milestones.length}% + 60px)`
                          }}
                        >
                          <div className="float-right -mt-1.5">
                            <div className="w-0 h-0 border-l-8 border-l-muted border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Milestone marker */}
                    <div className={`w-12 h-12 rounded-full ${getStatusColor(milestone.status)} flex items-center justify-center mb-2 relative z-10`}>
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Milestone info */}
                    <p className="text-xs font-medium text-center mb-1 px-2">
                      {milestone.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(milestone.targetDate), 'dd MMM yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone details table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Milestone</th>
                    <th className="text-left p-3 text-sm font-medium">Target Date</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                    <th className="text-left p-3 text-sm font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((milestone) => (
                    <tr key={milestone.id} className="border-t">
                      <td className="p-3 font-medium">{milestone.name}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {format(new Date(milestone.targetDate), 'dd MMM yyyy')}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {milestone.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
