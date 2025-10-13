-- Create enum for vendor contract types
CREATE TYPE public.vendor_contract_type AS ENUM ('NDA', 'MSA', 'SOW', 'SLA', 'Other');

-- Create enum for vendor contract status
CREATE TYPE public.vendor_contract_status AS ENUM ('draft', 'pending_approval', 'approved', 'active', 'expired', 'terminated');

-- Create enum for vendor performance rating
CREATE TYPE public.vendor_performance_rating AS ENUM ('excellent', 'good', 'satisfactory', 'needs_improvement', 'poor');

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_contracts table
CREATE TABLE public.vendor_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  project_id UUID,
  contract_type vendor_contract_type NOT NULL,
  contract_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  value NUMERIC,
  status vendor_contract_status NOT NULL DEFAULT 'draft',
  signed_date TIMESTAMP WITH TIME ZONE,
  document_url TEXT,
  approved_by TEXT,
  approval_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_deliverables table
CREATE TABLE public.vendor_deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  project_id UUID,
  contract_id UUID REFERENCES public.vendor_contracts(id) ON DELETE SET NULL,
  deliverable_name TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  submission_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  quality_rating vendor_performance_rating,
  review_notes TEXT,
  reviewed_by TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_performance_reviews table
CREATE TABLE public.vendor_performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  project_id UUID,
  review_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  review_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  overall_rating vendor_performance_rating NOT NULL,
  quality_rating vendor_performance_rating,
  timeliness_rating vendor_performance_rating,
  communication_rating vendor_performance_rating,
  cost_effectiveness_rating vendor_performance_rating,
  strengths TEXT,
  areas_for_improvement TEXT,
  recommendations TEXT,
  reviewed_by TEXT NOT NULL,
  review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_performance_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendors
CREATE POLICY "Anyone can view vendors"
ON public.vendors FOR SELECT
USING (true);

CREATE POLICY "Anyone can create vendors"
ON public.vendors FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update vendors"
ON public.vendors FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete vendors"
ON public.vendors FOR DELETE
USING (true);

-- Create RLS policies for vendor_contracts
CREATE POLICY "Anyone can view vendor contracts"
ON public.vendor_contracts FOR SELECT
USING (true);

CREATE POLICY "Anyone can create vendor contracts"
ON public.vendor_contracts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update vendor contracts"
ON public.vendor_contracts FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete vendor contracts"
ON public.vendor_contracts FOR DELETE
USING (true);

-- Create RLS policies for vendor_deliverables
CREATE POLICY "Anyone can view vendor deliverables"
ON public.vendor_deliverables FOR SELECT
USING (true);

CREATE POLICY "Anyone can create vendor deliverables"
ON public.vendor_deliverables FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update vendor deliverables"
ON public.vendor_deliverables FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete vendor deliverables"
ON public.vendor_deliverables FOR DELETE
USING (true);

-- Create RLS policies for vendor_performance_reviews
CREATE POLICY "Anyone can view vendor performance reviews"
ON public.vendor_performance_reviews FOR SELECT
USING (true);

CREATE POLICY "Anyone can create vendor performance reviews"
ON public.vendor_performance_reviews FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update vendor performance reviews"
ON public.vendor_performance_reviews FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete vendor performance reviews"
ON public.vendor_performance_reviews FOR DELETE
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_contracts_updated_at
BEFORE UPDATE ON public.vendor_contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_deliverables_updated_at
BEFORE UPDATE ON public.vendor_deliverables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_performance_reviews_updated_at
BEFORE UPDATE ON public.vendor_performance_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();