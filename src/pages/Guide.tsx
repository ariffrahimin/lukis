import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  MousePointer2,
  Hand,
  Type,
  BoxSelect,
  Undo,
  Redo,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Upload,
  Download,
  Cloud,
  Database,
  Server,
  Box,
  Shapes,
  Sparkles,
  Lightbulb,
  Cable,
  PanelRight,
  Keyboard,
  Layers,
  Move,
  Image,
  FileJson,
  Film,
  Eye,
  EyeOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  PanelRightOpen,
} from "lucide-react";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="font-mono text-[11px] px-1.5 py-0.5 bg-muted/50 border-muted-foreground/30"
    >
      {children}
    </Badge>
  );
}

function SectionCard({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-20 border-muted/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        {children}
      </CardContent>
    </Card>
  );
}

const navItems = [
  { id: "getting-started", label: "Getting Started" },
  { id: "nodes", label: "Nodes" },
  { id: "edges", label: "Edges" },
  { id: "toolbar", label: "Toolbar" },
  { id: "shortcuts", label: "Shortcuts" },
  { id: "properties", label: "Properties" },
  { id: "export-import", label: "Export / Import" },
  { id: "layers", label: "Layers" },
  { id: "services", label: "Services" },
  { id: "tips", label: "Tips" },
];

export default function Guide() {
  useEffect(() => {
    document.title = "Guide - Basically";
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-primary">Basically</span>{" "}
            <span className="text-muted-foreground font-normal text-sm">Guide</span>
          </span>
          <Button variant="ghost" size="sm" asChild>
            <a href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Canvas
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-3 pb-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How to Use <span className="text-primary">Basically</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            A visual diagram editor for cloud architecture, software processes, and system design.
            Drag, connect, and export — all from your browser.
          </p>
        </section>

        {/* Quick nav */}
        <nav className="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {item.label}
              </Badge>
            </a>
          ))}
        </nav>

        <Separator className="opacity-40" />

        {/* 1. Getting Started */}
        <SectionCard id="getting-started" icon={Layers} title="Getting Started">
          <p>The editor has four main areas:</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-muted/50 p-3 space-y-1">
              <p className="font-medium text-foreground">Components Panel</p>
              <p>Left sidebar — browse and drag cloud services, databases, shapes, and more onto the canvas.</p>
            </div>
            <div className="rounded-lg border border-muted/50 p-3 space-y-1">
              <p className="font-medium text-foreground">Canvas</p>
              <p>Center area — your diagram workspace. Pan, zoom, and arrange nodes freely on a snap grid.</p>
            </div>
            <div className="rounded-lg border border-muted/50 p-3 space-y-1">
              <p className="font-medium text-foreground">Properties Panel</p>
              <p>Right side — edit labels, descriptions, edge styles, and markers for selected elements.</p>
            </div>
            <div className="rounded-lg border border-muted/50 p-3 space-y-1">
              <p className="font-medium text-foreground">Layers Panel</p>
              <p>Right drawer — manage z-order, visibility, and selection of all nodes and edges. Press <strong>L</strong> to toggle.</p>
            </div>
          </div>
        </SectionCard>

        {/* 2. Adding Nodes */}
        <SectionCard id="nodes" icon={Box} title="Adding Nodes">
          <p>
            Open the <strong className="text-foreground">Components Panel</strong> on the left and drag any item onto the canvas.
            Nodes are organized into five categories:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { icon: Cloud, label: "Cloud", desc: "AWS (15), GCP (13), and Azure (14) services" },
              { icon: Database, label: "Databases", desc: "NoSQL (7) and SQL (6) databases" },
              { icon: Box, label: "Tools", desc: "Basic components (6) and Software Process (6)" },
              { icon: Shapes, label: "Shapes", desc: "11 shapes — Circle, Square, Star, Hexagon, Diamond, Triangle, and more" },
              { icon: Sparkles, label: "Animated", desc: "13 animated icons like API, Rocket, Cloud" },
            ].map((cat) => (
              <div key={cat.label} className="flex items-start gap-3 rounded-lg border border-muted/50 p-3">
                <cat.icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{cat.label}</p>
                  <p className="text-xs">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p>
            You can also add <strong className="text-foreground">Text</strong> labels and{" "}
            <strong className="text-foreground">Sub Flow</strong> containers from the toolbar.
            Select multiple nodes and press <strong className="text-foreground">⌘/Ctrl+G</strong> to group them into a sub flow.
            Double-click any node label to rename it inline.
          </p>
        </SectionCard>

        {/* 3. Connecting Edges */}
        <SectionCard id="edges" icon={Cable} title="Connecting Edges">
          <p>
            Each node has <strong className="text-foreground">connection handles</strong> on all four sides
            (top, right, bottom, left). Hover over a node to reveal them, then drag from one handle to another
            to create a connection.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Edge Types</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bezier — smooth curve (default style)</li>
                <li>Straight — direct line</li>
                <li>Step — right-angle path</li>
                <li>Smooth Step — rounded right-angle path</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Markers</p>
              <ul className="list-disc list-inside space-y-1">
                <li>None — plain line end</li>
                <li>Arrow — open arrowhead</li>
                <li>Arrow Closed — filled arrowhead</li>
              </ul>
              <p className="text-xs">Set independently for start and end.</p>
            </div>
          </div>
          <p>
            Edges are <strong className="text-foreground">reconnectable</strong> — drag an existing edge
            endpoint to move it to a different node. Toggle <strong className="text-foreground">animation</strong>{" "}
            in the Properties Panel for a dashed moving stroke effect.
          </p>
        </SectionCard>

        {/* 4. Toolbar */}
        <SectionCard id="toolbar" icon={Move} title="Toolbar">
          <p>The floating toolbar at the top of the canvas provides quick access to all tools:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { icon: MousePointer2, label: "Select", key: "V", desc: "Click and drag to select nodes" },
              { icon: Hand, label: "Pan", key: "H", desc: "Click and drag to pan the canvas" },
              { icon: Type, label: "Text", key: null, desc: "Add a text label node" },
              { icon: BoxSelect, label: "Sub Flow", key: null, desc: "Add a sub flow container" },
              { icon: Undo, label: "Undo", key: "⌘Z", desc: "Undo last action (50 levels)" },
              { icon: Redo, label: "Redo", key: "⌘⇧Z", desc: "Redo undone action" },
              { icon: Trash2, label: "Delete", key: "Del", desc: "Delete selected elements" },
              { icon: ZoomOut, label: "Zoom Out", key: "−", desc: "Decrease zoom level" },
              { icon: ZoomIn, label: "Zoom In", key: "+", desc: "Increase zoom level" },
              { icon: Maximize, label: "Fit View", key: "F", desc: "Fit all content to screen" },
              { icon: Upload, label: "Import", key: null, desc: "Import diagram from JSON" },
              { icon: Download, label: "Export", key: null, desc: "Export as JSON, PNG, or GIF" },
            ].map((tool) => (
              <div key={tool.label} className="flex items-center gap-3 rounded-lg border border-muted/50 p-2.5">
                <tool.icon className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground text-xs">{tool.label}</span>
                  <span className="text-xs ml-2">{tool.desc}</span>
                </div>
                {tool.key && <Kbd>{tool.key}</Kbd>}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 5. Keyboard Shortcuts */}
        <SectionCard id="shortcuts" icon={Keyboard} title="Keyboard Shortcuts">
          <p>Shortcuts are disabled when typing in input fields.</p>
          <div className="grid gap-1.5">
            {[
              { keys: "V", action: "Switch to Select tool" },
              { keys: "H", action: "Switch to Pan tool" },
              { keys: "F", action: "Fit view to screen" },
              { keys: "⌘ / Ctrl + Z", action: "Undo" },
              { keys: "⌘ / Ctrl + ⇧ + Z", action: "Redo" },
              { keys: "⌘ / Ctrl + C", action: "Copy selected nodes" },
              { keys: "⌘ / Ctrl + X", action: "Cut selected nodes" },
              { keys: "⌘ / Ctrl + V", action: "Paste nodes (offset +50px)" },
              { keys: "⌘ / Ctrl + G", action: "Group selected nodes into sub flow" },
              { keys: "⌘ / Ctrl + ⇧ + G", action: "Ungroup sub flow" },
              { keys: "L", action: "Toggle Layers panel" },
              { keys: "Delete / Backspace", action: "Delete selected elements" },
              { keys: "+", action: "Zoom in" },
              { keys: "−", action: "Zoom out" },
            ].map((s) => (
              <div
                key={s.keys}
                className="flex items-center justify-between rounded-md border border-muted/50 px-3 py-2"
              >
                <span className="text-foreground text-xs">{s.action}</span>
                <Kbd>{s.keys}</Kbd>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 6. Properties Panel */}
        <SectionCard id="properties" icon={PanelRight} title="Properties Panel">
          <p>
            Select a node or edge to open the Properties Panel. On desktop, right-click to position it
            near your cursor. On mobile, it slides in from the right.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Node Properties</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-foreground">Label</strong> — editable name</li>
                <li><strong className="text-foreground">Description</strong> — optional text below the label</li>
                <li><strong className="text-foreground">Type</strong> — read-only badge</li>
                <li><strong className="text-foreground">Environment</strong> — Development, Staging, Production, Testing (cloud nodes only)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Edge Properties</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-foreground">Edge Type</strong> — Bezier, Straight, Step, Smooth Step</li>
                <li><strong className="text-foreground">Start Marker</strong> — None, Arrow, Arrow Closed</li>
                <li><strong className="text-foreground">End Marker</strong> — None, Arrow, Arrow Closed</li>
                <li><strong className="text-foreground">Animated</strong> — toggle for dashed animation</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* 7. Export & Import */}
        <SectionCard id="export-import" icon={Download} title="Export & Import">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-muted/50 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <FileJson className="h-4 w-4 text-primary" />
                <p className="font-medium text-foreground">JSON</p>
              </div>
              <p className="text-xs">Full diagram data — nodes, edges, positions. Use for saving and sharing.</p>
            </div>
            <div className="rounded-lg border border-muted/50 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                <p className="font-medium text-foreground">PNG</p>
              </div>
              <p className="text-xs">High-resolution raster image with white background. Great for docs and slides.</p>
            </div>
            <div className="rounded-lg border border-muted/50 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4 text-primary" />
                <p className="font-medium text-foreground">GIF</p>
              </div>
              <p className="text-xs">Animated export — 3 seconds at 10 fps. Captures animated node icons.</p>
            </div>
          </div>
          <p>
            <strong className="text-foreground">Import:</strong> Click the upload button in the toolbar to load
            a previously exported JSON file. The importer validates structure and checks for circular references.
          </p>
        </SectionCard>

        {/* 8. Layers Panel */}
        <SectionCard id="layers" icon={PanelRightOpen} title="Layers Panel">
          <p>
            The Layers Panel is a right-side drawer that lets you manage the <strong className="text-foreground">z-order</strong>,{" "}
            <strong className="text-foreground">visibility</strong>, and <strong className="text-foreground">selection</strong> of
            all nodes and edges in your diagram. Toggle it with the{" "}
            <Layers className="inline h-4 w-4 align-text-bottom text-primary" /> button in the top-right
            or press <Kbd>L</Kbd>.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Z-Order</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Items at the <strong className="text-foreground">top</strong> of the list are in <strong className="text-foreground">front</strong></li>
                <li>Items at the <strong className="text-foreground">bottom</strong> are <strong className="text-foreground">behind</strong></li>
                <li>
                  Use <ChevronUp className="inline h-3.5 w-3.5 align-text-bottom" />{" "}
                  <ChevronDown className="inline h-3.5 w-3.5 align-text-bottom" /> arrows to reorder
                </li>
                <li>
                  Drag the <GripVertical className="inline h-3.5 w-3.5 align-text-bottom" /> handle to reorder via drag-and-drop
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Visibility & Selection</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Click <Eye className="inline h-3.5 w-3.5 align-text-bottom" /> /{" "}
                  <EyeOff className="inline h-3.5 w-3.5 align-text-bottom" /> to show/hide a node or edge
                </li>
                <li>Hiding a node also hides its connected edges</li>
                <li>Click any item to select it and pan the canvas to it</li>
                <li>Selected nodes get a brief pulse highlight</li>
              </ul>
            </div>
          </div>
          <p>
            On mobile and tablet, the Layers Panel opens as a slide-over sheet from the right.
          </p>
        </SectionCard>

        {/* 9. Cloud Services */}
        <SectionCard id="services" icon={Server} title="Cloud Services & Components">
          <p>
            The Components Panel organizes <strong className="text-foreground">95+ node types</strong> across
            providers. Expand any provider accordion to browse its services.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { label: "AWS", count: 15, color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
              { label: "GCP", count: 13, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
              { label: "Azure", count: 14, color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
              { label: "NoSQL", count: 7, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
              { label: "SQL", count: 6, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
              { label: "Basic", count: 6, color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
              { label: "Process", count: 6, color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
              { label: "Shapes", count: 11, color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
              { label: "Animated", count: 13, color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between rounded-lg border border-muted/50 p-2.5">
                <span className="text-foreground text-sm font-medium">{p.label}</span>
                <Badge className={`text-[10px] border ${p.color} bg-transparent`}>
                  {p.count}
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 9. Tips & Tricks */}
        <SectionCard id="tips" icon={Lightbulb} title="Tips & Tricks">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { tip: "Snap to Grid", detail: "Nodes snap to a 15×15px grid for clean alignment." },
              { tip: "MiniMap", detail: "Use the bottom-right minimap to navigate large diagrams. You can pan and zoom within it." },
              { tip: "Multi-Select", detail: "Hold ⌘/Ctrl and click, or drag a selection box, to select multiple nodes at once." },
              { tip: "Double-Click to Edit", detail: "Double-click any node label to rename it inline. Press Enter to confirm or Escape to cancel." },
              { tip: "Resize Nodes", detail: "Select a node to reveal blue resize handles on its corners and edges." },
              { tip: "Sub Flows & Grouping", detail: "Select 2+ nodes and press ⌘/Ctrl+G to group them into a sub flow. Drag nodes into a sub flow to add them. Press ⌘/Ctrl+⇧+G to ungroup." },
              { tip: "Right-Click Properties", detail: "Right-click a node or edge on desktop to open the Properties Panel right at your cursor." },
              { tip: "Layers Panel", detail: "Press L to toggle the Layers drawer. Items at the top are in front. Drag to reorder, click the eye to hide, click a row to pan to it." },
              { tip: "Undo History", detail: "Up to 50 levels of undo/redo. Every change is tracked automatically." },
            ].map((t) => (
              <div key={t.tip} className="rounded-lg border border-muted/50 p-3 space-y-1">
                <p className="font-medium text-foreground text-xs">{t.tip}</p>
                <p className="text-xs">{t.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <Separator className="opacity-40" />

        {/* Bottom CTA */}
        <section className="text-center py-8 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Ready to build?</h2>
          <p className="text-muted-foreground text-sm">
            You know the tools — now go create something great.
          </p>
          <Button asChild size="lg" className="gap-2">
            <a href="/">
              Start Building
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </a>
          </Button>
        </section>
      </main>
    </div>
  );
}
