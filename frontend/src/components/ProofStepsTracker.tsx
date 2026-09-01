import React from 'react';
import { CheckCircle2, Loader2, Lock, ShieldCheck, Database, FileCheck } from 'lucide-react';

export interface ProofStep {
  id: number;
  label: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

interface ProofStepsTrackerProps {
  steps: ProofStep[];
  currentStepIndex: number;
}

export const ProofStepsTracker: React.FC<ProofStepsTrackerProps> = ({ steps, currentStepIndex }) => {
  return (
    <div className="p-4 rounded-xl bg-obsidian-950/90 border border-slate-800 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-850 pb-2">
        <span className="flex items-center gap-1.5 font-bold text-neon-cyan">
          <FileCheck className="w-3.5 h-3.5" /> Compact ZK Witness Evaluation Pipeline
        </span>
        <span>Step {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}</span>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed' || idx < currentStepIndex;
          const isCurrent = step.status === 'running' || idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                isCompleted
                  ? 'bg-emerald-950/30 border-neon-emerald/30 text-slate-200'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-neon-cyan/50 text-white shadow-glow-cyan'
                  : 'bg-obsidian-900 border-slate-850 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-neon-cyan animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center shrink-0">
                    {step.id}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-xs">{step.label}</div>
                  <div className="text-[10px] text-slate-400">{step.description}</div>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isCompleted
                    ? 'bg-neon-emerald/20 text-neon-emerald'
                    : isCurrent
                    ? 'bg-neon-cyan/20 text-neon-cyan'
                    : 'text-slate-600'
                }`}
              >
                {isCompleted ? 'VERIFIED' : isCurrent ? 'EXECUTING' : 'PENDING'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
