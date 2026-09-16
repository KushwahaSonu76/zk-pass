import React, { useState } from 'react';
import { GitBranch, ShieldCheck, Database, Key, Sparkles, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { computeCommitment } from '../../../contract';

interface VisualMerkleTreeProps {
  currentRoot: string;
  commitments: string[];
  activeCommitment?: string;
  activePath?: string[];
  activeIndex?: number;
}

export const VisualMerkleTree: React.FC<VisualMerkleTreeProps> = ({
  currentRoot,
  commitments,
  activeCommitment,
  activePath = [],
  activeIndex = 0,
}) => {
  const [selectedNode, setSelectedNode] = useState<{
    level: string;
    hash: string;
    isPath: boolean;
    description: string;
  } | null>(null);

  // Shorten hash helper
  const shorten = (hash?: string) => (hash ? `${hash.slice(0, 8)}...${hash.slice(-6)}` : '0x000000...');

  return (
    <div className="cyber-card p-6 rounded-3xl space-y-6 border border-slate-800 bg-cyber-900/90 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-prism-emerald/10 border border-prism-emerald/40 text-prism-emerald shadow-prism-emerald">
            <GitBranch className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
              Visual Merkle Tree <span className="text-xs text-prism-emerald font-normal font-sans">(ZK Circuit State)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 8-depth cryptographic tree verified off-chain by Midnight Compact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-cyber-950 border border-slate-800 text-slate-300">
            Leaves: <strong className="text-prism-emerald">{commitments.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-cyber-950 border border-slate-800 text-slate-300">
            Tree Depth: <strong className="text-prism-purple">8 Levels</strong>
          </span>
        </div>
      </div>

      {/* Interactive Visual Graph */}
      <div className="relative p-6 rounded-2xl bg-cyber-950 border border-slate-800/90 overflow-x-auto">
        <div className="min-w-[620px] flex flex-col items-center space-y-7 font-mono text-xs">
          
          {/* Level 0: On-Chain Merkle Root */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-prism-emerald" /> Midnight Public Ledger State Root
            </span>
            <div
              onClick={() =>
                setSelectedNode({
                  level: 'Ledger Root (Level 0)',
                  hash: currentRoot,
                  isPath: true,
                  description: 'This 32-byte cryptographic root hash is stored publicly on the Midnight blockchain ledger.',
                })
              }
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-cyber-900 to-teal-950/80 border-2 border-prism-emerald text-prism-emerald font-bold shadow-prism-emerald cursor-pointer hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-prism-emerald animate-ping" />
              <span>Root: {shorten(currentRoot)}</span>
            </div>
          </div>

          {/* Connecting Branch Lines */}
          <div className="w-48 h-5 border-t-2 border-l-2 border-r-2 border-prism-emerald/50 rounded-t-lg -my-3" />

          {/* Level 1: Intermediate Branch Nodes */}
          <div className="grid grid-cols-2 gap-16 w-full max-w-md">
            <div
              onClick={() =>
                setSelectedNode({
                  level: 'Intermediate Left Branch (Depth 1)',
                  hash: activePath[0] || 'f9c2a84d1e0b57e9...',
                  isPath: activeIndex % 2 === 0,
                  description: 'Intermediate digest combining Left sub-tree commitments.',
                })
              }
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 ${
                activeIndex % 2 === 0
                  ? 'bg-cyber-900 border-prism-emerald text-slate-100 shadow-sm'
                  : 'bg-cyber-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[9px] text-slate-500 font-bold">BRANCH 0 (L1)</div>
              <div className="text-[11px] font-bold text-prism-teal mt-0.5">{shorten(activePath[0] || currentRoot)}</div>
            </div>

            <div
              onClick={() =>
                setSelectedNode({
                  level: 'Intermediate Right Branch (Depth 1)',
                  hash: activePath[1] || 'a3e8b1d9c4f02a5...',
                  isPath: activeIndex % 2 === 1,
                  description: 'Intermediate digest combining Right sub-tree commitments.',
                })
              }
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 ${
                activeIndex % 2 === 1
                  ? 'bg-cyber-900 border-prism-emerald text-slate-100 shadow-sm'
                  : 'bg-cyber-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[9px] text-slate-500 font-bold">BRANCH 1 (L1)</div>
              <div className="text-[11px] font-bold text-prism-purple mt-0.5">{shorten(activePath[1] || currentRoot)}</div>
            </div>
          </div>

          {/* Level 2: Leaf Commitments */}
          <div className="w-full pt-2">
            <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2.5">
              Registered Private Credential Commitments (Leaf Level)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {commitments.slice(0, 3).map((comm, idx) => {
                const isActive = activeCommitment ? comm.toLowerCase() === activeCommitment.toLowerCase() : idx === 0;

                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setSelectedNode({
                        level: `Credential Leaf #${idx}`,
                        hash: comm,
                        isPath: isActive,
                        description: `Computed as sha256(userSecret || userSalt). Position index #${idx} is proven in ZK without exposing it to the ledger.`,
                      })
                    }
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.02] relative ${
                      isActive
                        ? 'bg-cyber-900/95 border-prism-emerald shadow-prism-emerald text-white'
                        : 'bg-cyber-950 border-slate-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-prism-emerald text-cyber-950 font-bold text-[9px] shadow-sm">
                        PROVEN
                      </span>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-prism-emerald">Leaf #{idx}</span>
                      <Key className="w-3 h-3 text-slate-500" />
                    </div>
                    <div className="font-mono font-bold text-xs text-slate-200 mt-1 truncate">
                      {shorten(comm)}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1">
                      {isActive ? '✓ Active witness path member' : 'Registered allowlist entry'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-4 rounded-2xl bg-cyber-950 border border-slate-800 text-xs font-mono space-y-2 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <span className="font-bold text-prism-emerald flex items-center gap-1.5">
              <Info className="w-4 h-4 text-prism-emerald" /> {selectedNode.level}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedNode.isPath ? 'bg-prism-emerald/20 text-prism-emerald' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {selectedNode.isPath ? 'Path Verified in Circuit' : 'Sibling Node'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-slate-400 text-[10px]">Full SHA256 Hash Digest:</div>
            <div className="p-2 rounded-lg bg-cyber-900 border border-slate-850 text-[11px] text-prism-teal break-all font-bold select-all">
              {selectedNode.hash}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans pt-1">
            {selectedNode.description}
          </p>
        </div>
      )}

      {/* Educational Footer */}
      <div className="p-4 rounded-2xl bg-prism-purple/10 border border-prism-purple/30 text-xs font-mono text-slate-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-prism-purple shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-prism-purple">Zero Knowledge Proof Mechanics:</strong> Prover evaluates 8 levels of SHA256 hashes off-chain in browser RAM. The smart contract validates that <code className="text-prism-emerald font-bold">computedRoot == ledger.credentialRoot</code> without ever learning which leaf index you proved.
        </p>
      </div>

    </div>
  );
};
