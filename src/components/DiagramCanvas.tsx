
import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type ReactFlowInstance,
  BackgroundVariant,
  Panel,
  ConnectionMode,
  MarkerType,
  reconnectEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { type NodeType, type DiagramNodeData } from '../types/diagrams';
import { toBlob, toCanvas } from 'html-to-image';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import BaseNode from './nodes/BaseNode';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { CloudServicesPanel } from './CloudServicesPanel';
import { useUndoRedo } from '..//hooks/useUndoRedo';
import { useIsMobile, useIsTablet } from '../hooks/use-mobile';
import { toast } from 'sonner';
import { LayoutGrid } from 'lucide-react';

// Use the centralized type from types/diagrams
type NodeData = DiagramNodeData;

const cloudServiceTypes = new Set<string>([
  'gcp-cloud-run', 'gcp-cloud-storage', 'gcp-bigquery', 'gcp-pub-sub',
  'gcp-apigee', 'gcp-billing', 'gcp-cloud-build', 'gcp-cloud-monitoring',
  'gcp-cloud-sql', 'gcp-compute-engine', 'gcp-iam', 'gcp-kubernetes',
  'gcp-security', 'aws-ec2', 'aws-s3', 'aws-lambda', 'aws-rds',
  'azure-vm', 'azure-blob-storage', 'azure-functions', 'azure-sql-database',
]);

const getDefaultNodeStyle = (type: NodeType): { width: number; height: number } | undefined => {
  if (cloudServiceTypes.has(type)) return { width: 80, height: 90 };
  return undefined;
};

const defaultNodeLabels: Record<NodeType, string> = {
  service: 'Service',
  database: 'Database',
  server: 'Server',
  client: 'Client',
  storage: 'Storage',
  api: 'API Gateway',
  text: 'Label',
  group: 'Group',
  'process-requirements': 'Requirements',
  'process-design': 'Design',
  'process-development': 'Development',
  'process-testing': 'Testing',
  'process-deployment': 'Deployment',
  'process-monitoring': 'Monitoring',
  'gcp-cloud-run': 'Cloud Run',
  'gcp-cloud-storage': 'Cloud Storage',
  'gcp-bigquery': 'BigQuery',
  'gcp-pub-sub': 'Pub/Sub',
  'gcp-apigee': 'Apigee',
  'gcp-billing': 'Billing',
  'gcp-cloud-build': 'Cloud Build',
  'gcp-cloud-monitoring': 'Cloud Monitoring',
  'gcp-cloud-sql': 'Cloud SQL',
  'gcp-compute-engine': 'Compute Engine',
  'gcp-iam': 'IAM',
  'gcp-kubernetes': 'Kubernetes',
  'gcp-security': 'Security',
  'aws-ec2': 'EC2',
  'aws-s3': 'S3',
  'aws-lambda': 'Lambda',
  'aws-rds': 'RDS',
  'azure-vm': 'Virtual Machine',
  'azure-blob-storage': 'Blob Storage',
  'azure-functions': 'Functions',
  'azure-sql-database': 'SQL Database',
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

export const DiagramCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedTool, setSelectedTool] = useState<'select' | 'pan' | NodeType>('select');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState(false);

  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo();

  const nodeTypes = useMemo(() => ({
    service: BaseNode,
    database: BaseNode,
    server: BaseNode,
    client: BaseNode,
    storage: BaseNode,
    api: BaseNode,
    text: BaseNode,
    group: BaseNode,
    'process-requirements': BaseNode,
    'process-design': BaseNode,
    'process-development': BaseNode,
    'process-testing': BaseNode,
    'process-deployment': BaseNode,
    'process-monitoring': BaseNode,
    'gcp-cloud-run': BaseNode,
    'gcp-cloud-storage': BaseNode,
    'gcp-bigquery': BaseNode,
    'gcp-pub-sub': BaseNode,
    'gcp-apigee': BaseNode,
    'gcp-billing': BaseNode,
    'gcp-cloud-build': BaseNode,
    'gcp-cloud-monitoring': BaseNode,
    'gcp-cloud-sql': BaseNode,
    'gcp-compute-engine': BaseNode,
    'gcp-iam': BaseNode,
    'gcp-kubernetes': BaseNode,
    'gcp-security': BaseNode,
    'aws-ec2': BaseNode,
    'aws-s3': BaseNode,
    'aws-lambda': BaseNode,
    'aws-rds': BaseNode,
    'azure-vm': BaseNode,
    'azure-blob-storage': BaseNode,
    'azure-functions': BaseNode,
    'azure-sql-database': BaseNode,
  }), []);

  // Save initial state
  useEffect(() => {
    saveState(initialNodes, initialEdges);
  }, [saveState]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ 
      ...connection, 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.Arrow },
      reconnectable: true
    }, eds));
  }, [setEdges]);

  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNodes(nodes);
    setSelectedEdges(edges);
    
    // Update single selection state for properties panel
    if (nodes.length === 1) {
      setSelectedNode(nodes[0]);
    } else {
      setSelectedNode(null);
    }
    
    if (edges.length === 1) {
      setSelectedEdge(edges[0]);
    } else {
      setSelectedEdge(null);
    }
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Handle single click selection when not using multi-selection
    if (!event.metaKey && !event.ctrlKey) {
      setSelectedNodes([node]);
      setSelectedEdges([]);
      setSelectedNode(node);
      setSelectedEdge(null);
    }
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    // Handle single click selection when not using multi-selection
    if (!event.metaKey && !event.ctrlKey) {
      setSelectedNodes([]);
      setSelectedEdges([edge]);
      setSelectedNode(null);
      setSelectedEdge(edge);
    }
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setSelectedNodes([]);
    setSelectedEdges([]);
  }, []);

  const addNode = useCallback((type: NodeType) => {
    const defaultStyle = getDefaultNodeStyle(type);
    const newNode: Node = {
      id: uuidv4(),
      type,
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 100
      },
      data: {
        label: defaultNodeLabels[type],
        nodeType: type
      },
      ...(defaultStyle && { style: defaultStyle }),
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`Added ${defaultNodeLabels[type]} node`);
  }, [setNodes]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type || !reactFlowInstance || !reactFlowWrapper.current) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const defaultStyle = getDefaultNodeStyle(type);
      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: {
          label: defaultNodeLabels[type],
          nodeType: type
        },
        ...(defaultStyle && { style: defaultStyle }),
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDelete = useCallback(() => {
    const nodeIdsToDelete = selectedNodes.map((n: Node) => n.id);
    const edgeIdsToDelete = selectedEdges.map((e: Edge) => e.id);
    
    if (nodeIdsToDelete.length > 0 || edgeIdsToDelete.length > 0) {
      // Perform atomic updates to prevent race conditions
      setNodes((nds) => {
        const remainingNodes = nds.filter((n) => !nodeIdsToDelete.includes(n.id));
        
        // Update edges in the same callback to ensure consistency
        setEdges((eds) => eds.filter((e) => 
          !nodeIdsToDelete.includes(e.source) && 
          !nodeIdsToDelete.includes(e.target) &&
          !edgeIdsToDelete.includes(e.id)
        ));
        
        return remainingNodes;
      });
      
      // Clear selection state
      setSelectedNodes([]);
      setSelectedEdges([]);
      setSelectedNode(null);
      setSelectedEdge(null);
      
      const totalDeleted = nodeIdsToDelete.length + edgeIdsToDelete.length;
      toast.success(`${totalDeleted} item${totalDeleted !== 1 ? 's' : ''} deleted`);
    }
  }, [selectedNodes, selectedEdges, setNodes, setEdges]);

  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
      toast.info('Undo');
    }
  }, [undo, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
      toast.info('Redo');
    }
  }, [redo, setNodes, setEdges]);

  const handleNodeUpdate = useCallback((nodeId: string, data: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n))
    );
  }, [setNodes]);

  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    setEdges((eds) => {
      const reconnectedEdge = reconnectEdge(oldEdge, newConnection, eds);
      if (reconnectedEdge) {
        return Array.isArray(reconnectedEdge) ? reconnectedEdge : eds.map((edge) => 
          edge.id === oldEdge.id ? reconnectedEdge : edge
        );
      }
      return eds;
    });
    toast.success('Edge updated');
  }, [setEdges]);

  const handleEdgeUpdate = useCallback((edgeId: string, data: Partial<Edge>) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === edgeId ? { ...e, ...data } : e))
    );
  }, [setEdges]);

  const getExportElement = useCallback(() => {
    const wrapper = reactFlowWrapper.current;
    if (!wrapper) return null;

    const rendererEl = wrapper.querySelector('.react-flow__renderer') as HTMLElement | null;
    const reactFlowEl = wrapper.querySelector('.react-flow') as HTMLElement | null;
    return rendererEl ?? reactFlowEl ?? wrapper;
  }, []);

  const exportFilter = useCallback((node: HTMLElement) => {
    const el = node as unknown as HTMLElement;
    const classList = el.classList;
    if (!classList) return true;

    if (classList.contains('react-flow__minimap')) return false;
    if (classList.contains('react-flow__controls')) return false;
    if (classList.contains('react-flow__panel')) return false;
    if (classList.contains('react-flow__attribution')) return false;

    return true;
  }, []);

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);

  const withInlinedEdgeStrokeStyles = useCallback(async <T,>(root: HTMLElement, fn: () => Promise<T>): Promise<T> => {
    const edgePaths = root.querySelectorAll<SVGPathElement>('.react-flow__edge-path');
    const originals = Array.from(edgePaths).map((path) => ({
      path,
      strokeAttr: path.getAttribute('stroke'),
      strokeWidthAttr: path.getAttribute('stroke-width'),
      strokeDasharrayAttr: path.getAttribute('stroke-dasharray'),
      strokeDashoffsetAttr: path.getAttribute('stroke-dashoffset'),
      styleCssText: path.style.cssText,
    }));

    edgePaths.forEach((path) => {
      const cs = getComputedStyle(path);
      // Inline computed stroke values so exports don't lose stylesheet/CSS variable strokes.
      path.setAttribute('stroke', cs.stroke);
      path.setAttribute('stroke-width', cs.strokeWidth);
      // Preserve dashes if present (helps animated edges); don't touch dashoffset to keep animation.
      if (cs.strokeDasharray && cs.strokeDasharray !== 'none') {
        path.setAttribute('stroke-dasharray', cs.strokeDasharray);
      }
      if (cs.strokeDashoffset && cs.strokeDashoffset !== 'none') {
        path.setAttribute('stroke-dashoffset', cs.strokeDashoffset);
      }
      path.style.stroke = cs.stroke;
      path.style.strokeWidth = cs.strokeWidth;
      if (cs.strokeDasharray && cs.strokeDasharray !== 'none') {
        path.style.strokeDasharray = cs.strokeDasharray;
      }
      if (cs.strokeDashoffset && cs.strokeDashoffset !== 'none') {
        path.style.strokeDashoffset = cs.strokeDashoffset;
      }
    });

    try {
      return await fn();
    } finally {
      originals.forEach((o) => {
        if (o.strokeAttr === null) o.path.removeAttribute('stroke');
        else o.path.setAttribute('stroke', o.strokeAttr);

        if (o.strokeWidthAttr === null) o.path.removeAttribute('stroke-width');
        else o.path.setAttribute('stroke-width', o.strokeWidthAttr);

        if (o.strokeDasharrayAttr === null) o.path.removeAttribute('stroke-dasharray');
        else o.path.setAttribute('stroke-dasharray', o.strokeDasharrayAttr);

        if (o.strokeDashoffsetAttr === null) o.path.removeAttribute('stroke-dashoffset');
        else o.path.setAttribute('stroke-dashoffset', o.strokeDashoffsetAttr);

        o.path.style.cssText = o.styleCssText;
      });
    }
  }, []);

  const handleExport = useCallback((format: 'json' | 'png' | 'gif') => {
    if (format === 'json') {
      const data = { nodes, edges };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.json';
        a.click();
      } finally {
        URL.revokeObjectURL(url);
      }
      toast.success('Diagram exported');
      return;
    }

    if (format === 'png') {
      const el = getExportElement();
      if (!el) {
        toast.error('Export failed');
        return;
      }

      void (async () => {
        try {
          const backgroundColor = '#ffffff';
          const blob = await withInlinedEdgeStrokeStyles(el, () =>
            toBlob(el, {
              cacheBust: true,
              pixelRatio: window.devicePixelRatio || 2,
              backgroundColor,
              filter: exportFilter,
            }),
          );

          if (!blob) {
            toast.error('PNG export failed');
            return;
          }

          downloadBlob(blob, 'diagram.png');
          toast.success('Diagram exported');
        } catch (error) {
          console.error('PNG export error:', error);
          toast.error('PNG export failed');
        }
      })();
      return;
    }

    const el = getExportElement();
    if (!el) {
      toast.error('Export failed');
      return;
    }

    void (async () => {
      try {
        toast.info('Rendering GIF…');

        const fps = 10;
        const durationMs = 1500;
        const delay = Math.round(1000 / fps);
        const frameCount = Math.max(1, Math.round(durationMs / delay));

        const backgroundColor = '#ffffff';

        const downscaleCanvas = (src: HTMLCanvasElement, maxDimension: number) => {
          const scale = Math.min(1, maxDimension / src.width, maxDimension / src.height);
          if (scale >= 1) return src;

          const dst = document.createElement('canvas');
          dst.width = Math.max(1, Math.round(src.width * scale));
          dst.height = Math.max(1, Math.round(src.height * scale));
          const ctx = dst.getContext('2d');
          if (!ctx) return src;
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, dst.width, dst.height);
          ctx.drawImage(src, 0, 0, dst.width, dst.height);
          return dst;
        };

        const encoder = GIFEncoder();
        let palette: ReturnType<typeof quantize> | null = null;

        for (let i = 0; i < frameCount; i++) {
          const rawCanvas = await withInlinedEdgeStrokeStyles(el, () =>
            toCanvas(el, {
              cacheBust: true,
              pixelRatio: 1,
              backgroundColor,
              filter: exportFilter,
            }),
          );

          const canvas = downscaleCanvas(rawCanvas, 900);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            toast.error('GIF export failed');
            return;
          }

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (!palette) {
            palette = quantize(imageData.data, 256);
          }
          const index = applyPalette(imageData.data, palette);
          encoder.writeFrame(index, canvas.width, canvas.height, {
            palette,
            delay,
            repeat: 0,
          });
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        encoder.finish();
        const bytes = encoder.bytes();
        const bytesCopy = new Uint8Array(bytes);
        const blob = new Blob([bytesCopy], { type: 'image/gif' });
        downloadBlob(blob, 'diagram.gif');
        toast.success('Diagram exported');
      } catch (error) {
        console.error('GIF export error:', error);
        toast.error('GIF export failed');
      }
    })();
  }, [downloadBlob, edges, exportFilter, getExportElement, nodes, withInlinedEdgeStrokeStyles]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            if (!content || content.trim() === '') {
              toast.error('File is empty');
              return;
            }
            
            const parsed: unknown = JSON.parse(content);
            
            // Validate imported data structure
            if (!parsed || typeof parsed !== 'object') {
              toast.error('Invalid file format: expected JSON object');
              return;
            }

            const data = parsed as Record<string, unknown>;
            
            if (!Array.isArray(data.nodes)) {
              toast.error('Invalid file format: nodes array is required');
              return;
            }
            
            if (!Array.isArray(data.edges)) {
              toast.error('Invalid file format: edges array is required');
              return;
            }

            const isNodeType = (value: unknown): value is NodeType => {
              return (
                typeof value === 'string' &&
                Object.prototype.hasOwnProperty.call(defaultNodeLabels, value)
              );
            };

            const isImportedNode = (node: unknown): node is Node<NodeData> => {
              if (!node || typeof node !== 'object') return false;
              const n = node as Record<string, unknown>;
              if (typeof n.id !== 'string') return false;
              if (!n.position || typeof n.position !== 'object') return false;
              const pos = n.position as Record<string, unknown>;
              if (typeof pos.x !== 'number' || typeof pos.y !== 'number') return false;
              if (!n.data || typeof n.data !== 'object') return false;
              const d = n.data as Record<string, unknown>;
              if (typeof d.label !== 'string') return false;
              if (!isNodeType(d.nodeType)) return false;
              return true;
            };

            const isImportedEdge = (edge: unknown): edge is Edge => {
              if (!edge || typeof edge !== 'object') return false;
              const e = edge as Record<string, unknown>;
              return (
                typeof e.id === 'string' &&
                typeof e.source === 'string' &&
                typeof e.target === 'string'
              );
            };
            
            // Validate node structure
            if (!data.nodes.every(isImportedNode)) {
              toast.error('Invalid file format: nodes have invalid structure');
              return;
            }

            if (!data.edges.every(isImportedEdge)) {
              toast.error('Invalid file format: edges have invalid structure');
              return;
            }

            const importedNodes = data.nodes.filter(isImportedNode);
            const importedEdges = data.edges.filter(isImportedEdge);
            
            // Check for circular references in edges
            const hasCircularReference = (function detectCircular(nodeId: string, visited: Set<string>, path: Set<string>): boolean {
              if (path.has(nodeId)) return true;
              if (visited.has(nodeId)) return false;
              
              visited.add(nodeId);
              path.add(nodeId);
              
              const outgoingEdges = importedEdges.filter((edge) => edge.source === nodeId);
              for (const edge of outgoingEdges) {
                if (detectCircular(edge.target, visited, path)) {
                  return true;
                }
              }
              
              path.delete(nodeId);
              return false;
            });
            
            for (const node of importedNodes) {
              if (hasCircularReference(node.id, new Set(), new Set())) {
                toast.error('Invalid file format: circular references detected in edges');
                return;
              }
            }
            
            // Sanitize imported data
            const sanitizedNodes = importedNodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                label: String(node.data.label || '').slice(0, 100), // Limit length
                description: node.data.description ? String(node.data.description).slice(0, 500) : undefined
              }
            }));
            
            const sanitizedEdges = importedEdges.map((edge) => ({
              ...edge,
              id: String(edge.id),
              source: String(edge.source),
              target: String(edge.target)
            }));
            
            setNodes(sanitizedNodes);
            setEdges(sanitizedEdges);
            saveState(sanitizedNodes, sanitizedEdges);
            toast.success(`Diagram imported: ${sanitizedNodes.length} nodes, ${sanitizedEdges.length} edges`);
            
          } catch (error) {
            console.error('Import error:', error);
            if (error instanceof SyntaxError) {
              toast.error('Invalid JSON format');
            } else {
              toast.error('Failed to import file');
            }
          }
        };
        reader.onerror = () => {
          toast.error('Failed to read file');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges, saveState]);

  // Save state when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      saveState(nodes, edges);
    }
  }, [nodes, edges, saveState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDelete();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      // Only trigger single-key shortcuts when no modifier keys are pressed
      if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        if (e.key === 'v') setSelectedTool('select');
        if (e.key === 'h') setSelectedTool('pan');
        if (e.key === 'f' && reactFlowInstance) reactFlowInstance.fitView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDelete, handleUndo, handleRedo, reactFlowInstance, setSelectedTool]);

  // Auto-open properties sheet on mobile/tablet when a node or edge is selected
  useEffect(() => {
    if ((isMobile || isTablet) && (selectedNode || selectedEdge)) {
      setMobilePropertiesOpen(true);
    }
  }, [isMobile, isTablet, selectedNode, selectedEdge]);

  return (
    <div className="flex w-full h-screen bg-[hsl(var(--canvas-bg))]">
      {/* Desktop/Tablet: static sidebar. Mobile: Sheet overlay */}
      {!isMobile && (
        <CloudServicesPanel
          onServiceSelect={addNode}
          isMobile={false}
        />
      )}
      {isMobile && (
        <CloudServicesPanel
          onServiceSelect={addNode}
          isMobile={true}
          open={mobileServicesOpen}
          onOpenChange={setMobileServicesOpen}
        />
      )}

      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          onSelectionChange={onSelectionChange}
          multiSelectionKeyCode="Meta"
          deleteKeyCode="Delete"
          panOnDrag={selectedTool === 'pan'}
          selectionOnDrag={selectedTool === 'select'}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { strokeWidth: 2 },
            markerEnd: { type: MarkerType.Arrow },
            reconnectable: true,
          }}
          connectionLineStyle={{ strokeWidth: 2 }}
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="hsl(var(--canvas-grid))"
          />
          {!isMobile && (
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="!bottom-4 !right-4"
            />
          )}
          <Controls
            className="!bottom-4 !left-4"
            showInteractive={false}
          />

          <Panel position="bottom-center" className={isMobile ? "mb-16" : "mb-4"}>
            <div className="text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
              {nodes.length} nodes • {edges.length} edges
            </div>
          </Panel>
        </ReactFlow>

        {/* Mobile: FAB button to open services panel */}
        {isMobile && (
          <button
            onClick={() => setMobileServicesOpen(true)}
            className="fixed top-4 left-4 z-10 p-3 bg-primary text-primary-foreground rounded-full shadow-lg active:scale-95 transition-transform"
            aria-label="Open node panel"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        )}

        <Toolbar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          onAddNode={addNode}
          onDelete={handleDelete}
          onZoomIn={() => reactFlowInstance?.zoomIn()}
          onZoomOut={() => reactFlowInstance?.zoomOut()}
          onFitView={() => reactFlowInstance?.fitView()}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onExport={handleExport}
          onImport={handleImport}
          isMobile={isMobile}
        />

        <PropertiesPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onNodeUpdate={handleNodeUpdate}
          onEdgeUpdate={handleEdgeUpdate}
          onClose={() => {
            setSelectedNode(null);
            setSelectedEdge(null);
            setMobilePropertiesOpen(false);
          }}
          isMobile={isMobile || isTablet}
          open={mobilePropertiesOpen}
          onOpenChange={(open) => {
            setMobilePropertiesOpen(open);
            if (!open) {
              setSelectedNode(null);
              setSelectedEdge(null);
            }
          }}
        />
      </div>
    </div>
  );
};
