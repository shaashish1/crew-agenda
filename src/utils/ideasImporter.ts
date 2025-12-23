import * as XLSX from 'xlsx';
import { EnhancedIdea, EvaluationStage, StageStatus } from '@/types/ideation';

interface RawIdeaRow {
  [key: string]: string | undefined;
}

interface ParsedIdea {
  title: string;
  description: string | null;
  problem_statement: string | null;
  proposed_solution: string | null;
  expected_benefits: string | null;
  category: string;
  priority: string;
  status: string;
  remarks: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
  submitter_employee_id: string | null;
  department_code: string | null;
  evaluation_stage: EvaluationStage;
  stage_status: StageStatus;
}

// Column name mappings - maps various possible headers to our field names
const columnMappings: Record<string, string[]> = {
  title: ['title', 'idea title', 'idea name', 'name', 'idea'],
  description: ['description', 'desc', 'details'],
  problem_statement: ['problem statement', 'problem', 'issue', 'challenge'],
  proposed_solution: ['proposed solution', 'solution', 'approach', 'proposed approach'],
  expected_benefits: ['expected benefits', 'benefits', 'expected outcome', 'outcomes', 'value'],
  category: ['category', 'type', 'idea category', 'area'],
  priority: ['priority', 'urgency', 'importance'],
  status: ['status', 'state', 'current status'],
  remarks: ['remarks', 'notes', 'comments', 'additional notes'],
  submitter_name: ['submitter name', 'submitter', 'owner', 'author', 'submitted by', 'idea owner'],
  submitter_email: ['submitter email', 'email', 'owner email', 'author email'],
  submitter_employee_id: ['employee id', 'emp id', 'employee number', 'staff id'],
  department_code: ['department', 'dept', 'ou', 'department code', 'dept code', 'unit'],
  evaluation_stage: ['stage', 'evaluation stage', 'level', 'phase'],
  stage_status: ['stage status', 'review status', 'approval status'],
};

// Valid values for enums
const validCategories = ['Innovation', 'Process Improvement', 'Cost Reduction', 'Quality'];
const validPriorities = ['High', 'Medium', 'Low'];
const validStages: EvaluationStage[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
const validStatuses: StageStatus[] = ['pending', 'in_progress', 'approved', 'rejected', 'on_hold'];

function normalizeHeader(header: string): string {
  return header.toLowerCase().trim();
}

function findColumnMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const normalizedHeaders = headers.map(h => normalizeHeader(h));

  for (const [field, possibleNames] of Object.entries(columnMappings)) {
    for (const header of normalizedHeaders) {
      if (possibleNames.includes(header)) {
        mapping[field] = headers[normalizedHeaders.indexOf(header)];
        break;
      }
    }
  }

  return mapping;
}

function normalizeCategory(value: string | undefined): string {
  if (!value) return 'Innovation';
  const normalized = value.trim();
  const found = validCategories.find(c => c.toLowerCase() === normalized.toLowerCase());
  return found || 'Innovation';
}

function normalizePriority(value: string | undefined): string {
  if (!value) return 'Medium';
  const normalized = value.trim();
  const found = validPriorities.find(p => p.toLowerCase() === normalized.toLowerCase());
  return found || 'Medium';
}

function normalizeStage(value: string | undefined): EvaluationStage {
  if (!value) return 'L1';
  const normalized = value.trim().toUpperCase();
  if (validStages.includes(normalized as EvaluationStage)) {
    return normalized as EvaluationStage;
  }
  // Handle formats like "1", "Level 1", etc.
  const match = normalized.match(/(\d)/);
  if (match) {
    const stage = `L${match[1]}` as EvaluationStage;
    if (validStages.includes(stage)) {
      return stage;
    }
  }
  return 'L1';
}

function normalizeStageStatus(value: string | undefined): StageStatus {
  if (!value) return 'pending';
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '_');
  if (validStatuses.includes(normalized as StageStatus)) {
    return normalized as StageStatus;
  }
  // Handle variations
  if (normalized.includes('progress') || normalized.includes('review')) return 'in_progress';
  if (normalized.includes('approve') || normalized.includes('accept')) return 'approved';
  if (normalized.includes('reject') || normalized.includes('decline')) return 'rejected';
  if (normalized.includes('hold') || normalized.includes('pause')) return 'on_hold';
  return 'pending';
}

function parseRow(row: RawIdeaRow, columnMapping: Record<string, string>): ParsedIdea | null {
  const getValue = (field: string): string | undefined => {
    const column = columnMapping[field];
    return column ? row[column]?.toString().trim() : undefined;
  };

  const title = getValue('title');
  if (!title) {
    return null; // Title is required
  }

  return {
    title,
    description: getValue('description') || null,
    problem_statement: getValue('problem_statement') || null,
    proposed_solution: getValue('proposed_solution') || null,
    expected_benefits: getValue('expected_benefits') || null,
    category: normalizeCategory(getValue('category')),
    priority: normalizePriority(getValue('priority')),
    status: 'new',
    remarks: getValue('remarks') || null,
    submitter_name: getValue('submitter_name') || null,
    submitter_email: getValue('submitter_email') || null,
    submitter_employee_id: getValue('submitter_employee_id') || null,
    department_code: getValue('department_code') || null,
    evaluation_stage: normalizeStage(getValue('evaluation_stage')),
    stage_status: normalizeStageStatus(getValue('stage_status')),
  };
}

export interface ImportResult {
  ideas: ParsedIdea[];
  errors: string[];
  skipped: number;
}

export function parseIdeasFile(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with headers
        const rows: RawIdeaRow[] = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '',
          raw: false 
        });

        if (rows.length === 0) {
          resolve({ ideas: [], errors: ['File is empty or has no data rows'], skipped: 0 });
          return;
        }

        // Get headers from first row keys
        const headers = Object.keys(rows[0]);
        const columnMapping = findColumnMapping(headers);

        if (!columnMapping.title) {
          resolve({ 
            ideas: [], 
            errors: ['Could not find a "Title" column. Please ensure your file has a column named "Title" or "Idea Title".'], 
            skipped: 0 
          });
          return;
        }

        const ideas: ParsedIdea[] = [];
        const errors: string[] = [];
        let skipped = 0;

        rows.forEach((row, index) => {
          const parsed = parseRow(row, columnMapping);
          if (parsed) {
            ideas.push(parsed);
          } else {
            skipped++;
            errors.push(`Row ${index + 2}: Missing required "Title" field`);
          }
        });

        resolve({ ideas, errors, skipped });
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export type { ParsedIdea };
