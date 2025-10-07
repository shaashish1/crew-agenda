import { Task, TaskStatus } from "@/types/task";

const statusMapping: { [key: string]: TaskStatus } = {
  "Closed": "Completed",
  "Open": "In Progress",
  "Not Started": "Not Started",
  "In Progress": "In Progress",
  "On Hold": "On Hold",
  "Overdue": "Overdue",
};

export const parseCSVDate = (dateStr: string): string => {
  // Handle format like "02/Sep/25" or other formats
  try {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const monthStr = parts[1];
      const year = parts[2];
      
      // Convert month name to number
      const months: { [key: string]: string } = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      
      const month = months[monthStr] || '01';
      const fullYear = year.length === 2 ? `20${year}` : year;
      
      return `${fullYear}-${month}-${day}`;
    }
  } catch (e) {
    console.error('Error parsing date:', dateStr, e);
  }
  
  // Return today's date as fallback
  return new Date().toISOString().split('T')[0];
};

export const parseCSV = (csvContent: string): Omit<Task, "id">[] => {
  const lines = csvContent.split('\n');
  const tasks: Omit<Task, "id">[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV considering quoted fields with commas
    const fields: string[] = [];
    let currentField = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim()); // Add last field
    
    if (fields.length >= 7) {
      const serialNo = parseInt(fields[0]) || tasks.length + 1;
      const owner = fields[1] || 'Unknown';
      const actionItem = fields[2] || '';
      const reportedDate = parseCSVDate(fields[3]);
      const targetDate = parseCSVDate(fields[4]);
      const statusRaw = fields[5] || 'Not Started';
      const status = statusMapping[statusRaw] || "Not Started";
      const progressComments = fields[6] || '';
      
      tasks.push({
        serialNo,
        owner,
        actionItem,
        reportedDate,
        targetDate,
        status,
        progressComments,
        category: '', // No category in CSV
      });
    }
  }
  
  return tasks;
};
