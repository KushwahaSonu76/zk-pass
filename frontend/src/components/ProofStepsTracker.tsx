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
    <div className="p-4 rounded-2xl bg-cyber-950/90 border border-slate-800 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-850 pb-2">
        <span className="flex items-center gap-1.5 font-bold text-prism-emerald">
          <FileCheck className="w-3.5 h-3.5" /> Compact ZK Witness Pipeline (5 Stages)
        </span>
        <span className="text-slate-400">Step {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}</span>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed' || idx < currentStepIndex;
          const isCurrent = step.status === 'running' || idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                isCompleted
                  ? 'bg-emerald-950/30 border-prism-emerald/30 text-slate-200'
                  : isCurrent
                  ? 'bg-cyber-900 border-prism-emerald/60 text-white shadow-prism-emerald'
                  : 'bg-cyber-950 border-slate-850 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-prism-emerald shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-prism-emerald animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center shrink-0 text-slate-500">
                    {step.id}
                  </div>
                )}
                <div>
                  <div className={`font-semibold text-xs ${isCurrent ? 'text-prism-emerald' : ''}`}>{step.label}</div>
                  <div className="text-[10px] text-slate-400">{step.description}</div>
                </div>
              </div>

              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isCompleted
                    ? 'bg-prism-emerald/20 text-prism-emerald border border-prism-emerald/40'
                    : isCurrent
                    ? 'bg-prism-teal/20 text-prism-teal border border-prism-teal/40 animate-pulse'
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
