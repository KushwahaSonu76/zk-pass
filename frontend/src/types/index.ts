export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  walletName: string | null;
  publicAddress: string | null; // Note: Wallet address is NEVER passed into Compact ZK proof witness!
  network: string;
  error: string | null;
}

export interface CredentialInput {
  secretCredential: string;
  credentialSalt: string;
  leafIndex: number;
}

export interface VerificationHistoryItem {
  id: string;
  timestamp: number;
  status: 'SUCCESS' | 'FAILED';
  proofHash: string;
  publicLedgerRoot: string;
  identityExposed: false; // Always false by privacy model
  userAddressExposed: false; // Always false by privacy model
}
