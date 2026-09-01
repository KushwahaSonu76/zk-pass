import React from 'react';
import { Terminal, Check, Shield, Cpu } from 'lucide-react';

interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'zkp';
  text: string;
}

interface TerminalSimulatorProps {
  logs: TerminalLog[];
  isRunning: boolean;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({ logs, isRunning }) => {
  return (
    <div className="rounded-2xl bg-cyber-950 border border-slate-800 overflow-hidden shadow-2xl font-mono text-xs">
      
      {/* Header bar */}
      <div className="bg-cyber-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-slate-400 text-[11px] font-bold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-prism-emerald" /> Compact ZK Witness Engine Console
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          {isRunning ? (
            <span className="text-prism-emerald flex items-center gap-1 animate-pulse">
              <Cpu className="w-3 h-3" /> Evaluating Witnesses...
            </span>
          ) : (
            <span className="text-slate-500">Idle / Ready</span>
          )}
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 space-y-2 max-h-52 overflow-y-auto bg-black/60 scanline-overlay text-[11px] leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">
            $ awaiting witness input... press &quot;Generate &amp; Submit ZK Proof&quot; to begin zero-knowledge execution trace.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2 font-mono">
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              {log.type === 'info' && <span className="text-prism-teal font-bold shrink-0">[INFO]</span>}
              {log.type === 'zkp' && <span className="text-prism-purple font-bold shrink-0">[ZK_CIRCUIT]</span>}
              {log.type === 'success' && <span className="text-prism-emerald font-bold shrink-0">[LEDGER_SUCCESS]</span>}
              {log.type === 'warn' && <span className="text-amber-400 font-bold shrink-0">[WARN]</span>}
              <span className={log.type === 'success' ? 'text-prism-emerald font-semibold' : 'text-slate-300'}>
                {log.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
