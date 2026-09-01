import React, { useState } from 'react';
import { Lock, Cpu, CheckCircle, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { AccessProofResult } from '../../../contract';
import { ProofStepsTracker, ProofStep } from './ProofStepsTracker';

interface ProofGeneratorProps {
  onGenerateProof: (secret: string, salt: string) => Promise<AccessProofResult>;
  defaultUserSecret: string;
  defaultSalt: string;
  isSubmitting: boolean;
}

const INITIAL_STEPS: ProofStep[] = [
  { id: 1, label: 'Private Witness Import', description: 'Load user secret credential & salt in local memory', status: 'idle' },
  { id: 2, label: 'Commitment Hash Computation', description: 'Evaluate sha256(secret || salt) commitment', status: 'idle' },
  { id: 3, label: 'Merkle Membership Verification', description: 'Calculate 8-depth path against ledger root', status: 'idle' },
  { id: 4, label: 'Midnight Compact Circuit ZKP', description: 'Generate zero-knowledge proof & verify constraints', status: 'idle' },
  { id: 5, label: 'On-Chain Ledger State Transition', description: 'Emit public accessGranted=true event', status: 'idle' },
];

export const ProofGenerator: React.FC<ProofGeneratorProps> = ({
  onGenerateProof,
  defaultUserSecret,
  defaultSalt,
  isSubmitting,
}) => {
  const [secretInput, setSecretInput] = useState(defaultUserSecret);
  const [saltInput, setSaltInput] = useState(defaultSalt);
  const [latestResult, setLatestResult] = useState<AccessProofResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPipelineRunning(true);
    setCurrentStepIndex(0);

    // Animate witness pipeline steps for interactive user experience
    for (let i = 0; i < 4; i++) {
      setCurrentStepIndex(i);
      await new Promise((res) => setTimeout(res, 300));
    }

    const result = await onGenerateProof(secretInput, saltInput);
    setCurrentStepIndex(4);
    setLatestResult(result);
    setIsPipelineRunning(false);
  };

  const loadPresetDemoSecret = () => {
    setSecretInput(defaultUserSecret);
  };

  return (
    <div className="glass-card-glow p-6 rounded-2xl border border-neon-cyan/30 shadow-glow-cyan space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              ZK Proof Generator <span className="text-xs text-neon-cyan font-normal font-sans">(Compact Witness)</span>
            </h2>
            <p className="text-xs text-slate-400">Generate a zero-knowledge membership proof locally in your browser</p>
          </div>
        </div>
        <button
          onClick={loadPresetDemoSecret}
          className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-obsidian-800 hover:bg-slate-800 border border-slate-700 text-neon-cyan transition-colors"
        >
          Load Demo Secret
        </button>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neon-cyan" /> Private Credential Secret
            </span>
            <span className="text-neon-emerald text-[10px] font-semibold">Never leaves client</span>
          </label>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Enter your private credential secret..."
            className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-slate-700 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan font-mono text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Private Credential Salt (32-byte hex)
          </label>
          <input
            type="text"
            value={saltInput}
            onChange={(e) => setSaltInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-slate-700 focus:border-neon-cyan font-mono text-xs text-slate-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!secretInput || isSubmitting || isPipelineRunning}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan via-teal-500 to-emerald-500 hover:opacity-95 disabled:opacity-50 text-obsidian-950 font-mono text-sm font-bold shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
        >
          {isSubmitting || isPipelineRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-obsidian-950" />
              <span>Evaluating Compact ZK Circuit Witnesses...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate & Submit ZK Proof</span>
            </>
          )}
        </button>
      </form>

      {/* Live Pipeline Tracker */}
      {(isPipelineRunning || latestResult) && (
        <ProofStepsTracker steps={INITIAL_STEPS} currentStepIndex={currentStepIndex} />
      )}

      {/* Proof Evaluation Result Banner */}
      {latestResult && !isPipelineRunning && (
        <div
          className={`p-4 rounded-xl border font-mono text-xs space-y-2 transition-all ${
            latestResult.isValid
              ? 'bg-emerald-950/40 border-neon-emerald/50 text-slate-200 shadow-glow-emerald'
              : 'bg-rose-950/40 border-neon-rose/50 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {latestResult.isValid ? (
                <CheckCircle className="w-5 h-5 text-neon-emerald" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-neon-rose" />
              )}
              <span className="font-bold text-sm">
                {latestResult.isValid ? 'ZK Proof Validated on Ledger' : 'ZK Proof Rejected (Root Mismatch)'}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                latestResult.isValid ? 'bg-neon-emerald/20 text-neon-emerald' : 'bg-neon-rose/20 text-neon-rose'
              }`}
            >
              {latestResult.isValid ? 'accessGranted: TRUE' : 'accessGranted: FALSE'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 border-t border-slate-800/80 pt-2">
            <div>
              <span className="text-slate-500">Proof Hash: </span>
              <span className="text-neon-cyan font-mono">{latestResult.proofHash}</span>
            </div>
            <div>
              <span className="text-slate-500">Computed Merkle Root: </span>
              <span className="text-slate-300 font-mono text-[10px] break-all">{latestResult.computedRoot}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 text-neon-emerald text-[10px]">
              <span>✓ Identity Disclosed: NONE</span>
              <span>•</span>
              <span>✓ Wallet Address Exposed: NONE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
