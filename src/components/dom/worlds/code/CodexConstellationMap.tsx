'use client';

import { useState } from 'react';
import { Compass } from 'lucide-react';

interface ConstellationNode {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
  x: number; // SVG viewBox coordinates (0 - 400)
  y: number; // SVG viewBox coordinates (0 - 240)
  complexity: string;
  annotation: string;
  patterns: string[];
}

const NODES: ConstellationNode[] = [
  {
    id: 'math',
    name: 'Number Theory & Combinatorics',
    count: 98,
    percentage: 13.0,
    color: '#f472b6',
    x: 60,
    y: 180,
    complexity: 'O(log N) / O(sqrt N)',
    annotation: 'Modular arithmetic, Fermat\'s Little Theorem, sieve transformations.',
    patterns: ['Euler Totient', 'Matrix Exponentiation', 'Combinatorial Inverses'],
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    count: 184,
    percentage: 24.4,
    color: '#38bdf8',
    x: 130,
    y: 80,
    complexity: 'O(N * K) State Space',
    annotation: 'Optimal substructure decomposition & DAG state transitions.',
    patterns: ['Tree Re-rooting', 'Digit DP', 'Knapsack Variations', 'Bitmask DP'],
  },
  {
    id: 'graphs',
    name: 'Graphs & Tree Structures',
    count: 162,
    percentage: 21.5,
    color: '#818cf8',
    x: 230,
    y: 50,
    complexity: 'O(V + E log V)',
    annotation: 'Shortest paths, bridges, topological orders, and tree traversals.',
    patterns: ['Dijkstra / Bellman-Ford', 'Tarjan SCC', 'Binary Lifting / LCA'],
  },
  {
    id: 'ds',
    name: 'Segment Trees & Fenwick',
    count: 114,
    percentage: 15.1,
    color: '#34d399',
    x: 340,
    y: 90,
    complexity: 'O(log N) Queries',
    annotation: 'Range query aggregation with lazy propagation & point updates.',
    patterns: ['Range Affine Updates', 'Fenwick 2D', 'Dynamic Segment Tree'],
  },
  {
    id: 'binary-search',
    name: 'Binary Search & 2-Pointers',
    count: 136,
    percentage: 18.0,
    color: '#fbbf24',
    x: 210,
    y: 170,
    complexity: 'O(log N) / O(N)',
    annotation: 'Monotonicity exploitation, search space reduction, and sliding windows.',
    patterns: ['Binary Search on Answer', 'Prefix Invariants', '2-Pointer Shrink'],
  },
  {
    id: 'bitmask',
    name: 'Bitmasking & Greedy',
    count: 60,
    percentage: 8.0,
    color: '#a78bfa',
    x: 330,
    y: 200,
    complexity: 'O(2^N * N)',
    annotation: 'Exponential subset compression and locally optimal choice proofs.',
    patterns: ['State Bit Manipulation', 'Submask Iteration', 'Greedy Exchange'],
  },
];

const CONNECTIONS: [string, string][] = [
  ['math', 'dp'],
  ['dp', 'graphs'],
  ['graphs', 'ds'],
  ['dp', 'binary-search'],
  ['graphs', 'binary-search'],
  ['binary-search', 'bitmask'],
  ['ds', 'bitmask'],
];

export function CodexConstellationMap() {
  const [selectedId, setSelectedId] = useState<string>('dp');
  const selectedNode = NODES.find((n) => n.id === selectedId) || NODES[0];

  return (
    <div className="space-y-5">
      {/* Manuscript Section Header */}
      <div className="flex items-baseline justify-between border-b border-cyan-900/40 pb-2">
        <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
          <Compass className="h-3.5 w-3.5" />
          <span>TERRITORIAL CONSTELLATION MAP</span>
        </div>
        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
          INTERACTIVE STELLAR PATHS
        </span>
      </div>

      {/* Interactive Constellation SVG Canvas */}
      <div className="relative rounded-lg border border-cyan-900/30 bg-slate-950/80 p-4 shadow-inner">
        {/* Subtle coordinate ticks */}
        <div className="absolute top-2 left-2 font-mono text-[8px] text-cyan-500/40">
          GRID [0x01 ... 0xFF]
        </div>
        <div className="absolute bottom-2 right-2 font-mono text-[8px] text-cyan-500/40">
          DIM: 6 SECTORS
        </div>

        <svg
          viewBox="0 0 400 240"
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Connection Lines between Star Nodes */}
          {CONNECTIONS.map(([srcId, dstId]) => {
            const src = NODES.find((n) => n.id === srcId)!;
            const dst = NODES.find((n) => n.id === dstId)!;
            const isHighlighted = selectedId === srcId || selectedId === dstId;

            return (
              <g key={`${srcId}-${dstId}`}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={dst.x}
                  y2={dst.y}
                  stroke={isHighlighted ? '#38bdf8' : 'rgba(56, 189, 248, 0.15)'}
                  strokeWidth={isHighlighted ? 1.5 : 0.8}
                  strokeDasharray={isHighlighted ? 'none' : '3 3'}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Star Nodes */}
          {NODES.map((node) => {
            const isSelected = selectedId === node.id;
            const radius = isSelected ? 8 : 5;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                className="cursor-pointer group"
              >
                {/* Orbital Glow Ring for Selected Node */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 6}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    className="animate-spin"
                    style={{ animationDuration: '8s', transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                )}

                {/* Star Core */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={node.color}
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Node Label Inscription */}
                <text
                  x={node.x}
                  y={node.y + (node.y > 120 ? -12 : 16)}
                  textAnchor="middle"
                  fill={isSelected ? '#f8fafc' : '#94a3b8'}
                  fontSize={isSelected ? '9px' : '7.5px'}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="transition-colors pointer-events-none"
                >
                  {node.name.split(' ')[0]} ({node.count})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Discovered Territory Detail Note (Manuscript Field Report) */}
      <div className="border-l-2 border-cyan-400/80 bg-slate-900/40 p-4 rounded-r-md space-y-2.5 transition-all">
        <div className="flex items-baseline justify-between">
          <h4 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: selectedNode.color }}
            />
            {selectedNode.name}
          </h4>
          <span className="font-mono text-xs font-semibold text-cyan-300">
            {selectedNode.count} Solved ({selectedNode.percentage}%)
          </span>
        </div>

        {/* Marginalia & Complexity Note */}
        <p className="text-xs font-light text-slate-300 leading-relaxed italic">
          &ldquo;{selectedNode.annotation}&rdquo;
        </p>

        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
          <span>COMPLEXITY REGIME: {selectedNode.complexity}</span>
          <span className="text-cyan-400">STATUS: CONQUERED</span>
        </div>

        {/* Mastered Patterns List */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedNode.patterns.map((pat) => (
            <span
              key={pat}
              className="rounded border border-cyan-900/50 bg-slate-950/60 px-2 py-0.5 font-mono text-[9px] text-cyan-200"
            >
              + {pat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
