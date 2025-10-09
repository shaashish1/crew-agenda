import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Milestone, Risk, StatusUpdate, Document } from '@/types/project';

interface ProjectContextType {
  projects: Project[];
  milestones: Milestone[];
  risks: Risk[];
  statusUpdates: StatusUpdate[];
  documents: Document[];
  
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (id: string, milestone: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  getMilestonesByProject: (projectId: string) => Milestone[];
  
  addRisk: (risk: Omit<Risk, 'id'>) => void;
  updateRisk: (id: string, risk: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;
  getRisksByProject: (projectId: string) => Risk[];
  
  addStatusUpdate: (update: Omit<StatusUpdate, 'id'>) => void;
  getStatusUpdatesByProject: (projectId: string) => StatusUpdate[];
  
  addDocument: (document: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByProject: (projectId: string) => Document[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    const savedMilestones = localStorage.getItem('milestones');
    const savedRisks = localStorage.getItem('risks');
    const savedStatusUpdates = localStorage.getItem('statusUpdates');
    const savedDocuments = localStorage.getItem('documents');

    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedMilestones) setMilestones(JSON.parse(savedMilestones));
    if (savedRisks) setRisks(JSON.parse(savedRisks));
    if (savedStatusUpdates) setStatusUpdates(JSON.parse(savedStatusUpdates));
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('risks', JSON.stringify(risks));
  }, [risks]);

  useEffect(() => {
    localStorage.setItem('statusUpdates', JSON.stringify(statusUpdates));
  }, [statusUpdates]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  // Project functions
  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: project.comments || [],
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, projectUpdate: Partial<Project>) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, ...projectUpdate, updatedAt: new Date().toISOString() } : p
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setMilestones(milestones.filter(m => m.projectId !== id));
    setRisks(risks.filter(r => r.projectId !== id));
    setStatusUpdates(statusUpdates.filter(s => s.projectId !== id));
    setDocuments(documents.filter(d => d.projectId !== id));
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  // Milestone functions
  const addMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: crypto.randomUUID(),
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, milestoneUpdate: Partial<Milestone>) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, ...milestoneUpdate } : m
    ));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const getMilestonesByProject = (projectId: string) => 
    milestones.filter(m => m.projectId === projectId).sort((a, b) => a.order - b.order);

  // Risk functions
  const addRisk = (risk: Omit<Risk, 'id'>) => {
    const newRisk: Risk = {
      ...risk,
      id: crypto.randomUUID(),
    };
    setRisks([...risks, newRisk]);
  };

  const updateRisk = (id: string, riskUpdate: Partial<Risk>) => {
    setRisks(risks.map(r => 
      r.id === id ? { ...r, ...riskUpdate } : r
    ));
  };

  const deleteRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
  };

  const getRisksByProject = (projectId: string) => 
    risks.filter(r => r.projectId === projectId);

  // Status Update functions
  const addStatusUpdate = (update: Omit<StatusUpdate, 'id'>) => {
    const newUpdate: StatusUpdate = {
      ...update,
      id: crypto.randomUUID(),
    };
    setStatusUpdates([...statusUpdates, newUpdate]);
  };

  const getStatusUpdatesByProject = (projectId: string) => 
    statusUpdates.filter(s => s.projectId === projectId).sort((a, b) => 
      new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
    );

  // Document functions
  const addDocument = (document: Omit<Document, 'id'>) => {
    const newDocument: Document = {
      ...document,
      id: crypto.randomUUID(),
    };
    setDocuments([...documents, newDocument]);
  };

  const updateDocument = (id: string, documentUpdate: Partial<Document>) => {
    setDocuments(documents.map(d => 
      d.id === id ? { ...d, ...documentUpdate } : d
    ));
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const getDocumentsByProject = (projectId: string) => 
    documents.filter(d => d.projectId === projectId).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

  return (
    <ProjectContext.Provider
      value={{
        projects,
        milestones,
        risks,
        statusUpdates,
        documents,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        getMilestonesByProject,
        addRisk,
        updateRisk,
        deleteRisk,
        getRisksByProject,
        addStatusUpdate,
        getStatusUpdatesByProject,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocumentsByProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
