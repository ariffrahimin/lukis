
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { type NodeType } from '../types/diagrams';
import BaseNode from './nodes/BaseNode';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { useUndoRedo } from '..//hooks/useUndoRedo';
import { toast } from 'sonner';

interface NodeData {
  label: string;
  description?: string;
  nodeType: NodeType;
  [key: string]: unknown;
}

const defaultNodeLabels: Record<NodeType, string> = {
  service: 'Service',
  database: 'Database',
  server: 'Server',
  client: 'Client',
  storage: 'Storage',
  api: 'API Gateway',
  text: 'Label',
  group: 'Group',
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'client',
    position: { x: 100, y: 200 },
    data: { label: 'Web App', nodeType: 'client', description: 'React Frontend' },
  },
  {
    id: '2',
    type: 'api',
    position: { x: 350, y: 200 },
    data: { label: 'API Gateway', nodeType: 'api', description: 'REST API' },
  },
  {
    id: '3',
    type: 'service',
    position: { x: 600, y: 100 },
    data: { label: 'Auth Service', nodeType: 'service', description: 'JWT Auth' },
  },
  {
    id: '4',
    type: 'service',
    position: { x: 600, y: 300 },
    data: { label: 'User Service', nodeType: 'service' },
  },
  {
    id: '5',
    type: 'database',
    position: { x: 850, y: 200 },
    data: { label: 'PostgreSQL', nodeType: 'database', description: 'Primary DB' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
];

export const DiagramCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedTool, setSelectedTool] = useState<'select' | 'pan' | NodeType>('select');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

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
  }), []);

  // Save initial state
  useEffect(() => {
    saveState(nodes, edges);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, type: 'smoothstep' }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const addNode = useCallback((type: NodeType) => {
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

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: {
          label: defaultNodeLabels[type],
          nodeType: type
        },
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
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
      toast.success('Node deleted');
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      setSelectedEdge(null);
      toast.success('Edge deleted');
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges]);

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

  const handleEdgeUpdate = useCallback((edgeId: string, data: Partial<Edge>) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === edgeId ? { ...e, ...data } : e))
    );
  }, [setEdges]);

  const handleExport = useCallback(() => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Diagram exported');
  }, [nodes, edges]);

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
            
            const data = JSON.parse(content);
            
            // Validate imported data structure
            if (!data || typeof data !== 'object') {
              toast.error('Invalid file format: expected JSON object');
              return;
            }
            
            if (!Array.isArray(data.nodes)) {
              toast.error('Invalid file format: nodes array is required');
              return;
            }
            
            if (!Array.isArray(data.edges)) {
              toast.error('Invalid file format: edges array is required');
              return;
            }
            
            // Validate node structure
            const validNodes = data.nodes.every((node: any) => {
              return node && typeof node === 'object' && 
                     typeof node.id === 'string' && 
                     typeof node.position === 'object' &&
                     typeof node.data === 'object';
            });
            
            if (!validNodes) {
              toast.error('Invalid file format: nodes have invalid structure');
              return;
            }
            
            // Validate edge structure
            const validEdges = data.edges.every((edge: any) => {
              return edge && typeof edge === 'object' && 
                     typeof edge.id === 'string' && 
                     typeof edge.source === 'string' &&
                     typeof edge.target === 'string';
            });
            
            if (!validEdges) {
              toast.error('Invalid file format: edges have invalid structure');
              return;
            }
            
            setNodes(data.nodes);
            setEdges(data.edges);
            saveState(data.nodes, data.edges);
            toast.success(`Diagram imported: ${data.nodes.length} nodes, ${data.edges.length} edges`);
            
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
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          handleDelete();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if (e.key === 'v') setSelectedTool('select');
      if (e.key === 'h') setSelectedTool('pan');
      if (e.key === 'f' && reactFlowInstance) reactFlowInstance.fitView();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDelete, handleUndo, handleRedo, reactFlowInstance, setSelectedTool]);

  return (
    <div ref={reactFlowWrapper} className="w-full h-screen bg-[hsl(var(--canvas-bg))]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={selectedTool === 'pan'}
        selectionOnDrag={selectedTool === 'select'}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
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
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bottom-4 !right-4"
        />
        <Controls
          className="!bottom-4 !left-4"
          showInteractive={false}
        />

        <Panel position="bottom-center" className="mb-4">
          <div className="text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
            {nodes.length} nodes • {edges.length} edges
          </div>
        </Panel>
      </ReactFlow>

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
      />

      <PropertiesPanel
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onNodeUpdate={handleNodeUpdate}
        onEdgeUpdate={handleEdgeUpdate}
        onClose={() => {
          setSelectedNode(null);
          setSelectedEdge(null);
        }}
      />
    </div>
  );
};
