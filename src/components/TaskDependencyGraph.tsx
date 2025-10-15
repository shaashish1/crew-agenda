import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Task } from "@/types/task";
import { Card } from "./ui/card";

interface TaskDependencyGraphProps {
  tasks: Task[];
  selectedTaskId?: string;
}

export const TaskDependencyGraph = ({ tasks, selectedTaskId }: TaskDependencyGraphProps) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create a map for quick task lookup
    const taskMap = new Map(tasks.map(task => [task.id, task]));

    // Calculate positions using a simple force-directed layout
    tasks.forEach((task, index) => {
      const isSelected = task.id === selectedTaskId;
      const hasDependencies = task.dependencies && task.dependencies.length > 0;
      const isDependedUpon = tasks.some(t => t.dependencies?.includes(task.id));

      nodes.push({
        id: task.id,
        type: "default",
        position: {
          x: (index % 4) * 250,
          y: Math.floor(index / 4) * 150,
        },
        data: {
          label: (
            <div className="px-3 py-2 min-w-[180px]">
              <div className="font-semibold text-sm truncate">{task.actionItem}</div>
              <div className="text-xs text-muted-foreground mt-1">
                #{task.serialNo} • {task.status}
              </div>
            </div>
          ),
        },
        style: {
          background: isSelected ? "hsl(var(--primary))" : "hsl(var(--card))",
          border: isSelected ? "2px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
          borderRadius: "12px",
          color: isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
          fontSize: "12px",
          padding: 0,
        },
      });

      // Create edges for dependencies
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          if (taskMap.has(depId)) {
            edges.push({
              id: `${depId}-${task.id}`,
              source: depId,
              target: task.id,
              type: "smoothstep",
              animated: selectedTaskId === task.id || selectedTaskId === depId,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: selectedTaskId === task.id || selectedTaskId === depId
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))",
              },
              style: {
                stroke: selectedTaskId === task.id || selectedTaskId === depId
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))",
                strokeWidth: selectedTaskId === task.id || selectedTaskId === depId ? 2 : 1,
              },
            });
          }
        });
      }
    });

    return { nodes, edges };
  }, [tasks, selectedTaskId]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No tasks to display in dependency graph</p>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </Card>
  );
};
