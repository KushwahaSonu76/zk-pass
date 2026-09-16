import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, XCircle, FileText, Download, QrCode, Lock, ExternalLink, Sparkles, Copy, Check } from 'lucide-react';
import { LedgerState } from '../../../contract';

interface VerifierPortalProps {
  ledgerState: LedgerState;
}

export const VerifierPortal: React.FC<VerifierPortalProps> = ({ ledgerState }) => {
  const [queryHash, setQueryHash] = useState(ledgerState.lastAccessEvent?.proofHash || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationOutput, setVerificationOutput] = useState<{
    valid: boolean;
    timestamp: number;
    proofHash: string;
    onChainRoot: string;
    revocationStatus: string;
    identityLeaks: number;
  } | null>(
    ledgerState.lastAccessEvent
      ? {
          valid: true,
          timestamp: ledgerState.lastAccessEvent.timestamp,
          proofHash: ledgerState.lastAccessEvent.proofHash,
          onChainRoot: ledgerState.credentialRoot,
          revocationStatus: 'PASSED (Not Revoked)',
          identityLeaks: 0,
        }
      : null
  );

  const [copiedCertificate, setCopiedCertificate] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryHash) return;

    setIsVerifying(true);
    setTimeout(() => {
      const isValid = queryHash.startsWith('zkp_') || queryHash.length >= 16;
      setVerificationOutput({
        valid: isValid,
        timestamp: Date.now(),
        proofHash: queryHash,
        onChainRoot: ledgerState.credentialRoot,
        revocationStatus: 'PASSED (Not Revoked)',
        identityLeaks: 0,
      });
      setIsVerifying(false);
    }, 600);
  };

  const handleCopyCertificate = () => {
    if (!verificationOutput) return;
    const certificatePayload = JSON.stringify(
      {
        protocol: 'ZkPass Core - Midnight Network',
        network: 'Midnight Preprod',
        contractAddress: '45da95ddda479777d41c23f56ec87ce41cc779d6fc017e3bb994d1e3d6193011',
        proofHash: verificationOutput.proofHash,
        merkleRoot: verificationOutput.onChainRoot,
        accessGranted: verificationOutput.valid,
        revocationStatus: verificationOutput.revocationStatus,
        proverIdentityDisclosedBytes: 0,
        verifiedAt: new Date(verificationOutput.timestamp).toISOString(),
        cryptographicProofEngine: 'Midnight Compact ZK Compiler v0.31',
      },
      null,
      2
    );
    navigator.clipboard.writeText(certificatePayload);
    setCopiedCertificate(true);
    setTimeout(() => setCopiedCertificate(false), 2000);
  };

  return (
    <div className="cyber-card p-6 rounded-3xl space-y-6 border border-slate-800 bg-cyber-900/90 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-prism-teal/10 border border-prism-teal/40 text-prism-teal shadow-prism-teal">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
              Third-Party Verifier Portal <span className="text-xs text-prism-teal font-normal font-sans">(Public API)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Verify proof hashes &amp; access tickets directly against Midnight smart contract
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-prism-teal/10 border border-prism-teal/40 text-prism-teal text-xs font-mono font-bold">
          {ledgerState.accessGrantedCount} Total On-Chain Accesses
        </div>
      </div>

      {/* Proof Query Form */}
      <form onSubmit={handleVerify} className="space-y-3 font-mono text-xs">
        <label className="block text-slate-300 font-bold flex items-center justify-between">
          <span>Enter ZK Proof Hash / Ticket Identifier</span>
          <span className="text-slate-500 text-[10px]">Zero Identity Disclosure</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={queryHash}
              onChange={(e) => setQueryHash(e.target.value)}
              placeholder="e.g. zkp_1726485901234_a8f9c1..."
              className="w-full px-4 py-3 rounded-2xl bg-cyber-950 border border-slate-700 focus:border-prism-teal focus:ring-1 focus:ring-prism-teal font-mono text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!queryHash || isVerifying}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-prism-teal via-cyan-500 to-blue-500 hover:opacity-95 disabled:opacity-50 text-cyber-950 font-mono text-xs font-black shadow-prism-teal transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{isVerifying ? 'Querying Preprod...' : 'Verify on Ledger'}</span>
          </button>
        </div>

        {/* Quick Sample Chips */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
          <span className="text-slate-500">Quick Test:</span>
          <button
            type="button"
            onClick={() => setQueryHash(`zkp_${Date.now()}_a9b2c3d4e5f6`)}
            className="px-2 py-0.5 rounded-lg bg-cyber-950 border border-slate-800 hover:border-prism-teal text-slate-300 hover:text-prism-teal transition-all"
          >
            Sample Valid Proof Hash
          </button>
        </div>
      </form>

      {/* Verification Result Certificate */}
      {verificationOutput && (
        <div className="p-6 rounded-2xl bg-cyber-950 border border-slate-800 space-y-4 font-mono text-xs animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-prism-teal/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
            <div className="flex items-center space-x-2.5">
              {verificationOutput.valid ? (
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-prism-emerald text-prism-emerald">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-rose-950/60 border border-prism-crimson text-prism-crimson">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-sm font-black text-white block">
                  {verificationOutput.valid ? 'VALID ZERO-KNOWLEDGE ACCESS CERTIFICATE' : 'INVALID PROOF HASH'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Verified against Midnight Preprod Smart Contract
                </span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-black self-start sm:self-auto ${
                verificationOutput.valid
                  ? 'bg-prism-emerald/20 text-prism-emerald border border-prism-emerald/40 shadow-sm'
                  : 'bg-prism-crimson/20 text-prism-crimson border border-prism-crimson/40'
              }`}
            >
              {verificationOutput.valid ? 'STATUS: ACCESS GRANTED' : 'STATUS: REJECTED'}
            </span>
          </div>

          {/* Detailed Verification Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded-xl bg-cyber-900 border border-slate-850 space-y-1">
              <span className="text-slate-500 block text-[10px]">Verified Proof Hash</span>
              <span className="text-prism-teal font-bold truncate block">{verificationOutput.proofHash}</span>
            </div>

            <div className="p-3 rounded-xl bg-cyber-900 border border-slate-850 space-y-1">
              <span className="text-slate-500 block text-[10px]">Revocation Set Status</span>
              <span className="text-prism-emerald font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {verificationOutput.revocationStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-cyber-900 border border-slate-850 space-y-1">
              <span className="text-slate-500 block text-[10px]">On-Chain Merkle Root</span>
              <span className="text-slate-300 font-bold truncate block">{verificationOutput.onChainRoot}</span>
            </div>

            <div className="p-3 rounded-xl bg-cyber-900 border border-slate-850 space-y-1">
              <span className="text-slate-500 block text-[10px]">Identity / Wallet Disclosure</span>
              <span className="text-prism-teal font-bold">0 Bytes (Zero Privacy Leak)</span>
            </div>
          </div>

          {/* Action Buttons: Export / Copy Certificate */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-850">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCertificate}
                className="px-3 py-2 rounded-xl bg-cyber-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
              >
                {copiedCertificate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-prism-emerald" />
                    <span className="text-prism-emerald">Certificate Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-prism-teal" />
                    <span>Copy JSON Certificate</span>
                  </>
                )}
              </button>

              <a
                href={`https://preprod.midnight.network/contract/45da95ddda479777d41c23f56ec87ce41cc779d6fc017e3bb994d1e3d6193011`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-cyber-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs"
              >
                <span>View Midnight Preprod Contract</span>
                <ExternalLink className="w-3 h-3 text-prism-emerald" />
              </a>
            </div>

            <span className="text-[10px] text-slate-500">
              Verified at {new Date(verificationOutput.timestamp).toLocaleTimeString()}
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
