import React from 'react';
import { ShieldCheck, EyeOff, CheckCircle2, Lock } from 'lucide-react';
import { LedgerState } from '../../../contract';

interface VerificationBadgeProps {
  ledgerState: LedgerState;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ ledgerState }) => {
  const hasEvent = !!ledgerState.lastAccessEvent;

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono">Verifier Portal</h2>
            <p className="text-xs text-slate-400">On-Chain Access State & Proof Verifier</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan text-xs font-mono font-semibold">
          {ledgerState.accessGrantedCount} Accesses Granted
        </div>
      </div>

      {/* Main Status Display */}
      <div className="p-5 rounded-2xl bg-obsidian-950/90 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-full bg-emerald-950/60 border border-neon-emerald/40 text-neon-emerald shadow-glow-emerald">
          <CheckCircle2 className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-mono">
            {hasEvent ? 'ACCESS VERIFIED ON-CHAIN' : 'READY FOR PROOF VERIFICATION'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Midnight ledger confirms a valid credential holder executed a zero-knowledge membership proof.
          </p>
        </div>

        {/* Public Output Status */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-left">
            <span className="text-[10px] font-mono text-slate-500 block">Public Output</span>
            <span className="text-xs font-mono font-bold text-neon-emerald">accessGranted = true</span>
          </div>
          <div className="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-left">
            <span className="text-[10px] font-mono text-slate-500 block">Public Identity Leakage</span>
            <span className="text-xs font-mono font-bold text-neon-cyan flex items-center gap-1">
              <EyeOff className="w-3 h-3" /> 0 Bytes (Zero)
            </span>
          </div>
        </div>
      </div>

      {/* Ledger State Root Details */}
      <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Public Ledger Commitment Root</span>
          <Lock className="w-3 h-3 text-neon-cyan" />
        </div>
        <div className="text-neon-cyan text-[10px] break-all bg-obsidian-900 p-2 rounded-lg border border-slate-850">
          {ledgerState.credentialRoot}
        </div>
      </div>
    </div>
  );
};
