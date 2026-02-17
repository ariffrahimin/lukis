import { useCallback, useMemo, useRef, useState } from 'react';
import { type Node, type Edge } from '@xyflow/react';
import { GripVertical, ChevronUp, ChevronDown, Eye, EyeOff, X, GitBranch, Layers } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '../lib/utils';
import { NodeIcon } from './nodes/NodeIcon';
import { isCloudService, cloudServiceIcons } from './nodes/node-icons';
import { sortNodesForSubFlow } from '../utils/sort-nodes';
import { type NodeType, type DiagramNodeData } from '../types/diagrams';

interface LayersPanelProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
  isMobile: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DRAG_TYPE = 'application/layers-reorder';

export const LayersPanel = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  onSelectNode,
  onSelectEdge,
  isMobile,
  open,
  onOpenChange,
}: LayersPanelProps) => {
  const [dragOverIndex, setDragOverIndex] = useState<{ type: 'node' | 'edge'; index: number } | null>(null);
  const dragItemRef = useRef<{ type: 'node' | 'edge'; index: number } | null>(null);

  const getNodeLabel = useCallback((node: Node): string => {
    const data = node.data as DiagramNodeData;
    return data?.label || node.id;
  }, []);

  const getEdgeLabel = useCallback((edge: Edge): string => {
    if (edge.label) return String(edge.label);
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    const sourceLabel = sourceNode ? getNodeLabel(sourceNode) : edge.source;
    const targetLabel = targetNode ? getNodeLabel(targetNode) : edge.target;
    return `${sourceLabel} → ${targetLabel}`;
  }, [nodes, getNodeLabel]);

  // Display is reversed: top of list = front (last in array), bottom = back (first in array)
  // All drag/drop/move use real array indices internally.
  const reversedNodes = useMemo(() => [...nodes].reverse(), [nodes]);
  const reversedEdges = useMemo(() => [...edges].reverse(), [edges]);

  // Convert display index (in reversed list) to real array index
  const toRealNodeIndex = useCallback((displayIndex: number) => nodes.length - 1 - displayIndex, [nodes.length]);
  const toRealEdgeIndex = useCallback((displayIndex: number) => edges.length - 1 - displayIndex, [edges.length]);

  const handleNodeDragStart = useCallback((e: React.DragEvent, displayIndex: number) => {
    e.dataTransfer.setData(DRAG_TYPE, 'node');
    e.dataTransfer.effectAllowed = 'move';
    dragItemRef.current = { type: 'node', index: displayIndex };
  }, []);

  const handleEdgeDragStart = useCallback((e: React.DragEvent, displayIndex: number) => {
    e.dataTransfer.setData(DRAG_TYPE, 'edge');
    e.dataTransfer.effectAllowed = 'move';
    dragItemRef.current = { type: 'edge', index: displayIndex };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, type: 'node' | 'edge', displayIndex: number) => {
    if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex({ type, index: displayIndex });
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleNodeDrop = useCallback((e: React.DragEvent, dropDisplayIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const dragItem = dragItemRef.current;
    if (!dragItem || dragItem.type !== 'node') return;
    if (dragItem.index === dropDisplayIndex) return;

    const dragReal = toRealNodeIndex(dragItem.index);
    const dropReal = toRealNodeIndex(dropDisplayIndex);

    setNodes((nds) => {
      const updated = [...nds];
      const [moved] = updated.splice(dragReal, 1);
      updated.splice(dropReal, 0, moved);
      return sortNodesForSubFlow(updated);
    });
    dragItemRef.current = null;
  }, [setNodes, toRealNodeIndex]);

  const handleEdgeDrop = useCallback((e: React.DragEvent, dropDisplayIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const dragItem = dragItemRef.current;
    if (!dragItem || dragItem.type !== 'edge') return;
    if (dragItem.index === dropDisplayIndex) return;

    const dragReal = toRealEdgeIndex(dragItem.index);
    const dropReal = toRealEdgeIndex(dropDisplayIndex);

    setEdges((eds) => {
      const updated = [...eds];
      const [moved] = updated.splice(dragReal, 1);
      updated.splice(dropReal, 0, moved);
      return updated;
    });
    dragItemRef.current = null;
  }, [setEdges, toRealEdgeIndex]);

  const handleDragEnd = useCallback(() => {
    setDragOverIndex(null);
    dragItemRef.current = null;
  }, []);

  // Move up in list = bring to front = move toward end of real array (+1)
  // Move down in list = send to back = move toward start of real array (-1)
  const moveNodeInList = useCallback((displayIndex: number, listDirection: -1 | 1) => {
    const realIndex = toRealNodeIndex(displayIndex);
    // listDirection -1 = move up in list = +1 in array (bring forward)
    // listDirection +1 = move down in list = -1 in array (send backward)
    const arrayDirection = -listDirection as -1 | 1;
    setNodes((nds) => {
      const targetIndex = realIndex + arrayDirection;
      if (targetIndex < 0 || targetIndex >= nds.length) return nds;
      const updated = [...nds];
      [updated[realIndex], updated[targetIndex]] = [updated[targetIndex], updated[realIndex]];
      return sortNodesForSubFlow(updated);
    });
  }, [setNodes, toRealNodeIndex]);

  const moveEdgeInList = useCallback((displayIndex: number, listDirection: -1 | 1) => {
    const realIndex = toRealEdgeIndex(displayIndex);
    const arrayDirection = -listDirection as -1 | 1;
    setEdges((eds) => {
      const targetIndex = realIndex + arrayDirection;
      if (targetIndex < 0 || targetIndex >= eds.length) return eds;
      const updated = [...eds];
      [updated[realIndex], updated[targetIndex]] = [updated[targetIndex], updated[realIndex]];
      return updated;
    });
  }, [setEdges, toRealEdgeIndex]);

  const toggleNodeVisibility = useCallback((nodeId: string) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, hidden: !n.hidden } : n))
    );
    setEdges((eds) =>
      eds.map((e) => {
        if (e.source === nodeId || e.target === nodeId) {
          const sourceNode = nodes.find((n) => n.id === e.source);
          const targetNode = nodes.find((n) => n.id === e.target);
          const sourceHiding = e.source === nodeId ? !sourceNode?.hidden : sourceNode?.hidden;
          const targetHiding = e.target === nodeId ? !targetNode?.hidden : targetNode?.hidden;
          return { ...e, hidden: sourceHiding || targetHiding };
        }
        return e;
      })
    );
  }, [setNodes, setEdges, nodes]);

  const toggleEdgeVisibility = useCallback((edgeId: string) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === edgeId ? { ...e, hidden: !e.hidden } : e))
    );
  }, [setEdges]);

  const renderNodeIcon = useCallback((node: Node) => {
    const nodeType = (node.data as DiagramNodeData)?.nodeType || node.type;
    if (isCloudService(nodeType as NodeType)) {
      const iconSrc = cloudServiceIcons[nodeType as string];
      if (iconSrc) {
        return <img src={iconSrc} alt="" className="w-4 h-4" />;
      }
    }
    if (typeof nodeType === 'string' && nodeType.startsWith('shape-')) {
      return <div className="w-4 h-4 rounded-sm bg-muted-foreground/30" />;
    }
    return <NodeIcon type={nodeType as NodeType} className="!w-4 !h-4" />;
  }, []);

  const listContent = (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {/* Nodes section */}
        <div className="mb-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-1">
            Nodes ({nodes.length})
          </span>
        </div>
        {nodes.length === 0 && (
          <p className="text-xs text-muted-foreground px-1 py-2">No nodes</p>
        )}
        {reversedNodes.map((node, displayIndex) => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => handleNodeDragStart(e, displayIndex)}
            onDragOver={(e) => handleDragOver(e, 'node', displayIndex)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleNodeDrop(e, displayIndex)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-center gap-1 px-1 py-1 rounded-md group cursor-pointer hover:bg-secondary/60 transition-colors',
              dragOverIndex?.type === 'node' && dragOverIndex.index === displayIndex && 'border-t-2 border-primary',
              node.hidden && 'opacity-50'
            )}
            onClick={() => onSelectNode(node.id)}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground/50 cursor-grab shrink-0" />
            <span className="shrink-0">{renderNodeIcon(node)}</span>
            <span className="text-xs text-foreground truncate flex-1 min-w-0">
              {getNodeLabel(node)}
            </span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveNodeInList(displayIndex, -1); }}
                    className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                    disabled={displayIndex === 0}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">Bring forward</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveNodeInList(displayIndex, 1); }}
                    className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                    disabled={displayIndex === reversedNodes.length - 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">Send backward</TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleNodeVisibility(node.id); }}
                  className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
                >
                  {node.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                {node.hidden ? 'Show' : 'Hide'}
              </TooltipContent>
            </Tooltip>
          </div>
        ))}

        <Separator className="my-2" />

        {/* Edges section */}
        <div className="mb-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-1">
            Edges ({edges.length})
          </span>
        </div>
        {edges.length === 0 && (
          <p className="text-xs text-muted-foreground px-1 py-2">No edges</p>
        )}
        {reversedEdges.map((edge, displayIndex) => (
          <div
            key={edge.id}
            draggable
            onDragStart={(e) => handleEdgeDragStart(e, displayIndex)}
            onDragOver={(e) => handleDragOver(e, 'edge', displayIndex)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleEdgeDrop(e, displayIndex)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-center gap-1 px-1 py-1 rounded-md group cursor-pointer hover:bg-secondary/60 transition-colors',
              dragOverIndex?.type === 'edge' && dragOverIndex.index === displayIndex && 'border-t-2 border-primary',
              edge.hidden && 'opacity-50'
            )}
            onClick={() => onSelectEdge(edge.id)}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground/50 cursor-grab shrink-0" />
            <GitBranch className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-foreground truncate flex-1 min-w-0">
              {getEdgeLabel(edge)}
            </span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveEdgeInList(displayIndex, -1); }}
                    className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                    disabled={displayIndex === 0}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">Bring forward</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveEdgeInList(displayIndex, 1); }}
                    className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                    disabled={displayIndex === reversedEdges.length - 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">Send backward</TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleEdgeVisibility(edge.id); }}
                  className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
                >
                  {edge.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                {edge.hidden ? 'Show' : 'Hide'}
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  // Mobile: use Sheet overlay
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[280px] p-0 flex flex-col">
          <SheetHeader className="px-3 py-2 border-b border-border">
            <SheetTitle className="text-sm">Layers</SheetTitle>
          </SheetHeader>
          {listContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: right-side drawer that slides in/out
  return (
    <div
      className={cn(
        'w-[260px] bg-background border-l border-border h-full flex flex-col flex-shrink-0 transition-[width,opacity] duration-300 ease-in-out overflow-hidden',
        !open && 'w-0 opacity-0 border-l-0'
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Layers</span>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {listContent}
    </div>
  );
};
