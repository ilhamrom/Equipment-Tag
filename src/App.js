import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { utils, writeFile } from "xlsx";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [idCount, setIdCount] = useState(1);

  // tambah node baru
  const addNode = (type) => {
    const newNode = {
      id: `node-${idCount}`,
      data: { label: `${type}-${idCount}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: "default",
      nodeType: type,
    };
    setNodes((nds) => [...nds, newNode]);
    setIdCount(idCount + 1);
  };

  // koneksi antar node
  const onConnect = useCallback(
    (params) => {
      const cableTag = `CABLE-${edges.length + 1}`;
      setEdges((eds) => [
        ...eds,
        { ...params, id: cableTag, label: cableTag },
      ]);
    },
    [edges]
  );

  // data untuk export
  const connectionData = edges.map((e, i) => {
    const from = nodes.find((n) => n.id === e.source);
    const to = nodes.find((n) => n.id === e.target);

    return {
      "Item No": i + 1,
      "Cable Tag Number": e.id,
      "From Tag": from?.data?.label || "",
      "From Description": from?.nodeType || "",
      "To Tag": to?.data?.label || "",
      "To Description": to?.nodeType || "",
    };
  });

  // export ke excel
  const exportExcel = () => {
    const ws = utils.json_to_sheet(connectionData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Connections");
    writeFile(wb, "connections.xlsx");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar kiri */}
      <div className="w-1/4 p-4 border-r space-y-2 overflow-y-auto">
        <h2 className="font-bold text-lg">Add Equipment</h2>
        {["PANEL", "JUNCTION BOX", "SWITCH", "LAMP"].map((t) => (
          <button
            key={t}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => addNode(t)}
          >
            + {t}
          </button>
        ))}

        <h2 className="font-bold text-lg mt-6">Export</h2>
        <button
          className="w-full px-4 py-2 bg-green-500 text-white rounded"
          onClick={exportExcel}
        >
          Export to Excel
        </button>
      </div>

      {/* Canvas React Flow */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 border-b">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) =>
              setNodes((nds) => applyNodeChanges(changes, nds))
            }
            onEdgesChange={(changes) =>
              setEdges((eds) => applyEdgeChanges(changes, eds))
            }
            onConnect={onConnect}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        {/* Preview Table */}
        <div className="p-4 overflow-y-auto max-h-64">
          <h2 className="text-xl font-semibold mb-2">Preview Connections</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "Item No",
                  "Cable Tag Number",
                  "From Tag",
                  "From Description",
                  "To Tag",
                  "To Description",
                ].map((col) => (
                  <th key={col} className="border p-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {connectionData.map((c, i) => (
                <tr key={i}>
                  <td className="border p-2">{c["Item No"]}</td>
                  <td className="border p-2">{c["Cable Tag Number"]}</td>
                  <td className="border p-2">{c["From Tag"]}</td>
                  <td className="border p-2">{c["From Description"]}</td>
                  <td className="border p-2">{c["To Tag"]}</td>
                  <td className="border p-2">{c["To Description"]}</td>
                </tr>
              ))}
              {connectionData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    No connections yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
