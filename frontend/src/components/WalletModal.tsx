import React from 'react';
import { X, Wallet, Check, Shield, Cpu, Sparkles } from 'lucide-react';

export interface WalletOption {
  id: 'freighter' | 'lace' | 'metamask' | 'demo';
  name: string;
  badge: string;
  description: string;
  isInstalled: boolean;
  color: string;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: 'freighter' | 'lace' | 'metamask' | 'demo') => void;
  currentWalletName: string | null;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
  currentWalletName,
}) => {
  if (!isOpen) return null;

  const isLaceAvailable = !!(window as unknown as { midnight?: { lace?: unknown } }).midnight?.lace;
  const isFreighterAvailable = !!(window as unknown as { freighterApi?: unknown; freighter?: unknown }).freighterApi || !!(window as unknown as { freighter?: unknown }).freighter;
  const isMetaMaskAvailable = !!(window as unknown as { ethereum?: unknown }).ethereum;

  const walletOptions: WalletOption[] = [
    {
      id: 'freighter',
      name: 'Freighter Wallet',
      badge: isFreighterAvailable ? 'Extension Active' : 'Supported',
      description: 'Connect via Freighter browser wallet extension API',
      isInstalled: isFreighterAvailable,
      color: 'border-prism-teal/60 text-prism-teal bg-prism-teal/10 hover:border-prism-teal',
    },
    {
      id: 'lace',
      name: 'Midnight Lace Wallet',
      badge: isLaceAvailable ? 'Extension Active' : 'Midnight Native',
      description: 'Official Midnight Network native browser extension wallet',
      isInstalled: isLaceAvailable,
      color: 'border-prism-emerald/60 text-prism-emerald bg-prism-emerald/10 hover:border-prism-emerald',
    },
    {
      id: 'metamask',
      name: 'MetaMask / Web3',
      badge: isMetaMaskAvailable ? 'Detected' : 'Web3 Bridge',
      description: 'Ethereum & Web3 bridge wallet adapter for zero-knowledge proofs',
      isInstalled: isMetaMaskAvailable,
      color: 'border-prism-purple/60 text-prism-purple bg-prism-purple/10 hover:border-prism-purple',
    },
    {
      id: 'demo',
      name: 'Instant Hackathon Test Wallet',
      badge: 'Fast Connect',
      description: '1-click simulated Midnight wallet for instant proof evaluation & testing',
      isInstalled: true,
      color: 'border-amber-500/60 text-amber-400 bg-amber-500/10 hover:border-amber-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg cyber-card-emerald p-6 sm:p-7 rounded-3xl space-y-6 shadow-2xl border border-prism-emerald/40">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-prism-emerald/10 border border-prism-emerald/40 text-prism-emerald shadow-prism-emerald">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-mono flex items-center gap-2">
                Connect Wallet <span className="text-xs text-prism-emerald font-normal font-sans">(Multi-Wallet)</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">Select your browser wallet for Midnight ZK proof signing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-cyber-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet Options List */}
        <div className="space-y-3 font-mono text-xs">
          {walletOptions.map((option) => {
            const isSelected = currentWalletName?.toLowerCase().includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => {
                  onSelectWallet(option.id);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 relative group flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyber-800 border-prism-emerald shadow-prism-emerald text-white'
                    : 'bg-cyber-950/90 border-slate-800/90 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border ${option.color}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{option.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${option.color}`}>
                        {option.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-tight max-w-xs font-sans">
                      {option.description}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="p-1 rounded-full bg-prism-emerald text-cyber-950 shadow-prism-emerald">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <span className="text-[11px] text-prism-emerald font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Connect &rarr;
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 rounded-2xl bg-cyber-900/90 border border-slate-850 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-sans">
            <Cpu className="w-3.5 h-3.5 text-prism-emerald" />
            <span>Private keys stay 100% in your local browser context.</span>
          </span>
          <span className="text-prism-emerald font-bold">Midnight Testnet</span>
        </div>

      </div>
    </div>
  );
};
