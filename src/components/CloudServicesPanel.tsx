import { useState, useMemo } from "react";
import { type NodeType } from "../types/diagrams";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Cloud,
  Database,
  Server,
  Monitor,
  HardDrive,
  Globe,
  FileText,
  PenTool,
  Code,
  Bug,
  Rocket,
  Activity,
  Layers,
  Box,
  Shapes,
  GripVertical,
  Sparkles,
} from "lucide-react";

// Shape Icons
import shapeCircleIcon from "./cloud-services/shapes/circle.svg";
import shapeSquareIcon from "./cloud-services/shapes/square.svg";
import shapeStarIcon from "./cloud-services/shapes/star.svg";
import shapeHexagonIcon from "./cloud-services/shapes/hexagon.svg";
import shapeRoundRectangleIcon from "./cloud-services/shapes/round-rectangle.svg";
import shapeDiamondIcon from "./cloud-services/shapes/diamond.svg";
import shapeArrowRectangleIcon from "./cloud-services/shapes/arrow-rectangle.svg";
import shapeCylinderIcon from "./cloud-services/shapes/cylinder.svg";
import shapeParallelogramIcon from "./cloud-services/shapes/parallelogram.svg";
import shapePlusIcon from "./cloud-services/shapes/plus.svg";
import shapeTriangleIcon from "./cloud-services/shapes/triangle.svg";

// GCP Icons
import cloudRunIcon from "./cloud-services/gcp/cloud-run.svg";
import cloudStorageIcon from "./cloud-services/gcp/cloud-storage.svg";
import bigqueryIcon from "./cloud-services/gcp/bigquery.svg";
import pubSubIcon from "./cloud-services/gcp/pub-sub.svg";
import apigeeIcon from "./cloud-services/gcp/apigee.svg";
import billingIcon from "./cloud-services/gcp/billing.svg";
import cloudBuildIcon from "./cloud-services/gcp/cloud-build.svg";
import cloudMonitoringIcon from "./cloud-services/gcp/cloud-monitoring.svg";
import cloudSqlIcon from "./cloud-services/gcp/cloud-sql.svg";
import computeEngineIcon from "./cloud-services/gcp/compute-engine.svg";
import iamIcon from "./cloud-services/gcp/iam.svg";
import kubernetesIcon from "./cloud-services/gcp/kubernetes.svg";
import securityIcon from "./cloud-services/gcp/security.svg";

// AWS Icons
import ec2Icon from "./cloud-services/aws/ec2.svg";
import s3Icon from "./cloud-services/aws/s3.svg";
import lambdaIcon from "./cloud-services/aws/lambda.svg";
import rdsIcon from "./cloud-services/aws/rds.svg";
import eksIcon from "./cloud-services/aws/eks.svg";
import cloudwatchIcon from "./cloud-services/aws/cloudwatch.svg";
import awsIamIcon from "./cloud-services/aws/iam.svg";
import awsApiGatewayIcon from "./cloud-services/aws/api-gateway.svg";
import codebuildIcon from "./cloud-services/aws/codebuild.svg";
import codepipelineIcon from "./cloud-services/aws/codepipeline.svg";
import sqsIcon from "./cloud-services/aws/sqs.svg";
import snsIcon from "./cloud-services/aws/sns.svg";
import dynamodbIcon from "./cloud-services/aws/dynamodb.svg";
import cloudfrontIcon from "./cloud-services/aws/cloudfront.svg";
import fargateIcon from "./cloud-services/aws/fargate.svg";

// Azure Icons
import vmIcon from "./cloud-services/azure/vm.svg";
import blobStorageIcon from "./cloud-services/azure/blob-storage.svg";
import functionsIcon from "./cloud-services/azure/functions.svg";
import sqlDatabaseIcon from "./cloud-services/azure/sql-database.svg";
import aksIcon from "./cloud-services/azure/aks.svg";
import azureMonitorIcon from "./cloud-services/azure/monitor.svg";
import entraIdIcon from "./cloud-services/azure/entra-id.svg";
import apiManagementIcon from "./cloud-services/azure/api-management.svg";
import azureDevopsIcon from "./cloud-services/azure/devops.svg";
import serviceBusIcon from "./cloud-services/azure/service-bus.svg";
import eventGridIcon from "./cloud-services/azure/event-grid.svg";
import cosmosDbIcon from "./cloud-services/azure/cosmos-db.svg";
import containerAppsIcon from "./cloud-services/azure/container-apps.svg";
import keyVaultIcon from "./cloud-services/azure/key-vault.svg";

// NoSQL DB Icons
import mongodbIcon from "./cloud-services/nosql-db/mongodb.svg";
import redisIcon from "./cloud-services/nosql-db/redis.svg";
import cassandraIcon from "./cloud-services/nosql-db/cassandra.svg";
import couchdbIcon from "./cloud-services/nosql-db/couchdb.svg";
import firebaseIcon from "./cloud-services/nosql-db/firebase.svg";
import influxdbIcon from "./cloud-services/nosql-db/influxdb.svg";
import rocksdbIcon from "./cloud-services/nosql-db/rocksdb.svg";

// SQL DB Icons
import mysqlIcon from "./cloud-services/sql-db/mysql.svg";
import postgresqlIcon from "./cloud-services/sql-db/postgressql.svg";
import sqliteIcon from "./cloud-services/sql-db/sqlite.svg";
import oracleIcon from "./cloud-services/sql-db/oracle.svg";
import mssqlIcon from "./cloud-services/sql-db/microsoft-sql-server.svg";
import sqlalchemyIcon from "./cloud-services/sql-db/sqlalchemy.svg";

// Animated Icons
import animatedApiIcon from "./cloud-services/animated/api.gif";
import animatedClickIcon from "./cloud-services/animated/click.gif";
import animatedCloudIcon from "./cloud-services/animated/cloud.gif";
import animatedDoubleCheckIcon from "./cloud-services/animated/double-check.gif";
import animatedLoadingBubbleIcon from "./cloud-services/animated/loading-bubble.gif";
import animatedLoadingIcon from "./cloud-services/animated/loading.gif";
import animatedRocketIcon from "./cloud-services/animated/rocket.gif";
import animatedSettingsIcon from "./cloud-services/animated/settings.gif";
import animatedTargetIcon from "./cloud-services/animated/target.gif";
import animatedUploadCloudIcon from "./cloud-services/animated/upload-cloud.gif";
import animatedUploadIcon from "./cloud-services/animated/upload.gif";
import animatedVerifiedIcon from "./cloud-services/animated/verified.gif";
import animatedWorkerIcon from "./cloud-services/animated/worker.gif";

interface CloudService {
  type: NodeType;
  label: string;
  icon: string | React.ComponentType<{ className?: string }>;
}

interface CloudProvider {
  name: string;
  services: CloudService[];
  accent?: string;
}

interface CloudServicesPanelProps {
  onServiceSelect: (type: NodeType) => void;
  isMobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// --- Data ---

const shapesProvider: CloudProvider = {
  name: "Shapes",
  accent: "bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800 dark:text-pink-400",
  services: [
    { type: "shape-circle", label: "Circle", icon: shapeCircleIcon },
    { type: "shape-square", label: "Square", icon: shapeSquareIcon },
    { type: "shape-star", label: "Star", icon: shapeStarIcon },
    { type: "shape-hexagon", label: "Hexagon", icon: shapeHexagonIcon },
    { type: "shape-round-rectangle", label: "Round Rect", icon: shapeRoundRectangleIcon },
    { type: "shape-diamond", label: "Diamond", icon: shapeDiamondIcon },
    { type: "shape-arrow-rectangle", label: "Arrow Rect", icon: shapeArrowRectangleIcon },
    { type: "shape-cylinder", label: "Cylinder", icon: shapeCylinderIcon },
    { type: "shape-parallelogram", label: "Parallelogram", icon: shapeParallelogramIcon },
    { type: "shape-plus", label: "Plus", icon: shapePlusIcon },
    { type: "shape-triangle", label: "Triangle", icon: shapeTriangleIcon },
  ],
};

const basicProvider: CloudProvider = {
  name: "Basic",
  accent: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-700 dark:text-slate-400",
  services: [
    { type: "service", label: "Service", icon: Cloud },
    { type: "database", label: "Database", icon: Database },
    { type: "server", label: "Server", icon: Server },
    { type: "client", label: "Client", icon: Monitor },
    { type: "storage", label: "Storage", icon: HardDrive },
    { type: "api", label: "API Gateway", icon: Globe },
  ],
};

const processProvider: CloudProvider = {
  name: "Software Process",
  accent: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400",
  services: [
    { type: "process-requirements", label: "Requirements", icon: FileText },
    { type: "process-design", label: "Design", icon: PenTool },
    { type: "process-development", label: "Development", icon: Code },
    { type: "process-testing", label: "Testing", icon: Bug },
    { type: "process-deployment", label: "Deployment", icon: Rocket },
    { type: "process-monitoring", label: "Monitoring", icon: Activity },
  ],
};

const gcpProvider: CloudProvider = {
  name: "GCP",
  accent: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  services: [
    { type: "gcp-cloud-run", label: "Cloud Run", icon: cloudRunIcon },
    { type: "gcp-cloud-storage", label: "Cloud Storage", icon: cloudStorageIcon },
    { type: "gcp-bigquery", label: "BigQuery", icon: bigqueryIcon },
    { type: "gcp-pub-sub", label: "Pub/Sub", icon: pubSubIcon },
    { type: "gcp-apigee", label: "Apigee", icon: apigeeIcon },
    { type: "gcp-billing", label: "Billing", icon: billingIcon },
    { type: "gcp-cloud-build", label: "Cloud Build", icon: cloudBuildIcon },
    { type: "gcp-cloud-monitoring", label: "Cloud Monitoring", icon: cloudMonitoringIcon },
    { type: "gcp-cloud-sql", label: "Cloud SQL", icon: cloudSqlIcon },
    { type: "gcp-compute-engine", label: "Compute Engine", icon: computeEngineIcon },
    { type: "gcp-iam", label: "IAM", icon: iamIcon },
    { type: "gcp-kubernetes", label: "Kubernetes", icon: kubernetesIcon },
    { type: "gcp-security", label: "Security", icon: securityIcon },
  ],
};

const awsProvider: CloudProvider = {
  name: "AWS",
  accent: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  services: [
    { type: "aws-ec2", label: "EC2", icon: ec2Icon },
    { type: "aws-s3", label: "S3", icon: s3Icon },
    { type: "aws-lambda", label: "Lambda", icon: lambdaIcon },
    { type: "aws-rds", label: "RDS", icon: rdsIcon },
    { type: "aws-eks", label: "EKS", icon: eksIcon },
    { type: "aws-cloudwatch", label: "CloudWatch", icon: cloudwatchIcon },
    { type: "aws-iam", label: "IAM", icon: awsIamIcon },
    { type: "aws-api-gateway", label: "API Gateway", icon: awsApiGatewayIcon },
    { type: "aws-codebuild", label: "CodeBuild", icon: codebuildIcon },
    { type: "aws-codepipeline", label: "CodePipeline", icon: codepipelineIcon },
    { type: "aws-sqs", label: "SQS", icon: sqsIcon },
    { type: "aws-sns", label: "SNS", icon: snsIcon },
    { type: "aws-dynamodb", label: "DynamoDB", icon: dynamodbIcon },
    { type: "aws-cloudfront", label: "CloudFront", icon: cloudfrontIcon },
    { type: "aws-fargate", label: "Fargate", icon: fargateIcon },
  ],
};

const azureProvider: CloudProvider = {
  name: "Azure",
  accent: "bg-sky-500/10 text-sky-600 border-sky-200 dark:border-sky-800 dark:text-sky-400",
  services: [
    { type: "azure-vm", label: "VM", icon: vmIcon },
    { type: "azure-blob-storage", label: "Blob Storage", icon: blobStorageIcon },
    { type: "azure-functions", label: "Functions", icon: functionsIcon },
    { type: "azure-sql-database", label: "SQL Database", icon: sqlDatabaseIcon },
    { type: "azure-aks", label: "AKS", icon: aksIcon },
    { type: "azure-monitor", label: "Monitor", icon: azureMonitorIcon },
    { type: "azure-entra-id", label: "Entra ID", icon: entraIdIcon },
    { type: "azure-api-management", label: "API Management", icon: apiManagementIcon },
    { type: "azure-devops", label: "DevOps", icon: azureDevopsIcon },
    { type: "azure-service-bus", label: "Service Bus", icon: serviceBusIcon },
    { type: "azure-event-grid", label: "Event Grid", icon: eventGridIcon },
    { type: "azure-cosmos-db", label: "Cosmos DB", icon: cosmosDbIcon },
    { type: "azure-container-apps", label: "Container Apps", icon: containerAppsIcon },
    { type: "azure-key-vault", label: "Key Vault", icon: keyVaultIcon },
  ],
};

const nosqlProvider: CloudProvider = {
  name: "NoSQL",
  accent: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  services: [
    { type: "nosql-mongodb", label: "MongoDB", icon: mongodbIcon },
    { type: "nosql-redis", label: "Redis", icon: redisIcon },
    { type: "nosql-cassandra", label: "Cassandra", icon: cassandraIcon },
    { type: "nosql-couchdb", label: "CouchDB", icon: couchdbIcon },
    { type: "nosql-firebase", label: "Firebase", icon: firebaseIcon },
    { type: "nosql-influxdb", label: "InfluxDB", icon: influxdbIcon },
    { type: "nosql-rocksdb", label: "RocksDB", icon: rocksdbIcon },
  ],
};

const sqlProvider: CloudProvider = {
  name: "SQL",
  accent: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400",
  services: [
    { type: "sql-mysql", label: "MySQL", icon: mysqlIcon },
    { type: "sql-postgresql", label: "PostgreSQL", icon: postgresqlIcon },
    { type: "sql-sqlite", label: "SQLite", icon: sqliteIcon },
    { type: "sql-oracle", label: "Oracle", icon: oracleIcon },
    { type: "sql-mssql", label: "SQL Server", icon: mssqlIcon },
    { type: "sql-sqlalchemy", label: "SQLAlchemy", icon: sqlalchemyIcon },
  ],
};

const animatedProvider: CloudProvider = {
  name: "Animated",
  accent: "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800 dark:text-violet-400",
  services: [
    { type: "animated-api", label: "API", icon: animatedApiIcon },
    { type: "animated-click", label: "Click", icon: animatedClickIcon },
    { type: "animated-cloud", label: "Cloud", icon: animatedCloudIcon },
    { type: "animated-double-check", label: "Double Check", icon: animatedDoubleCheckIcon },
    { type: "animated-loading-bubble", label: "Loading Bubble", icon: animatedLoadingBubbleIcon },
    { type: "animated-loading", label: "Loading", icon: animatedLoadingIcon },
    { type: "animated-rocket", label: "Rocket", icon: animatedRocketIcon },
    { type: "animated-settings", label: "Settings", icon: animatedSettingsIcon },
    { type: "animated-target", label: "Target", icon: animatedTargetIcon },
    { type: "animated-upload-cloud", label: "Upload Cloud", icon: animatedUploadCloudIcon },
    { type: "animated-upload", label: "Upload", icon: animatedUploadIcon },
    { type: "animated-verified", label: "Verified", icon: animatedVerifiedIcon },
    { type: "animated-worker", label: "Worker", icon: animatedWorkerIcon },
  ],
};

// Tab categories
const tabCategories = {
  cloud: [gcpProvider, awsProvider, azureProvider],
  databases: [nosqlProvider, sqlProvider],
  tools: [basicProvider, processProvider],
  shapes: [shapesProvider],
  animated: [animatedProvider],
};

const allProviders = [
  shapesProvider,
  basicProvider,
  processProvider,
  gcpProvider,
  awsProvider,
  azureProvider,
  nosqlProvider,
  sqlProvider,
  animatedProvider,
];

// --- Sub-components ---

function ServiceIcon({
  icon,
  label,
}: {
  icon: string | React.ComponentType<{ className?: string }>;
  label: string;
}) {
  if (typeof icon === "string") {
    return (
      <>
        <img
          src={icon}
          alt={label}
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLDivElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        <div
          className="w-7 h-7 bg-muted rounded-md flex items-center justify-center text-[10px] font-bold tracking-tight"
          style={{ display: "none" }}
        >
          {label.substring(0, 2).toUpperCase()}
        </div>
      </>
    );
  }
  const IconComponent = icon;
  return <IconComponent className="w-full h-full text-muted-foreground" />;
}

function ServiceCard({
  service,
  isMobile,
  onSelect,
  onMobileClose,
}: {
  service: CloudService;
  isMobile: boolean;
  onSelect: (type: NodeType) => void;
  onMobileClose?: () => void;
}) {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", service.type);
    event.dataTransfer.effectAllowed = "move";
  };

  const card = (
    <div
      draggable={!isMobile}
      onDragStart={(e) => !isMobile && handleDragStart(e)}
      onClick={() => {
        onSelect(service.type);
        if (isMobile) onMobileClose?.();
      }}
      className={`group relative flex items-center cursor-pointer transition-all duration-200 active:scale-[0.97] ${isMobile
        ? "flex-row gap-3 p-3 rounded-xl border border-border/50 bg-card hover:bg-accent/50 hover:border-border hover:shadow-sm"
        : "flex-col justify-center gap-1.5 p-2.5 rounded-xl border border-border/50 bg-card hover:bg-accent/50 hover:border-border hover:shadow-sm min-h-[68px]"
        }`}
    >
      {!isMobile && (
        <GripVertical className="absolute top-1 right-1 w-3 h-3 text-muted-foreground/0 group-hover:text-muted-foreground/40 transition-colors" />
      )}
      <div className={`flex-shrink-0 flex items-center justify-center ${isMobile ? "w-8 h-8" : "w-7 h-7"
        }`}>
        <ServiceIcon icon={service.icon} label={service.label} />
      </div>
      <span className={`text-muted-foreground group-hover:text-foreground leading-tight font-medium transition-colors ${isMobile
        ? "text-sm text-left"
        : "text-[11px] text-center line-clamp-2"
        }`}>
        {service.label}
      </span>
    </div>
  );

  if (isMobile) return card;

  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>{card}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          <p>Drag or click to add <strong>{service.label}</strong></p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ProviderSection({
  provider,
  isMobile,
  isExpanded,
  onToggle,
  onServiceSelect,
  onMobileClose,
  forceExpand,
}: {
  provider: CloudProvider;
  isMobile: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onServiceSelect: (type: NodeType) => void;
  onMobileClose?: () => void;
  forceExpand?: boolean;
}) {
  const expanded = forceExpand || isExpanded;
  const gridCols = isMobile ? "grid-cols-2" : "grid-cols-3";
  const gridGap = isMobile ? "gap-2.5" : "gap-1.5";

  return (
    <div className={isMobile ? "mb-2" : "mb-1"}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between rounded-lg hover:bg-muted/60 transition-colors group ${isMobile ? "px-1 py-2.5" : "px-3 py-2"
          }`}
      >
        <div className="flex items-center gap-2">
          <h4 className={`font-semibold text-foreground uppercase tracking-wider ${isMobile ? "text-[11px]" : "text-xs"
            }`}>
            {provider.name}
          </h4>
          {provider.accent && (
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 h-4 font-medium ${provider.accent}`}
            >
              {provider.services.length}
            </Badge>
          )}
          {!provider.accent && (
            <span className="text-[10px] text-muted-foreground">
              {provider.services.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : "rotate-0"
            }`}
        />
      </button>

      <div
        className={`grid ${gridCols} ${gridGap} px-1 overflow-hidden transition-all duration-200 ${expanded ? "max-h-[2000px] opacity-100 mt-1.5 mb-2" : "max-h-0 opacity-0"
          }`}
      >
        {provider.services.map((service) => (
          <ServiceCard
            key={service.type}
            service={service}
            isMobile={isMobile}
            onSelect={onServiceSelect}
            onMobileClose={onMobileClose}
          />
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---

export const CloudServicesPanel = ({
  onServiceSelect,
  isMobile = false,
  open = false,
  onOpenChange,
}: CloudServicesPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("cloud");
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(
    new Set(["AWS", "GCP", "Azure", "Animated", "SQL", "NoSQL", "Basic", "Shapes", "Software Process"])
  );

  const isSearching = searchQuery.trim() !== "";

  // Search across all providers
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const query = searchQuery.toLowerCase();
    return allProviders
      .map((provider) => ({
        ...provider,
        services: provider.services.filter(
          (service) =>
            service.label.toLowerCase().includes(query) ||
            provider.name.toLowerCase().includes(query)
        ),
      }))
      .filter((provider) => provider.services.length > 0);
  }, [searchQuery, isSearching]);

  const totalSearchResults = searchResults.reduce(
    (sum, p) => sum + p.services.length,
    0
  );

  const toggleProvider = (providerName: string) => {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(providerName)) {
      newExpanded.delete(providerName);
    } else {
      newExpanded.add(providerName);
    }
    setExpandedProviders(newExpanded);
  };

  const currentProviders =
    tabCategories[activeTab as keyof typeof tabCategories] || [];

  const tabButtons = [
    { value: "cloud", icon: Cloud, label: "Cloud" },
    { value: "databases", icon: Database, label: "Databases" },
    { value: "tools", icon: Box, label: "Tools" },
    { value: "shapes", icon: Shapes, label: "Shapes" },
    { value: "animated", icon: Sparkles, label: "Animated" },
  ] as const;

  const searchInput = (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search components..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full text-sm rounded-lg border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:bg-background transition-all ${isMobile ? "pl-10 pr-10 py-2.5" : "pl-8 pr-8 py-2"
          }`}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );

  const searchResultsContent = (
    <ScrollArea className="flex-1">
      <div className={isMobile ? "px-4 pb-4" : "px-3 pb-3"}>
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-xs text-muted-foreground">
            {totalSearchResults} result{totalSearchResults !== 1 ? "s" : ""}
          </span>
        </div>
        {searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No components found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Try a different search term
            </p>
          </div>
        ) : (
          searchResults.map((provider) => (
            <ProviderSection
              key={provider.name}
              provider={provider}
              isMobile={isMobile}
              isExpanded={true}
              onToggle={() => { }}
              onServiceSelect={onServiceSelect}
              onMobileClose={() => onOpenChange?.(false)}
              forceExpand
            />
          ))
        )}
      </div>
    </ScrollArea>
  );

  const providerList = (
    <ScrollArea className="flex-1">
      <div className={isMobile ? "px-3 py-3" : "px-2 py-2"}>
        {currentProviders.map((provider) => (
          <ProviderSection
            key={provider.name}
            provider={provider}
            isMobile={isMobile}
            isExpanded={expandedProviders.has(provider.name)}
            onToggle={() => toggleProvider(provider.name)}
            onServiceSelect={onServiceSelect}
            onMobileClose={() => onOpenChange?.(false)}
          />
        ))}
      </div>
    </ScrollArea>
  );

  // Mobile: render inside a Sheet overlay
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[85vw] max-w-[360px] p-0 flex flex-col">
          {/* Mobile Header */}
          <SheetHeader className="flex-shrink-0 px-4 pt-5 pb-3">
            <SheetTitle className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base font-semibold">Components</span>
            </SheetTitle>
          </SheetHeader>

          {/* Mobile Search */}
          <div className="flex-shrink-0 px-4 pb-3">
            {searchInput}
          </div>

          {isSearching ? (
            searchResultsContent
          ) : (
            <>
              {/* Mobile Filter Pills - horizontal scroll */}
              <div className="flex-shrink-0 px-4 pb-3">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {tabButtons.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.value;
                    return (
                      <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Content */}
              {providerList}
            </>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: collapsed state with icon strip
  if (isCollapsed) {
    return (
      <div className="w-12 bg-background border-r border-border h-full flex flex-col items-center pt-3 gap-1">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Expand panel</p>
            </TooltipContent>
          </Tooltip>

          <div className="w-6 h-px bg-border my-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => { setIsCollapsed(false); setActiveTab("cloud"); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Cloud className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Cloud Services</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => { setIsCollapsed(false); setActiveTab("databases"); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Database className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Databases</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => { setIsCollapsed(false); setActiveTab("tools"); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Box className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Tools</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => { setIsCollapsed(false); setActiveTab("shapes"); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Shapes className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Shapes</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => { setIsCollapsed(false); setActiveTab("animated"); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Animated</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Desktop: expanded panel
  return (
    <div className="w-[320px] bg-background border-r border-border h-full flex flex-col">
      <div className="flex flex-col h-full">
        {/* Desktop Header */}
        <div className="flex-shrink-0 px-3 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Components</h3>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              title="Collapse panel"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {searchInput}
        </div>

        {isSearching ? (
          searchResultsContent
        ) : (
          <>
            {/* Desktop Tabs */}
            <div className="flex-shrink-0 px-3 pb-2">
              <TooltipProvider delayDuration={200}>
                <div className="flex items-center gap-1">
                  {tabButtons.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.value;
                    return (
                      <Tooltip key={tab.value}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setActiveTab(tab.value)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                              ? "bg-primary/15 text-primary shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {isActive && (
                              <span className="leading-none">{tab.label}</span>
                            )}
                          </button>
                        </TooltipTrigger>
                        {!isActive && (
                          <TooltipContent side="bottom" className="text-xs">
                            {tab.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>

            {providerList}
          </>
        )}
      </div>
    </div>
  );
};
