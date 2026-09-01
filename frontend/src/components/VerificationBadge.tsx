import React from 'react';
import { ShieldCheck, EyeOff, CheckCircle2, Lock, Radio } from 'lucide-react';
import { LedgerState } from '../../../contract';

interface VerificationBadgeProps {
  ledgerState: LedgerState;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ ledgerState }) => {
  const hasEvent = !!ledgerState.lastAccessEvent;

  return (
    <div className="cyber-card p-6 rounded-3xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-prism-teal/10 border border-prism-teal/40 text-prism-teal shadow-prism-teal">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-mono">Verifier Portal Matrix</h2>
            <p className="text-xs text-slate-400">On-Chain Access State &amp; Proof Inspector</p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-prism-teal/10 border border-prism-teal/40 text-prism-teal text-xs font-mono font-bold">
          {ledgerState.accessGrantedCount} Accesses Granted
        </div>
      </div>

      {/* Main Status Display */}
      <div className="p-6 rounded-2xl bg-cyber-950/90 border border-slate-800 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-emerald-950/60 border border-prism-emerald/50 text-prism-emerald shadow-prism-emerald">
          <CheckCircle2 className="w-10 h-10 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-white font-mono tracking-wide">
            {hasEvent ? 'ACCESS VERIFIED ON-CHAIN' : 'READY FOR PROOF VERIFICATION'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Midnight ledger confirms a valid allowlist member evaluated a zero-knowledge membership proof.
          </p>
        </div>

        {/* Public Output Status Matrix */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-cyber-900 border border-slate-800 text-left">
            <span className="text-[10px] font-mono text-slate-500 block font-semibold">Public Output State</span>
            <span className="text-xs font-mono font-bold text-prism-emerald flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-prism-emerald" /> accessGranted = true
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-cyber-900 border border-slate-800 text-left">
            <span className="text-[10px] font-mono text-slate-500 block font-semibold">Public Identity Disclosed</span>
            <span className="text-xs font-mono font-bold text-prism-teal flex items-center gap-1 mt-0.5">
              <EyeOff className="w-3.5 h-3.5" /> 0 Bytes (Airtight)
            </span>
          </div>
        </div>
      </div>

      {/* Ledger State Root Details */}
      <div className="p-4 rounded-2xl bg-cyber-950 border border-slate-800 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Public Ledger Commitment Root</span>
          <Lock className="w-3.5 h-3.5 text-prism-teal" />
        </div>
        <div className="text-prism-teal text-[10px] break-all bg-cyber-900/90 p-2.5 rounded-xl border border-slate-850 font-mono font-semibold">
          {ledgerState.credentialRoot}
        </div>
      </div>
    </div>
  );
};
