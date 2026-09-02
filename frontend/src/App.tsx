import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AdminPanel } from './components/AdminPanel';
import { ProofGenerator } from './components/ProofGenerator';
import { VerificationBadge } from './components/VerificationBadge';
import { LedgerActivity } from './components/LedgerActivity';
import { PrivacyModelCard } from './components/PrivacyModelCard';
import { useMidnightWallet } from './hooks/useMidnightWallet';
import { useZkPassContract } from './hooks/useZkPassContract';
import { Shield, Sparkles } from 'lucide-react';

export function App() {
  const { wallet, connectWalletType, disconnectWallet } = useMidnightWallet();
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
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col selection:bg-prism-emerald/20 selection:text-prism-emerald">
      
      {/* Sticky Header */}
      <Navbar wallet={wallet} onConnectWalletType={connectWalletType} onDisconnect={disconnectWallet} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Cyber-Vault Hero Banner */}
        <section className="relative overflow-hidden cyber-card p-8 sm:p-10 rounded-3xl border border-prism-emerald/25 text-center space-y-5">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-prism-purple/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-prism-emerald/20 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyber-900 border border-prism-emerald/40 text-prism-emerald text-xs font-mono font-bold shadow-prism-emerald">
            <Sparkles className="w-4 h-4 text-prism-emerald" />
            <span>Midnight Blockchain ZK Private Access Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Zero-Knowledge <span className="text-glow-emerald">Credential</span> &amp; Access Layer
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Prove valid KYC compliance, accredited investor status, or exclusive membership tier **without revealing your identity, wallet address, or underlying credential position**.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-4xl mx-auto font-mono text-xs">
            <div className="p-3.5 rounded-2xl bg-cyber-900/90 border border-slate-800 text-left">
              <span className="text-slate-500 block font-semibold text-[10px]">Ledger State</span>
              <span className="text-prism-emerald font-extrabold text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-prism-emerald animate-pulse" /> Active Root
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyber-900/90 border border-slate-800 text-left">
              <span className="text-slate-500 block font-semibold text-[10px]">Allowlist Registry</span>
              <span className="text-white font-extrabold text-sm">{registeredCommitments.length} Issued</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyber-900/90 border border-slate-800 text-left">
              <span className="text-slate-500 block font-semibold text-[10px]">Identity Disclosed</span>
              <span className="text-prism-teal font-extrabold text-sm">0 Bytes (Zero)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyber-900/90 border border-slate-800 text-left">
              <span className="text-slate-500 block font-semibold text-[10px]">Proof Engine</span>
              <span className="text-prism-purple font-extrabold text-sm">Compact ZK</span>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-cyber-900 border border-slate-800 font-mono text-xs space-x-2">
            <button
              onClick={() => setActiveTab('prover')}
              className={`px-5 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'prover'
                  ? 'bg-prism-emerald/20 border border-prism-emerald/50 text-prism-emerald shadow-prism-emerald'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Prover &amp; Verification Portal
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-5 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-prism-purple/20 border border-prism-purple/50 text-prism-purple shadow-prism-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Issuer Registry Vault (Admin)
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-5 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-prism-teal/20 border border-prism-teal/50 text-prism-teal shadow-prism-teal'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Privacy Guarantee Audit
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

      {/* Cyber-Vault Footer */}
      <footer className="cyber-card border-t border-slate-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-prism-emerald" />
            <span className="font-bold text-white">ZkPass Core • Midnight Blockchain</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Compact ZK Smart Contracts</span>
            <span>•</span>
            <span>Multi-Wallet Bridge (Freighter, Lace, MetaMask)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
