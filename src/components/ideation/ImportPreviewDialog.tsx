import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { ParsedIdea } from "@/utils/ideasImporter";

interface ImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ideas: ParsedIdea[];
  skippedCount: number;
  errors: string[];
  onConfirm: () => void;
  isImporting: boolean;
}

export function ImportPreviewDialog({
  open,
  onOpenChange,
  ideas,
  skippedCount,
  errors,
  onConfirm,
  isImporting,
}: ImportPreviewDialogProps) {
  const [showErrors, setShowErrors] = useState(false);

  const priorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Preview</DialogTitle>
          <DialogDescription>
            Review the ideas that will be imported. You can cancel to make changes to your file.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>
              <strong>{ideas.length}</strong> idea{ideas.length !== 1 ? 's' : ''} ready to import
            </span>
          </div>
          {skippedCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <button
                onClick={() => setShowErrors(!showErrors)}
                className="text-amber-600 hover:underline"
              >
                <strong>{skippedCount}</strong> row{skippedCount !== 1 ? 's' : ''} skipped
              </button>
            </div>
          )}
        </div>

        {showErrors && errors.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-2">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">Skipped rows:</p>
            <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-0.5">
              {errors.slice(0, 5).map((error, i) => (
                <li key={i}>• {error}</li>
              ))}
              {errors.length > 5 && (
                <li className="italic">...and {errors.length - 5} more</li>
              )}
            </ul>
          </div>
        )}

        <ScrollArea className="flex-1 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Submitter</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ideas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No valid ideas found in the file
                  </TableCell>
                </TableRow>
              ) : (
                ideas.map((idea, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="max-w-[250px] truncate" title={idea.title}>
                        {idea.title}
                      </div>
                      {idea.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[250px]" title={idea.description}>
                          {idea.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{idea.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityColor(idea.priority)}>{idea.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{idea.evaluation_stage}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {idea.submitter_name || <span className="text-muted-foreground italic">Not specified</span>}
                      </div>
                      {idea.submitter_email && (
                        <div className="text-xs text-muted-foreground">{idea.submitter_email}</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={ideas.length === 0 || isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${ideas.length} Idea${ideas.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
