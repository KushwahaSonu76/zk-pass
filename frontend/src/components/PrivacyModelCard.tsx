import React from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';

export const PrivacyModelCard: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-neon-cyan/20 space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-mono">Midnight Privacy Guarantee</h2>
          <p className="text-xs text-slate-400">Formal Privacy Model Specification & Data Visibility Audit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        
        {/* What Observer CAN See */}
        <div className="p-4 rounded-xl bg-obsidian-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-neon-cyan font-bold border-b border-slate-850 pb-2">
            <Eye className="w-4 h-4 text-neon-cyan" />
            <span>Public Observer CAN See:</span>
          </div>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
              <span>Boolean result: <code className="text-neon-emerald">accessGranted = true</code></span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
              <span>Total verified count on contract ledger</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
              <span>Issuer's public Merkle root hash</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
              <span>ZK proof integrity hash (valid mathematical proof)</span>
            </li>
          </ul>
        </div>

        {/* What Observer CANNOT See */}
        <div className="p-4 rounded-xl bg-obsidian-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-neon-rose font-bold border-b border-slate-850 pb-2">
            <EyeOff className="w-4 h-4 text-neon-rose" />
            <span>Public Observer CANNOT See:</span>
          </div>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-neon-rose shrink-0 mt-0.5" />
              <span>User's secret credential, passport, or identity</span>
            </li>
            <li className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-neon-rose shrink-0 mt-0.5" />
              <span>User's wallet address or key pair</span>
            </li>
            <li className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-neon-rose shrink-0 mt-0.5" />
              <span>Which leaf index in the Merkle registry belongs to user</span>
            </li>
            <li className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-neon-rose shrink-0 mt-0.5" />
              <span>Linkability between multiple verifications by same user</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="p-3.5 rounded-xl bg-neon-violet/10 border border-neon-violet/30 text-xs font-mono text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-neon-violet" />
          <span>Midnight Compact zero-knowledge circuits guarantee 100% selective disclosure.</span>
        </span>
        <span className="text-neon-violet font-bold">Privacy Airtight</span>
      </div>
    </div>
  );
};
