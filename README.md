# Basically - Visual Diagram Editor

A modern, interactive diagram builder built with React and TypeScript. Create beautiful system architecture diagrams, flowcharts, and network diagrams with an intuitive drag-and-drop interface right in your browser.

**Free &middot; No sign-up &middot; Browser-based**

## ✨ Features

### Core Functionality
- **Interactive Canvas**: Smooth, responsive diagram editing with zoom, pan, and selection tools.
- **Drag & Drop**: Easily add nodes by dragging from the components panel or clicking to place.
- **Smart Edges**: Create animated connections between nodes with various edge styles (Bezier, Straight, Step, Smooth Step) and customizable markers.
- **Sub-flows & Grouping**: Group related nodes into sub-flow containers for better organization.
- **Undo/Redo**: Full history management with keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z).
- **Import/Export**: Save and load diagrams as JSON files, or export as high-resolution PNGs and animated GIFs.
- **Layers Panel**: Manage the z-order, visibility, and selection of all nodes and edges in your diagram.

### Extensive Component Library (130+ Nodes)
- **Multi-Cloud Support (5 Providers)**: Amazon Web Services (AWS), Google Cloud (GCP), Microsoft Azure, and Oracle Cloud components.
- **Technologies & Databases**: Wide range of NoSQL, SQL, and Programming Language nodes.
- **Tools & Shapes**: Basic components, Software Process elements, and 11 distinct shapes.
- **Animated Nodes**: 13 animated icons (like API, Rocket, Cloud) that bring your architecture diagrams to life.

### User Experience
- **Keyboard Shortcuts**: Productivity shortcuts for common actions and fast diagramming.
- **Minimap**: Navigate large diagrams with ease.
- **Properties Panel**: Edit node labels, descriptions, edge styles, and markers in real-time.
- **Responsive Design**: Works perfectly on desktop and tablet devices.
- **Sticky Notes & Text**: Add clear annotations and labels anywhere on the canvas.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lukis # or your cloned directory name
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

## 🎯 Usage

1. **The Canvas**: A full diagram editor with smart connectors, sub-flows, and layers. Drag, drop, and build.
2. **The Guide**: A comprehensive built-in walkthrough of every tool, shortcut, and feature. From adding your first node to exporting a polished diagram.
3. **The Articles**: Access insights on cloud architecture, system design patterns, and diagramming best practices right from the app.

### Diagramming Workflow

1. **Add Nodes**: Open the Components Panel on the left and drag any item (Cloud service, database, shape, or animated node) onto the canvas.
2. **Connect**: Hover over a node to reveal connection points, then drag to another node to create a connection. Customize the edge style in the Properties Panel.
3. **Organize**: Use the Layers Panel (press `L`) to adjust z-index and visibility, or select multiple nodes and press `Cmd/Ctrl + G` to group them into a sub-flow.
4. **Export**: Export your creation as a PNG for documentation, a JSON file for version control, or a GIF to show off animated nodes.

## 🛠️ Tech Stack

### Core Technologies
- **React 19**: Modern React with the latest features.
- **TypeScript**: Type-safe development.
- **Vite**: Fast build tool and dev server.
- **pnpm workspaces**: Monorepo structure.

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI & shadcn/ui**: Accessible component primitives and high-quality UI design.
- **Lucide React**: Beautiful icon library.

### Diagram Engine
- **React Flow (@xyflow/react)**: Powerful diagramming library.

### Export & Image Processing
- **html-to-image**: Fast DOM to image conversion.
- **gif.js.optimized / gifenc**: Client-side GIF generation.

## 📁 Project Structure

The project is structured as a monorepo using pnpm workspaces. The main web application is located in `apps/web`.

```text
apps/web/src/
├── components/
│   ├── ui/                    # Reusable UI components (shadcn)
│   ├── nodes/                 # Custom node components
│   │   └── BaseNode.tsx       # Main node component with hover states
│   ├── cloud-services/        # Cloud service icons and assets
│   │   ├── gcp/               # Google Cloud Platform icons
│   │   ├── aws/               # Amazon Web Services icons
│   │   └── azure/             # Microsoft Azure icons
│   ├── DiagramCanvas.tsx      # Main diagram editor
│   ├── CloudServicesPanel.tsx # Cloud services panel
│   ├── PropertiesPanel.tsx    # Node/edge properties editor
│   ├── LayersPanel.tsx        # Layers management panel
│   └── Toolbar.tsx            # Diagram toolbar
├── lib/
│   └── utils.ts               # Utility functions
└── pages/
   ├── Home.tsx                # Landing page
   ├── Guide.tsx               # Guide page
   ├── Articles.tsx            # Articles listing
   ├── Article.tsx             # Single article view
   └── NotFound.tsx            # 404 page
```

## 🎨 Customization

### Adding New Cloud Services

1. Add SVG icons to `apps/web/src/components/cloud-services/{provider}/`
2. Update `NodeType` definitions in the corresponding node configuration files
3. Update the `cloudServiceIcons` mapping in `BaseNode.tsx`
4. Add the service to `CloudServicesPanel.tsx`

### Adding New Node Types

1. Create custom node components in `apps/web/src/components/nodes/` if needed
2. Update the toolbar items in `Toolbar.tsx`
3. Add styles to `nodeTypeStyles` in `BaseNode.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Developed by lamanhero**: [www.lamanhero.com](https://www.lamanhero.com)
- **Live Demo**: [basically.my](https://basically.my/)

---

*From developer, for developer.* Built with ❤️ using modern web technologies.