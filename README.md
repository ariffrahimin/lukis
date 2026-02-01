# Lukis

A modern, interactive diagram builder built with React and TypeScript. Create beautiful system architecture diagrams, flowcharts, and network diagrams with an intuitive drag-and-drop interface.

## ✨ Features

### Core Functionality
- **Interactive Canvas**: Smooth, responsive diagram editing with zoom, pan, and selection tools
- **Drag & Drop**: Easily add nodes by dragging from the toolbar or clicking to place
- **Smart Connections**: Create animated connections between nodes with various edge styles
- **Undo/Redo**: Full history management with keyboard shortcuts (Ctrl+Z/Ctrl+Shift+Z)
- **Import/Export**: Save and load diagrams as JSON files
- **Invisible Anchor Points**: Connection handles only appear on hover for a clean canvas

### Cloud Services Support
- **Cloud Services Panel**: Dedicated left-side panel with 12+ cloud services
- **Multi-Cloud Support**: Google Cloud Platform (GCP), Amazon Web Services (AWS), Microsoft Azure
- **Icon-Based Nodes**: Cloud services display as actual service icons instead of rectangles
- **Collapsible Categories**: Organized by cloud provider with expandable sections
- **Hidable Panel**: Collapse the entire panel for maximum canvas space

### Cloud Service Properties
- **Region Configuration**: Specify cloud regions (us-west-2, europe-west1, etc.)
- **Instance Types**: Define instance specifications (t3.micro, n1-standard-1, etc.)
- **Environment Selection**: Choose between development, staging, production, testing
- **Service-Specific Data**: Each cloud service type has relevant properties

### Node Types
#### Standard Nodes
- **Service**: Microservices and backend services
- **Database**: Data storage systems
- **Server**: Infrastructure and servers
- **Client**: Frontend applications and clients
- **Storage**: File and object storage
- **API Gateway**: API management layers
- **Text**: Labels and annotations
- **Group**: Container for organizing related nodes

#### Cloud Services
**Google Cloud Platform (GCP)**
- Cloud Run
- Cloud Storage
- BigQuery
- Pub/Sub

**Amazon Web Services (AWS)**
- EC2
- S3
- Lambda
- RDS

**Microsoft Azure**
- Virtual Machines
- Blob Storage
- Functions
- SQL Database

### User Experience
- **Keyboard Shortcuts**: Productivity shortcuts for common actions
- **Minimap**: Navigate large diagrams with ease
- **Properties Panel**: Edit node and edge properties in real-time
- **Toast Notifications**: Friendly feedback for all actions
- **Responsive Design**: Works on desktop and tablet devices
- **Clean Interface**: Invisible connection points for uncluttered viewing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lukis
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

### Preview Production Build

```bash
pnpm preview
```

## 🎯 Usage

### Creating Diagrams

1. **Add Nodes**: 
   - Use the toolbar for standard nodes
   - Use the Cloud Services Panel for cloud infrastructure components
   - Drag and drop or click to place nodes on the canvas
2. **Connect Nodes**: Hover over a node to reveal connection points, then click and drag to another node
3. **Edit Properties**: Select a node or edge to edit its properties in the side panel
4. **Navigate**: Use mouse wheel to zoom, click and drag to pan, or use the minimap

### Cloud Services Workflow

1. **Open Panel**: Click the "Show Cloud Services" button if the panel is collapsed
2. **Select Provider**: Expand GCP, AWS, or Azure categories to view services
3. **Add Services**: Drag cloud service icons or click to add them to your diagram
4. **Configure Properties**: Select cloud service nodes to set region, instance type, and environment
5. **Toggle Labels**: Use the "Show Labels" switch to display service names under icons

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete/Backspace` | Delete selected node/edge |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `V` | Select tool |
| `H` | Pan tool |
| `F` | Fit view to screen |

### Toolbar Actions

- **Select**: Select and move nodes/edges
- **Pan**: Navigate the canvas
- **Add Nodes**: Quick-add common node types
- **Zoom Controls**: Zoom in/out and fit to view
- **Undo/Redo**: Navigate history
- **Import/Export**: Save and load diagrams

## 🛠️ Tech Stack

### Core Technologies
- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **shadcn/ui**: High-quality component library

### Diagram Engine
- **React Flow**: Powerful diagramming library
- **UUID**: Unique identifier generation

### State Management
- **React Query**: Server state management
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── nodes/                 # Custom node components
│   │   └── BaseNode.tsx       # Main node component with hover states
│   ├── cloud-services/        # Cloud service icons and assets
│   │   ├── gcp/               # Google Cloud Platform icons
│   │   ├── aws/               # Amazon Web Services icons
│   │   └── azure/             # Microsoft Azure icons
│   ├── DiagramCanvas.tsx      # Main diagram editor
│   ├── CloudServicesPanel.tsx # Cloud services panel
│   ├── PropertiesPanel.tsx    # Node/edge properties editor
│   └── Toolbar.tsx            # Diagram toolbar
├── hooks/
│   ├── useUndoRedo.ts         # Undo/redo functionality
│   └── use-toast.ts           # Toast notifications
├── types/
│   └── diagrams.ts            # TypeScript definitions with cloud services
├── lib/
│   └── utils.ts                # Utility functions
└── pages/
   ├── Index.tsx               # Main page
   └── NotFound.tsx             # 404 page
```

## 🎨 Customization

### Adding New Cloud Services

1. Add SVG icons to `src/components/cloud-services/{provider}/`
2. Update `NodeType` in `src/types/diagrams.ts`
3. Add the new type to `defaultNodeLabels` in `DiagramCanvas.tsx`
4. Update the `cloudServiceIcons` mapping in `BaseNode.tsx`
5. Add the service to `CloudServicesPanel.tsx`

### Adding New Node Types

1. Update `NodeType` in `src/types/diagrams.ts`
2. Add the new type to `defaultNodeLabels` in `DiagramCanvas.tsx`
3. Update the toolbar items
4. Create custom node components if needed
5. Add styles to `nodeTypeStyles` in `BaseNode.tsx`

### Styling

The app uses a design system with CSS custom properties. Modify the theme by updating:

- `tailwind.config.ts` for design tokens
- Component-specific styles in their respective files
- Global styles in `src/index.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [React Flow](https://reactflow.dev/) - The powerful diagramming library behind Lukis
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

Built with ❤️ using modern web technologies
