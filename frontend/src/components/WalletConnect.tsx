import React from 'react';
import { Wallet, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { WalletState } from '../types';

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ wallet, onConnect, onDisconnect }) => {
  if (wallet.isConnecting) {
    return (
      <button disabled className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-obsidian-800 border border-slate-700 text-slate-400 font-mono text-sm cursor-wait">
        <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
        <span>Connecting Lace...</span>
      </button>
    );
  }

  if (wallet.isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-obsidian-900 border border-neon-cyan/30 text-xs font-mono text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
          <span>{wallet.walletName}</span>
          <span className="text-slate-500">|</span>
          <span className="text-neon-cyan font-semibold">
            {wallet.publicAddress ? `${wallet.publicAddress.substring(0, 8)}...${wallet.publicAddress.substring(wallet.publicAddress.length - 4)}` : 'Connected'}
          </span>
        </div>
        <button
          onClick={onDisconnect}
          title="Disconnect Wallet"
          className="p-2 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="group relative flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-violet/30 via-obsidian-900 to-neon-cyan/20 border border-neon-cyan/40 hover:border-neon-cyan font-mono text-sm text-white font-medium shadow-glow-cyan transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <Wallet className="w-4 h-4 text-neon-cyan group-hover:rotate-12 transition-transform duration-300" />
      <span>Connect Midnight Lace</span>
    </button>
  );
};
