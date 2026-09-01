import React, { useState } from 'react';
import { UserPlus, ShieldAlert, KeyRound, Check, Database } from 'lucide-react';
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
    <div className="glass-card p-6 rounded-2xl border border-neon-violet/30 shadow-glow-violet space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-neon-violet/10 border border-neon-violet/30 text-neon-violet">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              Issuer Registry <span className="text-xs text-neon-violet font-normal font-sans">(Admin)</span>
            </h2>
            <p className="text-xs text-slate-400">Register private credential commitments into Midnight contract root</p>
          </div>
        </div>
        <div className="text-right font-mono text-xs">
          <span className="text-slate-400">Registered Set: </span>
          <span className="text-neon-cyan font-bold">{credentialCount} Commitments</span>
        </div>
      </div>

      {/* Admin Secret Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span>User Secret Identifier / Passport Hash</span>
            <span className="text-slate-500 text-[10px]">Private (Off-Chain)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={newSecret}
              onChange={(e) => setNewSecret(e.target.value)}
              placeholder="e.g. secret_kyc_passed_user_9921"
              className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-slate-700 focus:border-neon-violet focus:ring-1 focus:ring-neon-violet font-mono text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
            />
            <KeyRound className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Live Commitment Preview */}
        {newSecret && (
          <div className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800 text-xs font-mono space-y-1 animate-fade-in">
            <div className="text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Calculated Commitment Hash:</span>
            </div>
            <div className="text-neon-cyan truncate font-semibold">
              0x{computeCommitment(newSecret, newSalt)}
            </div>
            <p className="text-[10px] text-slate-500">
              Only this commitment hash is merged into the Merkle root on the ledger.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!newSecret || isAdding}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-violet via-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-mono text-sm font-semibold shadow-glow-violet transition-all flex items-center justify-center space-x-2"
        >
          {isAdding ? (
            <span>Updating Ledger Root...</span>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Issue & Register Commitment</span>
            </>
          )}
        </button>
      </form>

      {/* Success Banner */}
      {lastAddedIndex !== null && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-neon-emerald/30 text-xs font-mono text-neon-emerald flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Credential commitment successfully committed to Midnight ledger root at index #{lastAddedIndex}!</span>
        </div>
      )}

      {/* Current Root Display */}
      <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800 font-mono text-[11px] space-y-1">
        <span className="text-slate-400">Current Ledger Root:</span>
        <div className="text-slate-300 break-all font-mono text-[10px] text-neon-cyan/90">
          {currentRoot}
        </div>
      </div>
    </div>
  );
};
