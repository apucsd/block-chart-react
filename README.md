# React + TypeScript + Vite# React + TypeScript + Vite

This project is a React application using TypeScript and Vite, featuring a dynamic block graph component with drag-and-drop functionality.

## Key Features

- **Dynamic Block Graph**: Visualize nodes and their connections, with the ability to add new nodes dynamically.
- **Drag-and-Drop**: Nodes can be repositioned using drag-and-drop, with real-time updates to their positions.
- **Interactive UI**: Each node displays its ID and includes a button to add child nodes.

## Components

### `App.tsx`

The main application component that renders the `BlockChart` component.

```typescript
import BlockChart from "./components/BlockGraph";

function App() {
  return (
    <>
      <BlockChart />
    </>
  );
}

export default App;
```

### `BlockGraph.tsx`

A component that manages and displays a graph of nodes. Nodes can be dragged, and new nodes can be added as children to existing nodes.

```typescript
import { useState } from "react";

const BlockChart = () => {
  const [nodes, setNodes] = useState([
    { id: 0, parentId: null, x: 200, y: 200 },
  ]);

  const handleNewNode = (parentId: number) => {
    const newNode = {
      id: nodes.length,
      parentId,
      x: Math.random() * 1000,
      y: Math.random() * 500,
    };
    setNodes([...nodes, newNode]);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData("nodeId", id.toString());
  };

  const handleDragBlock = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    const updatedNodes = nodes.map((node) =>
      node.id === id ? { ...node, x: e.clientX - 20, y: e.clientY - 20 } : node
    );
    setNodes(updatedNodes);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const id = e.dataTransfer.getData("nodeId");
    const updatedNodes = nodes.map((node) =>
      node.id === parseInt(id)
        ? { ...node, x: e.clientX - 20, y: e.clientY - 20 }
        : node
    );
    setNodes(updatedNodes);
  };

  const handleAllowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const createPath = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = (x2 - x1) / 2;
    return `M${x1},${y1} C${x1 + deltaX},${y1} ${
      x2 - deltaX
    },${y2} ${x2},${y2}`;
  };

  return (
    <div
      className="relative w-full min-h-screen bg-pink-100"
      onDrop={handleDrop}
      onDragOver={handleAllowDrop}
    >
      <svg className="absolute w-full h-full">
        {nodes.map((node) =>
          nodes
            .filter((child) => child.parentId === node.id)
            .map((child) => (
              <path
                key={`${node.id}-${child.id}`}
                d={createPath(
                  node.x + 20,
                  node.y + 20,
                  child.x + 20,
                  child.y + 20
                )}
                stroke="black"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4"
              />
            ))
        )}
      </svg>
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute bg-pink-500 size-24 text-white p-4 rounded cursor-pointer"
          style={{ left: node.x, top: node.y }}
          draggable
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDrag={(e) => handleDragBlock(e, node.id)}
        >
          <div className="flex flex-col items-center">
            <span>{node.id}</span>
            <button
              className="mt-2 bg-white text-pink-500 text-lg w-12 h-6 flex items-center justify-center"
              onClick={() => handleNewNode(node.id)}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockChart;
```

## Getting Started

1. **Install Dependencies**: Run `npm install` to install all necessary packages.
2. **Run the Application**: Use `npm run dev` to start the development server.
3. **Explore the Graph**: Interact with the block graph by dragging nodes and adding new ones.

## Conclusion

This project demonstrates a simple yet interactive way to visualize and manipulate a graph of nodes using React, TypeScript, and Vite. Enjoy exploring and expanding upon this foundation!

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
