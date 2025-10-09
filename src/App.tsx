import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "@/contexts/TaskContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import NewProject from "./pages/NewProject";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProjectProvider>
        <TaskProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Layout><Projects /></Layout>} />
              <Route path="/projects/new" element={<Layout><NewProject /></Layout>} />
              <Route path="/projects/:id" element={<Layout><ProjectDetails /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </ProjectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
