import React from 'react';
import { ShieldCheck, Cpu, Radio } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { WalletState } from '../types';
import { WalletType } from '../hooks/useMidnightWallet';

interface NavbarProps {
  wallet: WalletState;
  onConnectWalletType: (walletType: WalletType) => void;
  onDisconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ wallet, onConnectWalletType, onDisconnect }) => {
  return (
    <header className="sticky top-0 z-50 cyber-card border-b border-prism-emerald/20 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative p-2.5 rounded-2xl bg-cyber-900 border border-prism-emerald/50 shadow-prism-emerald">
            <ShieldCheck className="w-7 h-7 text-prism-emerald animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-prism-emerald rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-wider font-mono text-white">
                Zk<span className="text-glow-emerald font-black">Pass</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-black rounded-full bg-prism-purple/20 border border-prism-purple/50 text-prism-purple shadow-prism-purple">
                CORE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-prism-emerald" /> Private Credential Vault • Midnight Blockchain
            </p>
          </div>
        </div>

        {/* Network & Multi-Wallet Controls */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-cyber-900/90 border border-slate-800 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-prism-emerald animate-pulse" />
            <span className="text-slate-300 font-semibold">Midnight Testnet</span>
          </div>

          <WalletConnect
            wallet={wallet}
            onConnectWalletType={onConnectWalletType}
            onDisconnect={onDisconnect}
          />
        </div>

      </div>
    </header>
  );
};
