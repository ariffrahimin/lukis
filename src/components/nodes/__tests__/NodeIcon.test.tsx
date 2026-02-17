import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NodeIcon } from "../NodeIcon";
import type { NodeType } from "../../../types/diagrams";

describe("NodeIcon", () => {
  const basicTypes: { type: NodeType; expectedTag: string }[] = [
    { type: "service", expectedTag: "svg" },
    { type: "database", expectedTag: "svg" },
    { type: "server", expectedTag: "svg" },
    { type: "client", expectedTag: "svg" },
    { type: "storage", expectedTag: "svg" },
    { type: "api", expectedTag: "svg" },
    { type: "text", expectedTag: "svg" },
    { type: "group", expectedTag: "svg" },
    { type: "process-requirements", expectedTag: "svg" },
    { type: "process-design", expectedTag: "svg" },
    { type: "process-development", expectedTag: "svg" },
    { type: "process-testing", expectedTag: "svg" },
    { type: "process-deployment", expectedTag: "svg" },
    { type: "process-monitoring", expectedTag: "svg" },
  ];

  it.each(basicTypes)("renders an SVG for $type", ({ type }) => {
    const { container } = render(<NodeIcon type={type} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("falls back to Cloud icon for unknown types", () => {
    const { container } = render(
      <NodeIcon type={"gcp-cloud-run" as NodeType} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("merges custom className with base w-5 h-5", () => {
    const { container } = render(
      <NodeIcon type="service" className="text-red-500" />
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("w-5");
    expect(svg?.getAttribute("class")).toContain("h-5");
    expect(svg?.getAttribute("class")).toContain("text-red-500");
  });
});
