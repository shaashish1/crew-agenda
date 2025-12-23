import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import { parseCSV } from "@/utils/csvImporter";
import { toast } from "sonner";

export const ImportDataButton = () => {
  const { addTask, owners, addOwner } = useTaskContext();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Read the uploaded CSV file
      const csvContent = await file.text();
      
      // Parse CSV
      const parsedTasks = parseCSV(csvContent);
      
      if (parsedTasks.length === 0) {
        toast.error('No valid tasks found in the CSV file.');
        return;
      }
      
      // Extract unique owners from CSV and add them if they don't exist
      const uniqueOwners = [...new Set(parsedTasks.flatMap(task => task.owner))];
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />
      <Button 
        variant="secondary"
        onClick={() => fileInputRef.current?.click()} 
        size="lg"
        className="gap-2"
        disabled={loading}
      >
        <Upload className="w-5 h-5" />
        {loading ? "Importing..." : "Import CSV"}
      </Button>
    </>
  );
};
