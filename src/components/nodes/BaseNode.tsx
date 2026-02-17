import { memo, useState } from "react";
import { NodeResizer } from "@xyflow/react";
import { cn } from "../../lib/utils";
import { type NodeType } from "../../types/diagrams";
import { cloudServiceIcons, isCloudService } from "./node-icons";
import { nodeTypeStyles } from "./node-styles";
import { NodeHandles } from "./NodeHandles";
import { EditableLabel } from "./EditableLabel";
import { NodeIcon } from "./NodeIcon";

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
    [key: string]: unknown;
  };
  selected?: boolean;
}

const BaseNode = ({ id, data, selected }: BaseNodeProps) => {
  const styles = nodeTypeStyles[data.nodeType];
  const isTextNode = data.nodeType === "text";
  const isCloudServiceNode = isCloudService(data.nodeType);
  const isAnimatedNode = data.nodeType.startsWith("animated-");
  const [isHovered, setIsHovered] = useState(false);
  const handlesVisible = !!(selected || isHovered);

  if (isTextNode) {
    return (
      <div
        className="px-2 py-1 relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NodeResizer
          isVisible={selected}
          minWidth={30}
          minHeight={20}
          lineStyle={{ borderColor: "#3b82f6" }}
          handleStyle={{ backgroundColor: "#3b82f6", width: 8, height: 8 }}
        />
        <NodeHandles visible={handlesVisible} />
        <EditableLabel
          label={data.label}
          nodeId={id}
          className="text-foreground font-medium text-sm"
        />
      </div>
    );
  }

  if (isCloudServiceNode) {
    return (
      <div
        className="flex flex-col items-center relative w-full h-full"
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
        <div
          className={cn(
            "p-2 rounded-lg transition-all duration-200 flex-1 min-h-0 min-w-0 flex items-center justify-center",
            selected &&
              "ring-2 ring-primary ring-offset-2 ring-offset-background",
          )}
        >
          <div className={cn(
            "w-full h-full min-w-[48px] min-h-[48px]",
            isAnimatedNode && "rounded-lg bg-[hsl(var(--canvas-bg))] p-1"
          )}>
            <img
              src={cloudServiceIcons[data.nodeType]}
              alt={data.label}
              className={cn("w-full h-full object-contain", isAnimatedNode && "rounded-md")}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              className="w-full h-full bg-muted rounded flex items-center justify-center text-xs font-medium"
              style={{ display: "none" }}
            >
              {data.label.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
        {data.label && (
          <div className="mt-1 text-center">
            <EditableLabel
              label={data.label}
              nodeId={id}
              className="text-xs font-medium text-foreground leading-tight"
            />
          </div>
        )}
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 text-center max-w-[120px]">
            {data.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full rounded-lg border-2 backdrop-blur-sm transition-all duration-200",
        styles.bg,
        styles.border,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={50}
        lineStyle={{ borderColor: "#3b82f6" }}
        handleStyle={{ backgroundColor: "#3b82f6", width: 8, height: 8 }}
      />
      <NodeHandles visible={handlesVisible} />
      <div className="p-3">
        <div className="flex items-center gap-2">
          <NodeIcon type={data.nodeType} className={styles.icon} />
          <EditableLabel
            label={data.label}
            nodeId={id}
            className="font-medium text-sm text-foreground truncate max-w-[120px]"
          />
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[160px]">
            {data.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(BaseNode);
