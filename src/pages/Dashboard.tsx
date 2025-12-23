import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { TaskDialog } from "@/components/TaskDialog";
import { ImportDataButton } from "@/components/ImportDataButton";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TaskDependencyGraph } from "@/components/TaskDependencyGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SortField = "serialNo" | "owner" | "actionItem" | "category" | "reportedDate" | "targetDate" | "status";
type SortDirection = "asc" | "desc" | null;

const Dashboard = () => {
  const { tasks, deleteTask } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [viewMode, setViewMode] = useState<"table" | "graph">("table");
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Filter state - now arrays for multi-select
  const [filterOwners, setFilterOwners] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast.success("Task deleted successfully");
  };

  const handleAddNew = () => {
    setSelectedTask(undefined);
    setDialogOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    if (sortDirection === "asc") return <ArrowUp className="w-4 h-4 ml-1" />;
    return <ArrowDown className="w-4 h-4 ml-1" />;
  };

  // Get unique values for filters (only values that exist in the data)
  const uniqueOwners = useMemo(() => [...new Set(tasks.flatMap(t => t.owner))].sort(), [tasks]);
  const uniqueCategories = useMemo(() => [...new Set(tasks.map(t => t.category).filter(Boolean))].sort(), [tasks]);
  const uniqueStatuses = useMemo(() => [...new Set(tasks.map(t => t.status))].sort(), [tasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply filters
    if (filterOwners.length > 0) {
      filtered = filtered.filter(t => t.owner.some(o => filterOwners.includes(o)));
    }
    if (filterCategories.length > 0) {
      filtered = filtered.filter(t => t.category && filterCategories.includes(t.category));
    }
    if (filterStatuses.length > 0) {
      filtered = filtered.filter(t => filterStatuses.includes(t.status));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.actionItem.toLowerCase().includes(query) ||
        t.progressComments?.toLowerCase().includes(query) ||
        t.owner.some(o => o.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        if (sortField === "reportedDate" || sortField === "targetDate") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        } else if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal?.toLowerCase() || "";
        }

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tasks, filterOwners, filterCategories, filterStatuses, searchQuery, sortField, sortDirection]);

  const toggleFilter = (value: string, currentFilters: string[], setFilters: (filters: string[]) => void) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter(f => f !== value));
    } else {
      setFilters([...currentFilters, value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Task Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Manage and track your team's tasks</p>
        </div>
        <div className="flex gap-3">
          <ImportDataButton />
          <Button onClick={handleAddNew} size="lg">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search</label>
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Owner</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-10">
                    {filterOwners.length > 0 ? (
                      <span className="flex gap-1 flex-wrap">
                        {filterOwners.slice(0, 2).map(owner => (
                          <Badge key={owner} variant="secondary" className="text-xs">
                            {owner}
                          </Badge>
                        ))}
                        {filterOwners.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{filterOwners.length - 2}
                          </Badge>
                        )}
                      </span>
                    ) : (
                      "All owners"
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {uniqueOwners.map(owner => (
                      <div key={owner} className="flex items-center space-x-2">
                        <Checkbox
                          id={`owner-${owner}`}
                          checked={filterOwners.includes(owner)}
                          onCheckedChange={() => toggleFilter(owner, filterOwners, setFilterOwners)}
                        />
                        <label
                          htmlFor={`owner-${owner}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {owner}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-10">
                    {filterCategories.length > 0 ? (
                      <span className="flex gap-1 flex-wrap">
                        {filterCategories.slice(0, 2).map(cat => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        {filterCategories.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{filterCategories.length - 2}
                          </Badge>
                        )}
                      </span>
                    ) : (
                      "All categories"
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {uniqueCategories.map(cat => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${cat}`}
                          checked={filterCategories.includes(cat)}
                          onCheckedChange={() => toggleFilter(cat, filterCategories, setFilterCategories)}
                        />
                        <label
                          htmlFor={`cat-${cat}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-10">
                    {filterStatuses.length > 0 ? (
                      <span className="flex gap-1 flex-wrap">
                        {filterStatuses.slice(0, 2).map(status => (
                          <Badge key={status} variant="secondary" className="text-xs">
                            {status}
                          </Badge>
                        ))}
                        {filterStatuses.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{filterStatuses.length - 2}
                          </Badge>
                        )}
                      </span>
                    ) : (
                      "All statuses"
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {uniqueStatuses.map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filterStatuses.includes(status)}
                          onCheckedChange={() => toggleFilter(status, filterStatuses, setFilterStatuses)}
                        />
                        <label
                          htmlFor={`status-${status}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {(filterOwners.length > 0 || filterCategories.length > 0 || filterStatuses.length > 0 || searchQuery) && (
            <Button
              size="sm"
              onClick={() => {
                setFilterOwners([]);
                setFilterCategories([]);
                setFilterStatuses([]);
                setSearchQuery("");
              }}
            >
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "graph")} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="graph">
              <Network className="h-4 w-4 mr-2" />
              Dependency Graph
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? "s" : ""}
          </div>
        </div>

        <TabsContent value="table" className="mt-0">
          <Card>
            {filteredAndSortedTasks.length === 0 ? (
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {tasks.length === 0 ? "Get started by creating your first task" : "Try adjusting your filters"}
                </p>
                <Button onClick={handleAddNew} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Task
                </Button>
              </CardContent>
            ) : (
          <div className="overflow-x-auto">
            <Table className="table-auto">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead 
                    className="cursor-pointer select-none whitespace-nowrap font-semibold"
                    onClick={() => handleSort("serialNo")}
                  >
                    <div className="flex items-center">
                      S.No
                      {getSortIcon("serialNo")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none whitespace-nowrap font-semibold"
                    onClick={() => handleSort("owner")}
                  >
                    <div className="flex items-center">
                      Owner
                      {getSortIcon("owner")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none font-semibold"
                    onClick={() => handleSort("actionItem")}
                  >
                    <div className="flex items-center">
                      Action Item
                      {getSortIcon("actionItem")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none whitespace-nowrap font-semibold"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {getSortIcon("category")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none whitespace-nowrap font-semibold"
                    onClick={() => handleSort("reportedDate")}
                  >
                    <div className="flex items-center">
                      Reported Date
                      {getSortIcon("reportedDate")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none whitespace-nowrap font-semibold"
                    onClick={() => handleSort("targetDate")}
                  >
                    <div className="flex items-center">
                      Target Date
                      {getSortIcon("targetDate")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none whitespace-nowrap font-semibold"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">Progress Comments</TableHead>
                  <TableHead className="whitespace-nowrap font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{task.serialNo}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {task.owner.map((owner, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {owner}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">{task.actionItem}</TableCell>
                    <TableCell>{task.category || "-"}</TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(task.reportedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(task.targetDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <TaskStatusBadge status={task.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">
                      {task.progressComments || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(task)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </TabsContent>

    <TabsContent value="graph" className="mt-0">
      <TaskDependencyGraph tasks={filteredAndSortedTasks} selectedTaskId={selectedTask?.id} />
    </TabsContent>
  </Tabs>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
