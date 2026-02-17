
import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
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
import { decodeGif, getFrameAtTime, type DecodedGif } from '../utils/gif-frames';
import BaseNode from './nodes/BaseNode';
import ShapeNode from './nodes/ShapeNode';
import SubFlowNode from './nodes/SubFlowNode';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { CloudServicesPanel } from './CloudServicesPanel';
import { isCloudService } from './nodes/node-icons';
import { useUndoRedo } from '..//hooks/useUndoRedo';
import { useIsMobile, useIsTablet } from '../hooks/use-mobile';
import { toast } from 'sonner';
import { LayoutGrid, HelpCircle, Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { LayersPanel } from './LayersPanel';
import { sortNodesForSubFlow } from '../utils/sort-nodes';
import { cn } from '../lib/utils';

// Use the centralized type from types/diagrams
type NodeData = DiagramNodeData;

const getDefaultNodeStyle = (type: NodeType): { width: number; height: number } | undefined => {
  if (type === 'subflow') return { width: 400, height: 300 };
  if (type.startsWith('shape-')) return { width: 120, height: 120 };
  if (isCloudService(type)) return { width: 80, height: 90 };
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
  subflow: 'Sub Flow',
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
  'aws-eks': 'EKS',
  'aws-cloudwatch': 'CloudWatch',
  'aws-iam': 'IAM',
  'aws-api-gateway': 'API Gateway',
  'aws-codebuild': 'CodeBuild',
  'aws-codepipeline': 'CodePipeline',
  'aws-sqs': 'SQS',
  'aws-sns': 'SNS',
  'aws-dynamodb': 'DynamoDB',
  'aws-cloudfront': 'CloudFront',
  'aws-fargate': 'Fargate',
  'azure-vm': 'Virtual Machine',
  'azure-blob-storage': 'Blob Storage',
  'azure-functions': 'Functions',
  'azure-sql-database': 'SQL Database',
  'azure-aks': 'AKS',
  'azure-monitor': 'Monitor',
  'azure-entra-id': 'Entra ID',
  'azure-api-management': 'API Management',
  'azure-devops': 'DevOps',
  'azure-service-bus': 'Service Bus',
  'azure-event-grid': 'Event Grid',
  'azure-cosmos-db': 'Cosmos DB',
  'azure-container-apps': 'Container Apps',
  'azure-key-vault': 'Key Vault',
  'nosql-mongodb': 'MongoDB',
  'nosql-redis': 'Redis',
  'nosql-cassandra': 'Cassandra',
  'nosql-couchdb': 'CouchDB',
  'nosql-firebase': 'Firebase',
  'nosql-influxdb': 'InfluxDB',
  'nosql-rocksdb': 'RocksDB',
  'sql-mysql': 'MySQL',
  'sql-postgresql': 'PostgreSQL',
  'sql-sqlite': 'SQLite',
  'sql-oracle': 'Oracle',
  'sql-mssql': 'SQL Server',
  'sql-sqlalchemy': 'SQLAlchemy',
  'shape-circle': 'Circle',
  'shape-square': 'Square',
  'shape-star': 'Star',
  'shape-hexagon': 'Hexagon',
  'shape-round-rectangle': 'Round Rectangle',
  'shape-diamond': 'Diamond',
  'shape-arrow-rectangle': 'Arrow Rectangle',
  'shape-cylinder': 'Cylinder',
  'shape-parallelogram': 'Parallelogram',
  'shape-plus': 'Plus',
  'shape-triangle': 'Triangle',
  'animated-api': 'API',
  'animated-click': 'Click',
  'animated-cloud': 'Cloud',
  'animated-double-check': 'Double Check',
  'animated-loading-bubble': 'Loading Bubble',
  'animated-loading': 'Loading',
  'animated-rocket': 'Rocket',
  'animated-settings': 'Settings',
  'animated-target': 'Target',
  'animated-upload-cloud': 'Upload Cloud',
  'animated-upload': 'Upload',
  'animated-verified': 'Verified',
  'animated-worker': 'Worker',
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
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState(false);

  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [clipboard, setClipboard] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo();

  const nodeTypes = useMemo(() => ({
    service: BaseNode,
    database: BaseNode,
    server: BaseNode,
    client: BaseNode,
    storage: BaseNode,
    api: BaseNode,
    text: BaseNode,
    subflow: SubFlowNode,
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
    'aws-eks': BaseNode,
    'aws-cloudwatch': BaseNode,
    'aws-iam': BaseNode,
    'aws-api-gateway': BaseNode,
    'aws-codebuild': BaseNode,
    'aws-codepipeline': BaseNode,
    'aws-sqs': BaseNode,
    'aws-sns': BaseNode,
    'aws-dynamodb': BaseNode,
    'aws-cloudfront': BaseNode,
    'aws-fargate': BaseNode,
    'azure-vm': BaseNode,
    'azure-blob-storage': BaseNode,
    'azure-functions': BaseNode,
    'azure-sql-database': BaseNode,
    'azure-aks': BaseNode,
    'azure-monitor': BaseNode,
    'azure-entra-id': BaseNode,
    'azure-api-management': BaseNode,
    'azure-devops': BaseNode,
    'azure-service-bus': BaseNode,
    'azure-event-grid': BaseNode,
    'azure-cosmos-db': BaseNode,
    'azure-container-apps': BaseNode,
    'azure-key-vault': BaseNode,
    'nosql-mongodb': BaseNode,
    'nosql-redis': BaseNode,
    'nosql-cassandra': BaseNode,
    'nosql-couchdb': BaseNode,
    'nosql-firebase': BaseNode,
    'nosql-influxdb': BaseNode,
    'nosql-rocksdb': BaseNode,
    'sql-mysql': BaseNode,
    'sql-postgresql': BaseNode,
    'sql-sqlite': BaseNode,
    'sql-oracle': BaseNode,
    'sql-mssql': BaseNode,
    'sql-sqlalchemy': BaseNode,
    'shape-circle': ShapeNode,
    'shape-square': ShapeNode,
    'shape-star': ShapeNode,
    'shape-hexagon': ShapeNode,
    'shape-round-rectangle': ShapeNode,
    'shape-diamond': ShapeNode,
    'shape-arrow-rectangle': ShapeNode,
    'shape-cylinder': ShapeNode,
    'shape-parallelogram': ShapeNode,
    'shape-plus': ShapeNode,
    'shape-triangle': ShapeNode,
    'animated-api': BaseNode,
    'animated-click': BaseNode,
    'animated-cloud': BaseNode,
    'animated-double-check': BaseNode,
    'animated-loading-bubble': BaseNode,
    'animated-loading': BaseNode,
    'animated-rocket': BaseNode,
    'animated-settings': BaseNode,
    'animated-target': BaseNode,
    'animated-upload-cloud': BaseNode,
    'animated-upload': BaseNode,
    'animated-verified': BaseNode,
    'animated-worker': BaseNode,
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
    // Handle single click selection when not using multi-selection (no panel)
    if (!event.metaKey && !event.ctrlKey) {
      setSelectedNodes([node]);
      setSelectedEdges([]);
      setSelectedNode(node);
      setSelectedEdge(null);
    }
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    // Handle single click selection when not using multi-selection (no panel)
    if (!event.metaKey && !event.ctrlKey) {
      setSelectedNodes([]);
      setSelectedEdges([edge]);
      setSelectedNode(null);
      setSelectedEdge(edge);
    }
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setSelectedNode(node);
    setSelectedEdge(null);
    setContextMenuPos({ x: event.clientX, y: event.clientY });
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setSelectedEdge(edge);
    setSelectedNode(null);
    setContextMenuPos({ x: event.clientX, y: event.clientY });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setSelectedNodes([]);
    setSelectedEdges([]);
    setContextMenuPos(null);
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
    const directNodeIds = new Set(selectedNodes.map((n: Node) => n.id));
    const edgeIdsToDelete = selectedEdges.map((e: Edge) => e.id);

    if (directNodeIds.size > 0 || edgeIdsToDelete.length > 0) {
      // Perform atomic updates to prevent race conditions
      setNodes((nds) => {
        // Also delete children of any sub flow nodes being deleted
        const allNodeIdsToDelete = new Set(directNodeIds);
        for (const n of nds) {
          if (n.parentId && allNodeIdsToDelete.has(n.parentId)) {
            allNodeIdsToDelete.add(n.id);
          }
        }

        const remainingNodes = nds.filter((n) => !allNodeIdsToDelete.has(n.id));

        // Update edges in the same callback to ensure consistency
        setEdges((eds) => eds.filter((e) =>
          !allNodeIdsToDelete.has(e.source) &&
          !allNodeIdsToDelete.has(e.target) &&
          !edgeIdsToDelete.includes(e.id)
        ));

        return remainingNodes;
      });
      
      // Clear selection state
      setSelectedNodes([]);
      setSelectedEdges([]);
      setSelectedNode(null);
      setSelectedEdge(null);
      
      const totalDeleted = directNodeIds.size + edgeIdsToDelete.length;
      toast.success(`${totalDeleted} item${totalDeleted !== 1 ? 's' : ''} deleted`);
    }
  }, [selectedNodes, selectedEdges, setNodes, setEdges]);

  const handleCopy = useCallback(() => {
    if (selectedNodes.length === 0) return;
    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));

    // Also include children of selected sub flow nodes
    const allNodes = [...selectedNodes];
    for (const n of nodes) {
      if (n.parentId && selectedNodeIds.has(n.parentId) && !selectedNodeIds.has(n.id)) {
        allNodes.push(n);
        selectedNodeIds.add(n.id);
      }
    }

    const connectedEdges = edges.filter(
      (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    );
    setClipboard({
      nodes: structuredClone(allNodes),
      edges: structuredClone(connectedEdges),
    });
    toast.success(`Copied ${allNodes.length} node${allNodes.length !== 1 ? 's' : ''}`);
  }, [selectedNodes, nodes, edges]);

  const handleCut = useCallback(() => {
    if (selectedNodes.length === 0) return;
    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
    const connectedEdges = edges.filter(
      (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    );
    setClipboard({
      nodes: structuredClone(selectedNodes),
      edges: structuredClone(connectedEdges),
    });
    handleDelete();
    toast.success(`Cut ${selectedNodes.length} node${selectedNodes.length !== 1 ? 's' : ''}`);
  }, [selectedNodes, edges, handleDelete]);

  const handlePaste = useCallback(() => {
    if (!clipboard || clipboard.nodes.length === 0) return;
    const idMap = new Map<string, string>();
    clipboard.nodes.forEach((n) => idMap.set(n.id, uuidv4()));

    const newNodes = clipboard.nodes.map((n) => ({
      ...n,
      id: idMap.get(n.id)!,
      // Remap parentId for sub flow children
      ...(n.parentId && idMap.has(n.parentId)
        ? { parentId: idMap.get(n.parentId)! }
        : {}),
      // Only offset position for non-child nodes (children are relative to parent)
      position: n.parentId
        ? n.position
        : { x: n.position.x + 50, y: n.position.y + 50 },
      selected: !n.parentId, // only select top-level pasted nodes
    }));

    const newEdges = clipboard.edges.map((e) => ({
      ...e,
      id: uuidv4(),
      source: idMap.get(e.source)!,
      target: idMap.get(e.target)!,
    }));

    setNodes((nds) =>
      sortNodesForSubFlow(
        nds.map((n) => ({ ...n, selected: false })).concat(newNodes)
      )
    );
    setEdges((eds) => eds.concat(newEdges));
    toast.success(`Pasted ${newNodes.length} node${newNodes.length !== 1 ? 's' : ''}`);
  }, [clipboard, setNodes, setEdges]);

  const groupSelectedNodes = useCallback(() => {
    // Only group non-subflow nodes that aren't already parented
    const nodesToGroup = selectedNodes.filter(
      (n) => n.type !== 'subflow' && !n.parentId
    );
    if (nodesToGroup.length < 2) return;

    // Calculate bounding box with padding
    const padding = 40;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const node of nodesToGroup) {
      const w = (node.style?.width as number) || (node.measured?.width as number) || 150;
      const h = (node.style?.height as number) || (node.measured?.height as number) || 50;
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + w);
      maxY = Math.max(maxY, node.position.y + h);
    }

    const subFlowId = uuidv4();
    const subFlowX = minX - padding;
    const subFlowY = minY - padding - 30; // extra space for label
    const subFlowW = maxX - minX + padding * 2;
    const subFlowH = maxY - minY + padding * 2 + 30;

    const subFlowNode: Node = {
      id: subFlowId,
      type: 'subflow',
      position: { x: subFlowX, y: subFlowY },
      data: { label: 'Sub Flow', nodeType: 'subflow' as NodeType },
      style: { width: subFlowW, height: subFlowH },
    };

    const childIds = new Set(nodesToGroup.map((n) => n.id));

    setNodes((nds) => {
      const updated = nds.map((n) => {
        if (childIds.has(n.id)) {
          return {
            ...n,
            parentId: subFlowId,
            extent: 'parent' as const,
            position: {
              x: n.position.x - subFlowX,
              y: n.position.y - subFlowY,
            },
          };
        }
        return n;
      });
      return sortNodesForSubFlow([subFlowNode, ...updated]);
    });

    toast.success(`Grouped ${nodesToGroup.length} nodes`);
  }, [selectedNodes, setNodes]);

  const ungroupSelectedNodes = useCallback(() => {
    // Find selected sub flow nodes
    const subFlowNodes = selectedNodes.filter((n) => n.type === 'subflow');
    if (subFlowNodes.length === 0) return;

    const subFlowIds = new Set(subFlowNodes.map((n) => n.id));

    setNodes((nds) => {
      // Build a map of subflow positions
      const subFlowPositions = new Map<string, { x: number; y: number }>();
      for (const n of nds) {
        if (subFlowIds.has(n.id)) {
          subFlowPositions.set(n.id, n.position);
        }
      }

      const updated = nds
        .filter((n) => !subFlowIds.has(n.id)) // remove sub flow nodes
        .map((n) => {
          if (n.parentId && subFlowIds.has(n.parentId)) {
            const parentPos = subFlowPositions.get(n.parentId)!;
            return {
              ...n,
              parentId: undefined,
              extent: undefined,
              position: {
                x: n.position.x + parentPos.x,
                y: n.position.y + parentPos.y,
              },
            };
          }
          return n;
        });

      return sortNodesForSubFlow(updated);
    });

    toast.success(`Ungrouped ${subFlowNodes.length} sub flow(s)`);
  }, [selectedNodes, setNodes]);

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

  const onNodeDragStop = useCallback((_event: React.MouseEvent, draggedNode: Node) => {
    // Don't re-parent sub flow nodes or nodes that are already children
    if (draggedNode.type === 'subflow' || draggedNode.parentId) return;

    setNodes((nds) => {
      // Find sub flow nodes that the dragged node overlaps with
      const subFlowNodes = nds.filter((n) => n.type === 'subflow' && n.id !== draggedNode.id);

      for (const sf of subFlowNodes) {
        const sfW = (sf.style?.width as number) || 400;
        const sfH = (sf.style?.height as number) || 300;

        if (
          draggedNode.position.x >= sf.position.x &&
          draggedNode.position.y >= sf.position.y &&
          draggedNode.position.x <= sf.position.x + sfW &&
          draggedNode.position.y <= sf.position.y + sfH
        ) {
          // Re-parent: convert position to relative
          const updated = nds.map((n) => {
            if (n.id === draggedNode.id) {
              return {
                ...n,
                parentId: sf.id,
                extent: 'parent' as const,
                position: {
                  x: n.position.x - sf.position.x,
                  y: n.position.y - sf.position.y,
                },
              };
            }
            return n;
          });
          toast.success('Node added to sub flow');
          return sortNodesForSubFlow(updated);
        }
      }
      return nds;
    });
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

    // Deselect all nodes and edges, then fit view
    flushSync(() => {
      setNodes((nds) => nds.map((n) => (n.selected ? { ...n, selected: false } : n)));
      setEdges((eds) => eds.map((e) => (e.selected ? { ...e, selected: false } : e)));
    });

    // Fit view instantly (no animation)
    reactFlowInstance?.fitView({ duration: 0 });

    // Wait for deselection and fitView to fully settle before capturing
    const waitForSettle = () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 300);
          });
        });
      });

    void (async () => {
      await waitForSettle();

      if (format === 'png') {
        const el = getExportElement();
        if (!el) {
          toast.error('Export failed');
          return;
        }

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
        return;
      }

      const el = getExportElement();
      if (!el) {
        toast.error('Export failed');
        return;
      }

      try {
        toast.info('Rendering GIF…');

        const fps = 10;
        const durationMs = 3000;
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

        // Pre-decode all animated GIF images in the export area
        const gifImgs = Array.from(el.querySelectorAll('img'))
          .filter((img) => img.src && /\.gif(\?|$)/i.test(img.src));

        const decodedGifs = new Map<HTMLImageElement, DecodedGif>();
        const originalSrcs = new Map<HTMLImageElement, string>();

        for (const img of gifImgs) {
          try {
            const decoded = await decodeGif(img.src);
            if (decoded.frames.length > 1) {
              decodedGifs.set(img, decoded);
              originalSrcs.set(img, img.src);
            }
          } catch {
            // Skip images that fail to decode
          }
        }

        const encoder = GIFEncoder();
        let palette: ReturnType<typeof quantize> | null = null;

        for (let i = 0; i < frameCount; i++) {
          const timeMs = i * delay;

          // Swap animated GIF images to the correct frame
          for (const [img, gif] of decodedGifs) {
            const frameIdx = getFrameAtTime(gif, timeMs);
            img.src = gif.frames[frameIdx].dataUrl;
          }

          // Small delay to let the browser render the swapped images
          await new Promise((resolve) => setTimeout(resolve, 20));

          const rawCanvas = await withInlinedEdgeStrokeStyles(el, () =>
            toCanvas(el, {
              cacheBust: false,
              pixelRatio: 1,
              backgroundColor,
              filter: exportFilter,
            }),
          );

          const canvas = downscaleCanvas(rawCanvas, 900);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            toast.error('GIF export failed');
            for (const [img, src] of originalSrcs) img.src = src;
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
        }

        // Restore original GIF sources
        for (const [img, src] of originalSrcs) img.src = src;

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
  }, [downloadBlob, edges, exportFilter, getExportElement, nodes, reactFlowInstance, setEdges, setNodes, withInlinedEdgeStrokeStyles]);

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
            
            setNodes(sortNodesForSubFlow(sanitizedNodes));
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        handleCopy();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'x') {
        handleCut();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        handlePaste();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          ungroupSelectedNodes();
        } else {
          groupSelectedNodes();
        }
      }
      // Only trigger single-key shortcuts when no modifier keys are pressed
      if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        if (e.key === 'v') setSelectedTool('select');
        if (e.key === 'h') setSelectedTool('pan');
        if (e.key === 'f' && reactFlowInstance) reactFlowInstance.fitView();
        if (e.key === 'l') setLayersPanelOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDelete, handleUndo, handleRedo, handleCopy, handleCut, handlePaste, groupSelectedNodes, ungroupSelectedNodes, reactFlowInstance, setSelectedTool]);

  // Auto-open properties sheet on mobile/tablet when a node or edge is selected
  useEffect(() => {
    if ((isMobile || isTablet) && (selectedNode || selectedEdge)) {
      setMobilePropertiesOpen(true);
    }
  }, [isMobile, isTablet, selectedNode, selectedEdge]);

  const handleLayerSelectNode = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    setSelectedNode(node);
    setSelectedEdge(null);
    setSelectedNodes([node]);
    setSelectedEdges([]);
    // Select the node on the canvas
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === nodeId })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: false })));
    // Fit view to the node
    reactFlowInstance?.fitView({ nodes: [{ id: nodeId }], duration: 800, padding: 0.5 });
    // Highlight pulse
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    setHighlightedNodeId(nodeId);
    highlightTimeoutRef.current = setTimeout(() => setHighlightedNodeId(null), 1500);
  }, [nodes, setNodes, setEdges, reactFlowInstance]);

  const handleLayerSelectEdge = useCallback((edgeId: string) => {
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;
    setSelectedEdge(edge);
    setSelectedNode(null);
    setSelectedNodes([]);
    setSelectedEdges([edge]);
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: e.id === edgeId })));
  }, [edges, setNodes, setEdges]);

  // Inject highlight class on the highlighted node
  const nodesWithHighlight = useMemo(() => {
    if (!highlightedNodeId) return nodes;
    return nodes.map((n) =>
      n.id === highlightedNodeId
        ? { ...n, className: cn(n.className, 'node-highlight-pulse') }
        : n
    );
  }, [nodes, highlightedNodeId]);

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
          nodes={nodesWithHighlight}
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
          onNodeDragStop={onNodeDragStop}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
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
          onGroupSelection={groupSelectedNodes}
          canGroup={selectedNodes.filter((n) => n.type !== 'subflow' && !n.parentId).length >= 2}
          isMobile={isMobile}
        />

        {/* Guide button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="/guide"
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-toolbar-bg border border-border shadow-lg backdrop-blur-xl text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="How to use"
            >
              <HelpCircle className="w-4 h-4" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="left">How to Use</TooltipContent>
        </Tooltip>

        {/* Layers toggle button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setLayersPanelOpen((prev) => !prev)}
              className={cn(
                'absolute top-4 right-14 z-10 p-2 rounded-xl bg-toolbar-bg border border-border shadow-lg backdrop-blur-xl text-muted-foreground hover:text-primary transition-colors duration-200',
                layersPanelOpen && 'text-primary'
              )}
              aria-label="Toggle layers panel"
            >
              <Layers className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Layers (L)</TooltipContent>
        </Tooltip>

        <PropertiesPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onNodeUpdate={handleNodeUpdate}
          onEdgeUpdate={handleEdgeUpdate}
          onClose={() => {
            setSelectedNode(null);
            setSelectedEdge(null);
            setContextMenuPos(null);
            setMobilePropertiesOpen(false);
          }}
          position={contextMenuPos}
          isMobile={isMobile || isTablet}
          open={mobilePropertiesOpen}
          onOpenChange={(open) => {
            setMobilePropertiesOpen(open);
            if (!open) {
              setSelectedNode(null);
              setSelectedEdge(null);
              setContextMenuPos(null);
            }
          }}
        />
      </div>

      {/* Right-side layers drawer */}
      {!isMobile && (
        <LayersPanel
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onSelectNode={handleLayerSelectNode}
          onSelectEdge={handleLayerSelectEdge}
          isMobile={false}
          open={layersPanelOpen}
          onOpenChange={setLayersPanelOpen}
        />
      )}
      {(isMobile || isTablet) && (
        <LayersPanel
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onSelectNode={handleLayerSelectNode}
          onSelectEdge={handleLayerSelectEdge}
          isMobile={true}
          open={layersPanelOpen}
          onOpenChange={setLayersPanelOpen}
        />
      )}
    </div>
  );
};
