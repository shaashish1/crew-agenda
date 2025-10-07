import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, Category, Owner, TaskStatus } from "@/types/task";

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  owners: Owner[];
  addTask: (task: Omit<Task, "id" | "serialNo">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  addOwner: (owner: Omit<Owner, "id">) => void;
  deleteOwner: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedCategories = localStorage.getItem("categories");
    const storedOwners = localStorage.getItem("owners");

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedOwners) setOwners(JSON.parse(storedOwners));
  }, []);

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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        owners,
        addTask,
        updateTask,
        deleteTask,
        addCategory,
        deleteCategory,
        addOwner,
        deleteOwner,
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
