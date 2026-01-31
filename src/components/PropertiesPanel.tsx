
import { useState, useEffect } from 'react';
import { type Node, type Edge } from '@xyflow/react';
import { type NodeType } from '../types/diagrams';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Layers, GitBranch } from 'lucide-react';
import { cn } from '../lib/utils';

interface NodeData {
  label: string;
  description?: string;
  nodeType: NodeType;
}

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onNodeUpdate: (nodeId: string, data: Partial<NodeData>) => void;
  onEdgeUpdate: (edgeId: string, data: Partial<Edge>) => void;
  onClose: () => void;
}

export const PropertiesPanel = ({
  selectedNode,
  selectedEdge,
  onNodeUpdate,
  onEdgeUpdate,
  onClose,
}: PropertiesPanelProps) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [edgeType, setEdgeType] = useState('default');
  const [animated, setAnimated] = useState(false);

  const nodeData = selectedNode?.data as unknown as NodeData | undefined;

  useEffect(() => {
    if (nodeData) {
      setLabel(nodeData.label || '');
      setDescription(nodeData.description || '');
    }
  }, [nodeData]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeType(selectedEdge.type || 'default');
      setAnimated(selectedEdge.animated || false);
    }
  }, [selectedEdge]);

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { label: value });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { description: value });
    }
  };

  const handleEdgeTypeChange = (value: string) => {
    setEdgeType(value);
    if (selectedEdge) {
      onEdgeUpdate(selectedEdge.id, { type: value });
    }
  };

  const handleAnimatedChange = (value: boolean) => {
    setAnimated(value);
    if (selectedEdge) {
      onEdgeUpdate(selectedEdge.id, { animated: value });
    }
  };

  if (!selectedNode && !selectedEdge) return null;

  return (
    <div className="absolute right-4 top-4 w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
        <div className="flex items-center gap-2">
          {selectedNode ? (
            <Layers className="w-4 h-4 text-primary" />
          ) : (
            <GitBranch className="w-4 h-4 text-primary" />
          )}
          <span className="font-medium text-sm">
            {selectedNode ? 'Node Properties' : 'Edge Properties'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {selectedNode && nodeData && (
          <>
            <div className="space-y-2">
              <Label htmlFor="label" className="text-xs text-muted-foreground">
                Label
              </Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Node label"
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Optional description..."
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Type</Label>
              <div className="px-3 py-2 bg-secondary/50 rounded-lg text-sm capitalize">
                {nodeData.nodeType}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Position</Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="px-3 py-2 bg-secondary/50 rounded-lg">
                  X: {Math.round(selectedNode.position.x)}
                </div>
                <div className="px-3 py-2 bg-secondary/50 rounded-lg">
                  Y: {Math.round(selectedNode.position.y)}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedEdge && (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Edge Type</Label>
              <Select value={edgeType} onValueChange={handleEdgeTypeChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Bezier</SelectItem>
                  <SelectItem value="straight">Straight</SelectItem>
                  <SelectItem value="step">Step</SelectItem>
                  <SelectItem value="smoothstep">Smooth Step</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Animated</Label>
              <button
                onClick={() => handleAnimatedChange(!animated)}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  animated ? 'bg-primary' : 'bg-secondary'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    animated ? 'translate-x-5' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Connection</Label>
              <div className="text-xs text-muted-foreground px-3 py-2 bg-secondary/50 rounded-lg">
                {selectedEdge.source} → {selectedEdge.target}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
