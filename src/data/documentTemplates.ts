export interface DocumentTemplate {
  name: string;
  phase_name: string;
  category: 'strategic' | 'contractual' | 'technical' | 'quality' | 'governance' | 'vendor';
  is_critical_milestone: boolean;
  description: string;
  typical_owner: string;
  estimated_days: number;
  dependencies: string[];
}

export const PHASE_NAMES = [
  "Phase 0: Initiation",
  "Phase 1: Planning",
  "Phase 2: Design",
  "Phase 3: Development",
  "Phase 4: Testing",
  "Phase 5: Deployment",
  "Phase 6: Hypercare",
  "Phase 7: Closeout"
];

export const documentTemplates: DocumentTemplate[] = [
  // Phase 0: Initiation & Vendor Selection
  {
    name: "Project Charter",
    phase_name: "Phase 0: Initiation",
    category: "strategic",
    is_critical_milestone: true,
    description: "Formal project authorization document defining objectives, scope, and stakeholders",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Business Case",
    phase_name: "Phase 0: Initiation",
    category: "strategic",
    is_critical_milestone: true,
    description: "Justification for project investment including ROI and benefits analysis",
    typical_owner: "Business Owner",
    estimated_days: 7,
    dependencies: []
  },
  {
    name: "Feasibility Study",
    phase_name: "Phase 0: Initiation",
    category: "strategic",
    is_critical_milestone: false,
    description: "Technical, operational, and financial feasibility analysis",
    typical_owner: "Business Analyst",
    estimated_days: 10,
    dependencies: []
  },
  {
    name: "Cost-Benefit Analysis",
    phase_name: "Phase 0: Initiation",
    category: "strategic",
    is_critical_milestone: false,
    description: "Detailed analysis of project costs vs expected benefits",
    typical_owner: "Financial Analyst",
    estimated_days: 5,
    dependencies: ["Business Case"]
  },
  {
    name: "Initial Risk Assessment",
    phase_name: "Phase 0: Initiation",
    category: "governance",
    is_critical_milestone: false,
    description: "High-level identification of project risks",
    typical_owner: "Project Manager",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "RFI (Request for Information)",
    phase_name: "Phase 0: Initiation",
    category: "vendor",
    is_critical_milestone: false,
    description: "Initial vendor information gathering document",
    typical_owner: "Procurement Team",
    estimated_days: 7,
    dependencies: []
  },
  {
    name: "RFP (Request for Proposal)",
    phase_name: "Phase 0: Initiation",
    category: "vendor",
    is_critical_milestone: true,
    description: "Formal vendor proposal request document",
    typical_owner: "Procurement Team",
    estimated_days: 14,
    dependencies: ["RFI", "Business Case"]
  },
  {
    name: "Vendor Evaluation Matrix",
    phase_name: "Phase 0: Initiation",
    category: "vendor",
    is_critical_milestone: true,
    description: "Structured vendor comparison and scoring framework",
    typical_owner: "Procurement Team",
    estimated_days: 5,
    dependencies: ["RFP"]
  },
  {
    name: "Vendor Due Diligence Report",
    phase_name: "Phase 0: Initiation",
    category: "vendor",
    is_critical_milestone: false,
    description: "Comprehensive vendor background and capability assessment",
    typical_owner: "Procurement Team",
    estimated_days: 10,
    dependencies: []
  },
  {
    name: "Vendor Selection Justification",
    phase_name: "Phase 0: Initiation",
    category: "vendor",
    is_critical_milestone: true,
    description: "Documented rationale for vendor selection decision",
    typical_owner: "Project Manager",
    estimated_days: 3,
    dependencies: ["Vendor Evaluation Matrix"]
  },
  {
    name: "Non-Disclosure Agreement (NDA)",
    phase_name: "Phase 0: Initiation",
    category: "contractual",
    is_critical_milestone: true,
    description: "Legal agreement protecting confidential information",
    typical_owner: "Legal Team",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Confidentiality & Data Agreement (CDA)",
    phase_name: "Phase 0: Initiation",
    category: "contractual",
    is_critical_milestone: false,
    description: "Data protection and confidentiality agreement",
    typical_owner: "Legal Team",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Master Service Agreement (MSA)",
    phase_name: "Phase 0: Initiation",
    category: "contractual",
    is_critical_milestone: true,
    description: "Framework agreement defining general terms with vendor",
    typical_owner: "Legal Team",
    estimated_days: 7,
    dependencies: ["NDA"]
  },
  {
    name: "Statement of Work (SOW)",
    phase_name: "Phase 0: Initiation",
    category: "contractual",
    is_critical_milestone: true,
    description: "Detailed scope, deliverables, and timeline agreement",
    typical_owner: "Project Manager",
    estimated_days: 10,
    dependencies: ["MSA"]
  },
  {
    name: "Service Level Agreement (SLA)",
    phase_name: "Phase 0: Initiation",
    category: "contractual",
    is_critical_milestone: true,
    description: "Performance metrics and service expectations agreement",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: ["SOW"]
  },
  {
    name: "Communication Plan",
    phase_name: "Phase 0: Initiation",
    category: "governance",
    is_critical_milestone: false,
    description: "Stakeholder communication strategy and schedule",
    typical_owner: "Project Manager",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Vendor Onboarding Checklist",
    phase_name: "Phase 0: Initiation",
    category: "vendor",
    is_critical_milestone: true,
    description: "Comprehensive vendor integration checklist",
    typical_owner: "Project Manager",
    estimated_days: 2,
    dependencies: ["MSA", "SOW"]
  },

  // Phase 1: Planning & Requirements (20 documents)
  {
    name: "Project Management Plan",
    phase_name: "Phase 1: Planning",
    category: "strategic",
    is_critical_milestone: true,
    description: "Comprehensive project execution plan",
    typical_owner: "Project Manager",
    estimated_days: 10,
    dependencies: ["Project Charter"]
  },
  {
    name: "Resource Management Plan",
    phase_name: "Phase 1: Planning",
    category: "strategic",
    is_critical_milestone: false,
    description: "Resource allocation and management strategy",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Communication Management Plan",
    phase_name: "Phase 1: Planning",
    category: "governance",
    is_critical_milestone: false,
    description: "Detailed communication protocols and procedures",
    typical_owner: "Project Manager",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Risk Management Plan",
    phase_name: "Phase 1: Planning",
    category: "governance",
    is_critical_milestone: false,
    description: "Risk identification, assessment, and mitigation strategy",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Quality Management Plan",
    phase_name: "Phase 1: Planning",
    category: "quality",
    is_critical_milestone: false,
    description: "Quality standards, processes, and assurance procedures",
    typical_owner: "Quality Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Procurement Management Plan",
    phase_name: "Phase 1: Planning",
    category: "governance",
    is_critical_milestone: false,
    description: "Procurement processes and vendor management approach",
    typical_owner: "Procurement Team",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Business Requirements Document (BRD)",
    phase_name: "Phase 1: Planning",
    category: "strategic",
    is_critical_milestone: true,
    description: "Detailed business needs, objectives, and requirements",
    typical_owner: "Business Analyst",
    estimated_days: 15,
    dependencies: ["Business Case"]
  },
  {
    name: "Functional Requirements Specification (FRS)",
    phase_name: "Phase 1: Planning",
    category: "technical",
    is_critical_milestone: true,
    description: "Detailed functional requirements and specifications",
    typical_owner: "Business Analyst",
    estimated_days: 15,
    dependencies: ["BRD"]
  },
  {
    name: "Non-Functional Requirements (NFR)",
    phase_name: "Phase 1: Planning",
    category: "technical",
    is_critical_milestone: false,
    description: "Performance, security, scalability requirements",
    typical_owner: "Technical Architect",
    estimated_days: 7,
    dependencies: ["FRS"]
  },
  {
    name: "User Stories & Use Cases",
    phase_name: "Phase 1: Planning",
    category: "technical",
    is_critical_milestone: false,
    description: "Detailed user scenarios and system interactions",
    typical_owner: "Business Analyst",
    estimated_days: 10,
    dependencies: ["BRD"]
  },
  {
    name: "Requirements Traceability Matrix (RTM)",
    phase_name: "Phase 1: Planning",
    category: "quality",
    is_critical_milestone: true,
    description: "Requirements tracking and validation matrix",
    typical_owner: "Business Analyst",
    estimated_days: 5,
    dependencies: ["FRS"]
  },
  {
    name: "Vendor Project Plan (.mpp)",
    phase_name: "Phase 1: Planning",
    category: "vendor",
    is_critical_milestone: true,
    description: "Detailed vendor project schedule and task plan",
    typical_owner: "Vendor PM",
    estimated_days: 7,
    dependencies: ["SOW"]
  },
  {
    name: "Vendor Resource Plan",
    phase_name: "Phase 1: Planning",
    category: "vendor",
    is_critical_milestone: false,
    description: "Vendor resource allocation and availability plan",
    typical_owner: "Vendor PM",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Vendor RACI Matrix",
    phase_name: "Phase 1: Planning",
    category: "vendor",
    is_critical_milestone: false,
    description: "Vendor responsibility assignment matrix",
    typical_owner: "Vendor PM",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Stakeholder Register",
    phase_name: "Phase 1: Planning",
    category: "governance",
    is_critical_milestone: false,
    description: "Comprehensive list of project stakeholders",
    typical_owner: "Project Manager",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "RACI Matrix",
    phase_name: "Phase 1: Planning",
    category: "governance",
    is_critical_milestone: true,
    description: "Responsibility assignment matrix for all activities",
    typical_owner: "Project Manager",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Change Management Plan",
    phase_name: "Phase 1: Planning",
    category: "governance",
    is_critical_milestone: false,
    description: "Change control and management procedures",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Configuration Management Plan",
    phase_name: "Phase 1: Planning",
    category: "technical",
    is_critical_milestone: false,
    description: "Configuration item identification and control plan",
    typical_owner: "Configuration Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Issue & Risk Log (Initial)",
    phase_name: "Phase 1: Planning",
    category: "governance",
    is_critical_milestone: false,
    description: "Initial risk and issue tracking register",
    typical_owner: "Project Manager",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Lessons Learned Register (Initial)",
    phase_name: "Phase 1: Planning",
    category: "governance",
    is_critical_milestone: false,
    description: "Document to capture lessons throughout project",
    typical_owner: "Project Manager",
    estimated_days: 1,
    dependencies: []
  },

  // Phase 2: Design & Architecture (18 documents)
  {
    name: "Solution Architecture Document (SAD)",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: true,
    description: "Comprehensive solution architecture blueprint",
    typical_owner: "Solution Architect",
    estimated_days: 15,
    dependencies: ["FRS", "NFR"]
  },
  {
    name: "Technical Design Document (TDD)",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: true,
    description: "Detailed technical design specifications",
    typical_owner: "Technical Architect",
    estimated_days: 15,
    dependencies: ["SAD"]
  },
  {
    name: "High-Level Design (HLD)",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: false,
    description: "System-level design and architecture overview",
    typical_owner: "Technical Architect",
    estimated_days: 10,
    dependencies: ["SAD"]
  },
  {
    name: "Low-Level Design (LLD)",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: false,
    description: "Component-level detailed design",
    typical_owner: "Developer Lead",
    estimated_days: 10,
    dependencies: ["HLD"]
  },
  {
    name: "Integration Architecture Design",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: false,
    description: "System integration patterns and interfaces",
    typical_owner: "Integration Architect",
    estimated_days: 10,
    dependencies: ["SAD"]
  },
  {
    name: "Data Architecture Document",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: false,
    description: "Data models, flows, and storage design",
    typical_owner: "Data Architect",
    estimated_days: 10,
    dependencies: ["SAD"]
  },
  {
    name: "Security Architecture Design",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: true,
    description: "Security controls, protocols, and compliance design",
    typical_owner: "Security Architect",
    estimated_days: 10,
    dependencies: ["SAD"]
  },
  {
    name: "Network Architecture Design",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: false,
    description: "Network topology and infrastructure design",
    typical_owner: "Network Architect",
    estimated_days: 7,
    dependencies: ["SAD"]
  },
  {
    name: "UI/UX Design Document",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: false,
    description: "User interface and experience design specifications",
    typical_owner: "UX Designer",
    estimated_days: 10,
    dependencies: ["User Stories"]
  },
  {
    name: "Wireframes & Mockups",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: false,
    description: "Visual design mockups and prototypes",
    typical_owner: "UX Designer",
    estimated_days: 7,
    dependencies: ["UI/UX Design Document"]
  },
  {
    name: "User Interface Style Guide",
    phase_name: "Phase 2: Design",
    category: "technical",
    is_critical_milestone: false,
    description: "UI standards, patterns, and branding guidelines",
    typical_owner: "UX Designer",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Vendor Design Review Report",
    phase_name: "Phase 2: Design",
    category: "vendor",
    is_critical_milestone: true,
    description: "Vendor's design review and sign-off document",
    typical_owner: "Vendor Architect",
    estimated_days: 5,
    dependencies: ["TDD"]
  },
  {
    name: "Vendor Technical Solution Blueprint",
    phase_name: "Phase 2: Design",
    category: "vendor",
    is_critical_milestone: false,
    description: "Vendor's technical implementation plan",
    typical_owner: "Vendor Architect",
    estimated_days: 7,
    dependencies: ["TDD"]
  },
  {
    name: "Design Review Sign-off",
    phase_name: "Phase 2: Design",
    category: "quality",
    is_critical_milestone: true,
    description: "Formal approval of design phase completion",
    typical_owner: "Project Manager",
    estimated_days: 2,
    dependencies: ["TDD", "Vendor Design Review Report"]
  },
  {
    name: "Security Review Report",
    phase_name: "Phase 2: Design",
    category: "quality",
    is_critical_milestone: false,
    description: "Security assessment of design",
    typical_owner: "Security Team",
    estimated_days: 5,
    dependencies: ["Security Architecture Design"]
  },
  {
    name: "Compliance Gap Analysis",
    phase_name: "Phase 2: Design",
    category: "governance",
    is_critical_milestone: false,
    description: "Regulatory compliance assessment",
    typical_owner: "Compliance Officer",
    estimated_days: 7,
    dependencies: ["SAD"]
  },
  {
    name: "Data Privacy Impact Assessment (DPIA)",
    phase_name: "Phase 2: Design",
    category: "governance",
    is_critical_milestone: false,
    description: "Privacy risk assessment and mitigation",
    typical_owner: "Privacy Officer",
    estimated_days: 7,
    dependencies: ["Data Architecture Document"]
  },
  {
    name: "Design Phase Exit Criteria Checklist",
    phase_name: "Phase 2: Design",
    category: "quality",
    is_critical_milestone: false,
    description: "Phase gate criteria verification",
    typical_owner: "Quality Manager",
    estimated_days: 1,
    dependencies: []
  },

  // Phase 3: Development & Build (15 documents)
  {
    name: "Development Standards & Guidelines",
    phase_name: "Phase 3: Development",
    category: "technical",
    is_critical_milestone: false,
    description: "Coding standards and best practices",
    typical_owner: "Development Lead",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Code Repository Structure Document",
    phase_name: "Phase 3: Development",
    category: "technical",
    is_critical_milestone: false,
    description: "Source code organization and branching strategy",
    typical_owner: "Development Lead",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "API Documentation",
    phase_name: "Phase 3: Development",
    category: "technical",
    is_critical_milestone: false,
    description: "API endpoints, methods, and integration guide",
    typical_owner: "Developer",
    estimated_days: 7,
    dependencies: ["TDD"]
  },
  {
    name: "Database Design Document",
    phase_name: "Phase 3: Development",
    category: "technical",
    is_critical_milestone: false,
    description: "Database schema, tables, and relationships",
    typical_owner: "Database Developer",
    estimated_days: 7,
    dependencies: ["Data Architecture Document"]
  },
  {
    name: "Development Environment Setup Guide",
    phase_name: "Phase 3: Development",
    category: "technical",
    is_critical_milestone: false,
    description: "Development environment configuration",
    typical_owner: "DevOps Engineer",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Vendor Development Progress Reports (Weekly)",
    phase_name: "Phase 3: Development",
    category: "vendor",
    is_critical_milestone: true,
    description: "Weekly development status and progress updates",
    typical_owner: "Vendor PM",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "Vendor Code Review Reports",
    phase_name: "Phase 3: Development",
    category: "vendor",
    is_critical_milestone: false,
    description: "Code quality review findings",
    typical_owner: "Vendor Tech Lead",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Vendor Unit Test Reports",
    phase_name: "Phase 3: Development",
    category: "vendor",
    is_critical_milestone: true,
    description: "Unit testing results and coverage",
    typical_owner: "Vendor QA",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Vendor Build & Deployment Guide",
    phase_name: "Phase 3: Development",
    category: "vendor",
    is_critical_milestone: false,
    description: "Build and deployment procedures",
    typical_owner: "Vendor DevOps",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Code Review Checklist",
    phase_name: "Phase 3: Development",
    category: "quality",
    is_critical_milestone: false,
    description: "Code review standards and criteria",
    typical_owner: "Tech Lead",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "Unit Test Plan",
    phase_name: "Phase 3: Development",
    category: "quality",
    is_critical_milestone: true,
    description: "Unit testing strategy and test cases",
    typical_owner: "QA Lead",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Integration Test Plan",
    phase_name: "Phase 3: Development",
    category: "quality",
    is_critical_milestone: true,
    description: "Component integration testing strategy",
    typical_owner: "QA Lead",
    estimated_days: 7,
    dependencies: []
  },
  {
    name: "Code Quality Metrics Report",
    phase_name: "Phase 3: Development",
    category: "quality",
    is_critical_milestone: false,
    description: "Code quality analysis and metrics",
    typical_owner: "Tech Lead",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Change Request Log",
    phase_name: "Phase 3: Development",
    category: "governance",
    is_critical_milestone: false,
    description: "Change request tracking register",
    typical_owner: "Project Manager",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "Configuration Items Register",
    phase_name: "Phase 3: Development",
    category: "governance",
    is_critical_milestone: false,
    description: "Configuration management database",
    typical_owner: "Configuration Manager",
    estimated_days: 2,
    dependencies: []
  },

  // Phase 4: Testing & QA (16 documents)
  {
    name: "Master Test Plan (MTP)",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: true,
    description: "Comprehensive testing strategy and approach",
    typical_owner: "QA Manager",
    estimated_days: 10,
    dependencies: ["RTM"]
  },
  {
    name: "System Integration Test (SIT) Plan",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: true,
    description: "System integration testing strategy",
    typical_owner: "QA Lead",
    estimated_days: 7,
    dependencies: ["MTP"]
  },
  {
    name: "User Acceptance Test (UAT) Plan",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: true,
    description: "User acceptance testing approach and criteria",
    typical_owner: "Business Analyst",
    estimated_days: 7,
    dependencies: ["MTP"]
  },
  {
    name: "Performance Test Plan",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: false,
    description: "Performance, load, and stress testing strategy",
    typical_owner: "Performance Test Lead",
    estimated_days: 7,
    dependencies: ["MTP"]
  },
  {
    name: "Security Test Plan",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: true,
    description: "Security testing and vulnerability assessment",
    typical_owner: "Security Tester",
    estimated_days: 7,
    dependencies: ["MTP"]
  },
  {
    name: "Regression Test Plan",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: false,
    description: "Regression testing strategy for changes",
    typical_owner: "QA Lead",
    estimated_days: 5,
    dependencies: ["MTP"]
  },
  {
    name: "Test Cases & Test Scripts",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: true,
    description: "Detailed test cases and execution scripts",
    typical_owner: "QA Team",
    estimated_days: 15,
    dependencies: ["SIT Plan", "UAT Plan"]
  },
  {
    name: "Test Data Management Plan",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: false,
    description: "Test data creation and management strategy",
    typical_owner: "QA Lead",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Defect Management Process",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: false,
    description: "Defect logging, tracking, and resolution process",
    typical_owner: "QA Manager",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Vendor Test Summary Reports",
    phase_name: "Phase 4: Testing",
    category: "vendor",
    is_critical_milestone: true,
    description: "Vendor testing results and analysis",
    typical_owner: "Vendor QA Lead",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Vendor Defect Resolution Log",
    phase_name: "Phase 4: Testing",
    category: "vendor",
    is_critical_milestone: true,
    description: "Vendor defect tracking and resolution status",
    typical_owner: "Vendor QA Lead",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "SIT Sign-off",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: true,
    description: "System integration testing approval",
    typical_owner: "Project Manager",
    estimated_days: 1,
    dependencies: ["SIT Plan"]
  },
  {
    name: "UAT Sign-off",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: true,
    description: "User acceptance testing approval",
    typical_owner: "Business Owner",
    estimated_days: 1,
    dependencies: ["UAT Plan"]
  },
  {
    name: "Performance Test Sign-off",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: false,
    description: "Performance testing approval",
    typical_owner: "Technical Manager",
    estimated_days: 1,
    dependencies: ["Performance Test Plan"]
  },
  {
    name: "Security Test Sign-off",
    phase_name: "Phase 4: Testing",
    category: "quality",
    is_critical_milestone: true,
    description: "Security testing approval",
    typical_owner: "Security Manager",
    estimated_days: 1,
    dependencies: ["Security Test Plan"]
  },
  {
    name: "Go/No-Go Decision Document",
    phase_name: "Phase 4: Testing",
    category: "governance",
    is_critical_milestone: true,
    description: "Formal decision to proceed with deployment",
    typical_owner: "Project Steering Committee",
    estimated_days: 2,
    dependencies: ["SIT Sign-off", "UAT Sign-off", "Security Test Sign-off"]
  },

  // Phase 5: Deployment & Go-Live (14 documents)
  {
    name: "Deployment Plan",
    phase_name: "Phase 5: Deployment",
    category: "technical",
    is_critical_milestone: true,
    description: "Detailed deployment strategy and procedures",
    typical_owner: "Release Manager",
    estimated_days: 7,
    dependencies: ["Go/No-Go Decision"]
  },
  {
    name: "Cutover Plan",
    phase_name: "Phase 5: Deployment",
    category: "technical",
    is_critical_milestone: true,
    description: "System cutover and transition procedures",
    typical_owner: "Release Manager",
    estimated_days: 7,
    dependencies: ["Deployment Plan"]
  },
  {
    name: "Rollback Plan",
    phase_name: "Phase 5: Deployment",
    category: "technical",
    is_critical_milestone: true,
    description: "Rollback procedures in case of failure",
    typical_owner: "Release Manager",
    estimated_days: 5,
    dependencies: ["Deployment Plan"]
  },
  {
    name: "Data Migration Plan",
    phase_name: "Phase 5: Deployment",
    category: "technical",
    is_critical_milestone: true,
    description: "Data migration strategy and validation",
    typical_owner: "Data Migration Lead",
    estimated_days: 10,
    dependencies: ["Deployment Plan"]
  },
  {
    name: "Go-Live Checklist",
    phase_name: "Phase 5: Deployment",
    category: "governance",
    is_critical_milestone: true,
    description: "Pre-deployment readiness checklist",
    typical_owner: "Project Manager",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Operations Readiness Assessment",
    phase_name: "Phase 5: Deployment",
    category: "governance",
    is_critical_milestone: true,
    description: "Operational readiness verification",
    typical_owner: "Operations Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Service Transition Plan",
    phase_name: "Phase 5: Deployment",
    category: "governance",
    is_critical_milestone: false,
    description: "Transition to operations procedures",
    typical_owner: "Service Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Incident Management Plan",
    phase_name: "Phase 5: Deployment",
    category: "governance",
    is_critical_milestone: false,
    description: "Post-deployment incident handling procedures",
    typical_owner: "Service Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Change Management Plan (Operations)",
    phase_name: "Phase 5: Deployment",
    category: "governance",
    is_critical_milestone: false,
    description: "Post-deployment change control process",
    typical_owner: "Change Manager",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "End User Training Materials",
    phase_name: "Phase 5: Deployment",
    category: "governance",
    is_critical_milestone: true,
    description: "User training guides and materials",
    typical_owner: "Training Manager",
    estimated_days: 10,
    dependencies: []
  },
  {
    name: "Administrator Training Materials",
    phase_name: "Phase 5: Deployment",
    category: "technical",
    is_critical_milestone: false,
    description: "System admin training documentation",
    typical_owner: "Training Manager",
    estimated_days: 7,
    dependencies: []
  },
  {
    name: "System Operations Manual",
    phase_name: "Phase 5: Deployment",
    category: "technical",
    is_critical_milestone: true,
    description: "System operations and maintenance guide",
    typical_owner: "Technical Writer",
    estimated_days: 10,
    dependencies: []
  },
  {
    name: "User Manual / Help Documentation",
    phase_name: "Phase 5: Deployment",
    category: "governance",
    is_critical_milestone: false,
    description: "End user help and reference documentation",
    typical_owner: "Technical Writer",
    estimated_days: 10,
    dependencies: []
  },
  {
    name: "Go-Live Approval",
    phase_name: "Phase 5: Deployment",
    category: "governance",
    is_critical_milestone: true,
    description: "Formal approval to go live",
    typical_owner: "Project Sponsor",
    estimated_days: 1,
    dependencies: ["Go-Live Checklist", "Operations Readiness Assessment"]
  },

  // Phase 6: Hypercare & Stabilization (12 documents)
  {
    name: "Hypercare Support Plan",
    phase_name: "Phase 6: Hypercare",
    category: "governance",
    is_critical_milestone: true,
    description: "Post go-live intensive support plan",
    typical_owner: "Support Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Issue Escalation Matrix",
    phase_name: "Phase 6: Hypercare",
    category: "governance",
    is_critical_milestone: false,
    description: "Issue escalation procedures and contacts",
    typical_owner: "Support Manager",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Known Issues Log",
    phase_name: "Phase 6: Hypercare",
    category: "governance",
    is_critical_milestone: false,
    description: "Known issues and workarounds register",
    typical_owner: "Support Team",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "Incident Log & Resolution Tracker",
    phase_name: "Phase 6: Hypercare",
    category: "governance",
    is_critical_milestone: true,
    description: "Post go-live incident tracking",
    typical_owner: "Support Team",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "System Performance Report (Daily/Weekly)",
    phase_name: "Phase 6: Hypercare",
    category: "technical",
    is_critical_milestone: false,
    description: "System performance monitoring reports",
    typical_owner: "Operations Team",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "User Feedback Log",
    phase_name: "Phase 6: Hypercare",
    category: "governance",
    is_critical_milestone: true,
    description: "User feedback and satisfaction tracking",
    typical_owner: "Project Manager",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "Bug & Defect Log (Post Go-Live)",
    phase_name: "Phase 6: Hypercare",
    category: "quality",
    is_critical_milestone: false,
    description: "Post-deployment defect tracking",
    typical_owner: "Support Team",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "Vendor Hypercare Support Schedule",
    phase_name: "Phase 6: Hypercare",
    category: "vendor",
    is_critical_milestone: true,
    description: "Vendor hypercare availability and support plan",
    typical_owner: "Vendor PM",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Vendor Issue Resolution SLA Tracker",
    phase_name: "Phase 6: Hypercare",
    category: "vendor",
    is_critical_milestone: false,
    description: "Vendor SLA compliance tracking",
    typical_owner: "Project Manager",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "Vendor Performance Scorecard",
    phase_name: "Phase 6: Hypercare",
    category: "vendor",
    is_critical_milestone: false,
    description: "Vendor performance evaluation",
    typical_owner: "Project Manager",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Stabilization Criteria Checklist",
    phase_name: "Phase 6: Hypercare",
    category: "quality",
    is_critical_milestone: false,
    description: "System stabilization verification",
    typical_owner: "Project Manager",
    estimated_days: 2,
    dependencies: []
  },
  {
    name: "Hypercare Exit Criteria",
    phase_name: "Phase 6: Hypercare",
    category: "governance",
    is_critical_milestone: true,
    description: "Criteria for exiting hypercare phase",
    typical_owner: "Project Manager",
    estimated_days: 2,
    dependencies: []
  },

  // Phase 7: Closeout & Handover (10 documents)
  {
    name: "Project Closeout Report",
    phase_name: "Phase 7: Closeout",
    category: "governance",
    is_critical_milestone: true,
    description: "Comprehensive project closure document",
    typical_owner: "Project Manager",
    estimated_days: 7,
    dependencies: []
  },
  {
    name: "Final Project Performance Report",
    phase_name: "Phase 7: Closeout",
    category: "governance",
    is_critical_milestone: true,
    description: "Final performance metrics and analysis",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Lessons Learned Report",
    phase_name: "Phase 7: Closeout",
    category: "governance",
    is_critical_milestone: true,
    description: "Project lessons learned and recommendations",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Benefits Realization Report",
    phase_name: "Phase 7: Closeout",
    category: "strategic",
    is_critical_milestone: false,
    description: "Benefits achieved vs planned analysis",
    typical_owner: "Business Owner",
    estimated_days: 7,
    dependencies: []
  },
  {
    name: "Business As-Usual (BAU) Handover Document",
    phase_name: "Phase 7: Closeout",
    category: "governance",
    is_critical_milestone: true,
    description: "Handover to business operations",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Support Team Handover Document",
    phase_name: "Phase 7: Closeout",
    category: "governance",
    is_critical_milestone: true,
    description: "Handover to support team with procedures",
    typical_owner: "Support Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Knowledge Transfer Completion Certificate",
    phase_name: "Phase 7: Closeout",
    category: "governance",
    is_critical_milestone: false,
    description: "Knowledge transfer confirmation",
    typical_owner: "Project Manager",
    estimated_days: 1,
    dependencies: []
  },
  {
    name: "Final Budget Report",
    phase_name: "Phase 7: Closeout",
    category: "governance",
    is_critical_milestone: false,
    description: "Final financial performance report",
    typical_owner: "Finance Manager",
    estimated_days: 5,
    dependencies: []
  },
  {
    name: "Contract Closure Document",
    phase_name: "Phase 7: Closeout",
    category: "contractual",
    is_critical_milestone: false,
    description: "Vendor contract closure and sign-off",
    typical_owner: "Procurement Manager",
    estimated_days: 3,
    dependencies: []
  },
  {
    name: "Vendor Performance Evaluation",
    phase_name: "Phase 7: Closeout",
    category: "vendor",
    is_critical_milestone: true,
    description: "Final vendor performance assessment",
    typical_owner: "Project Manager",
    estimated_days: 5,
    dependencies: []
  }
];
