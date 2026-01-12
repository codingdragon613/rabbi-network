import React, { useCallback, useEffect, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    ReactFlowProvider,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

const nodeTypes = {
    // We can define custom node types here if needed for more complex visuals
};

const GraphView = ({ rabbis, relationships, onNodeClick }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!rabbis.length) return;

        // Simple layouting: Assign generic positions for now. 
        // In a real app, use dagre or elkjs for auto layout.
        const newNodes = rabbis.map((rabbi, index) => ({
            id: rabbi.id,
            type: 'default',
            data: { label: rabbi.name, ...rabbi },
            position: { x: (index % 3) * 200, y: Math.floor(index / 3) * 100 },
            style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '8px',
                width: 180,
                padding: '10px'
            }
        }));

        const newEdges = relationships.map((rel, index) => ({
            id: `e${index}`,
            source: rel.source,
            target: rel.target,
            label: rel.type,
            animated: true,
            style: { stroke: '#888' },
        }));

        setNodes(newNodes);
        setEdges(newEdges);
    }, [rabbis, relationships, setNodes, setEdges]);

    return (
        <div className="h-full w-full bg-slate-950">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(_, node) => onNodeClick(node.data)}
                fitView
            >
                <Controls className='bg-white text-black' />
                <MiniMap nodeColor="#fff" maskColor="rgba(0,0,0,0.6)" className='bg-slate-900' />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
};

export default function WrappedGraphView(props) {
    return (
        <ReactFlowProvider>
            <GraphView {...props} />
        </ReactFlowProvider>
    )
}
