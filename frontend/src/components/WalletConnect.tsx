import React, { useState } from 'react';
import { Wallet, LogOut, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { WalletState } from '../types';
import { WalletModal } from './WalletModal';
import { WalletType } from '../hooks/useMidnightWallet';

interface WalletConnectProps {
  wallet: WalletState;
  onConnectWalletType: (walletType: WalletType) => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnectWalletType,
  onDisconnect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (wallet.isConnecting) {
    return (
      <button disabled className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-cyber-850 border border-slate-700 text-slate-400 font-mono text-xs cursor-wait">
        <Loader2 className="w-4 h-4 animate-spin text-prism-emerald" />
        <span>Connecting Wallet...</span>
      </button>
    );
  }

  if (wallet.isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-cyber-900 border border-prism-emerald/40 text-xs font-mono text-slate-200 shadow-prism-emerald hover:border-prism-emerald transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 text-prism-emerald" />
          <span className="font-semibold">{wallet.walletName}</span>
          <span className="text-slate-600">|</span>
          <span className="text-prism-emerald font-bold">
            {wallet.publicAddress ? `${wallet.publicAddress.substring(0, 8)}...${wallet.publicAddress.substring(wallet.publicAddress.length - 4)}` : 'Connected'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>
        <button
          onClick={onDisconnect}
          title="Disconnect Wallet"
          className="p-2.5 rounded-2xl bg-cyber-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>

        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectWallet={onConnectWalletType}
          currentWalletName={wallet.walletName}
        />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-prism-purple/30 via-cyber-900 to-prism-emerald/20 border border-prism-emerald/50 hover:border-prism-emerald font-mono text-xs text-white font-bold shadow-prism-emerald transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Wallet className="w-4 h-4 text-prism-emerald group-hover:rotate-12 transition-transform duration-300" />
        <span>Connect Wallet</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectWallet={onConnectWalletType}
        currentWalletName={wallet.walletName}
      />
    </>
  );
};
