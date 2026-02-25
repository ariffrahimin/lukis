import { describe, it, expect } from "vitest";
import { nodeTypeStyles } from "../node-styles";
import type { NodeType } from "../../../types/diagrams";

const allNodeTypes: NodeType[] = [
  "service", "database", "server", "client", "storage", "api", "text", "sticky", "subflow",
  "process-requirements", "process-design", "process-development",
  "process-testing", "process-deployment", "process-monitoring",
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
  "oci-virtual-machine", "oci-object-storage", "oci-vcn", "oci-autonomous-database",
  "oci-load-balancer", "oci-oke", "oci-iam", "oci-functions", "oci-api-gateway",
  "oci-block-storage", "oci-dns", "oci-waf", "oci-monitoring", "oci-container-registry",
  "oci-exadata",
  "nosql-mongodb", "nosql-redis", "nosql-cassandra", "nosql-couchdb",
  "nosql-firebase", "nosql-influxdb", "nosql-rocksdb",
  "sql-mysql", "sql-postgresql", "sql-sqlite", "sql-oracle", "sql-mssql", "sql-sqlalchemy",
  "proglang-apl", "proglang-ballerina", "proglang-c", "proglang-clojure", "proglang-clojurescript",
  "proglang-cpp", "proglang-csharp", "proglang-erlang", "proglang-fsharp", "proglang-go",
  "proglang-haskell", "proglang-jule", "proglang-nim", "proglang-objectivec", "proglang-perl",
  "proglang-purescript", "proglang-python", "proglang-ruby", "proglang-swift", "proglang-vala",
  "proglang-vyper", "proglang-zig",
  "shape-circle", "shape-square", "shape-star", "shape-hexagon",
  "shape-round-rectangle", "shape-diamond", "shape-arrow-rectangle", "shape-cylinder",
  "shape-parallelogram", "shape-plus", "shape-triangle",
  "animated-api", "animated-click", "animated-cloud", "animated-double-check",
  "animated-loading-bubble", "animated-loading", "animated-rocket", "animated-settings",
  "animated-target", "animated-upload-cloud", "animated-upload", "animated-verified",
  "animated-worker",
];

describe("nodeTypeStyles", () => {
  it("has an entry for every NodeType", () => {
    for (const type of allNodeTypes) {
      expect(nodeTypeStyles[type], `missing style for "${type}"`).toBeDefined();
    }
  });

  it("every style has bg, border, icon keys with non-empty strings", () => {
    for (const [type, style] of Object.entries(nodeTypeStyles)) {
      expect(style.bg, `bg for "${type}"`).toBeTruthy();
      expect(style.border, `border for "${type}"`).toBeTruthy();
      expect(style.icon, `icon for "${type}"`).toBeTruthy();
      expect(typeof style.bg).toBe("string");
      expect(typeof style.border).toBe("string");
      expect(typeof style.icon).toBe("string");
    }
  });

  it("text type has transparent styles", () => {
    const textStyle = nodeTypeStyles["text"];
    expect(textStyle.bg).toContain("transparent");
    expect(textStyle.border).toContain("transparent");
  });

  it("subflow type includes border-dashed", () => {
    const subflowStyle = nodeTypeStyles["subflow"];
    expect(subflowStyle.border).toContain("border-dashed");
  });

  it("all aws-* types share identical style objects", () => {
    const awsTypes = allNodeTypes.filter((t) => t.startsWith("aws-"));
    const first = nodeTypeStyles[awsTypes[0]];
    for (const type of awsTypes.slice(1)) {
      expect(nodeTypeStyles[type]).toBe(first);
    }
  });

  it("all azure-* types share identical style objects", () => {
    const azureTypes = allNodeTypes.filter((t) => t.startsWith("azure-"));
    const first = nodeTypeStyles[azureTypes[0]];
    for (const type of azureTypes.slice(1)) {
      expect(nodeTypeStyles[type]).toBe(first);
    }
  });

  it("all oci-* types share identical style objects", () => {
    const ociTypes = allNodeTypes.filter((t) => t.startsWith("oci-"));
    const first = nodeTypeStyles[ociTypes[0]];
    for (const type of ociTypes.slice(1)) {
      expect(nodeTypeStyles[type]).toBe(first);
    }
  });
});
