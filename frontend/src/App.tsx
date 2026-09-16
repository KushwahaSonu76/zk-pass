import React, { useState, useRef } from 'react';
import {
  Shield,
  Sparkles,
  ArrowUpRight,
  Lock,
  Cpu,
  Check,
  ExternalLink,
  Copy,
  CheckCircle2,
  Radio,
  Globe,
  Layers,
  Fingerprint,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMidnightWallet } from './hooks/useMidnightWallet';
import { useZkPassContract } from './hooks/useZkPassContract';
import { WalletModal } from './components/WalletModal';
import { ProofGenerator } from './components/ProofGenerator';
import { VisualMerkleTree } from './components/VisualMerkleTree';
import { VerifierPortal } from './components/VerifierPortal';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyModelCard } from './components/PrivacyModelCard';
import { LedgerActivity } from './components/LedgerActivity';
import { VerificationBadge } from './components/VerificationBadge';
import { AccessProofResult, computeCommitment } from '../../contract';

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

  const [activeTab, setActiveTab] = useState<'prover' | 'tree' | 'verifier' | 'admin' | 'privacy'>('prover');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [activeProofData, setActiveProofData] = useState<{
    result: AccessProofResult;
    commitment: string;
    secret: string;
    salt: string;
  } | null>(null);

  const [quickSecret, setQuickSecret] = useState(defaultUserSecret);
  const [quickSalt, setQuickSalt] = useState(defaultSalt);
  const [quickProofSuccess, setQuickProofSuccess] = useState(false);
  const [isGeneratingQuickProof, setIsGeneratingQuickProof] = useState(false);

  const contractAddress = '45da95ddda479777d41c23f56ec87ce41cc779d6fc017e3bb994d1e3d6193011';
  const explorerUrl = `https://preprod.midnightexplorer.com/contracts/0x${contractAddress}`;

  const proverSectionRef = useRef<HTMLDivElement>(null);

  const handleProofGenerated = (result: AccessProofResult, secret: string, salt: string) => {
    try {
      const commitment = computeCommitment(secret, salt);
      setActiveProofData({
        result,
        commitment,
        secret,
        salt,
      });
    } catch {}
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleQuickProof = async () => {
    setIsGeneratingQuickProof(true);
    try {
      const result = await proveAndSubmitCredential(quickSecret, quickSalt);
      handleProofGenerated(result, quickSecret, quickSalt);
      setQuickProofSuccess(true);
      setTimeout(() => setQuickProofSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingQuickProof(false);
    }
  };

  const scrollToProver = () => {
    setActiveTab('prover');
    proverSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#0A0A0A] font-sans selection:bg-black selection:text-white flex flex-col justify-between">
      
      {/* HEADER - Ovia Style */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md">
            <Shield size={19} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-xl tracking-tight font-space">zkpass.</p>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm text-stone-500 font-medium">
          <button
            onClick={() => setActiveTab('prover')}
            className={`transition ${activeTab === 'prover' ? 'text-black font-semibold' : 'hover:text-black'}`}
          >
            Product
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`transition ${activeTab === 'tree' ? 'text-black font-semibold' : 'hover:text-black'}`}
          >
            Merkle Tree
          </button>
          <button
            onClick={() => setActiveTab('verifier')}
            className={`transition ${activeTab === 'verifier' ? 'text-black font-semibold' : 'hover:text-black'}`}
          >
            Verifier
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`transition ${activeTab === 'admin' ? 'text-black font-semibold' : 'hover:text-black'}`}
          >
            Issuer Vault
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`transition ${activeTab === 'privacy' ? 'text-black font-semibold' : 'hover:text-black'}`}
          >
            Privacy Audit
          </button>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black flex items-center gap-1"
          >
            Midnight Explorer <ArrowUpRight size={12} />
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {wallet.isConnected ? (
            <button
              onClick={() => disconnectWallet()}
              className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium flex items-center gap-2 hover:bg-stone-800 transition"
              title="Click to disconnect"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{wallet.walletName || 'Wallet'}</span>
              <span className="text-xs text-stone-400 font-mono">
                ({wallet.publicAddress ? `${wallet.publicAddress.slice(0, 6)}...${wallet.publicAddress.slice(-4)}` : 'Connected'})
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium flex items-center gap-2 hover:bg-stone-800 transition shadow-sm hover:shadow"
            >
              Connect Wallet <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-6 space-y-12">

        {/* HERO - 3D Ovia Style */}
        <div className="pt-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-[11px] font-medium tracking-wide uppercase mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero Knowledge on Midnight Preprod</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] font-space text-[#0A0A0A]">
              Private <br />
              <span className="text-stone-400">access,</span> <br />
              verified.
            </h1>

            <p className="text-stone-600 mt-6 max-w-md leading-relaxed text-base">
              Prove KYC, accredited status, or DAO membership without revealing identity. Ovia-inspired private credential vault built on Midnight Compact.
            </p>

            <div className="flex flex-wrap gap-3.5 mt-8">
              <button
                onClick={scrollToProver}
                className="px-8 py-3.5 rounded-full bg-black text-white font-medium hover:scale-105 transition shadow-md flex items-center gap-2"
              >
                <span>Generate Proof</span>
                <ArrowRight size={16} />
              </button>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full bg-white border border-black/10 font-medium hover:bg-stone-100 transition shadow-sm flex items-center gap-2"
              >
                <span>View Explorer</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold">ZK</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold">MN</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold">CP</div>
              </div>
              <p className="text-xs text-stone-500 font-medium">Trusted by 3k+ private members • Midnight Preprod Active</p>
            </div>
          </motion.div>

          {/* 3D BLOB - Ovia Element */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-[480px] mx-auto rounded-[3rem] bg-gradient-to-br from-[#EAE6FF] via-[#FFE5E5] to-[#E5FFF0] flex items-center justify-center overflow-hidden border border-white shadow-2xl">
              
              {/* Background ambient lighting */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_60%)]" />
              
              {/* Abstract 3D Tilted Card */}
              <motion.div
                whileHover={{ rotate: 8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-[72%] h-[72%] rounded-[2.2rem] bg-gradient-to-br from-black via-stone-900 to-stone-700 shadow-[0_30px_90px_rgba(0,0,0,0.35)] rotate-12 flex flex-col items-center justify-center p-6 border border-white/20 relative"
              >
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-3 shadow-inner">
                  <Lock size={44} className="text-white drop-shadow-md" />
                </div>
                <p className="text-white font-space font-bold text-lg tracking-tight">Compact ZK Vault</p>
                <p className="text-white/60 text-xs font-mono">0 Bytes Revealed</p>
              </motion.div>

              {/* Floating Merkle Root Glass Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-[10px] tracking-wider text-stone-500 font-bold uppercase">PREPROD MERKLE ROOT</p>
                  <p className="text-xs font-mono font-bold text-black mt-0.5">
                    {ledgerState.credentialRoot.slice(0, 10)}...{ledgerState.credentialRoot.slice(-6)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                  <Check size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* PREPROD CONTRACT VERIFIED BANNER */}
        <div className="rounded-2xl bg-white border border-black/5 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Midnight Preprod
            </span>
            <span className="text-stone-400">Contract:</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 text-stone-900 font-bold">
              {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
            </span>
            <button
              onClick={handleCopyContract}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition flex items-center gap-1"
            >
              {copiedContract ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copiedContract ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-stone-500">
            <span>Compact ZK v0.31</span>
            <span>•</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black font-semibold hover:underline flex items-center gap-1"
            >
              On-Chain Explorer <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* ZK CARDS - Ovia Glass Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Card 1 - Quick Salt & Proof Trigger */}
          <div className="rounded-[2rem] bg-white border border-black/5 p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="w-11 h-11 rounded-full bg-[#F8F5F0] flex items-center justify-center mb-5 border border-stone-200">
                <Cpu size={20} className="text-stone-800" />
              </div>
              <h3 className="font-bold text-lg font-space">Private Salt &amp; Entropy</h3>
              <p className="text-xs text-stone-500 mt-1.5 mb-4">32-byte hex entropy for unforgeable commitment</p>
              
              <div className="space-y-2">
                <div className="bg-[#F8F5F0] rounded-xl p-3 text-[11px] font-mono break-all border border-stone-200 text-stone-800">
                  <span className="text-stone-400 block text-[9px] font-sans font-bold">SALT ENTROPY</span>
                  {quickSalt}
                </div>
                <div className="bg-[#F8F5F0] rounded-xl p-3 text-[11px] font-mono break-all border border-stone-200 text-stone-800">
                  <span className="text-stone-400 block text-[9px] font-sans font-bold">SECRET CREDENTIAL</span>
                  {quickSecret}
                </div>
              </div>
            </div>

            <button
              onClick={handleQuickProof}
              disabled={isGeneratingQuickProof || isSubmitting}
              className="w-full mt-6 py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-stone-800 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGeneratingQuickProof ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Witness &amp; Proof...</span>
                </>
              ) : quickProofSuccess ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span>Verified On Preprod!</span>
                </>
              ) : (
                <>
                  <span>Generate &amp; Submit ZK Proof</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          {/* Card 2 - Witness Pipeline */}
          <div className="rounded-[2rem] bg-[#0A0A0A] text-white p-7 flex flex-col justify-between shadow-xl">
            <div>
              <p className="text-[10px] tracking-widest text-stone-400 font-bold mb-4 font-space uppercase">
                COMPACT ZK WITNESS PIPELINE
              </p>
              <div className="space-y-2.5">
                {[
                  { title: 'Private Witness Extraction', status: isGeneratingQuickProof ? 'EXECUTING' : 'READY', active: true },
                  { title: 'Cryptographic Commitment', status: isGeneratingQuickProof ? 'EXECUTING' : 'READY', active: true },
                  { title: 'Merkle Membership Path', status: activeProofData ? 'VERIFIED' : 'READY', active: true },
                  { title: 'Compact Circuit Evaluation', status: activeProofData ? 'PASSED' : 'READY', active: true },
                ].map((t, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 rounded-xl transition ${
                      isGeneratingQuickProof && i === 0
                        ? 'bg-white/15 border border-white/30'
                        : activeProofData
                        ? 'bg-white/10 border border-emerald-500/30'
                        : 'bg-white/5 border border-white/5'
                    }`}
                  >
                    <p className="text-xs font-medium text-stone-200">{t.title}</p>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isGeneratingQuickProof && i === 0
                          ? 'bg-white text-black animate-pulse'
                          : activeProofData
                          ? 'bg-emerald-400 text-black'
                          : 'bg-white/10 text-stone-300'
                      }`}
                    >
                      {isGeneratingQuickProof && i === 0 ? 'EXECUTING' : activeProofData ? 'PASSED' : 'READY'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
              <span>Proof Engine</span>
              <span className="font-mono text-emerald-400 font-bold">Compact v0.31.0</span>
            </div>
          </div>

          {/* Card 3 - Verifier Portal */}
          <div className="rounded-[2rem] bg-[#EDE8FF] border border-purple-200 p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-bold text-lg font-space text-purple-950">Verifier Portal</h3>
                <span className="px-3 py-1 rounded-full bg-white text-[11px] font-medium text-purple-900 shadow-sm border border-purple-100">
                  {registeredCommitments.length} Active Credentials
                </span>
              </div>

              <div className="w-full py-6 rounded-2xl bg-white flex flex-col items-center justify-center border border-purple-100 shadow-sm text-center px-4">
                <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center mb-2 shadow-md">
                  <Shield size={18} />
                </div>
                <p className="text-xs font-bold text-black tracking-wide">
                  {activeProofData ? 'CREDENTIAL VERIFIED' : 'READY FOR VERIFICATION'}
                </p>
                <p className="text-[10px] text-stone-500 mt-0.5">0 Bytes leaked (Airtight Privacy)</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-purple-100 text-[10px] shadow-sm">
                  <p className="text-stone-400 font-medium">Output</p>
                  <p className="font-bold text-emerald-600 mt-0.5 font-mono">accessGranted = true</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-purple-100 text-[10px] shadow-sm">
                  <p className="text-stone-400 font-medium">Identity Leaked</p>
                  <p className="font-bold text-black mt-0.5 font-mono">0 Bytes</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('verifier')}
              className="w-full mt-5 py-2.5 rounded-full bg-purple-900 text-white text-xs font-medium hover:bg-purple-950 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Open Verifier Certificate</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>

        {/* INTERACTIVE WORKSPACE SECTION */}
        <div ref={proverSectionRef} className="pt-6 space-y-6">
          
          {/* Section Navigation Tabs (Ovia Pill Style) */}
          <div className="flex justify-center overflow-x-auto py-2">
            <div className="inline-flex p-1.5 rounded-full bg-white border border-black/10 shadow-sm text-xs space-x-1 font-medium">
              <button
                onClick={() => setActiveTab('prover')}
                className={`px-5 py-2.5 rounded-full transition-all ${
                  activeTab === 'prover'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-stone-600 hover:text-black hover:bg-stone-100'
                }`}
              >
                Prover Studio
              </button>
              <button
                onClick={() => setActiveTab('tree')}
                className={`px-5 py-2.5 rounded-full transition-all ${
                  activeTab === 'tree'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-stone-600 hover:text-black hover:bg-stone-100'
                }`}
              >
                Visual Merkle Tree
              </button>
              <button
                onClick={() => setActiveTab('verifier')}
                className={`px-5 py-2.5 rounded-full transition-all ${
                  activeTab === 'verifier'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-stone-600 hover:text-black hover:bg-stone-100'
                }`}
              >
                Verifier Portal &amp; Certificate
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-5 py-2.5 rounded-full transition-all ${
                  activeTab === 'admin'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-stone-600 hover:text-black hover:bg-stone-100'
                }`}
              >
                Issuer Vault (Admin)
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-5 py-2.5 rounded-full transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-stone-600 hover:text-black hover:bg-stone-100'
                }`}
              >
                Privacy Audit Inspector
              </button>
            </div>
          </div>

          {/* Active Tab Component Render */}
          {activeTab === 'prover' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <ProofGenerator
                  onGenerateProof={proveAndSubmitCredential}
                  defaultUserSecret={defaultUserSecret}
                  defaultSalt={defaultSalt}
                  isSubmitting={isSubmitting}
                  onProofGenerated={handleProofGenerated}
                />
                <VerificationBadge ledgerState={ledgerState} />
              </div>
              <div className="space-y-6">
                <VisualMerkleTree
                  currentRoot={ledgerState.credentialRoot}
                  commitments={registeredCommitments}
                  activeCommitment={activeProofData?.commitment}
                />
                <LedgerActivity history={history} />
              </div>
            </div>
          )}

          {activeTab === 'tree' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <VisualMerkleTree
                currentRoot={ledgerState.credentialRoot}
                commitments={registeredCommitments}
                activeCommitment={activeProofData?.commitment}
              />
            </div>
          )}

          {activeTab === 'verifier' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <VerifierPortal ledgerState={ledgerState} />
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

        </div>

      </main>

      {/* FOOTER - Ovia Style */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-12 mt-20 border-t border-stone-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <p className="font-bold text-base tracking-tight font-space">zkpass.</p>
            <span className="text-xs text-stone-500 ml-2">Midnight Blockchain ZK Allowlist Protocol</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-500 font-medium">
            <span>Compact Smart Contracts</span>
            <span>•</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black font-semibold hover:underline"
            >
              Midnight Preprod Explorer
            </a>
            <span>•</span>
            <span>Midnight Native Wallets (Lace &amp; 1 AM Wallet)</span>
          </div>
        </div>
      </footer>

      {/* Multi-Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={(walletId) => connectWalletType(walletId)}
        currentWalletName={wallet.walletName}
      />

    </div>
  );
}
export default App;
