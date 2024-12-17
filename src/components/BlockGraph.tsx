import { useState } from "react";

const BlockChart = () => {
  // Note: This is the state for the nodes in the graph
  const [nodes, setNodes] = useState<
    {
      id: number;
      parentId: number | null;
      x: number;
      y: number;
    }[]
  >([{ id: 0, parentId: null, x: 200, y: 200 }]);

  // Note: This is the function to add a new node to the graph
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
    console.log("dragging node", id);
    e.dataTransfer.setData("nodeId", id.toString());
  };

  const handleDragBlock = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    // Update node position in real-time
    const updatedNodes = nodes.map((node) =>
      node.id === id ? { ...node, x: e.clientX - 20, y: e.clientY - 20 } : node
    );
    setNodes(updatedNodes);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const id = e.dataTransfer.getData("nodeId");
    // console.log("dropping node", id);
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
              className="mt-2 bg-white text-pink-500  text-lg w-12 h-6 flex items-center justify-center"
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
