
import { type Node, type Edge } from '@xyflow/react';

export type NodeType =
  | 'service'
  | 'database'
  | 'server'
  | 'client'
  | 'storage'
  | 'api'
  | 'text'
  | 'group';

export interface DiagramNodeData {
  label: string;
  description?: string;
  nodeType: NodeType;
  icon?: string;
  [key: string]: unknown;
}

export type DiagramNode = Node<DiagramNodeData>;
export type DiagramEdge = Edge;

export interface ToolbarItem {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
}

export type EdgeType = 'default' | 'step' | 'smoothstep' | 'straight';
