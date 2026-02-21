
import { type Node, type Edge } from '@xyflow/react';

export type NodeType =
  | 'service'
  | 'database'
  | 'server'
  | 'client'
  | 'storage'
  | 'api'
  | 'text'
  | 'subflow'
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
  | 'oci-virtual-machine'
  | 'oci-object-storage'
  | 'oci-vcn'
  | 'oci-autonomous-database'
  | 'oci-load-balancer'
  | 'oci-oke'
  | 'oci-iam'
  | 'oci-functions'
  | 'oci-api-gateway'
  | 'oci-block-storage'
  | 'oci-dns'
  | 'oci-waf'
  | 'oci-monitoring'
  | 'oci-container-registry'
  | 'oci-exadata'
  | 'nosql-mongodb'
  | 'nosql-redis'
  | 'nosql-cassandra'
  | 'nosql-couchdb'
  | 'nosql-firebase'
  | 'nosql-influxdb'
  | 'nosql-rocksdb'
  | 'sql-mysql'
  | 'sql-postgresql'
  | 'sql-sqlite'
  | 'sql-oracle'
  | 'sql-mssql'
  | 'sql-sqlalchemy'
  | 'shape-circle'
  | 'shape-square'
  | 'shape-star'
  | 'shape-hexagon'
  | 'shape-round-rectangle'
  | 'shape-diamond'
  | 'shape-arrow-rectangle'
  | 'shape-cylinder'
  | 'shape-parallelogram'
  | 'shape-plus'
  | 'shape-triangle'
  | 'animated-api'
  | 'animated-click'
  | 'animated-cloud'
  | 'animated-double-check'
  | 'animated-loading-bubble'
  | 'animated-loading'
  | 'animated-rocket'
  | 'animated-settings'
  | 'animated-target'
  | 'animated-upload-cloud'
  | 'animated-upload'
  | 'animated-verified'
  | 'animated-worker';

export interface DiagramNodeData {
  label: string;
  description?: string;
  nodeType: NodeType;
  icon?: string;
  // Cloud service specific properties
  region?: string;
  instanceType?: string;
  environment?: 'development' | 'staging' | 'production' | 'testing';
  // Shape node customization
  shapeColor?: string;
  shapeOpacity?: number;
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
