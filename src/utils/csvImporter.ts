import { Task, TaskStatus } from "@/types/task";

// Use status exactly as provided in CSV (trimmed)


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
  const tasks: Omit<Task, "id">[] = [];
  
  // Parse CSV handling multi-line quoted fields
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  
  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Handle escaped quotes ("")
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      // End of row (handle both \n and \r\n)
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip the \n in \r\n
      }
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field)) { // Only add non-empty rows
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      }
    } else {
      currentField += char;
    }
  }
  
  // Add last field and row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field)) {
      rows.push(currentRow);
    }
  }
  
  // Skip header row and process data rows
  for (let i = 1; i < rows.length; i++) {
    const fields = rows[i];
    
    if (fields.length >= 7) {
      const serialNo = parseInt(fields[0]) || tasks.length + 1;
      const owner = fields[1]?.trim() || 'Unknown';
      const actionItem = fields[2]?.trim() || '';
      const reportedDate = parseCSVDate(fields[3]);
      const targetDate = parseCSVDate(fields[4]);
      const statusRaw = fields[5]?.trim() || 'Not Started';
      const status = statusRaw as TaskStatus;
      const progressComments = fields[6]?.trim() || '';
      
      console.log(`Row ${i}: Using status as-is -> "${status}"`);
      
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
