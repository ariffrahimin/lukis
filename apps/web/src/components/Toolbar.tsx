
import {
  Type,
  BoxSelect,
  Group,
  MousePointer2,
  Hand,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Undo,
  Redo,
  Download,
  Upload,
  MoreHorizontal,
  StickyNote
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
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

const nodeTypes: ToolbarItem[] = [
  { type: 'text', label: 'Text', icon: 'type', description: 'Text label annotation' },
  { type: 'subflow', label: 'Sub Flow', icon: 'boxselect', description: 'Sub flow container' },
  { type: 'sticky', label: 'Sticky Note', icon: 'sticky', description: 'Sticky note annotation' },
];

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'type': Type,
  'boxselect': BoxSelect,
  'sticky': StickyNote,
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
  onGroupSelection?: () => void;
  canGroup?: boolean;
  isMobile?: boolean;
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
  onGroupSelection,
  canGroup = false,
  isMobile = false,
}: ToolbarProps) => {
  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Mobile: fixed bottom bar with core tools + overflow menu
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-1 px-3 py-2 bg-toolbar-bg border-t border-border shadow-lg backdrop-blur-xl safe-area-bottom">
        {/* Core tools row */}
        <button
          onClick={() => onToolSelect('select')}
          className={cn(
            'p-3 rounded-lg transition-all duration-200',
            selectedTool === 'select'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-secondary text-foreground'
          )}
        >
          <MousePointer2 className="w-5 h-5" />
        </button>

        <button
          onClick={() => onToolSelect('pan')}
          className={cn(
            'p-3 rounded-lg transition-all duration-200',
            selectedTool === 'pan'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-secondary text-foreground'
          )}
        >
          <Hand className="w-5 h-5" />
        </button>

        <Separator orientation="vertical" className="h-6 mx-0.5" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'p-3 rounded-lg transition-all duration-200',
            canUndo ? 'hover:bg-secondary text-foreground' : 'text-muted-foreground'
          )}
        >
          <Undo className="w-5 h-5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            'p-3 rounded-lg transition-all duration-200',
            canRedo ? 'hover:bg-secondary text-foreground' : 'text-muted-foreground'
          )}
        >
          <Redo className="w-5 h-5" />
        </button>

        <button
          onClick={onDelete}
          className="p-3 rounded-lg hover:bg-destructive/20 text-destructive transition-all duration-200"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <Separator orientation="vertical" className="h-6 mx-0.5" />

        {/* Overflow menu for secondary actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-3 rounded-lg hover:bg-secondary text-foreground transition-all duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={8}>
            <DropdownMenuItem onSelect={onZoomIn}>
              <ZoomIn className="w-4 h-4 mr-2" /> Zoom In
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onZoomOut}>
              <ZoomOut className="w-4 h-4 mr-2" /> Zoom Out
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onFitView}>
              <Maximize className="w-4 h-4 mr-2" /> Fit View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onAddNode('text')}>
              <Type className="w-4 h-4 mr-2" /> Add Text
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAddNode('subflow')}>
              <BoxSelect className="w-4 h-4 mr-2" /> Add Sub Flow
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAddNode('sticky')}>
              <StickyNote className="w-4 h-4 mr-2" /> Add Sticky Note
            </DropdownMenuItem>
            {canGroup && (
              <DropdownMenuItem onSelect={onGroupSelection}>
                <Group className="w-4 h-4 mr-2" /> Group Selection
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onImport}>
              <Upload className="w-4 h-4 mr-2" /> Import
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onExport('json')}>
              <Download className="w-4 h-4 mr-2" /> Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onExport('png')}>
              <Download className="w-4 h-4 mr-2" /> Export PNG
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onExport('gif')}>
              <Download className="w-4 h-4 mr-2" /> Export GIF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Desktop/Tablet: top-center floating toolbar
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

        {canGroup && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onGroupSelection}
                className="p-2 rounded-lg hover:bg-secondary text-foreground transition-all duration-200"
              >
                <Group className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Group Selection (⌘G)</TooltipContent>
          </Tooltip>
        )}
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
