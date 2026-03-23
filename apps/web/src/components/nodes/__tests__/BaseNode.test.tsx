import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";

// Mock all SVG/GIF asset imports used by node-icons
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
vi.mock("../../cloud-services/oci/virtual-machine.svg", () => ({ default: "oci-virtual-machine.svg" }));
vi.mock("../../cloud-services/oci/object-storage.svg", () => ({ default: "oci-object-storage.svg" }));
vi.mock("../../cloud-services/oci/vcn.svg", () => ({ default: "oci-vcn.svg" }));
vi.mock("../../cloud-services/oci/autonomous-database.svg", () => ({ default: "oci-autonomous-database.svg" }));
vi.mock("../../cloud-services/oci/load-balancer.svg", () => ({ default: "oci-load-balancer.svg" }));
vi.mock("../../cloud-services/oci/oke.svg", () => ({ default: "oci-oke.svg" }));
vi.mock("../../cloud-services/oci/iam.svg", () => ({ default: "oci-iam.svg" }));
vi.mock("../../cloud-services/oci/functions.svg", () => ({ default: "oci-functions.svg" }));
vi.mock("../../cloud-services/oci/api-gateway.svg", () => ({ default: "oci-api-gateway.svg" }));
vi.mock("../../cloud-services/oci/block-storage.svg", () => ({ default: "oci-block-storage.svg" }));
vi.mock("../../cloud-services/oci/dns.svg", () => ({ default: "oci-dns.svg" }));
vi.mock("../../cloud-services/oci/waf.svg", () => ({ default: "oci-waf.svg" }));
vi.mock("../../cloud-services/oci/monitoring.svg", () => ({ default: "oci-monitoring.svg" }));
vi.mock("../../cloud-services/oci/container-registry.svg", () => ({ default: "oci-container-registry.svg" }));
vi.mock("../../cloud-services/oci/exadata.svg", () => ({ default: "oci-exadata.svg" }));
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
vi.mock("../../cloud-services/programming-language/APL.svg", () => ({ default: "proglang-apl.svg" }));
vi.mock("../../cloud-services/programming-language/Ballerina.svg", () => ({ default: "proglang-ballerina.svg" }));
vi.mock("../../cloud-services/programming-language/CLang.svg", () => ({ default: "proglang-c.svg" }));
vi.mock("../../cloud-services/programming-language/Clojure.svg", () => ({ default: "proglang-clojure.svg" }));
vi.mock("../../cloud-services/programming-language/ClojureScript.svg", () => ({ default: "proglang-clojurescript.svg" }));
vi.mock("../../cloud-services/programming-language/CPlusPlus.svg", () => ({ default: "proglang-cpp.svg" }));
vi.mock("../../cloud-services/programming-language/CSharp.svg", () => ({ default: "proglang-csharp.svg" }));
vi.mock("../../cloud-services/programming-language/ErLang.svg", () => ({ default: "proglang-erlang.svg" }));
vi.mock("../../cloud-services/programming-language/FSharp.svg", () => ({ default: "proglang-fsharp.svg" }));
vi.mock("../../cloud-services/programming-language/GoLang.svg", () => ({ default: "proglang-go.svg" }));
vi.mock("../../cloud-services/programming-language/Haskell.svg", () => ({ default: "proglang-haskell.svg" }));
vi.mock("../../cloud-services/programming-language/Jule.svg", () => ({ default: "proglang-jule.svg" }));
vi.mock("../../cloud-services/programming-language/Nim.svg", () => ({ default: "proglang-nim.svg" }));
vi.mock("../../cloud-services/programming-language/ObjectiveC.svg", () => ({ default: "proglang-objectivec.svg" }));
vi.mock("../../cloud-services/programming-language/Perl.svg", () => ({ default: "proglang-perl.svg" }));
vi.mock("../../cloud-services/programming-language/PureScript.svg", () => ({ default: "proglang-purescript.svg" }));
vi.mock("../../cloud-services/programming-language/Python.svg", () => ({ default: "proglang-python.svg" }));
vi.mock("../../cloud-services/programming-language/Ruby.svg", () => ({ default: "proglang-ruby.svg" }));
vi.mock("../../cloud-services/programming-language/Swift.svg", () => ({ default: "proglang-swift.svg" }));
vi.mock("../../cloud-services/programming-language/Typescript.svg", () => ({ default: "proglang-typescript.svg" }));
vi.mock("../../cloud-services/programming-language/Javascript.svg", () => ({ default: "proglang-javascript.svg" }));
vi.mock("../../cloud-services/programming-language/Vala.svg", () => ({ default: "proglang-vala.svg" }));
vi.mock("../../cloud-services/programming-language/Vyper.svg", () => ({ default: "proglang-vyper.svg" }));
vi.mock("../../cloud-services/programming-language/Zig.svg", () => ({ default: "proglang-zig.svg" }));
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

// Mock @xyflow/react
vi.mock("@xyflow/react", () => ({
  NodeResizer: () => <div data-testid="node-resizer" />,
  Handle: ({ id, style }: { id: string; style: React.CSSProperties }) => (
    <div data-testid={id} style={style} />
  ),
  Position: { Top: "top", Right: "right", Bottom: "bottom", Left: "left" },
  useReactFlow: () => ({ setNodes: vi.fn() }),
}));

import BaseNodeMemo from "../BaseNode";

// BaseNode is wrapped in memo — unwrap for testing by rendering directly
const BaseNode = BaseNodeMemo;

describe("BaseNode", () => {
  it("text node: renders label, no NodeIcon SVG", () => {
    const { container, getByText } = render(
      <BaseNode id="1" data={{ label: "Hello", nodeType: "text" }} />
    );
    expect(getByText("Hello")).toBeTruthy();
    // Text node should NOT contain a NodeIcon svg
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(0);
  });

  it("cloud service node: renders <img> with correct src", () => {
    const { container } = render(
      <BaseNode
        id="2"
        data={{ label: "EC2", nodeType: "aws-ec2" }}
      />
    );
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("aws-ec2.svg");
  });

  it("cloud service node: image error triggers fallback text", () => {
    const { container } = render(
      <BaseNode
        id="3"
        data={{ label: "EC2 Instance", nodeType: "aws-ec2" }}
      />
    );
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img).toBeTruthy();

    // Simulate image error
    fireEvent.error(img);

    // After error, the img should be hidden
    expect(img.style.display).toBe("none");

    // Fallback div should be visible
    const fallback = img.nextElementSibling as HTMLElement;
    expect(fallback).toBeTruthy();
    expect(fallback.style.display).toBe("flex");
    expect(fallback.textContent).toBe("EC");
  });

  it("default node: renders NodeIcon SVG + label", () => {
    const { container, getByText } = render(
      <BaseNode id="4" data={{ label: "My Server", nodeType: "server" }} />
    );
    expect(getByText("My Server")).toBeTruthy();
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("selected node: shows ring styling", () => {
    const { container } = render(
      <BaseNode
        id="6"
        data={{ label: "Service", nodeType: "service" }}
        selected={true}
      />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("ring-2");
  });

  it("description renders when provided", () => {
    const { getByText } = render(
      <BaseNode
        id="7"
        data={{ label: "API", nodeType: "api", description: "My API desc" }}
      />
    );
    expect(getByText("My API desc")).toBeTruthy();
  });
});
