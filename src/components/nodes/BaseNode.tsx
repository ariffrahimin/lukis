import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Handle, Position, NodeResizer, useReactFlow } from "@xyflow/react";
import { cn } from "../../lib/utils";
import { type NodeType } from "../../types/diagrams";
import {
  Server,
  Database,
  Cloud,
  Monitor,
  HardDrive,
  Globe,
  Type,
  Square,
  FileText,
  PenTool,
  Code,
  Bug,
  Rocket,
  Activity,
} from "lucide-react";

// GCP Icons
import cloudRunIcon from "../cloud-services/gcp/cloud-run.svg";
import cloudStorageIcon from "../cloud-services/gcp/cloud-storage.svg";
import bigqueryIcon from "../cloud-services/gcp/bigquery.svg";
import pubSubIcon from "../cloud-services/gcp/pub-sub.svg";
import apigeeIcon from "../cloud-services/gcp/apigee.svg";
import billingIcon from "../cloud-services/gcp/billing.svg";
import cloudBuildIcon from "../cloud-services/gcp/cloud-build.svg";
import cloudMonitoringIcon from "../cloud-services/gcp/cloud-monitoring.svg";
import cloudSqlIcon from "../cloud-services/gcp/cloud-sql.svg";
import computeEngineIcon from "../cloud-services/gcp/compute-engine.svg";
import iamIcon from "../cloud-services/gcp/iam.svg";
import kubernetesIcon from "../cloud-services/gcp/kubernetes.svg";
import securityIcon from "../cloud-services/gcp/security.svg";

// AWS Icons
import ec2Icon from "../cloud-services/aws/ec2.svg";
import s3Icon from "../cloud-services/aws/s3.svg";
import lambdaIcon from "../cloud-services/aws/lambda.svg";
import rdsIcon from "../cloud-services/aws/rds.svg";
import eksIcon from "../cloud-services/aws/eks.svg";
import cloudwatchIcon from "../cloud-services/aws/cloudwatch.svg";
import awsIamIcon from "../cloud-services/aws/iam.svg";
import awsApiGatewayIcon from "../cloud-services/aws/api-gateway.svg";
import codebuildIcon from "../cloud-services/aws/codebuild.svg";
import codepipelineIcon from "../cloud-services/aws/codepipeline.svg";
import sqsIcon from "../cloud-services/aws/sqs.svg";
import snsIcon from "../cloud-services/aws/sns.svg";
import dynamodbIcon from "../cloud-services/aws/dynamodb.svg";
import cloudfrontIcon from "../cloud-services/aws/cloudfront.svg";
import fargateIcon from "../cloud-services/aws/fargate.svg";

// Azure Icons
import vmIcon from "../cloud-services/azure/vm.svg";
import blobStorageIcon from "../cloud-services/azure/blob-storage.svg";
import functionsIcon from "../cloud-services/azure/functions.svg";
import sqlDatabaseIcon from "../cloud-services/azure/sql-database.svg";
import aksIcon from "../cloud-services/azure/aks.svg";
import azureMonitorIcon from "../cloud-services/azure/monitor.svg";
import entraIdIcon from "../cloud-services/azure/entra-id.svg";
import apiManagementIcon from "../cloud-services/azure/api-management.svg";
import azureDevopsIcon from "../cloud-services/azure/devops.svg";
import serviceBusIcon from "../cloud-services/azure/service-bus.svg";
import eventGridIcon from "../cloud-services/azure/event-grid.svg";
import cosmosDbIcon from "../cloud-services/azure/cosmos-db.svg";
import containerAppsIcon from "../cloud-services/azure/container-apps.svg";
import keyVaultIcon from "../cloud-services/azure/key-vault.svg";

// NoSQL DB Icons
import mongodbIcon from "../cloud-services/nosql-db/mongodb.svg";
import redisIcon from "../cloud-services/nosql-db/redis.svg";
import cassandraIcon from "../cloud-services/nosql-db/cassandra.svg";
import couchdbIcon from "../cloud-services/nosql-db/couchdb.svg";
import firebaseIcon from "../cloud-services/nosql-db/firebase.svg";
import influxdbIcon from "../cloud-services/nosql-db/influxdb.svg";
import rocksdbIcon from "../cloud-services/nosql-db/rocksdb.svg";

// SQL DB Icons
import mysqlIcon from "../cloud-services/sql-db/mysql.svg";
import postgresqlIcon from "../cloud-services/sql-db/postgressql.svg";
import sqliteIcon from "../cloud-services/sql-db/sqlite.svg";
import oracleIcon from "../cloud-services/sql-db/oracle.svg";
import mssqlIcon from "../cloud-services/sql-db/microsoft-sql-server.svg";
import sqlalchemyIcon from "../cloud-services/sql-db/sqlalchemy.svg";

// Shape Icons
import shapeCircleIcon from "../cloud-services/shapes/circle.svg";
import shapeSquareIcon from "../cloud-services/shapes/square.svg";
import shapeStarIcon from "../cloud-services/shapes/star.svg";
import shapeHexagonIcon from "../cloud-services/shapes/hexagon.svg";

// Cloud service icon mapping
const cloudServiceIcons: Record<string, string> = {
  "gcp-cloud-run": cloudRunIcon,
  "gcp-cloud-storage": cloudStorageIcon,
  "gcp-bigquery": bigqueryIcon,
  "gcp-pub-sub": pubSubIcon,
  "gcp-apigee": apigeeIcon,
  "gcp-billing": billingIcon,
  "gcp-cloud-build": cloudBuildIcon,
  "gcp-cloud-monitoring": cloudMonitoringIcon,
  "gcp-cloud-sql": cloudSqlIcon,
  "gcp-compute-engine": computeEngineIcon,
  "gcp-iam": iamIcon,
  "gcp-kubernetes": kubernetesIcon,
  "gcp-security": securityIcon,
  "aws-ec2": ec2Icon,
  "aws-s3": s3Icon,
  "aws-lambda": lambdaIcon,
  "aws-rds": rdsIcon,
  "aws-eks": eksIcon,
  "aws-cloudwatch": cloudwatchIcon,
  "aws-iam": awsIamIcon,
  "aws-api-gateway": awsApiGatewayIcon,
  "aws-codebuild": codebuildIcon,
  "aws-codepipeline": codepipelineIcon,
  "aws-sqs": sqsIcon,
  "aws-sns": snsIcon,
  "aws-dynamodb": dynamodbIcon,
  "aws-cloudfront": cloudfrontIcon,
  "aws-fargate": fargateIcon,
  "azure-vm": vmIcon,
  "azure-blob-storage": blobStorageIcon,
  "azure-functions": functionsIcon,
  "azure-sql-database": sqlDatabaseIcon,
  "azure-aks": aksIcon,
  "azure-monitor": azureMonitorIcon,
  "azure-entra-id": entraIdIcon,
  "azure-api-management": apiManagementIcon,
  "azure-devops": azureDevopsIcon,
  "azure-service-bus": serviceBusIcon,
  "azure-event-grid": eventGridIcon,
  "azure-cosmos-db": cosmosDbIcon,
  "azure-container-apps": containerAppsIcon,
  "azure-key-vault": keyVaultIcon,
  "nosql-mongodb": mongodbIcon,
  "nosql-redis": redisIcon,
  "nosql-cassandra": cassandraIcon,
  "nosql-couchdb": couchdbIcon,
  "nosql-firebase": firebaseIcon,
  "nosql-influxdb": influxdbIcon,
  "nosql-rocksdb": rocksdbIcon,
  "sql-mysql": mysqlIcon,
  "sql-postgresql": postgresqlIcon,
  "sql-sqlite": sqliteIcon,
  "sql-oracle": oracleIcon,
  "sql-mssql": mssqlIcon,
  "sql-sqlalchemy": sqlalchemyIcon,
  "shape-circle": shapeCircleIcon,
  "shape-square": shapeSquareIcon,
  "shape-star": shapeStarIcon,
  "shape-hexagon": shapeHexagonIcon,
};
// Helper function to check if node type is a cloud service
const isCloudService = (nodeType: NodeType): boolean => {
  return nodeType in cloudServiceIcons;
};

const nodeTypeStyles: Record<
  NodeType,
  { bg: string; border: string; icon: string }
> = {
  service: {
    bg: "bg-[hsl(187_72%_50%/0.15)]",
    border: "border-[hsl(187_72%_50%/0.5)]",
    icon: "text-[hsl(187_72%_50%)]",
  },
  database: {
    bg: "bg-[hsl(262_83%_58%/0.15)]",
    border: "border-[hsl(262_83%_58%/0.5)]",
    icon: "text-[hsl(262_83%_58%)]",
  },
  server: {
    bg: "bg-[hsl(142_71%_45%/0.15)]",
    border: "border-[hsl(142_71%_45%/0.5)]",
    icon: "text-[hsl(142_71%_45%)]",
  },
  client: {
    bg: "bg-[hsl(38_92%_50%/0.15)]",
    border: "border-[hsl(38_92%_50%/0.5)]",
    icon: "text-[hsl(38_92%_50%)]",
  },
  storage: {
    bg: "bg-[hsl(346_77%_50%/0.15)]",
    border: "border-[hsl(346_77%_50%/0.5)]",
    icon: "text-[hsl(346_77%_50%)]",
  },
  api: {
    bg: "bg-[hsl(199_89%_48%/0.15)]",
    border: "border-[hsl(199_89%_48%/0.5)]",
    icon: "text-[hsl(199_89%_48%)]",
  },
  text: {
    bg: "bg-transparent",
    border: "border-transparent",
    icon: "text-foreground",
  },
  group: {
    bg: "bg-secondary/30",
    border: "border-border border-dashed",
    icon: "text-muted-foreground",
  },
  "process-requirements": {
    bg: "bg-indigo-100/20",
    border: "border-indigo-300/50",
    icon: "text-indigo-600",
  },
  "process-design": {
    bg: "bg-violet-100/20",
    border: "border-violet-300/50",
    icon: "text-violet-600",
  },
  "process-development": {
    bg: "bg-sky-100/20",
    border: "border-sky-300/50",
    icon: "text-sky-600",
  },
  "process-testing": {
    bg: "bg-amber-100/20",
    border: "border-amber-300/50",
    icon: "text-amber-600",
  },
  "process-deployment": {
    bg: "bg-emerald-100/20",
    border: "border-emerald-300/50",
    icon: "text-emerald-600",
  },
  "process-monitoring": {
    bg: "bg-rose-100/20",
    border: "border-rose-300/50",
    icon: "text-rose-600",
  },
  "gcp-cloud-run": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "gcp-cloud-storage": {
    bg: "bg-red-100/20",
    border: "border-red-300/50",
    icon: "text-red-600",
  },
  "gcp-bigquery": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "gcp-pub-sub": {
    bg: "bg-yellow-100/20",
    border: "border-yellow-300/50",
    icon: "text-yellow-600",
  },
  "gcp-apigee": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "gcp-billing": {
    bg: "bg-green-100/20",
    border: "border-green-300/50",
    icon: "text-green-600",
  },
  "gcp-cloud-build": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "gcp-cloud-monitoring": {
    bg: "bg-red-100/20",
    border: "border-red-300/50",
    icon: "text-red-600",
  },
  "gcp-cloud-sql": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "gcp-compute-engine": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "gcp-iam": {
    bg: "bg-purple-100/20",
    border: "border-purple-300/50",
    icon: "text-purple-600",
  },
  "gcp-kubernetes": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "gcp-security": {
    bg: "bg-red-100/20",
    border: "border-red-300/50",
    icon: "text-red-600",
  },
  "aws-ec2": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-s3": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-lambda": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-rds": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-eks": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-cloudwatch": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-iam": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-api-gateway": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-codebuild": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-codepipeline": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-sqs": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-sns": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-dynamodb": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-cloudfront": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "aws-fargate": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "azure-vm": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-blob-storage": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-functions": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-sql-database": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-aks": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-monitor": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-entra-id": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-api-management": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-devops": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-service-bus": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-event-grid": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-cosmos-db": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-container-apps": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "azure-key-vault": {
    bg: "bg-cyan-100/20",
    border: "border-cyan-300/50",
    icon: "text-cyan-600",
  },
  "nosql-mongodb": {
    bg: "bg-green-100/20",
    border: "border-green-300/50",
    icon: "text-green-600",
  },
  "nosql-redis": {
    bg: "bg-red-100/20",
    border: "border-red-300/50",
    icon: "text-red-600",
  },
  "nosql-cassandra": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "nosql-couchdb": {
    bg: "bg-red-100/20",
    border: "border-red-300/50",
    icon: "text-red-600",
  },
  "nosql-firebase": {
    bg: "bg-amber-100/20",
    border: "border-amber-300/50",
    icon: "text-amber-600",
  },
  "nosql-influxdb": {
    bg: "bg-purple-100/20",
    border: "border-purple-300/50",
    icon: "text-purple-600",
  },
  "nosql-rocksdb": {
    bg: "bg-slate-100/20",
    border: "border-slate-300/50",
    icon: "text-slate-600",
  },
  "sql-mysql": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "sql-postgresql": {
    bg: "bg-sky-100/20",
    border: "border-sky-300/50",
    icon: "text-sky-600",
  },
  "sql-sqlite": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "sql-oracle": {
    bg: "bg-red-100/20",
    border: "border-red-300/50",
    icon: "text-red-600",
  },
  "sql-mssql": {
    bg: "bg-red-100/20",
    border: "border-red-300/50",
    icon: "text-red-600",
  },
  "sql-sqlalchemy": {
    bg: "bg-orange-100/20",
    border: "border-orange-300/50",
    icon: "text-orange-600",
  },
  "shape-circle": {
    bg: "bg-pink-100/20",
    border: "border-pink-300/50",
    icon: "text-pink-600",
  },
  "shape-square": {
    bg: "bg-blue-100/20",
    border: "border-blue-300/50",
    icon: "text-blue-600",
  },
  "shape-star": {
    bg: "bg-yellow-100/20",
    border: "border-yellow-300/50",
    icon: "text-yellow-600",
  },
  "shape-hexagon": {
    bg: "bg-teal-100/20",
    border: "border-teal-300/50",
    icon: "text-teal-600",
  },
};

const NodeIcon = ({
  type,
  className,
}: {
  type: NodeType;
  className?: string;
}) => {
  const iconProps = { className: cn("w-5 h-5", className) };

  switch (type) {
    case "service":
      return <Cloud {...iconProps} />;
    case "database":
      return <Database {...iconProps} />;
    case "server":
      return <Server {...iconProps} />;
    case "client":
      return <Monitor {...iconProps} />;
    case "storage":
      return <HardDrive {...iconProps} />;
    case "api":
      return <Globe {...iconProps} />;
    case "text":
      return <Type {...iconProps} />;
    case "group":
      return <Square {...iconProps} />;
    case "process-requirements":
      return <FileText {...iconProps} />;
    case "process-design":
      return <PenTool {...iconProps} />;
    case "process-development":
      return <Code {...iconProps} />;
    case "process-testing":
      return <Bug {...iconProps} />;
    case "process-deployment":
      return <Rocket {...iconProps} />;
    case "process-monitoring":
      return <Activity {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
};

const EditableLabel = ({
  label,
  nodeId,
  className,
}: {
  label: string;
  nodeId: string;
  className?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    setValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitEdit = useCallback(() => {
    setIsEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== label) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label: trimmed } } : n
        )
      );
    } else {
      setValue(label);
    }
  }, [value, label, nodeId, setNodes]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitEdit();
          if (e.key === "Escape") {
            setValue(label);
            setIsEditing(false);
          }
          e.stopPropagation();
        }}
        className={cn(
          "bg-transparent border-b border-primary outline-none text-center w-full",
          className
        )}
        style={{ minWidth: 30 }}
      />
    );
  }

  return (
    <span
      className={className}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Double-click to edit"
    >
      {label}
    </span>
  );
};

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
    [key: string]: unknown;
  };
  selected?: boolean;
}

const BaseNode = ({ id, data, selected }: BaseNodeProps) => {
  const styles = nodeTypeStyles[data.nodeType];
  const isTextNode = data.nodeType === "text";
  const isGroupNode = data.nodeType === "group";
  const isCloudServiceNode = isCloudService(data.nodeType);
  const [isHovered, setIsHovered] = useState(false);

  const getHandleStyle = (isSource: boolean = false) => ({
    background: isSource ? "#10b981" : "#3b82f6",
    width: 8,
    height: 8,
    opacity: selected || isHovered ? 1 : 0,
    transition: "opacity 0.2s ease-in-out",
  });

  if (isTextNode) {
    return (
      <div
        className="px-2 py-1 relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NodeResizer
          isVisible={selected}
          minWidth={30}
          minHeight={20}
          lineStyle={{ borderColor: "#3b82f6" }}
          handleStyle={{ backgroundColor: "#3b82f6", width: 8, height: 8 }}
        />
        <Handle
          type="target"
          position={Position.Top}
          id="target-top"
          style={{
            ...getHandleStyle(false),
            top: -4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="target"
          position={Position.Right}
          id="target-right"
          style={{
            ...getHandleStyle(false),
            right: -4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id="target-bottom"
          style={{
            ...getHandleStyle(false),
            bottom: -4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="target-left"
          style={{
            ...getHandleStyle(false),
            left: -4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        <Handle
          type="source"
          position={Position.Top}
          id="source-top"
          style={{
            ...getHandleStyle(true),
            top: -4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="source-right"
          style={{
            ...getHandleStyle(true),
            right: -4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="source-bottom"
          style={{
            ...getHandleStyle(true),
            bottom: -4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="source-left"
          style={{
            ...getHandleStyle(true),
            left: -4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <EditableLabel
          label={data.label}
          nodeId={id}
          className="text-foreground font-medium text-sm"
        />
      </div>
    );
  }

  // Cloud service nodes - display as icon with optional label
  if (isCloudServiceNode) {
    return (
      <div
        className="flex flex-col items-center relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NodeResizer
          isVisible={selected}
          minWidth={60}
          minHeight={60}
          lineStyle={{ borderColor: "#3b82f6" }}
          handleStyle={{ backgroundColor: "#3b82f6", width: 8, height: 8 }}
        />
        {/* Connection handles - only visible on hover/select */}
        <Handle
          type="target"
          position={Position.Top}
          id="target-top"
          style={{
            ...getHandleStyle(false),
            top: -4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="target"
          position={Position.Right}
          id="target-right"
          style={{
            ...getHandleStyle(false),
            right: -4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id="target-bottom"
          style={{
            ...getHandleStyle(false),
            bottom: -4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="target-left"
          style={{
            ...getHandleStyle(false),
            left: -4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {/* Icon container */}
        <div
          className={cn(
            "p-2 rounded-lg transition-all duration-200 flex-1 min-h-0 min-w-0 flex items-center justify-center",
            selected &&
              "ring-2 ring-primary ring-offset-2 ring-offset-background",
          )}
        >
          <div className="w-full h-full min-w-[48px] min-h-[48px]">
            <img
              src={cloudServiceIcons[data.nodeType]}
              alt={data.label}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              className="w-full h-full bg-muted rounded flex items-center justify-center text-xs font-medium"
              style={{ display: "none" }}
            >
              {data.label.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Optional label */}
        {data.label && (
          <div className="mt-1 text-center">
            <EditableLabel
              label={data.label}
              nodeId={id}
              className="text-xs font-medium text-foreground leading-tight"
            />
          </div>
        )}

        {/* Description */}
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 text-center max-w-[120px]">
            {data.description}
          </p>
        )}

        {/* Source handles - only visible on hover/select */}
        <Handle
          type="source"
          position={Position.Top}
          id="source-top"
          style={{
            ...getHandleStyle(true),
            top: -4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="source-right"
          style={{
            ...getHandleStyle(true),
            right: -4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="source-bottom"
          style={{
            ...getHandleStyle(true),
            bottom: -4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="source-left"
          style={{
            ...getHandleStyle(true),
            left: -4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full rounded-lg border-2 backdrop-blur-sm transition-all duration-200",
        styles.bg,
        styles.border,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isGroupNode && "min-w-[200px] min-h-[120px]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={50}
        lineStyle={{ borderColor: "#3b82f6" }}
        handleStyle={{ backgroundColor: "#3b82f6", width: 8, height: 8 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        style={{
          ...getHandleStyle(false),
          top: -4,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        style={{
          ...getHandleStyle(false),
          right: -4,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        style={{
          ...getHandleStyle(false),
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        style={{
          ...getHandleStyle(false),
          left: -4,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      <div className={cn("p-3", isGroupNode && "pb-16")}>
        <div className="flex items-center gap-2">
          <NodeIcon type={data.nodeType} className={styles.icon} />
          <EditableLabel
            label={data.label}
            nodeId={id}
            className="font-medium text-sm text-foreground truncate max-w-[120px]"
          />
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[160px]">
            {data.description}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Top}
        id="source-top"
        style={{
          ...getHandleStyle(true),
          top: -4,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        style={{
          ...getHandleStyle(true),
          right: -4,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        style={{
          ...getHandleStyle(true),
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        style={{
          ...getHandleStyle(true),
          left: -4,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  );
};

export default memo(BaseNode);
