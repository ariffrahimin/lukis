
import { useState, useEffect } from 'react';
import { type Node, type Edge, MarkerType as ReactFlowMarkerType } from '@xyflow/react';
import { type DiagramNodeData, type NodeType, type MarkerType } from '../types/diagrams';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { X, Layers, GitBranch } from 'lucide-react';
import { cn } from '../lib/utils';
import { isCloudService } from './nodes/node-icons';
import { nodeTypeStyles } from './nodes/node-styles';

// Use the centralized type from types/diagrams
type NodeData = DiagramNodeData;

// All valid node types derived from the centralized styles map
const validNodeTypes = new Set<string>(Object.keys(nodeTypeStyles));

// Type guard function to safely cast node data
const isValidNodeData = (data: unknown): data is NodeData => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    'label' in obj &&
    typeof obj.label === 'string' &&
    'nodeType' in obj &&
    typeof obj.nodeType === 'string' &&
    validNodeTypes.has(obj.nodeType)
  );
};

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onNodeUpdate: (nodeId: string, data: Partial<NodeData>) => void;
  onEdgeUpdate: (edgeId: string, data: Partial<Edge>) => void;
  onClose: () => void;
  position?: { x: number; y: number } | null;
  isMobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PropertiesPanel = ({
  selectedNode,
  selectedEdge,
  onNodeUpdate,
  onEdgeUpdate,
  onClose,
  position = null,
  isMobile = false,
  open = false,
  onOpenChange,
}: PropertiesPanelProps) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [edgeType, setEdgeType] = useState('default');
  const [markerStart, setMarkerStart] = useState<MarkerType>('none');
  const [markerEnd, setMarkerEnd] = useState<MarkerType>('arrow');
  const [animated, setAnimated] = useState(false);

  // Cloud service specific states
  const [environment, setEnvironment] = useState('');

  // Shape node specific states
  const [shapeColor, setShapeColor] = useState('');
  const [shapeOpacity, setShapeOpacity] = useState(0.15);

  const nodeData = selectedNode?.data && isValidNodeData(selectedNode.data) ? selectedNode.data : undefined;
  const isCloudServiceNode = nodeData?.nodeType ? isCloudService(nodeData.nodeType as NodeType) : false;
  const isShapeNode = nodeData?.nodeType?.startsWith('shape-') ?? false;

  useEffect(() => {
    if (nodeData) {
      setLabel(nodeData.label || '');
      setDescription(nodeData.description || '');
      setEnvironment(nodeData.environment || '');
      setShapeColor((nodeData.shapeColor as string) || '');
      setShapeOpacity(typeof nodeData.shapeOpacity === 'number' ? nodeData.shapeOpacity : 0.15);
    }
  }, [nodeData]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeType(selectedEdge.type || 'default');
      setMarkerStart((selectedEdge.markerStart as any)?.type || 'none');
      setMarkerEnd((selectedEdge.markerEnd as any)?.type || 'arrow');
      setAnimated(selectedEdge.animated || false);
    }
  }, [selectedEdge]);

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (selectedNode && isValidNodeData(selectedNode.data)) {
      onNodeUpdate(selectedNode.id, { label: value });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (selectedNode && isValidNodeData(selectedNode.data)) {
      onNodeUpdate(selectedNode.id, { description: value });
    }
  };

  const handleShapeColorChange = (value: string) => {
    setShapeColor(value);
    if (selectedNode && isValidNodeData(selectedNode.data)) {
      onNodeUpdate(selectedNode.id, { shapeColor: value });
    }
  };

  const handleShapeOpacityChange = (value: number) => {
    setShapeOpacity(value);
    if (selectedNode && isValidNodeData(selectedNode.data)) {
      onNodeUpdate(selectedNode.id, { shapeOpacity: value });
    }
  };

  const handleEnvironmentChange = (value: string) => {
    setEnvironment(value);
    if (selectedNode && isValidNodeData(selectedNode.data)) {
      onNodeUpdate(selectedNode.id, { environment: value as any });
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

  const handleMarkerStartChange = (value: MarkerType) => {
    setMarkerStart(value);
    if (selectedEdge) {
      onEdgeUpdate(selectedEdge.id, { 
        markerStart: value === 'none' ? undefined : { type: value as ReactFlowMarkerType } 
      });
    }
  };

  const handleMarkerEndChange = (value: MarkerType) => {
    setMarkerEnd(value);
    if (selectedEdge) {
      onEdgeUpdate(selectedEdge.id, { 
        markerEnd: value === 'none' ? undefined : { type: value as ReactFlowMarkerType } 
      });
    }
  };

  const hasSelection = selectedNode || selectedEdge;

  // Shared content for both mobile sheet and desktop popover
  const renderFields = () => (
    <>
      {selectedNode && nodeData && (
        <>
          <div className="space-y-1">
            <Label htmlFor="label" className="text-xs text-muted-foreground">
              Label
            </Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Node label"
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Optional description..."
              className="min-h-[60px] resize-none text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <div className="px-2 py-1.5 bg-secondary/50 rounded text-xs capitalize">
              {nodeData.nodeType.replace(/-/g, ' ')}
            </div>
          </div>

          {isShapeNode && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Color</Label>
                <div className="relative">
                  <button
                    onClick={() => {
                      const input = document.getElementById('shape-color-input') as HTMLInputElement;
                      input?.click();
                    }}
                    className="flex items-center gap-2 w-full h-8 px-2 rounded border border-border bg-secondary/50 text-sm hover:bg-secondary transition-colors"
                  >
                    <div
                      className="w-5 h-5 rounded border border-border shrink-0"
                      style={{ backgroundColor: shapeColor || '#3b82f6' }}
                    />
                    <span className="text-xs text-muted-foreground uppercase">
                      {shapeColor || 'Default'}
                    </span>
                  </button>
                  <input
                    id="shape-color-input"
                    type="color"
                    value={shapeColor || '#3b82f6'}
                    onChange={(e) => handleShapeColorChange(e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Opacity — {Math.round(shapeOpacity * 100)}%
                </Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={shapeOpacity}
                  onChange={(e) => handleShapeOpacityChange(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-secondary"
                />
              </div>
            </>
          )}

          {isCloudServiceNode && (
              <div className="space-y-1">
                <Label htmlFor="environment" className="text-xs text-muted-foreground">
                  Environment
                </Label>
                <Select value={environment} onValueChange={handleEnvironmentChange}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          )}
        </>
      )}

      {selectedEdge && (
        <>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Edge Type</Label>
            <Select value={edgeType} onValueChange={handleEdgeTypeChange}>
              <SelectTrigger className="h-8 text-sm">
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

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Start Marker</Label>
            <Select value={markerStart} onValueChange={handleMarkerStartChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="arrow">Arrow</SelectItem>
                <SelectItem value="arrowclosed">Arrow Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">End Marker</Label>
            <Select value={markerEnd} onValueChange={handleMarkerEndChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="arrow">Arrow</SelectItem>
                <SelectItem value="arrowclosed">Arrow Closed</SelectItem>
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
        </>
      )}
    </>
  );

  // Mobile/Tablet: render inside a Sheet overlay
  if (isMobile) {
    return (
      <Sheet open={open && !!hasSelection} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[300px] p-0 overflow-y-auto">
          <SheetHeader className="px-4 py-3 bg-secondary/50 border-b border-border">
            <SheetTitle className="flex items-center gap-2 text-sm">
              {selectedNode ? (
                <><Layers className="w-4 h-4 text-primary" /> Node Properties</>
              ) : (
                <><GitBranch className="w-4 h-4 text-primary" /> Edge Properties</>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-4">
            {renderFields()}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: compact floating popover near cursor
  if (!hasSelection || !position) return null;

  // Clamp position so panel doesn't overflow viewport
  const panelWidth = 224;
  const panelHeight = 400; // estimated max height
  const margin = 8;
  const clampedX = Math.min(position.x, window.innerWidth - panelWidth - margin);
  const clampedY = Math.min(position.y, window.innerHeight - panelHeight - margin);

  return (
    <div
      className="fixed w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
      style={{ left: clampedX, top: clampedY }}
    >
      {/* Compact header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          {selectedNode ? (
            <Layers className="w-3.5 h-3.5 text-primary" />
          ) : (
            <GitBranch className="w-3.5 h-3.5 text-primary" />
          )}
          <span className="font-medium text-xs">
            {selectedNode ? 'Node' : 'Edge'} Properties
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-0.5 hover:bg-secondary rounded transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <div className="p-3 space-y-2">
        {renderFields()}
      </div>
    </div>
  );
};
