
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
  | 'process-requirements'
  | 'process-design'
  | 'process-development'
  | 'process-testing'
  | 'process-deployment'
  | 'process-monitoring'
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
  | 'aws-eks'
  | 'aws-cloudwatch'
  | 'aws-iam'
  | 'aws-api-gateway'
  | 'aws-codebuild'
  | 'aws-codepipeline'
  | 'aws-sqs'
  | 'aws-sns'
  | 'aws-dynamodb'
  | 'aws-cloudfront'
  | 'aws-fargate'
  | 'azure-vm'
  | 'azure-blob-storage'
  | 'azure-functions'
  | 'azure-sql-database'
  | 'azure-aks'
  | 'azure-monitor'
  | 'azure-entra-id'
  | 'azure-api-management'
  | 'azure-devops'
  | 'azure-service-bus'
  | 'azure-event-grid'
  | 'azure-cosmos-db'
  | 'azure-container-apps'
  | 'azure-key-vault'
  | 'shape-circle'
  | 'shape-square'
  | 'shape-star'
  | 'shape-hexagon';

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
