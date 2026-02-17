import { memo, useState, type ReactElement } from "react";
import { NodeResizer } from "@xyflow/react";
import { type NodeType } from "../../types/diagrams";
import { NodeHandles } from "./NodeHandles";
import { EditableLabel } from "./EditableLabel";

interface ShapeNodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
    [key: string]: unknown;
  };
  selected?: boolean;
}

const SHAPE_COLORS: Record<string, { fill: string; stroke: string }> = {
  "shape-circle": { fill: "rgba(236, 72, 153, 0.15)", stroke: "rgba(236, 72, 153, 0.7)" },
  "shape-square": { fill: "rgba(59, 130, 246, 0.15)", stroke: "rgba(59, 130, 246, 0.7)" },
  "shape-star": { fill: "rgba(234, 179, 8, 0.15)", stroke: "rgba(234, 179, 8, 0.7)" },
  "shape-hexagon": { fill: "rgba(20, 184, 166, 0.15)", stroke: "rgba(20, 184, 166, 0.7)" },
  "shape-round-rectangle": { fill: "rgba(139, 92, 246, 0.15)", stroke: "rgba(139, 92, 246, 0.7)" },
  "shape-diamond": { fill: "rgba(249, 115, 22, 0.15)", stroke: "rgba(249, 115, 22, 0.7)" },
  "shape-arrow-rectangle": { fill: "rgba(6, 182, 212, 0.15)", stroke: "rgba(6, 182, 212, 0.7)" },
  "shape-cylinder": { fill: "rgba(16, 185, 129, 0.15)", stroke: "rgba(16, 185, 129, 0.7)" },
  "shape-parallelogram": { fill: "rgba(168, 85, 247, 0.15)", stroke: "rgba(168, 85, 247, 0.7)" },
  "shape-plus": { fill: "rgba(239, 68, 68, 0.15)", stroke: "rgba(239, 68, 68, 0.7)" },
  "shape-triangle": { fill: "rgba(245, 158, 11, 0.15)", stroke: "rgba(245, 158, 11, 0.7)" },
};

function renderShape(
  nodeType: string,
  fill: string,
  stroke: string,
): ReactElement {
  switch (nodeType) {
    case "shape-circle":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <ellipse cx="50" cy="50" rx="48" ry="48" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "shape-square":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="8" ry="8" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "shape-star": {
      // 5-point star
      const points: string[] = [];
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 2) * -1 + (Math.PI / 5) * i;
        const r = i % 2 === 0 ? 48 : 20;
        points.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
      }
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <polygon points={points.join(" ")} fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    }
    case "shape-hexagon": {
      const hexPoints: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        hexPoints.push(`${50 + 48 * Math.cos(angle)},${50 + 48 * Math.sin(angle)}`);
      }
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <polygon points={hexPoints.join(" ")} fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    }
    case "shape-round-rectangle":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="24" ry="24" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "shape-diamond":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <polygon points="50,2 98,50 50,98 2,50" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "shape-arrow-rectangle":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="2,5 75,5 98,50 75,95 2,95" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "shape-cylinder":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M5,20 C5,10 20,2 50,2 C80,2 95,10 95,20 L95,80 C95,90 80,98 50,98 C20,98 5,90 5,80 Z" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <ellipse cx="50" cy="20" rx="45" ry="18" fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "shape-parallelogram":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="22,5 98,5 78,95 2,95" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "shape-plus":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <polygon points="35,2 65,2 65,35 98,35 98,65 65,65 65,98 35,98 35,65 2,65 2,35 35,35" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "shape-triangle":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <polygon points="50,2 98,95 2,95" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    default:
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="96" rx="8" ry="8" fill={fill} stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      );
  }
}

const ShapeNode = ({ id, data, selected }: ShapeNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const handlesVisible = !!(selected || isHovered);
  const colors = SHAPE_COLORS[data.nodeType] ?? SHAPE_COLORS["shape-square"];

  return (
    <div
      className="relative w-full h-full"
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
      <NodeHandles visible={handlesVisible} />

      {/* Shape SVG fills entire node */}
      <div className="absolute inset-0">
        {renderShape(data.nodeType, colors.fill, colors.stroke)}
      </div>

      {/* Selected ring */}
      {selected && (
        <div className="absolute inset-0 pointer-events-none">
          {renderShape(data.nodeType, "transparent", "rgba(59, 130, 246, 0.6)")}
        </div>
      )}

      {/* Centered label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto px-1">
          <EditableLabel
            label={data.label}
            nodeId={id}
            className="text-xs font-medium text-foreground text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ShapeNode);
