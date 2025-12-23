import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseIdeasFile, ParsedIdea } from "@/utils/ideasImporter";
import { Department } from "@/types/ideation";
import { ImportPreviewDialog } from "./ImportPreviewDialog";

interface ImportIdeasButtonProps {
  projectId?: string;
  departments: Department[];
  onImportComplete: () => void;
}

export function ImportIdeasButton({ projectId, departments, onImportComplete }: ImportIdeasButtonProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [parsedIdeas, setParsedIdeas] = useState<ParsedIdea[]>([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const findDepartmentId = (code: string | null): string | null => {
    if (!code) return null;
    const normalizedCode = code.trim().toUpperCase();
    const dept = departments.find(
      d => d.code.toUpperCase() === normalizedCode || 
           d.name.toUpperCase() === normalizedCode
    );
    return dept?.id || null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input for re-selecting same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const extension = file.name.toLowerCase().split('.').pop();
    const isValidType = validTypes.includes(file.type) || 
                        ['csv', 'xlsx', 'xls'].includes(extension || '');

    if (!isValidType) {
      toast.error('Please select a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    setIsParsing(true);

    try {
      const result = await parseIdeasFile(file);

      if (result.ideas.length === 0 && result.errors.length > 0) {
        toast.error(result.errors[0] || 'No valid ideas found in file');
        setIsParsing(false);
        return;
      }

      // Store parsed results and show preview
      setParsedIdeas(result.ideas);
      setSkippedCount(result.skipped);
      setParseErrors(result.errors);
      setShowPreview(true);
    } catch (error) {
      console.error('Parse error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);

    try {
      // Prepare ideas for insertion
      const ideasToInsert = parsedIdeas.map((idea: ParsedIdea) => ({
        project_id: projectId || null,
        title: idea.title,
        description: idea.description,
        problem_statement: idea.problem_statement,
        proposed_solution: idea.proposed_solution,
        expected_benefits: idea.expected_benefits,
        category: idea.category,
        priority: idea.priority,
        status: 'new',
        remarks: idea.remarks,
        submitter_name: idea.submitter_name,
        submitter_email: idea.submitter_email,
        submitter_employee_id: idea.submitter_employee_id,
        department_id: findDepartmentId(idea.department_code),
        evaluation_stage: idea.evaluation_stage,
        stage_status: idea.stage_status,
        submission_date: new Date().toISOString(),
      }));

      // Insert in batches of 50
      const batchSize = 50;
      let insertedCount = 0;
      const insertErrors: string[] = [];

      for (let i = 0; i < ideasToInsert.length; i += batchSize) {
        const batch = ideasToInsert.slice(i, i + batchSize);
        const { error } = await supabase.from('ideas').insert(batch);
        
        if (error) {
          console.error('Insert error:', error);
          insertErrors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        } else {
          insertedCount += batch.length;
        }
      }

      if (insertedCount > 0) {
        toast.success(`Successfully imported ${insertedCount} idea${insertedCount > 1 ? 's' : ''}`);
        
        if (insertErrors.length > 0) {
          toast.warning(`Some batches failed: ${insertErrors.length} error(s)`);
        }

        setShowPreview(false);
        setParsedIdeas([]);
        onImportComplete();
      } else {
        toast.error('Failed to import any ideas. Please check your file format.');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import ideas');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClosePreview = (open: boolean) => {
    if (!open && !isImporting) {
      setShowPreview(false);
      setParsedIdeas([]);
      setParseErrors([]);
      setSkippedCount(0);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />
      <Button
        variant="secondary"
        size="lg"
        className="gap-2"
        onClick={handleClick}
        disabled={isParsing}
      >
        {isParsing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Parsing...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            Import Ideas
          </>
        )}
      </Button>

      <ImportPreviewDialog
        open={showPreview}
        onOpenChange={handleClosePreview}
        ideas={parsedIdeas}
        skippedCount={skippedCount}
        errors={parseErrors}
        onConfirm={handleConfirmImport}
        isImporting={isImporting}
      />
    </>
  );
}
