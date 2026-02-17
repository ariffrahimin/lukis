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
    shapeColor?: string;
    shapeOpacity?: number;
    [key: string]: unknown;
  };
  selected?: boolean;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

const SHAPE_DEFAULT_RGB: Record<string, { r: number; g: number; b: number }> = {
  "shape-circle": { r: 236, g: 72, b: 153 },
  "shape-square": { r: 59, g: 130, b: 246 },
  "shape-star": { r: 234, g: 179, b: 8 },
  "shape-hexagon": { r: 20, g: 184, b: 166 },
  "shape-round-rectangle": { r: 139, g: 92, b: 246 },
  "shape-diamond": { r: 249, g: 115, b: 22 },
  "shape-arrow-rectangle": { r: 6, g: 182, b: 212 },
  "shape-cylinder": { r: 16, g: 185, b: 129 },
  "shape-parallelogram": { r: 168, g: 85, b: 247 },
  "shape-plus": { r: 239, g: 68, b: 68 },
  "shape-triangle": { r: 245, g: 158, b: 11 },
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

  const opacity = data.shapeOpacity ?? 0.15;
  let rgb: { r: number; g: number; b: number };
  if (data.shapeColor) {
    rgb = hexToRgb(data.shapeColor) ?? SHAPE_DEFAULT_RGB[data.nodeType] ?? SHAPE_DEFAULT_RGB["shape-square"];
  } else {
    rgb = SHAPE_DEFAULT_RGB[data.nodeType] ?? SHAPE_DEFAULT_RGB["shape-square"];
  }
  const colors = {
    fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
    stroke: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`,
  };

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
