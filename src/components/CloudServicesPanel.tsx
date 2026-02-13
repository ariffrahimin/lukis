import { useState } from "react";
import { type NodeType } from "../types/diagrams";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
// Basic Icons (using Lucide React icons)
import {
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
} from "lucide-react";

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

// Azure Icons
import vmIcon from "./cloud-services/azure/vm.svg";
import blobStorageIcon from "./cloud-services/azure/blob-storage.svg";
import functionsIcon from "./cloud-services/azure/functions.svg";
import sqlDatabaseIcon from "./cloud-services/azure/sql-database.svg";

interface CloudService {
  type: NodeType;
  label: string;
  icon: string | React.ComponentType<{ className?: string }>;
}

interface CloudProvider {
  name: string;
  services: CloudService[];
}

interface CloudServicesPanelProps {
  onServiceSelect: (type: NodeType) => void;
  isMobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CloudServicesPanel = ({
  onServiceSelect,
  isMobile = false,
  open = false,
  onOpenChange,
}: CloudServicesPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(
    new Set([]),
  );
  const cloudProviders: CloudProvider[] = [
    {
      name: "Basic",
      services: [
        {
          type: "service",
          label: "Service",
          icon: Cloud,
        },
        {
          type: "database",
          label: "Database",
          icon: Database,
        },
        {
          type: "server",
          label: "Server",
          icon: Server,
        },
        {
          type: "client",
          label: "Client",
          icon: Monitor,
        },
        {
          type: "storage",
          label: "Storage",
          icon: HardDrive,
        },
        {
          type: "api",
          label: "API Gateway",
          icon: Globe,
        },
      ],
    },
    {
      name: "Software Process",
      services: [
        {
          type: "process-requirements",
          label: "Requirements",
          icon: FileText,
        },
        {
          type: "process-design",
          label: "Design",
          icon: PenTool,
        },
        {
          type: "process-development",
          label: "Development",
          icon: Code,
        },
        {
          type: "process-testing",
          label: "Testing",
          icon: Bug,
        },
        {
          type: "process-deployment",
          label: "Deployment",
          icon: Rocket,
        },
        {
          type: "process-monitoring",
          label: "Monitoring",
          icon: Activity,
        },
      ],
    },
    {
      name: "GCP",
      services: [
        {
          type: "gcp-cloud-run",
          label: "Cloud Run",
          icon: cloudRunIcon,
        },
        {
          type: "gcp-cloud-storage",
          label: "Cloud Storage",
          icon: cloudStorageIcon,
        },
        {
          type: "gcp-bigquery",
          label: "BigQuery",
          icon: bigqueryIcon,
        },
        {
          type: "gcp-pub-sub",
          label: "Pub/Sub",
          icon: pubSubIcon,
        },
        {
          type: "gcp-apigee",
          label: "Apigee",
          icon: apigeeIcon,
        },
        {
          type: "gcp-billing",
          label: "Billing",
          icon: billingIcon,
        },
        {
          type: "gcp-cloud-build",
          label: "Cloud Build",
          icon: cloudBuildIcon,
        },
        {
          type: "gcp-cloud-monitoring",
          label: "Cloud Monitoring",
          icon: cloudMonitoringIcon,
        },
        {
          type: "gcp-cloud-sql",
          label: "Cloud SQL",
          icon: cloudSqlIcon,
        },
        {
          type: "gcp-compute-engine",
          label: "Compute Engine",
          icon: computeEngineIcon,
        },
        {
          type: "gcp-iam",
          label: "IAM",
          icon: iamIcon,
        },
        {
          type: "gcp-kubernetes",
          label: "Kubernetes",
          icon: kubernetesIcon,
        },
        {
          type: "gcp-security",
          label: "Security",
          icon: securityIcon,
        },
      ],
    },
    {
      name: "AWS",
      services: [
        {
          type: "aws-ec2",
          label: "EC2",
          icon: ec2Icon,
        },
        {
          type: "aws-s3",
          label: "S3",
          icon: s3Icon,
        },
        {
          type: "aws-lambda",
          label: "Lambda",
          icon: lambdaIcon,
        },
        {
          type: "aws-rds",
          label: "RDS",
          icon: rdsIcon,
        },
      ],
    },
    {
      name: "Azure",
      services: [
        {
          type: "azure-vm",
          label: "VM",
          icon: vmIcon,
        },
        {
          type: "azure-blob-storage",
          label: "Blob Storage",
          icon: blobStorageIcon,
        },
        {
          type: "azure-functions",
          label: "Functions",
          icon: functionsIcon,
        },
        {
          type: "azure-sql-database",
          label: "SQL Database",
          icon: sqlDatabaseIcon,
        },
      ],
    },
  ];
  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleProvider = (providerName: string) => {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(providerName)) {
      newExpanded.delete(providerName);
    } else {
      newExpanded.add(providerName);
    }
    setExpandedProviders(newExpanded);
  };

  const allProvidersExpanded = expandedProviders.size === cloudProviders.length;

  const toggleAllProviders = () => {
    if (allProvidersExpanded) {
      setExpandedProviders(new Set());
      return;
    }

    setExpandedProviders(new Set(cloudProviders.map((p) => p.name)));
  };

  const panelContent = (
    <>
      <div className={isMobile ? "p-4 border-b border-border" : "p-4 border-b border-border"}>
        {!isMobile && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Node & Shapes</h3>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Hide Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleAllProviders}
            className="px-2 py-1 rounded hover:bg-muted transition-colors text-sm text-muted-foreground"
          >
            {allProvidersExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {cloudProviders.map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => toggleProvider(provider.name)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <h4 className="text-sm font-medium text-foreground">
                {provider.name}
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                  expandedProviders.has(provider.name) ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {expandedProviders.has(provider.name) && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {provider.services.map((service) => (
                  <div
                    key={service.type}
                    draggable={!isMobile}
                    onDragStart={(e) => !isMobile && handleDragStart(e, service.type)}
                    onClick={() => {
                      onServiceSelect(service.type);
                      if (isMobile) onOpenChange?.(false);
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border border-border bg-card hover:bg-muted/50 cursor-pointer transition-all duration-200 min-h-[60px]"
                  >
                    <div className="w-8 h-8 flex-shrink-0">
                      {typeof service.icon === 'string' ? (
                        <>
                          <img
                            src={service.icon}
                            alt={service.label}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const fallback =
                                target.nextElementSibling as HTMLDivElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div
                            className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium"
                            style={{ display: "none" }}
                          >
                            {service.label.substring(0, 2).toUpperCase()}
                          </div>
                        </>
                      ) : (
                        <service.icon className="w-full h-full text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-xs text-foreground text-center mt-1 leading-tight">
                      {service.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Separator className="mt-3" />
          </div>
        ))}
      </div>
    </>
  );

  // Mobile: render inside a Sheet overlay
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle>Node & Shapes</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col overflow-hidden">
            {panelContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop/Tablet: static sidebar
  if (isCollapsed) {
    return (
      <div className="w-12 bg-background border-r border-border h-full flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Show Cloud Services"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-background border-r border-border h-full flex flex-col">
      {panelContent}
    </div>
  );
};
