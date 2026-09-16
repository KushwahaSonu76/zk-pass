import React from 'react';
import { X, Wallet, Check, Shield, Cpu, Sparkles, ExternalLink, KeyRound } from 'lucide-react';
import { WalletType } from '../hooks/useMidnightWallet';

export interface WalletOption {
  id: WalletType;
  name: string;
  badge: string;
  description: string;
  isInstalled: boolean;
  color: string;
  iconBg: string;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: WalletType) => void;
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

  const walletOptions: WalletOption[] = [
    {
      id: 'lace',
      name: 'Midnight Lace Wallet',
      badge: isLaceAvailable ? 'Extension Active' : 'Midnight Official',
      description: 'Official Midnight Network native browser extension wallet for on-chain ZK transactions',
      isInstalled: isLaceAvailable,
      color: 'border-black/20 hover:border-black bg-stone-50',
      iconBg: 'bg-black text-white',
    },
    {
      id: '1am',
      name: '1 AM Wallet',
      badge: 'Preprod Native',
      description: 'Dedicated Midnight Preprod developer wallet & 24-word seed vault',
      isInstalled: true,
      color: 'border-black/20 hover:border-black bg-stone-50',
      iconBg: 'bg-stone-900 text-emerald-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#F8F5F0] text-[#0A0A0A] p-7 rounded-[2rem] space-y-6 shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black font-space">
                Connect Wallet
              </h3>
              <p className="text-xs text-stone-500">Midnight Network Supported Wallets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet Options List (Only Lace & 1 AM Wallet) */}
        <div className="space-y-3 text-xs">
          {walletOptions.map((option) => {
            const isSelected = currentWalletName?.toLowerCase().includes(option.id) || 
              (option.id === '1am' && currentWalletName?.toLowerCase().includes('1 am'));

            return (
              <button
                key={option.id}
                onClick={() => {
                  onSelectWallet(option.id);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 relative group flex items-center justify-between shadow-sm ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-stone-200 hover:border-black text-stone-800'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/10 text-white' : option.iconBg}`}>
                    {option.id === '1am' ? <KeyRound className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm flex items-center gap-2">
                      <span className={isSelected ? 'text-white' : 'text-black'}>{option.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}>
                        {option.badge}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 leading-tight max-w-xs ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-400 text-black flex items-center justify-center font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <span className="text-[11px] text-stone-900 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Connect &rarr;
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-stone-800" />
            <span>Midnight Preprod Network Native</span>
          </span>
          <span className="text-black font-bold font-mono">0-Leakage</span>
        </div>

      </div>
    </div>
  );
};
export default WalletModal;
