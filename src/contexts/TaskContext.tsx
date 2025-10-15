import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, Category, Owner, TaskStatus } from "@/types/task";
import { Subtask } from "@/types/subtask";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  owners: Owner[];
  subtasks: Subtask[];
  addTask: (task: Omit<Task, "id" | "serialNo">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  addOwner: (owner: Omit<Owner, "id">) => void;
  deleteOwner: (id: string) => void;
  addSubtask: (subtask: Omit<Subtask, "id" | "created_at" | "updated_at">) => void;
  updateSubtask: (id: string, subtask: Partial<Subtask>) => void;
  deleteSubtask: (id: string) => void;
  getSubtasksByTaskId: (taskId: string) => Subtask[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  // Load data from localStorage and Supabase on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedCategories = localStorage.getItem("categories");
    const storedOwners = localStorage.getItem("owners");

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedOwners) setOwners(JSON.parse(storedOwners));

    // Load subtasks from Supabase
    loadSubtasks();
  }, []);

  const loadSubtasks = async () => {
    try {
      const { data, error } = await supabase
        .from("subtasks")
        .select("*")
        .order("parent_task_id", { ascending: true })
        .order("order_index", { ascending: true });

      if (error) throw error;
      if (data) setSubtasks(data as Subtask[]);
    } catch (error) {
      console.error("Error loading subtasks:", error);
    }
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("owners", JSON.stringify(owners));
  }, [owners]);

  const addTask = (task: Omit<Task, "id" | "serialNo">) => {
    setTasks((prev) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        serialNo: prev.length + 1,
      };
      return [...prev, newTask];
    });
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addOwner = (owner: Omit<Owner, "id">) => {
    const newOwner: Owner = {
      ...owner,
      id: crypto.randomUUID(),
    };
    setOwners((prev) => [...prev, newOwner]);
  };

  const deleteOwner = (id: string) => {
    setOwners((prev) => prev.filter((owner) => owner.id !== id));
  };

  const addSubtask = async (subtask: Omit<Subtask, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("subtasks")
        .insert([subtask])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSubtasks((prev) => [...prev, data as Subtask]);
        toast.success("Subtask added successfully");
      }
    } catch (error) {
      console.error("Error adding subtask:", error);
      toast.error("Failed to add subtask");
    }
  };

  const updateSubtask = async (id: string, updatedSubtask: Partial<Subtask>) => {
    try {
      const { data, error } = await supabase
        .from("subtasks")
        .update(updatedSubtask)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSubtasks((prev) =>
          prev.map((subtask) => (subtask.id === id ? { ...subtask, ...data } : subtask))
        );
      }
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast.error("Failed to update subtask");
    }
  };

  const deleteSubtask = async (id: string) => {
    try {
      const { error } = await supabase.from("subtasks").delete().eq("id", id);

      if (error) throw error;
      setSubtasks((prev) => prev.filter((subtask) => subtask.id !== id));
      toast.success("Subtask deleted successfully");
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast.error("Failed to delete subtask");
    }
  };

  const getSubtasksByTaskId = (taskId: string): Subtask[] => {
    return subtasks.filter((subtask) => subtask.parent_task_id === taskId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        owners,
        subtasks,
        addTask,
        updateTask,
        deleteTask,
        addCategory,
        deleteCategory,
        addOwner,
        deleteOwner,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        getSubtasksByTaskId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskProvider");
  }
  return context;
};
