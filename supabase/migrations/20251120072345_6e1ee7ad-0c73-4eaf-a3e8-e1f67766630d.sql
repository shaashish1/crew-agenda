-- Add new columns to ideas table for enhanced idea tracking
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS problem_statement text,
ADD COLUMN IF NOT EXISTS proposed_solution text,
ADD COLUMN IF NOT EXISTS expected_benefits text,
ADD COLUMN IF NOT EXISTS remarks text;