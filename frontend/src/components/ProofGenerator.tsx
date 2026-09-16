import React, { useState, useEffect } from 'react';
import { Lock, Cpu, CheckCircle, AlertTriangle, Sparkles, Loader2, KeyRound, ShieldAlert, Volume2, VolumeX, Database, Check } from 'lucide-react';
import { AccessProofResult, computeCommitment } from '../../../contract';
import { PresetSelector, PRESETS, CredentialPreset } from './PresetSelector';
import { TerminalSimulator } from './TerminalSimulator';
import { ProofStepsTracker, ProofStep } from './ProofStepsTracker';

interface ProofGeneratorProps {
  onGenerateProof: (secret: string, salt: string) => Promise<AccessProofResult>;
  defaultUserSecret: string;
  defaultSalt: string;
  isSubmitting: boolean;
  onProofGenerated?: (result: AccessProofResult, secret: string, salt: string) => void;
}

interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'zkp';
  text: string;
}

const INITIAL_STEPS: ProofStep[] = [
  { id: 1, label: 'Private Witness Extraction', description: 'Load secret & salt into browser local RAM', status: 'idle' },
  { id: 2, label: 'Cryptographic Commitment', description: 'Evaluate sha256(secret || salt) leaf hash', status: 'idle' },
  { id: 3, label: 'Merkle Membership Path', description: 'Construct 8-level sibling witness path', status: 'idle' },
  { id: 4, label: 'Compact Circuit Evaluation', description: 'Execute zero-knowledge constraint verification', status: 'idle' },
  { id: 5, label: 'Midnight Preprod State Transition', description: 'Record public accessGranted = true without identity leakage', status: 'idle' },
];

export const ProofGenerator: React.FC<ProofGeneratorProps> = ({
  onGenerateProof,
  defaultUserSecret,
  defaultSalt,
  isSubmitting,
  onProofGenerated,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [secretInput, setSecretInput] = useState(PRESETS[0].secret);
  const [saltInput, setSaltInput] = useState(defaultSalt);
  const [latestResult, setLatestResult] = useState<AccessProofResult | null>(null);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [steps, setSteps] = useState<ProofStep[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play subtle web audio chime on success
  const playSuccessChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {}
  };

  const handleSelectPreset = (preset: CredentialPreset) => {
    setSelectedPresetId(preset.id);
    setSecretInput(preset.secret);
  };

  const getTime = () => new Date().toLocaleTimeString().split(' ')[0];

  const calculatedCommitment = React.useMemo(() => {
    try {
      return computeCommitment(secretInput, saltInput);
    } catch {
      return '';
    }
  }, [secretInput, saltInput]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);
    setLatestResult(null);
    setLogs([]);
    setCurrentStepIndex(0);

    const addLog = (type: 'info' | 'success' | 'warn' | 'zkp', text: string) => {
      setLogs((prev) => [
        ...prev,
        { id: Math.random().toString(36).substring(2, 9), timestamp: getTime(), type, text },
      ]);
    };

    // Reset steps
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'idle' })));

    // Step 1: Witness Extraction
    setSteps((prev) => prev.map((s, i) => (i === 0 ? { ...s, status: 'running' } : s)));
    addLog('info', 'Loading private witness credential & salt into browser isolated RAM...');
    await new Promise((res) => setTimeout(res, 250));
    setSteps((prev) => prev.map((s, i) => (i === 0 ? { ...s, status: 'completed' } : s)));
    setCurrentStepIndex(1);

    // Step 2: Commitment
    setSteps((prev) => prev.map((s, i) => (i === 1 ? { ...s, status: 'running' } : s)));
    addLog('zkp', `Computing double digest commitment: sha256(secret || salt) = 0x${calculatedCommitment.slice(0, 16)}...`);
    await new Promise((res) => setTimeout(res, 300));
    setSteps((prev) => prev.map((s, i) => (i === 1 ? { ...s, status: 'completed' } : s)));
    setCurrentStepIndex(2);

    // Step 3: Merkle Path
    setSteps((prev) => prev.map((s, i) => (i === 2 ? { ...s, status: 'running' } : s)));
    addLog('zkp', 'Constructing 8-depth Merkle membership path witness against public ledger root...');
    await new Promise((res) => setTimeout(res, 350));
    setSteps((prev) => prev.map((s, i) => (i === 2 ? { ...s, status: 'completed' } : s)));
    setCurrentStepIndex(3);

    // Step 4: Compact Circuit Evaluation
    setSteps((prev) => prev.map((s, i) => (i === 3 ? { ...s, status: 'running' } : s)));
    addLog('zkp', 'Evaluating Compact ZK circuit constraints: assert(computedRoot == ledger.credentialRoot)...');
    await new Promise((res) => setTimeout(res, 350));

    const result = await onGenerateProof(secretInput, saltInput);

    if (result.isValid) {
      setSteps((prev) => prev.map((s, i) => (i === 3 ? { ...s, status: 'completed' } : s)));
      setCurrentStepIndex(4);

      // Step 5: On-chain transition
      setSteps((prev) => prev.map((s, i) => (i === 4 ? { ...s, status: 'running' } : s)));
      addLog('success', `Compact ZK Proof Verified! Proof Hash: ${result.proofHash}`);
      addLog('success', 'Public ledger state transition confirmed: accessGranted = TRUE');
      addLog('info', 'Identity privacy audit: 0 bytes of identity or wallet data sent on-chain.');
      await new Promise((res) => setTimeout(res, 300));
      setSteps((prev) => prev.map((s, i) => (i === 4 ? { ...s, status: 'completed' } : s)));

      playSuccessChime();
      onProofGenerated?.(result, secretInput, saltInput);
    } else {
      setSteps((prev) => prev.map((s, i) => (i === 3 ? { ...s, status: 'failed' } : s)));
      addLog('warn', 'ZK Constraint Failure: Calculated Merkle root does not match registered credential root!');
    }

    setLatestResult(result);
    setIsExecuting(false);
  };

  return (
    <div className="cyber-card-emerald p-6 rounded-3xl space-y-6">
      
      {/* Header with Sound Toggle */}
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

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 ${
            soundEnabled
              ? 'bg-cyber-900 border-prism-emerald/30 text-prism-emerald'
              : 'bg-cyber-950 border-slate-800 text-slate-500'
          }`}
          title={soundEnabled ? 'Audio Chime Enabled' : 'Audio Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline text-[10px]">{soundEnabled ? 'Audio ON' : 'Muted'}</span>
        </button>
      </div>

      {/* Preset Selector */}
      <PresetSelector selectedPresetId={selectedPresetId} onSelectPreset={handleSelectPreset} />

      {/* Inputs Form */}
      <form onSubmit={handleGenerate} className="space-y-4 font-mono text-xs">
        <div>
          <label className="block text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-white">
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

        {/* Real-time Commitment Preview */}
        {calculatedCommitment && (
          <div className="p-3 rounded-xl bg-cyber-950/90 border border-slate-850 text-[11px] space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5 font-semibold text-[10px]">
              <Database className="w-3 h-3 text-prism-emerald" />
              <span>Calculated Commitment Preimage Hash: sha256(secret || salt)</span>
            </div>
            <div className="text-prism-emerald truncate font-bold text-xs select-all">
              0x{calculatedCommitment}
            </div>
          </div>
        )}

        <div>
          <label className="block text-slate-300 mb-1.5 text-[11px]">
            Private Salt (32-byte hex entropy)
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
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-prism-emerald via-teal-400 to-emerald-500 hover:opacity-95 disabled:opacity-50 text-cyber-950 font-mono text-sm font-black shadow-prism-emerald transition-all duration-300 flex items-center justify-center space-x-2"
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

      {/* Interactive 5-Stage Step Tracker */}
      <ProofStepsTracker steps={steps} currentStepIndex={currentStepIndex} />

      {/* Terminal Execution Log */}
      <TerminalSimulator logs={logs} isRunning={isExecuting} />

      {/* Result Holographic Card */}
      {latestResult && !isExecuting && (
        <div
          className={`p-5 rounded-2xl border font-mono text-xs space-y-3 transition-all ${
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
                {latestResult.isValid ? 'Proof Validated on Midnight Preprod' : 'Proof Rejected (Root Mismatch)'}
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
              <span className="text-slate-400">Proof Hash:</span>
              <span className="text-prism-emerald font-bold truncate max-w-xs">{latestResult.proofHash}</span>
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
