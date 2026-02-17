import { describe, it, expect, vi } from "vitest";

// Mock all SVG/GIF imports to return placeholder strings
vi.mock("../../cloud-services/gcp/cloud-run.svg", () => ({ default: "gcp-cloud-run.svg" }));
vi.mock("../../cloud-services/gcp/cloud-storage.svg", () => ({ default: "gcp-cloud-storage.svg" }));
vi.mock("../../cloud-services/gcp/bigquery.svg", () => ({ default: "gcp-bigquery.svg" }));
vi.mock("../../cloud-services/gcp/pub-sub.svg", () => ({ default: "gcp-pub-sub.svg" }));
vi.mock("../../cloud-services/gcp/apigee.svg", () => ({ default: "gcp-apigee.svg" }));
vi.mock("../../cloud-services/gcp/billing.svg", () => ({ default: "gcp-billing.svg" }));
vi.mock("../../cloud-services/gcp/cloud-build.svg", () => ({ default: "gcp-cloud-build.svg" }));
vi.mock("../../cloud-services/gcp/cloud-monitoring.svg", () => ({ default: "gcp-cloud-monitoring.svg" }));
vi.mock("../../cloud-services/gcp/cloud-sql.svg", () => ({ default: "gcp-cloud-sql.svg" }));
vi.mock("../../cloud-services/gcp/compute-engine.svg", () => ({ default: "gcp-compute-engine.svg" }));
vi.mock("../../cloud-services/gcp/iam.svg", () => ({ default: "gcp-iam.svg" }));
vi.mock("../../cloud-services/gcp/kubernetes.svg", () => ({ default: "gcp-kubernetes.svg" }));
vi.mock("../../cloud-services/gcp/security.svg", () => ({ default: "gcp-security.svg" }));

vi.mock("../../cloud-services/aws/ec2.svg", () => ({ default: "aws-ec2.svg" }));
vi.mock("../../cloud-services/aws/s3.svg", () => ({ default: "aws-s3.svg" }));
vi.mock("../../cloud-services/aws/lambda.svg", () => ({ default: "aws-lambda.svg" }));
vi.mock("../../cloud-services/aws/rds.svg", () => ({ default: "aws-rds.svg" }));
vi.mock("../../cloud-services/aws/eks.svg", () => ({ default: "aws-eks.svg" }));
vi.mock("../../cloud-services/aws/cloudwatch.svg", () => ({ default: "aws-cloudwatch.svg" }));
vi.mock("../../cloud-services/aws/iam.svg", () => ({ default: "aws-iam.svg" }));
vi.mock("../../cloud-services/aws/api-gateway.svg", () => ({ default: "aws-api-gateway.svg" }));
vi.mock("../../cloud-services/aws/codebuild.svg", () => ({ default: "aws-codebuild.svg" }));
vi.mock("../../cloud-services/aws/codepipeline.svg", () => ({ default: "aws-codepipeline.svg" }));
vi.mock("../../cloud-services/aws/sqs.svg", () => ({ default: "aws-sqs.svg" }));
vi.mock("../../cloud-services/aws/sns.svg", () => ({ default: "aws-sns.svg" }));
vi.mock("../../cloud-services/aws/dynamodb.svg", () => ({ default: "aws-dynamodb.svg" }));
vi.mock("../../cloud-services/aws/cloudfront.svg", () => ({ default: "aws-cloudfront.svg" }));
vi.mock("../../cloud-services/aws/fargate.svg", () => ({ default: "aws-fargate.svg" }));

vi.mock("../../cloud-services/azure/vm.svg", () => ({ default: "azure-vm.svg" }));
vi.mock("../../cloud-services/azure/blob-storage.svg", () => ({ default: "azure-blob-storage.svg" }));
vi.mock("../../cloud-services/azure/functions.svg", () => ({ default: "azure-functions.svg" }));
vi.mock("../../cloud-services/azure/sql-database.svg", () => ({ default: "azure-sql-database.svg" }));
vi.mock("../../cloud-services/azure/aks.svg", () => ({ default: "azure-aks.svg" }));
vi.mock("../../cloud-services/azure/monitor.svg", () => ({ default: "azure-monitor.svg" }));
vi.mock("../../cloud-services/azure/entra-id.svg", () => ({ default: "azure-entra-id.svg" }));
vi.mock("../../cloud-services/azure/api-management.svg", () => ({ default: "azure-api-management.svg" }));
vi.mock("../../cloud-services/azure/devops.svg", () => ({ default: "azure-devops.svg" }));
vi.mock("../../cloud-services/azure/service-bus.svg", () => ({ default: "azure-service-bus.svg" }));
vi.mock("../../cloud-services/azure/event-grid.svg", () => ({ default: "azure-event-grid.svg" }));
vi.mock("../../cloud-services/azure/cosmos-db.svg", () => ({ default: "azure-cosmos-db.svg" }));
vi.mock("../../cloud-services/azure/container-apps.svg", () => ({ default: "azure-container-apps.svg" }));
vi.mock("../../cloud-services/azure/key-vault.svg", () => ({ default: "azure-key-vault.svg" }));

vi.mock("../../cloud-services/nosql-db/mongodb.svg", () => ({ default: "nosql-mongodb.svg" }));
vi.mock("../../cloud-services/nosql-db/redis.svg", () => ({ default: "nosql-redis.svg" }));
vi.mock("../../cloud-services/nosql-db/cassandra.svg", () => ({ default: "nosql-cassandra.svg" }));
vi.mock("../../cloud-services/nosql-db/couchdb.svg", () => ({ default: "nosql-couchdb.svg" }));
vi.mock("../../cloud-services/nosql-db/firebase.svg", () => ({ default: "nosql-firebase.svg" }));
vi.mock("../../cloud-services/nosql-db/influxdb.svg", () => ({ default: "nosql-influxdb.svg" }));
vi.mock("../../cloud-services/nosql-db/rocksdb.svg", () => ({ default: "nosql-rocksdb.svg" }));

vi.mock("../../cloud-services/sql-db/mysql.svg", () => ({ default: "sql-mysql.svg" }));
vi.mock("../../cloud-services/sql-db/postgressql.svg", () => ({ default: "sql-postgresql.svg" }));
vi.mock("../../cloud-services/sql-db/sqlite.svg", () => ({ default: "sql-sqlite.svg" }));
vi.mock("../../cloud-services/sql-db/oracle.svg", () => ({ default: "sql-oracle.svg" }));
vi.mock("../../cloud-services/sql-db/microsoft-sql-server.svg", () => ({ default: "sql-mssql.svg" }));
vi.mock("../../cloud-services/sql-db/sqlalchemy.svg", () => ({ default: "sql-sqlalchemy.svg" }));

vi.mock("../../cloud-services/shapes/circle.svg", () => ({ default: "shape-circle.svg" }));
vi.mock("../../cloud-services/shapes/square.svg", () => ({ default: "shape-square.svg" }));
vi.mock("../../cloud-services/shapes/star.svg", () => ({ default: "shape-star.svg" }));
vi.mock("../../cloud-services/shapes/hexagon.svg", () => ({ default: "shape-hexagon.svg" }));

vi.mock("../../cloud-services/animated/api.gif", () => ({ default: "animated-api.gif" }));
vi.mock("../../cloud-services/animated/click.gif", () => ({ default: "animated-click.gif" }));
vi.mock("../../cloud-services/animated/cloud.gif", () => ({ default: "animated-cloud.gif" }));
vi.mock("../../cloud-services/animated/double-check.gif", () => ({ default: "animated-double-check.gif" }));
vi.mock("../../cloud-services/animated/loading-bubble.gif", () => ({ default: "animated-loading-bubble.gif" }));
vi.mock("../../cloud-services/animated/loading.gif", () => ({ default: "animated-loading.gif" }));
vi.mock("../../cloud-services/animated/rocket.gif", () => ({ default: "animated-rocket.gif" }));
vi.mock("../../cloud-services/animated/settings.gif", () => ({ default: "animated-settings.gif" }));
vi.mock("../../cloud-services/animated/target.gif", () => ({ default: "animated-target.gif" }));
vi.mock("../../cloud-services/animated/upload-cloud.gif", () => ({ default: "animated-upload-cloud.gif" }));
vi.mock("../../cloud-services/animated/upload.gif", () => ({ default: "animated-upload.gif" }));
vi.mock("../../cloud-services/animated/verified.gif", () => ({ default: "animated-verified.gif" }));
vi.mock("../../cloud-services/animated/worker.gif", () => ({ default: "animated-worker.gif" }));

import { cloudServiceIcons, isCloudService } from "../node-icons";
import type { NodeType } from "../../../types/diagrams";

describe("isCloudService", () => {
  const cloudTypes: NodeType[] = [
    "gcp-cloud-run", "aws-ec2", "azure-vm",
    "nosql-mongodb", "sql-mysql",
    "shape-circle", "animated-api",
  ];

  it.each(cloudTypes)("returns true for %s", (type) => {
    expect(isCloudService(type)).toBe(true);
  });

  const nonCloudTypes: NodeType[] = [
    "service", "database", "server", "client", "storage", "api", "text", "group",
    "process-requirements", "process-design", "process-development",
    "process-testing", "process-deployment", "process-monitoring",
  ];

  it.each(nonCloudTypes)("returns false for %s", (type) => {
    expect(isCloudService(type)).toBe(false);
  });
});

describe("cloudServiceIcons", () => {
  it("has a truthy string value for every key", () => {
    for (const [key, value] of Object.entries(cloudServiceIcons)) {
      expect(value, `icon for "${key}" should be a truthy string`).toBeTruthy();
      expect(typeof value).toBe("string");
    }
  });
});
