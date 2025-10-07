import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import { parseCSV } from "@/utils/csvImporter";
import { toast } from "sonner";

export const ImportDataButton = () => {
  const { addTask, owners, addOwner } = useTaskContext();
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      // Fetch the CSV file from the data folder
      const response = await fetch('/src/data/import-data.csv');
      const csvContent = await response.text();
      
      // Parse CSV
      const parsedTasks = parseCSV(csvContent);
      
      // Extract unique owners from CSV and add them if they don't exist
      const uniqueOwners = [...new Set(parsedTasks.map(task => task.owner))];
      const existingOwnerNames = owners.map(o => o.name);
      
      uniqueOwners.forEach(ownerName => {
        if (!existingOwnerNames.includes(ownerName)) {
          addOwner({ name: ownerName });
        }
      });
      
      // Add all tasks
      parsedTasks.forEach(task => {
        addTask(task);
      });
      
      toast.success(`Successfully imported ${parsedTasks.length} tasks!`);
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data. Please check the CSV format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleImport} 
      variant="outline" 
      className="gap-2"
      disabled={loading}
    >
      <Upload className="w-4 h-4" />
      {loading ? "Importing..." : "Import CSV Data"}
    </Button>
  );
};
