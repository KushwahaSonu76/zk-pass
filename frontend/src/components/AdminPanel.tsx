import React, { useState } from 'react';
import { UserPlus, KeyRound, Check, Database, ShieldAlert, Cpu } from 'lucide-react';
import { computeCommitment } from '../../../contract';

interface AdminPanelProps {
  onAddCredential: (userSecret: string, userSalt: string) => Promise<{ root: string; commitmentIndex: number }>;
  credentialCount: number;
  currentRoot: string;
  defaultSalt: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onAddCredential,
  credentialCount,
  currentRoot,
  defaultSalt,
}) => {
  const [newSecret, setNewSecret] = useState('');
  const [newSalt, setNewSalt] = useState(defaultSalt);
  const [isAdding, setIsAdding] = useState(false);
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecret) return;

    setIsAdding(true);
    try {
      const res = await onAddCredential(newSecret, newSalt);
      setLastAddedIndex(res.commitmentIndex);
      setNewSecret('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="cyber-card-purple p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-prism-purple/10 border border-prism-purple/40 text-prism-purple shadow-prism-purple">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
              Issuer Registry Vault <span className="text-xs text-prism-purple font-normal font-sans">(Admin)</span>
            </h2>
            <p className="text-xs text-slate-400">Register private credential commitments into Midnight contract state root</p>
          </div>
        </div>
        <div className="text-right font-mono text-xs">
          <span className="text-slate-400">Merkle Registry Set: </span>
          <span className="text-prism-purple font-bold text-sm">{credentialCount} Commitments</span>
        </div>
      </div>

      {/* Admin Secret Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="font-semibold text-white">New Member Secret Identifier / Passport Hash</span>
            <span className="text-slate-500 text-[10px]">Private Off-Chain Witness</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={newSecret}
              onChange={(e) => setNewSecret(e.target.value)}
              placeholder="e.g. secret_accredited_fund_manager_771"
              className="w-full px-4 py-3 rounded-2xl bg-cyber-950 border border-slate-700 focus:border-prism-purple focus:ring-1 focus:ring-prism-purple font-mono text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
            />
            <KeyRound className="absolute right-4 top-3.5 w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Live Commitment Preview */}
        {newSecret && (
          <div className="p-3.5 rounded-2xl bg-cyber-950/90 border border-slate-800 text-xs font-mono space-y-1 animate-fade-in">
            <div className="text-slate-400 flex items-center gap-1.5 font-semibold">
              <Database className="w-3.5 h-3.5 text-prism-purple" />
              <span>Calculated Commitment Hash: sha256(secret || salt)</span>
            </div>
            <div className="text-prism-purple truncate font-bold text-sm">
              0x{computeCommitment(newSecret, newSalt)}
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Only this cryptographic hash digest is merged into the Merkle root on the ledger. User secrets never leave local RAM.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!newSecret || isAdding}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-prism-purple via-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-mono text-sm font-extrabold shadow-prism-purple transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isAdding ? (
            <span>Updating Contract Merkle Root...</span>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Issue &amp; Commit Credential to Ledger</span>
            </>
          )}
        </button>
      </form>

      {/* Success Banner */}
      {lastAddedIndex !== null && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-prism-emerald/40 text-xs font-mono text-prism-emerald flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Credential commitment successfully committed to Midnight ledger root at index #{lastAddedIndex}!</span>
        </div>
      )}

      {/* Current Root Display */}
      <div className="p-4 rounded-2xl bg-cyber-950 border border-slate-800 font-mono text-xs space-y-1.5">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Current Public Ledger Merkle Root</span>
          <Cpu className="w-3.5 h-3.5 text-prism-purple" />
        </div>
        <div className="text-prism-purple text-[11px] break-all bg-cyber-900/90 p-2.5 rounded-xl border border-slate-850 font-bold">
          {currentRoot}
        </div>
      </div>
    </div>
  );
};
