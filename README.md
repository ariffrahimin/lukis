# Lukis

A modern, interactive diagram builder built with React and TypeScript. Create beautiful system architecture diagrams, flowcharts, and network diagrams with an intuitive drag-and-drop interface.

## ✨ Features

### Core Functionality
- **Interactive Canvas**: Smooth, responsive diagram editing with zoom, pan, and selection tools
- **Drag & Drop**: Easily add nodes by dragging from the toolbar or clicking to place
- **Node Types**: 8 different node types including services, databases, APIs, clients, and more
- **Smart Connections**: Create animated connections between nodes with various edge styles
- **Undo/Redo**: Full history management with keyboard shortcuts (Ctrl+Z/Ctrl+Shift+Z)
- **Import/Export**: Save and load diagrams as JSON files

### Node Types
- **Service**: Microservices and backend services
- **Database**: Data storage systems
- **Server**: Infrastructure and servers
- **Client**: Frontend applications and clients
- **Storage**: File and object storage
- **API Gateway**: API management layers
- **Text**: Labels and annotations
- **Group**: Container for organizing related nodes

### User Experience
- **Keyboard Shortcuts**: Productivity shortcuts for common actions
- **Minimap**: Navigate large diagrams with ease
- **Properties Panel**: Edit node and edge properties in real-time
- **Toast Notifications**: Friendly feedback for all actions
- **Responsive Design**: Works on desktop and tablet devices

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

1. **Add Nodes**: Click on node types in the toolbar or drag them onto the canvas
2. **Connect Nodes**: Click and drag from a node's connection point to another node
3. **Edit Properties**: Select a node or edge to edit its properties in the side panel
4. **Navigate**: Use mouse wheel to zoom, click and drag to pan, or use the minimap

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
│   ├── ui/           # Reusable UI components
│   ├── nodes/        # Custom node components
│   ├── DiagramCanvas.tsx    # Main diagram editor
│   ├── PropertiesPanel.tsx  # Node/edge properties editor
│   └── Toolbar.tsx          # Diagram toolbar
├── hooks/
│   ├── useUndoRedo.ts       # Undo/redo functionality
│   └── use-toast.ts         # Toast notifications
├── types/
│   └── diagrams.ts          # TypeScript definitions
├── lib/
│   └── utils.ts              # Utility functions
└── pages/
    ├── Index.tsx            # Main page
    └── NotFound.tsx          # 404 page
```

## 🎨 Customization

### Adding New Node Types

1. Update `NodeType` in `src/types/diagrams.ts`
2. Add the new type to `defaultNodeLabels` in `DiagramCanvas.tsx`
3. Update the toolbar items
4. Create custom node components if needed

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
