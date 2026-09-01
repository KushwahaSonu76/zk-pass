import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AdminPanel } from './components/AdminPanel';
import { ProofGenerator } from './components/ProofGenerator';
import { VerificationBadge } from './components/VerificationBadge';
import { LedgerActivity } from './components/LedgerActivity';
import { PrivacyModelCard } from './components/PrivacyModelCard';
import { useMidnightWallet } from './hooks/useMidnightWallet';
import { useZkPassContract } from './hooks/useZkPassContract';
import { Shield, Lock, Eye, Sparkles, Terminal, FileCode, CheckCircle } from 'lucide-react';

export function App() {
  const { wallet, connectWallet, disconnectWallet } = useMidnightWallet();
  const {
    ledgerState,
    registeredCommitments,
    history,
    isSubmitting,
    addCredentialToRegistry,
    proveAndSubmitCredential,
    defaultUserSecret,
    defaultSalt,
  } = useZkPassContract();

  const [activeTab, setActiveTab] = useState<'prover' | 'admin' | 'privacy'>('prover');

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-neon-cyan/20 selection:text-neon-cyan">
      
      {/* Sticky Header */}
      <Navbar wallet={wallet} onConnect={connectWallet} onDisconnect={disconnectWallet} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner */}
        <section className="relative overflow-hidden glass-card p-8 rounded-3xl border border-cyan-500/20 text-center space-y-4">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-neon-violet/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-neon-cyan/20 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-obsidian-900 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Midnight Blockchain ZK Private Access Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-white max-w-3xl mx-auto">
            Zero-Knowledge <span className="neon-text-cyan">Credential</span> & Access Layer
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Prove you hold a verified KYC credential, membership tier, or compliance status without exposing your identity, wallet address, or underlying passport data.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto font-mono text-xs">
            <div className="p-3 rounded-xl bg-obsidian-900/90 border border-slate-800">
              <span className="text-slate-500 block">Ledger State</span>
              <span className="text-neon-emerald font-bold">Active Root</span>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-900/90 border border-slate-800">
              <span className="text-slate-500 block">Commitment Registry</span>
              <span className="text-neon-cyan font-bold">{registeredCommitments.length} Issued</span>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-900/90 border border-slate-800">
              <span className="text-slate-500 block">Identity Disclosed</span>
              <span className="text-neon-emerald font-bold">0 Bytes</span>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-900/90 border border-slate-800">
              <span className="text-slate-500 block">Proof Engine</span>
              <span className="text-neon-violet font-bold">Compact ZK</span>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-obsidian-900 border border-slate-800 font-mono text-xs space-x-2">
            <button
              onClick={() => setActiveTab('prover')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'prover'
                  ? 'bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Prover & Verification Portal
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-neon-violet/20 border border-neon-violet/40 text-neon-violet shadow-glow-violet'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Issuer Registry (Admin)
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-emerald-950/60 border border-neon-emerald/40 text-neon-emerald shadow-glow-emerald'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Privacy Model Specification
            </button>
          </div>
        </div>

        {/* Main Content Sections */}
        {activeTab === 'prover' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ProofGenerator
                onGenerateProof={proveAndSubmitCredential}
                defaultUserSecret={defaultUserSecret}
                defaultSalt={defaultSalt}
                isSubmitting={isSubmitting}
              />
              <VerificationBadge ledgerState={ledgerState} />
            </div>
            <div className="space-y-6">
              <LedgerActivity history={history} />
              <PrivacyModelCard />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <AdminPanel
              onAddCredential={addCredentialToRegistry}
              credentialCount={registeredCommitments.length}
              currentRoot={ledgerState.credentialRoot}
              defaultSalt={defaultSalt}
            />
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <PrivacyModelCard />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-neon-cyan" />
            <span>ZkPass Core • Midnight Blockchain Hackathon Submission</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Compact Smart Contracts</span>
            <span>•</span>
            <span>Lace Wallet Compatible</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
