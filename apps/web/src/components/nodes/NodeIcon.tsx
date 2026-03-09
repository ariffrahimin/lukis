import {
  Server,
  Database,
  Cloud,
  Monitor,
  HardDrive,
  Globe,
  Type,
  BoxSelect,
  FileText,
  PenTool,
  Code,
  Bug,
  Rocket,
  Activity,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { type NodeType } from "../../types/diagrams";

interface NodeIconProps {
  type: NodeType;
  className?: string;
}

export const NodeIcon = ({ type, className }: NodeIconProps) => {
  const iconProps = { className: cn("w-5 h-5", className) };

  switch (type) {
    case "service":
      return <Cloud {...iconProps} />;
    case "database":
      return <Database {...iconProps} />;
    case "server":
      return <Server {...iconProps} />;
    case "client":
      return <Monitor {...iconProps} />;
    case "storage":
      return <HardDrive {...iconProps} />;
    case "api":
      return <Globe {...iconProps} />;
    case "text":
      return <Type {...iconProps} />;
    case "subflow":
      return <BoxSelect {...iconProps} />;
    case "process-requirements":
      return <FileText {...iconProps} />;
    case "process-design":
      return <PenTool {...iconProps} />;
    case "process-development":
      return <Code {...iconProps} />;
    case "process-testing":
      return <Bug {...iconProps} />;
    case "process-deployment":
      return <Rocket {...iconProps} />;
    case "process-monitoring":
      return <Activity {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
};
