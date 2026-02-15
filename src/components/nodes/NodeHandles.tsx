import { Handle, Position } from "@xyflow/react";

const HANDLE_CONFIGS = [
  { type: "target" as const, position: Position.Top, id: "target-top", style: { top: -4, left: "50%", transform: "translateX(-50%)" } },
  { type: "target" as const, position: Position.Right, id: "target-right", style: { right: -4, top: "50%", transform: "translateY(-50%)" } },
  { type: "target" as const, position: Position.Bottom, id: "target-bottom", style: { bottom: -4, left: "50%", transform: "translateX(-50%)" } },
  { type: "target" as const, position: Position.Left, id: "target-left", style: { left: -4, top: "50%", transform: "translateY(-50%)" } },
  { type: "source" as const, position: Position.Top, id: "source-top", style: { top: -4, left: "50%", transform: "translateX(-50%)" } },
  { type: "source" as const, position: Position.Right, id: "source-right", style: { right: -4, top: "50%", transform: "translateY(-50%)" } },
  { type: "source" as const, position: Position.Bottom, id: "source-bottom", style: { bottom: -4, left: "50%", transform: "translateX(-50%)" } },
  { type: "source" as const, position: Position.Left, id: "source-left", style: { left: -4, top: "50%", transform: "translateY(-50%)" } },
] as const;

interface NodeHandlesProps {
  visible: boolean;
}

export const NodeHandles = ({ visible }: NodeHandlesProps) => (
  <>
    {HANDLE_CONFIGS.map(({ type, position, id, style }) => (
      <Handle
        key={id}
        type={type}
        position={position}
        id={id}
        style={{
          background: type === "source" ? "#10b981" : "#3b82f6",
          width: 8,
          height: 8,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          ...style,
        }}
      />
    ))}
  </>
);
