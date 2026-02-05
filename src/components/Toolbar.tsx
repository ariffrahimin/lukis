
import {
  Type,
  Square,
  MousePointer2,
  Hand,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Undo,
  Redo,
  Download,
  Upload
} from 'lucide-react';
import { cn } from '../lib/utils';
import { type NodeType, type ToolbarItem } from '../types/diagrams';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const nodeTypes: ToolbarItem[] = [
  { type: 'text', label: 'Text', icon: 'type', description: 'Text label annotation' },
  { type: 'group', label: 'Group', icon: 'square', description: 'Group container' },
];

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'type': Type,
  'square': Square,
};

interface ToolbarProps {
  selectedTool: 'select' | 'pan' | NodeType;
  onToolSelect: (tool: 'select' | 'pan' | NodeType) => void;
  onAddNode: (type: NodeType) => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: (format: 'json' | 'png' | 'gif') => void;
  onImport: () => void;
}

export const Toolbar = ({
  selectedTool,
  onToolSelect,
  onAddNode,
  onDelete,
  onZoomIn,
  onZoomOut,
  onFitView,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onImport,
}: ToolbarProps) => {
  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-2 bg-toolbar-bg rounded-xl border border-border shadow-lg backdrop-blur-xl">
      {/* Selection Tools */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onToolSelect('select')}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                selectedTool === 'select'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-foreground'
              )}
            >
              <MousePointer2 className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Select (V)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onToolSelect('pan')}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                selectedTool === 'pan'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-foreground'
              )}
            >
              <Hand className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Pan (H)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Node Types */}
      <div className="flex items-center gap-1">
        {nodeTypes.map((item) => {
          const Icon = IconMap[item.icon];
          return (
            <Tooltip key={item.type}>
              <TooltipTrigger asChild>
                <button
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  onClick={() => onAddNode(item.type)}
                  className={cn(
                    'p-2 rounded-lg transition-all duration-200 cursor-grab active:cursor-grabbing',
                    selectedTool === item.type
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                canUndo ? 'hover:bg-secondary text-foreground' : 'text-muted-foreground cursor-not-allowed'
              )}
            >
              <Undo className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Undo (⌘Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                canRedo ? 'hover:bg-secondary text-foreground' : 'text-muted-foreground cursor-not-allowed'
              )}
            >
              <Redo className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Delete (Del)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onZoomOut}
              className="p-2 rounded-lg hover:bg-secondary text-foreground transition-all duration-200"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out (-)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onZoomIn}
              className="p-2 rounded-lg hover:bg-secondary text-foreground transition-all duration-200"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Zoom In (+)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onFitView}
              className="p-2 rounded-lg hover:bg-secondary text-foreground transition-all duration-200"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Fit View (F)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Import/Export */}
      <div className="flex items-center gap-1">
            <button
              onClick={onImport}
              className="p-2 rounded-lg hover:bg-secondary text-foreground transition-all duration-200"
            >
              <Upload className="w-4 h-4" />
            </button>

            <span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 rounded-lg hover:bg-secondary text-foreground transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8}>
                  <DropdownMenuItem onSelect={() => onExport('json')}>
                    Export JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onExport('png')}>
                    Export PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onExport('gif')}>
                    Export GIF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
      </div>
    </div>
  );
};
