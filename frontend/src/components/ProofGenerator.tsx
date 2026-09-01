import React, { useState } from 'react';
import { Lock, Cpu, CheckCircle, AlertTriangle, Sparkles, Loader2, KeyRound, ShieldAlert } from 'lucide-react';
import { AccessProofResult } from '../../../contract';
import { PresetSelector, PRESETS, CredentialPreset } from './PresetSelector';
import { TerminalSimulator } from './TerminalSimulator';

interface ProofGeneratorProps {
  onGenerateProof: (secret: string, salt: string) => Promise<AccessProofResult>;
  defaultUserSecret: string;
  defaultSalt: string;
  isSubmitting: boolean;
}

interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'zkp';
  text: string;
}

export const ProofGenerator: React.FC<ProofGeneratorProps> = ({
  onGenerateProof,
  defaultUserSecret,
  defaultSalt,
  isSubmitting,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [secretInput, setSecretInput] = useState(PRESETS[0].secret);
  const [saltInput, setSaltInput] = useState(defaultSalt);
  const [latestResult, setLatestResult] = useState<AccessProofResult | null>(null);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSelectPreset = (preset: CredentialPreset) => {
    setSelectedPresetId(preset.id);
    setSecretInput(preset.secret);
  };

  const getTime = () => new Date().toLocaleTimeString().split(' ')[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);
    setLatestResult(null);
    setLogs([]);

    const addLog = (type: 'info' | 'success' | 'warn' | 'zkp', text: string) => {
      setLogs((prev) => [
        ...prev,
        { id: Math.random().toString(36).substring(2, 9), timestamp: getTime(), type, text },
      ]);
    };

    // Live witness compilation simulation stream
    addLog('info', 'Importing private witness credentials into browser local RAM context...');
    await new Promise((res) => setTimeout(res, 250));

    addLog('zkp', 'Evaluating Poseidon-sha256 commitment hash: sha256(secret || salt)...');
    await new Promise((res) => setTimeout(res, 300));

    addLog('zkp', 'Constructing 8-depth Merkle path witness against public ledger root...');
    await new Promise((res) => setTimeout(res, 350));

    addLog('zkp', 'Executing Midnight Compact circuit zero-knowledge constraint checks...');
    await new Promise((res) => setTimeout(res, 350));

    const result = await onGenerateProof(secretInput, saltInput);

    if (result.isValid) {
      addLog('success', `Compact ZK Proof verified! Proof Hash: ${result.proofHash}`);
      addLog('success', 'Public ledger state updated: accessGranted = TRUE (Identity Leakage: 0 bytes)');
    } else {
      addLog('warn', 'ZK Constraint Failure: Calculated Merkle root does not match ledger root!');
    }

    setLatestResult(result);
    setIsExecuting(false);
  };

  return (
    <div className="cyber-card-emerald p-6 rounded-3xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-prism-emerald/10 border border-prism-emerald/40 text-prism-emerald shadow-prism-emerald">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
              ZK Proof Generator <span className="text-xs text-prism-emerald font-normal font-sans">(Compact Engine)</span>
            </h2>
            <p className="text-xs text-slate-400">Generate zero-knowledge membership proofs locally in your browser</p>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <PresetSelector selectedPresetId={selectedPresetId} onSelectPreset={handleSelectPreset} />

      {/* Inputs Form */}
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Lock className="w-3.5 h-3.5 text-prism-emerald" /> Private Credential Secret
            </span>
            <span className="text-prism-emerald text-[10px] font-semibold flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> Never Leaves Browser
            </span>
          </label>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Enter private credential secret..."
            className="w-full px-4 py-3 rounded-2xl bg-cyber-950 border border-slate-700 focus:border-prism-emerald focus:ring-1 focus:ring-prism-emerald font-mono text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Private Salt (32-byte hex)
          </label>
          <input
            type="text"
            value={saltInput}
            onChange={(e) => setSaltInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-cyber-950 border border-slate-800 text-slate-400 font-mono text-xs outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!secretInput || isSubmitting || isExecuting}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-prism-emerald via-teal-400 to-emerald-500 hover:opacity-95 disabled:opacity-50 text-cyber-950 font-mono text-sm font-extrabold shadow-prism-emerald transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyber-950" />
              <span>Evaluating Compact Witnesses in Browser...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate &amp; Submit ZK Proof</span>
            </>
          )}
        </button>
      </form>

      {/* Terminal Execution Log */}
      <TerminalSimulator logs={logs} isRunning={isExecuting} />

      {/* Result Holographic Card */}
      {latestResult && !isExecuting && (
        <div
          className={`p-4 rounded-2xl border font-mono text-xs space-y-3 transition-all ${
            latestResult.isValid
              ? 'bg-emerald-950/40 border-prism-emerald/60 text-slate-100 shadow-prism-emerald'
              : 'bg-rose-950/40 border-prism-crimson/60 text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center space-x-2">
              {latestResult.isValid ? (
                <CheckCircle className="w-5 h-5 text-prism-emerald" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-prism-crimson" />
              )}
              <span className="font-bold text-sm">
                {latestResult.isValid ? 'Proof Validated on Midnight Ledger' : 'Proof Rejected (Root Mismatch)'}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                latestResult.isValid ? 'bg-prism-emerald/20 text-prism-emerald border border-prism-emerald/40' : 'bg-prism-crimson/20 text-prism-crimson'
              }`}
            >
              {latestResult.isValid ? 'accessGranted = TRUE' : 'accessGranted = FALSE'}
            </span>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Public Proof Hash:</span>
              <span className="text-prism-emerald font-bold">{latestResult.proofHash}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Merkle Root Verified:</span>
              <span className="text-slate-300 text-[10px] truncate max-w-xs">{latestResult.computedRoot}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-prism-emerald font-semibold text-[10px]">
              <span>✓ Prover Identity Exposed: 0 Bytes</span>
              <span>✓ Wallet Address Exposed: 0 Bytes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
