import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act, fireEvent } from "@testing-library/react";
import type { Node, Edge, Connection } from "@xyflow/react";

// vi.hoisted runs before mock hoisting, so these are available in vi.mock factories
const { mockToast, incrementUuidCounter, resetUuidCounter } = vi.hoisted(() => {
  let counter = 0;
  return {
    mockToast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
    incrementUuidCounter: () => ++counter,
    resetUuidCounter: () => { counter = 0; },
  };
});

vi.mock("uuid", () => ({
  v4: () => `uuid-${incrementUuidCounter()}`,
}));

vi.mock("sonner", () => ({ toast: mockToast }));

// Mock heavy dependencies
vi.mock("html-to-image", () => ({ toBlob: vi.fn(), toCanvas: vi.fn() }));
vi.mock("gifenc", () => ({ GIFEncoder: vi.fn(), quantize: vi.fn(), applyPalette: vi.fn() }));
vi.mock("../../utils/gif-frames", () => ({ decodeGif: vi.fn(), getFrameAtTime: vi.fn() }));

// Mock the node-icons module directly to avoid mocking 60+ individual SVG/GIF imports
vi.mock("../nodes/node-icons", () => {
  const icons: Record<string, string> = {};
  const prefixes = [
    "gcp-cloud-run", "gcp-cloud-storage", "gcp-bigquery", "gcp-pub-sub",
    "gcp-apigee", "gcp-billing", "gcp-cloud-build", "gcp-cloud-monitoring",
    "gcp-cloud-sql", "gcp-compute-engine", "gcp-iam", "gcp-kubernetes", "gcp-security",
    "aws-ec2", "aws-s3", "aws-lambda", "aws-rds", "aws-eks", "aws-cloudwatch",
    "aws-iam", "aws-api-gateway", "aws-codebuild", "aws-codepipeline",
    "aws-sqs", "aws-sns", "aws-dynamodb", "aws-cloudfront", "aws-fargate",
    "azure-vm", "azure-blob-storage", "azure-functions", "azure-sql-database",
    "azure-aks", "azure-monitor", "azure-entra-id", "azure-api-management",
    "azure-devops", "azure-service-bus", "azure-event-grid", "azure-cosmos-db",
    "azure-container-apps", "azure-key-vault",
    "nosql-mongodb", "nosql-redis", "nosql-cassandra", "nosql-couchdb",
    "nosql-firebase", "nosql-influxdb", "nosql-rocksdb",
    "sql-mysql", "sql-postgresql", "sql-sqlite", "sql-oracle", "sql-mssql", "sql-sqlalchemy",
    "shape-circle", "shape-square", "shape-star", "shape-hexagon",
    "animated-api", "animated-click", "animated-cloud", "animated-double-check",
    "animated-loading-bubble", "animated-loading", "animated-rocket", "animated-settings",
    "animated-target", "animated-upload-cloud", "animated-upload", "animated-verified",
    "animated-worker",
  ];
  for (const p of prefixes) icons[p] = `mock-${p}.svg`;
  return {
    cloudServiceIcons: icons,
    isCloudService: (type: string) => type in icons,
  };
});

// Capture props passed to Toolbar to call addNode, onDelete, etc.
let toolbarProps: Record<string, unknown> = {};
vi.mock("../Toolbar", () => ({
  Toolbar: (props: Record<string, unknown>) => {
    toolbarProps = props;
    return <div data-testid="toolbar" />;
  },
}));

let propertiesPanelProps: Record<string, unknown> = {};
vi.mock("../PropertiesPanel", () => ({
  PropertiesPanel: (props: Record<string, unknown>) => {
    propertiesPanelProps = props;
    return <div data-testid="properties-panel" />;
  },
}));

vi.mock("../CloudServicesPanel", () => ({
  CloudServicesPanel: () => <div data-testid="cloud-services-panel" />,
}));
vi.mock("../../hooks/use-mobile", () => ({
  useIsMobile: () => false,
  useIsTablet: () => false,
}));

// Capture ReactFlow props to invoke onConnect, onSelectionChange, etc.
let reactFlowProps: Record<string, unknown> = {};

// We need real React.useState for useNodesState/useEdgesState mocks
vi.mock("@xyflow/react", () => {
  /* eslint-disable react-hooks/rules-of-hooks */
  return {
    MarkerType: { Arrow: "arrow", ArrowClosed: "arrowclosed" },
    BackgroundVariant: { Dots: "dots" },
    ConnectionMode: { Loose: "loose" },
    Position: { Top: "top", Right: "right", Bottom: "bottom", Left: "left" },
    addEdge: (edge: Record<string, unknown>, edges: unknown[]) => [
      ...edges,
      { id: `e-${edge.source}-${edge.target}`, ...edge },
    ],
    reconnectEdge: vi.fn(),
    useNodesState: (initial: Node[]) => {
      const [nodes, setNodes] = React.useState(initial);
      return [nodes, setNodes, vi.fn()];
    },
    useEdgesState: (initial: Edge[]) => {
      const [edges, setEdges] = React.useState(initial);
      return [edges, setEdges, vi.fn()];
    },
    ReactFlow: (props: Record<string, unknown>) => {
      reactFlowProps = props;
      return (
        <div data-testid="react-flow">
          {props.children as React.ReactNode}
        </div>
      );
    },
    Background: () => <div data-testid="background" />,
    Controls: () => <div data-testid="controls" />,
    MiniMap: () => <div data-testid="minimap" />,
    Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Handle: ({ id, style }: { id: string; style: React.CSSProperties }) => (
      <div data-testid={id} style={style} />
    ),
    NodeResizer: () => <div data-testid="node-resizer" />,
    useReactFlow: () => ({ setNodes: vi.fn() }),
  };
  /* eslint-enable react-hooks/rules-of-hooks */
});

import { DiagramCanvas } from "../DiagramCanvas";

describe("DiagramCanvas", () => {
  beforeEach(() => {
    resetUuidCounter();
    toolbarProps = {};
    propertiesPanelProps = {};
    reactFlowProps = {};
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { getByTestId } = render(<DiagramCanvas />);
    expect(getByTestId("react-flow")).toBeTruthy();
    expect(getByTestId("toolbar")).toBeTruthy();
  });

  it("addNode creates node with correct type, label, nodeType", () => {
    render(<DiagramCanvas />);
    const addNode = toolbarProps.onAddNode as (type: string) => void;

    act(() => addNode("server"));

    // Toolbar gets re-rendered, reactFlowProps.nodes should have 1 node
    const nodes = reactFlowProps.nodes as Node[];
    expect(nodes).toHaveLength(1);
    expect(nodes[0].type).toBe("server");
    expect(nodes[0].data.label).toBe("Server");
    expect(nodes[0].data.nodeType).toBe("server");
    expect(nodes[0].id).toBe("uuid-1");
  });

  it("cloud service nodes get explicit width/height style", () => {
    render(<DiagramCanvas />);
    const addNode = toolbarProps.onAddNode as (type: string) => void;

    act(() => addNode("aws-ec2"));

    const nodes = reactFlowProps.nodes as Node[];
    expect(nodes[0].style).toEqual({ width: 80, height: 90 });
  });

  it("non-cloud nodes do not get explicit style", () => {
    render(<DiagramCanvas />);
    const addNode = toolbarProps.onAddNode as (type: string) => void;

    act(() => addNode("service"));

    const nodes = reactFlowProps.nodes as Node[];
    expect(nodes[0].style).toBeUndefined();
  });

  it("onConnect creates edge with smoothstep type and arrow marker", () => {
    render(<DiagramCanvas />);
    const onConnect = reactFlowProps.onConnect as (c: Connection) => void;

    act(() => {
      onConnect({ source: "a", target: "b", sourceHandle: null, targetHandle: null });
    });

    const edges = reactFlowProps.edges as Edge[];
    expect(edges).toHaveLength(1);
    expect(edges[0].type).toBe("smoothstep");
    expect(edges[0].markerEnd).toEqual({ type: "arrow" });
  });

  it("handleDelete removes selected nodes and connected edges", () => {
    render(<DiagramCanvas />);
    const addNode = toolbarProps.onAddNode as (type: string) => void;
    const onConnect = reactFlowProps.onConnect as (c: Connection) => void;

    // Add 2 nodes and connect them
    act(() => addNode("server"));
    act(() => addNode("database"));
    act(() => {
      onConnect({
        source: "uuid-1",
        target: "uuid-2",
        sourceHandle: null,
        targetHandle: null,
      });
    });

    // Select the first node via onSelectionChange
    const onSelectionChange = reactFlowProps.onSelectionChange as (s: {
      nodes: Node[];
      edges: Edge[];
    }) => void;

    const nodes = reactFlowProps.nodes as Node[];
    act(() => {
      onSelectionChange({ nodes: [nodes[0]], edges: [] });
    });

    // Delete
    const onDelete = toolbarProps.onDelete as () => void;
    act(() => onDelete());

    const remainingNodes = reactFlowProps.nodes as Node[];
    const remainingEdges = reactFlowProps.edges as Edge[];
    expect(remainingNodes).toHaveLength(1);
    expect(remainingNodes[0].id).toBe("uuid-2");
    // Edge connected to deleted node should also be removed
    expect(remainingEdges).toHaveLength(0);
  });

  it("handleCopy + handlePaste duplicates nodes with new IDs and offset positions", () => {
    render(<DiagramCanvas />);
    const addNode = toolbarProps.onAddNode as (type: string) => void;

    act(() => addNode("server"));

    // Select the node
    const onSelectionChange = reactFlowProps.onSelectionChange as (s: {
      nodes: Node[];
      edges: Edge[];
    }) => void;
    const nodes = reactFlowProps.nodes as Node[];
    act(() => {
      onSelectionChange({ nodes: [nodes[0]], edges: [] });
    });

    // Copy via keyboard shortcut
    act(() => {
      fireEvent.keyDown(window, { key: "c", ctrlKey: true });
    });

    // Paste via keyboard shortcut
    act(() => {
      fireEvent.keyDown(window, { key: "v", ctrlKey: true });
    });

    const allNodes = reactFlowProps.nodes as Node[];
    expect(allNodes).toHaveLength(2);
    // New node should have different ID
    expect(allNodes[1].id).not.toBe(allNodes[0].id);
    // New node should be offset by 50,50
    expect(allNodes[1].position.x).toBe(allNodes[0].position.x + 50);
    expect(allNodes[1].position.y).toBe(allNodes[0].position.y + 50);
  });

  it("handleNodeUpdate merges partial data into targeted node", () => {
    render(<DiagramCanvas />);
    const addNode = toolbarProps.onAddNode as (type: string) => void;

    act(() => addNode("server"));

    const onNodeUpdate = propertiesPanelProps.onNodeUpdate as (
      id: string,
      data: Record<string, unknown>
    ) => void;

    act(() => {
      onNodeUpdate("uuid-1", { label: "Updated Server", description: "A desc" });
    });

    const nodes = reactFlowProps.nodes as Node[];
    expect(nodes[0].data.label).toBe("Updated Server");
    expect(nodes[0].data.description).toBe("A desc");
    // Original data should be preserved
    expect(nodes[0].data.nodeType).toBe("server");
  });

  it("handleEdgeUpdate merges partial data into targeted edge", () => {
    render(<DiagramCanvas />);
    const addNode = toolbarProps.onAddNode as (type: string) => void;
    const onConnect = reactFlowProps.onConnect as (c: Connection) => void;

    act(() => addNode("server"));
    act(() => addNode("database"));
    act(() => {
      onConnect({
        source: "uuid-1",
        target: "uuid-2",
        sourceHandle: null,
        targetHandle: null,
      });
    });

    const onEdgeUpdate = propertiesPanelProps.onEdgeUpdate as (
      id: string,
      data: Record<string, unknown>
    ) => void;

    const edges = reactFlowProps.edges as Edge[];
    const edgeId = edges[0].id;

    act(() => {
      onEdgeUpdate(edgeId, { type: "straight", animated: true });
    });

    const updatedEdges = reactFlowProps.edges as Edge[];
    expect(updatedEdges[0].type).toBe("straight");
    expect(updatedEdges[0].animated).toBe(true);
    // Original properties preserved
    expect(updatedEdges[0].source).toBe("uuid-1");
  });

  it("Delete key triggers handleDelete", () => {
    render(<DiagramCanvas />);
    const addNode = toolbarProps.onAddNode as (type: string) => void;

    act(() => addNode("server"));

    // Select the node
    const onSelectionChange = reactFlowProps.onSelectionChange as (s: {
      nodes: Node[];
      edges: Edge[];
    }) => void;
    act(() => {
      onSelectionChange({
        nodes: reactFlowProps.nodes as Node[],
        edges: [],
      });
    });

    act(() => {
      fireEvent.keyDown(window, { key: "Delete" });
    });

    expect((reactFlowProps.nodes as Node[]).length).toBe(0);
  });

  it("Ctrl+Z triggers undo", () => {
    render(<DiagramCanvas />);

    // Just verify it doesn't crash and toast fires if state is available
    act(() => {
      fireEvent.keyDown(window, { key: "z", ctrlKey: true });
    });
    // Undo with no history should be a no-op (no crash)
  });
});
