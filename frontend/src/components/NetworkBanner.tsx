import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Radio, Shield, Globe, Terminal } from 'lucide-react';

interface NetworkBannerProps {
  contractAddress?: string;
  network?: string;
}

export const NetworkBanner: React.FC<NetworkBannerProps> = ({
  contractAddress = '45da95ddda479777d41c23f56ec87ce41cc779d6fc017e3bb994d1e3d6193011',
  network = 'Midnight Preprod',
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(network);

  const explorerUrl = `https://preprod.midnightexplorer.com/contracts/0x${contractAddress}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="cyber-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-cyber-900/90 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs">
        
        {/* Left: Network Status & Active Tag */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-prism-emerald/15 border border-prism-emerald/40 text-prism-emerald">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-extrabold tracking-wider">{selectedNetwork}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-prism-emerald animate-ping" />
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <span className="text-slate-500 font-sans">Contract:</span>
            <span className="text-white font-bold bg-cyber-950 px-2.5 py-1 rounded-lg border border-slate-800 tracking-wider">
              {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-cyber-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-1 text-[11px]"
              title="Copy Full Contract Address"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-prism-emerald" />
                  <span className="text-prism-emerald text-[10px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>

            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-prism-emerald/10 hover:bg-prism-emerald/20 border border-prism-emerald/30 text-prism-emerald font-bold transition-all flex items-center gap-1.5 text-[11px] shadow-sm"
            >
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right: Network Metrics & Quick Switcher */}
        <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-prism-teal" />
            <span className="text-slate-300 font-semibold">Compact ZK v0.31</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-prism-purple" />
            <span>RPC: <span className="text-slate-200">rpc.preprod.midnight.network</span></span>
          </div>

          <div className="flex items-center gap-1 text-[10px] bg-cyber-950 px-2 py-1 rounded-lg border border-slate-850">
            <span className="text-slate-500">Mode:</span>
            <span className="text-prism-emerald font-bold">On-Chain Verified</span>
          </div>
        </div>

      </div>
    </section>
  );
};
