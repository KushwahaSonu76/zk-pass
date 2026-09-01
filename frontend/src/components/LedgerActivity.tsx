import React from 'react';
import { Activity, Radio, Clock, ShieldCheck } from 'lucide-react';
import { VerificationHistoryItem } from '../types';

interface LedgerActivityProps {
  history: VerificationHistoryItem[];
}

export const LedgerActivity: React.FC<LedgerActivityProps> = ({ history }) => {
  return (
    <div className="cyber-card p-6 rounded-3xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <Activity className="w-5 h-5 text-prism-emerald" />
          <h2 className="text-lg font-extrabold text-white font-mono">Live On-Chain Event Stream</h2>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-prism-emerald font-bold">
          <Radio className="w-3.5 h-3.5 animate-ping" />
          <span>Midnight Testnet Live</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl space-y-2">
          <Clock className="w-7 h-7 text-slate-600 mx-auto" />
          <p className="text-xs font-mono text-slate-400">No public accessGranted events recorded yet in this session.</p>
          <p className="text-[11px] text-slate-500">Generate a ZK proof to broadcast a new verified transition.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-cyber-950/90 border border-slate-800 hover:border-slate-700 transition-all font-mono text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-prism-emerald font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-prism-emerald animate-pulse" /> accessGranted: TRUE
                </span>
                <span className="text-slate-500 text-[10px]">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                <span className="text-slate-500">ZKP Hash: </span>
                <span className="text-prism-emerald font-semibold">{item.proofHash}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-900 pt-1">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-prism-emerald" /> Identity Exposed: NO</span>
                <span>Address Exposed: NO</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
