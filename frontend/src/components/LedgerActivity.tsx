import React from 'react';
import { Activity, ShieldAlert, Radio, Clock } from 'lucide-react';
import { VerificationHistoryItem } from '../types';

interface LedgerActivityProps {
  history: VerificationHistoryItem[];
}

export const LedgerActivity: React.FC<LedgerActivityProps> = ({ history }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <Activity className="w-5 h-5 text-neon-cyan" />
          <h2 className="text-base font-bold text-white font-mono">Live On-Chain Event Log</h2>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-neon-emerald">
          <Radio className="w-3.5 h-3.5 animate-ping" />
          <span>Watching Midnight Ledger</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
          <Clock className="w-6 h-6 text-slate-600 mx-auto" />
          <p className="text-xs font-mono text-slate-500">No public accessGranted events recorded yet in this session.</p>
          <p className="text-[11px] text-slate-600">Generate a ZK proof above to record a new on-chain transition.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800 hover:border-slate-700 transition-colors font-mono text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-neon-emerald font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neon-emerald" /> accessGranted: TRUE
                </span>
                <span className="text-slate-500 text-[10px]">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                <span className="text-slate-500">ZKP Hash: </span>
                <span className="text-neon-cyan">{item.proofHash}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900 pt-1">
                <span>Identity Exposed: NO</span>
                <span>Address Exposed: NO</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
