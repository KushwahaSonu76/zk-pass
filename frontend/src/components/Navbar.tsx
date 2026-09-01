import React from 'react';
import { ShieldCheck, Cpu, ExternalLink } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { WalletState } from '../types';

interface NavbarProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ wallet, onConnect, onDisconnect }) => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative p-2.5 rounded-xl bg-obsidian-900 border border-neon-cyan/40 shadow-glow-cyan">
            <ShieldCheck className="w-7 h-7 text-neon-cyan animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-neon-emerald rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-wider font-mono text-white">
                Zk<span className="neon-text-cyan">Pass</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-neon-violet/20 border border-neon-violet/40 text-neon-violet">
                CORE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3 h-3 text-neon-cyan" /> Midnight ZK Access Layer
            </p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-obsidian-900/90 border border-slate-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />
            <span className="text-slate-300">Midnight Testnet</span>
          </div>

          <WalletConnect wallet={wallet} onConnect={onConnect} onDisconnect={onDisconnect} />
        </div>

      </div>
    </header>
  );
};
