import {
  CredentialWitness,
  CompactProofContext,
  verifyCredentialProofCircuit,
  AccessProofResult,
  sha256Hex
} from './circuit';

export interface LedgerState {
  credentialRoot: string;
  accessGrantedCount: number;
  adminPublicKeyHash: string;
  revocationRoot: string;
  lastAccessEvent?: {
    accessGranted: boolean;
    timestamp: number;
    proofHash: string;
  };
}

export interface AccessGrantedEvent {
  event: 'accessGranted';
  accessGranted: boolean;
  timestamp: number;
  proofHash: string;
  // NOTE: Prover identity, wallet address, and credential index are strictly omitted
}

type EventListener = (event: AccessGrantedEvent) => void;

/**
 * ZkPass Contract Instance & Midnight Ledger State Manager
 * Implements private state + witness handling for Midnight ZK proof execution
 */
export class ZkPassContractClient {
  private ledger: LedgerState;
  private listeners: EventListener[] = [];

  constructor(initialAdminKeyHash?: string, initialRoot?: string) {
    this.ledger = {
      credentialRoot: initialRoot || '0'.repeat(64),
      accessGrantedCount: 0,
      adminPublicKeyHash: initialAdminKeyHash || sha256Hex('admin_secret_key_12345'),
      revocationRoot: 'f'.repeat(64), // Default empty revocation
    };
  }

  /**
   * Subscribe to public accessGranted events on the ledger
   */
  public subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Read public ledger state
   */
  public getLedgerState(): LedgerState {
    return { ...this.ledger };
  }

  /**
   * Admin Function: Register a new credential commitment Merkle root
   */
  public registerCredentialRoot(newRoot: string, adminSecretWitness: string): boolean {
    const adminCheck = sha256Hex(adminSecretWitness);
    if (adminCheck !== this.ledger.adminPublicKeyHash) {
      throw new Error('ZkPass Contract Error: Unauthorized admin registry update');
    }
    this.ledger.credentialRoot = newRoot;
    return true;
  }

  /**
   * Public Transition: Verify ZK credential proof & update ledger
   */
  public verifyAndGrantAccess(
    witness: CredentialWitness,
    contextNonce: string = Date.now().toString()
  ): AccessProofResult {
    const context: CompactProofContext = {
      accessContextHash: sha256Hex(contextNonce),
      publicLedgerRoot: this.ledger.credentialRoot,
      revocationRoot: this.ledger.revocationRoot,
    };

    const result = verifyCredentialProofCircuit(witness, context);

    if (result.isValid) {
      this.ledger.accessGrantedCount += 1;
      const event: AccessGrantedEvent = {
        event: 'accessGranted',
        accessGranted: true,
        timestamp: Date.now(),
        proofHash: result.proofHash,
      };
      this.ledger.lastAccessEvent = event;

      // Broadcast event to subscribed listeners (e.g. Indexer / Frontend)
      this.listeners.forEach((l) => l(event));
    }

    return result;
  }
}

export * from './circuit';
