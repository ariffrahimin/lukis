import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { NodeHandles } from "../NodeHandles";

vi.mock("@xyflow/react", () => ({
  Handle: ({ id, style, ...props }: Record<string, unknown>) => (
    <div
      data-testid={id as string}
      data-type={(props as Record<string, unknown>).type as string}
      style={style as React.CSSProperties}
    />
  ),
  Position: { Top: "top", Right: "right", Bottom: "bottom", Left: "left" },
}));

describe("NodeHandles", () => {
  it("renders 8 handles", () => {
    const { container } = render(<NodeHandles visible={true} />);
    const handles = container.querySelectorAll("[data-testid]");
    expect(handles.length).toBe(8);
  });

  it("visible=true sets opacity 1", () => {
    const { getByTestId } = render(<NodeHandles visible={true} />);
    const handle = getByTestId("target-top");
    expect(handle.style.opacity).toBe("1");
  });

  it("visible=false sets opacity 0", () => {
    const { getByTestId } = render(<NodeHandles visible={false} />);
    const handle = getByTestId("target-top");
    expect(handle.style.opacity).toBe("0");
  });
});
