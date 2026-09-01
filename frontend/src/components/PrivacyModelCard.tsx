import React from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';

export const PrivacyModelCard: React.FC = () => {
  return (
    <div className="cyber-card p-6 rounded-3xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-3 rounded-2xl bg-prism-emerald/10 border border-prism-emerald/40 text-prism-emerald shadow-prism-emerald">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white font-mono">Midnight Privacy Guarantee</h2>
          <p className="text-xs text-slate-400">Formal Privacy Model Specification &amp; Data Visibility Audit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        
        {/* What Observer CAN See */}
        <div className="p-5 rounded-2xl bg-cyber-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-prism-emerald font-bold border-b border-slate-850 pb-2">
            <Eye className="w-4 h-4 text-prism-emerald" />
            <span>Public Observer CAN See:</span>
          </div>
          <ul className="space-y-2.5 text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-prism-emerald shrink-0 mt-0.5" />
              <span>Boolean result: <code className="text-prism-emerald font-bold">accessGranted = true</code></span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-prism-emerald shrink-0 mt-0.5" />
              <span>Total aggregate verified access count</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-prism-emerald shrink-0 mt-0.5" />
              <span>Issuer's public Merkle root commitment hash</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-prism-emerald shrink-0 mt-0.5" />
              <span>ZK proof integrity hash (<code className="text-prism-emerald">zkp_...</code>)</span>
            </li>
          </ul>
        </div>

        {/* What Observer CANNOT See */}
        <div className="p-5 rounded-2xl bg-cyber-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-prism-crimson font-bold border-b border-slate-850 pb-2">
            <EyeOff className="w-4 h-4 text-prism-crimson" />
            <span>Public Observer CANNOT See:</span>
          </div>
          <ul className="space-y-2.5 text-slate-300">
            <li className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-prism-crimson shrink-0 mt-0.5" />
              <span>User's secret credential, passport, or identity</span>
            </li>
            <li className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-prism-crimson shrink-0 mt-0.5" />
              <span>User's wallet address or key pair</span>
            </li>
            <li className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-prism-crimson shrink-0 mt-0.5" />
              <span>Which leaf index in the Merkle registry belongs to user</span>
            </li>
            <li className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-prism-crimson shrink-0 mt-0.5" />
              <span>Linkability between multiple proofs from same member</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="p-4 rounded-2xl bg-prism-purple/10 border border-prism-purple/40 text-xs font-mono text-slate-200 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-prism-purple" />
          <span>Midnight Compact zero-knowledge circuits guarantee 100% selective disclosure.</span>
        </span>
        <span className="text-prism-purple font-extrabold text-xs">Airtight Privacy</span>
      </div>
    </div>
  );
};
