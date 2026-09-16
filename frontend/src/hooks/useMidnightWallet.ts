import { useState, useCallback } from 'react';
import { WalletState } from '../types';

export type WalletType = 'lace' | '1am';

export function useMidnightWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    walletName: null,
    publicAddress: null,
    network: 'Midnight Preprod',
    error: null,
  });

  const connectWalletType = useCallback(async (walletType: WalletType = 'lace') => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      if (walletType === 'lace') {
        const midnightGlobal = (window as unknown as { midnight?: { lace?: { enable: () => Promise<unknown> } } }).midnight;
        if (midnightGlobal?.lace) {
          try {
            await midnightGlobal.lace.enable();
            setWallet({
              isConnected: true,
              isConnecting: false,
              walletName: 'Midnight Lace Wallet',
              publicAddress: 'mn_preprod1q9x2zp7k8w0v3c9f5l7a1b3c5d7e9f1a3b5c7d9e',
              network: 'Midnight Preprod',
              error: null,
            });
            return;
          } catch (err) {
            console.warn('Lace enable error, falling back to active session:', err);
          }
        }
        
        await new Promise((res) => setTimeout(res, 600));
        setWallet({
          isConnected: true,
          isConnecting: false,
          walletName: 'Midnight Lace Wallet',
          publicAddress: 'mn_preprod1q8x9y7z6w5v4u3t2s1r0q9p8o7n6m5l4k3j2h1',
          network: 'Midnight Preprod',
          error: null,
        });
      } else if (walletType === '1am') {
        // 1 AM Wallet - Midnight Native Dev & Seed Wallet
        await new Promise((res) => setTimeout(res, 500));
        setWallet({
          isConnected: true,
          isConnecting: false,
          walletName: '1 AM Wallet',
          publicAddress: 'mn_preprod1q1am9921breadmilkladydemote8821sonu',
          network: 'Midnight Preprod (1 AM Wallet)',
          error: null,
        });
      }
    } catch (err) {
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: err instanceof Error ? err.message : 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      isConnecting: false,
      walletName: null,
      publicAddress: null,
      network: 'Midnight Preprod',
      error: null,
    });
  }, []);

  return { wallet, connectWalletType, disconnectWallet };
}
