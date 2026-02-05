
import { useState, useEffect } from 'react';
import { type Node, type Edge, MarkerType as ReactFlowMarkerType } from '@xyflow/react';
import { type DiagramNodeData, type MarkerType } from '../types/diagrams';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Layers, GitBranch } from 'lucide-react';
import { cn } from '../lib/utils';

// Use the centralized type from types/diagrams
type NodeData = DiagramNodeData;

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
    ['service', 'database', 'server', 'client', 'storage', 'api', 'text', 'group', 
     'process-requirements', 'process-design', 'process-development', 'process-testing', 'process-deployment', 'process-monitoring',
     'gcp-cloud-run', 'gcp-cloud-storage', 'gcp-bigquery', 'gcp-pub-sub','gcp-apigee','gcp-billing','gcp-cloud-build','gcp-cloud-monitoring','gcp-compute-engine','gcp-iam','gcp-kubernetes','gcp-security','gcp-cloud-sql',
     'aws-ec2', 'aws-s3', 'aws-lambda', 'aws-rds',
     'azure-vm', 'azure-blob-storage', 'azure-functions', 'azure-sql-database'].includes(obj.nodeType)
  );
};

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
  const [markerStart, setMarkerStart] = useState<MarkerType>('none');
  const [markerEnd, setMarkerEnd] = useState<MarkerType>('arrow');
  const [animated, setAnimated] = useState(false);

  // Cloud service specific states
  const [region, setRegion] = useState('');
  const [instanceType, setInstanceType] = useState('');
  const [environment, setEnvironment] = useState('');

  const nodeData = selectedNode?.data && isValidNodeData(selectedNode.data) ? selectedNode.data : undefined;
  const isCloudService = nodeData?.nodeType && [
    'gcp-cloud-run', 'gcp-cloud-storage', 'gcp-bigquery', 'gcp-pub-sub','gcp-apigee','gcp-billing','gcp-cloud-build','gcp-cloud-monitoring','gcp-compute-engine','gcp-iam','gcp-kubernetes','gcp-security','gcp-cloud-sql',
    'aws-ec2', 'aws-s3', 'aws-lambda', 'aws-rds',
    'azure-vm', 'azure-blob-storage', 'azure-functions', 'azure-sql-database'
  ].includes(nodeData.nodeType);

  useEffect(() => {
    if (nodeData) {
      setLabel(nodeData.label || '');
      setDescription(nodeData.description || '');
      setRegion(nodeData.region || '');
      setInstanceType(nodeData.instanceType || '');
      setEnvironment(nodeData.environment || '');
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

  const handleRegionChange = (value: string) => {
    setRegion(value);
    if (selectedNode && isValidNodeData(selectedNode.data)) {
      onNodeUpdate(selectedNode.id, { region: value });
    }
  };

  const handleInstanceTypeChange = (value: string) => {
    setInstanceType(value);
    if (selectedNode && isValidNodeData(selectedNode.data)) {
      onNodeUpdate(selectedNode.id, { instanceType: value });
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
                {nodeData.nodeType.replace(/-/g, ' ')}
              </div>
            </div>

            {/* Cloud Service Specific Properties */}
            {isCloudService && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-xs text-muted-foreground">
                    Region
                  </Label>
                  <Input
                    id="region"
                    value={region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    placeholder="us-west-2, europe-west1, etc."
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instance-type" className="text-xs text-muted-foreground">
                    Instance Type
                  </Label>
                  <Input
                    id="instance-type"
                    value={instanceType}
                    onChange={(e) => handleInstanceTypeChange(e.target.value)}
                    placeholder="t3.micro, n1-standard-1, etc."
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment" className="text-xs text-muted-foreground">
                    Environment
                  </Label>
                  <Select value={environment} onValueChange={handleEnvironmentChange}>
                    <SelectTrigger className="h-9">
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
              </>
            )}

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

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Start Marker</Label>
              <Select value={markerStart} onValueChange={handleMarkerStartChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="arrow">Arrow</SelectItem>
                  <SelectItem value="arrowclosed">Arrow Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">End Marker</Label>
              <Select value={markerEnd} onValueChange={handleMarkerEndChange}>
                <SelectTrigger className="h-9">
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
      </div>
    </div>
  );
};
