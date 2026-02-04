
import { type Node, type Edge } from '@xyflow/react';

export type NodeType =
  | 'service'
  | 'database'
  | 'server'
  | 'client'
  | 'storage'
  | 'api'
  | 'text'
  | 'group'
  | 'gcp-cloud-run'
  | 'gcp-cloud-storage'
  | 'gcp-bigquery'
  | 'gcp-pub-sub'
  | 'gcp-apigee'
  | 'gcp-billing'
  | 'gcp-cloud-build'
  | 'gcp-cloud-monitoring'
  | 'gcp-cloud-sql'
  | 'gcp-compute-engine'
  | 'gcp-iam'
  | 'gcp-kubernetes'
  | 'gcp-security'
  | 'aws-ec2'
  | 'aws-s3'
  | 'aws-lambda'
  | 'aws-rds'
  | 'azure-vm'
  | 'azure-blob-storage'
  | 'azure-functions'
  | 'azure-sql-database';

export interface DiagramNodeData {
  label: string;
  description?: string;
  nodeType: NodeType;
  icon?: string;
  // Cloud service specific properties
  region?: string;
  instanceType?: string;
  environment?: 'development' | 'staging' | 'production' | 'testing';
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

export type MarkerType = 'none' | 'arrow' | 'arrowclosed';
