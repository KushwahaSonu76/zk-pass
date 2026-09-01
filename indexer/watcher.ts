import { AccessGrantedEvent } from '../contract';

export interface IndexedAccessRecord {
  id: string;
  timestamp: number;
  accessGranted: boolean;
  proofHash: string;
  blockHeight: number;
  privacyGuarantee: string;
}

export class MidnightEventWatcher {
  private events: IndexedAccessRecord[] = [];
  private currentBlockHeight = 1042500;

  constructor() {
    // Seed watcher with mock initial block events for demonstration
    this.events.push({
      id: 'evt_1042500_01',
      timestamp: Date.now() - 3600000,
      accessGranted: true,
      proofHash: 'zkp_a1b2c3d4e5f67890a1b2c3d4e5f67890',
      blockHeight: 1042498,
      privacyGuarantee: 'ZERO_IDENTITY_LEAKAGE',
    });
  }

  public recordEvent(event: AccessGrantedEvent) {
    this.currentBlockHeight += 1;
    const record: IndexedAccessRecord = {
      id: `evt_${this.currentBlockHeight}_${Math.floor(Math.random() * 100)}`,
      timestamp: event.timestamp,
      accessGranted: event.accessGranted,
      proofHash: event.proofHash,
      blockHeight: this.currentBlockHeight,
      privacyGuarantee: 'ZERO_IDENTITY_LEAKAGE',
    };
    this.events.unshift(record);
    return record;
  }

  public getEvents(limit = 20): IndexedAccessRecord[] {
    return this.events.slice(0, limit);
  }

  public getStatusByProofHash(proofHash: string): IndexedAccessRecord | undefined {
    return this.events.find((e) => e.proofHash.toLowerCase() === proofHash.toLowerCase());
  }

  public getStats() {
    return {
      totalVerifications: this.events.length,
      currentBlockHeight: this.currentBlockHeight,
      network: 'Midnight Testnet',
      privacyStatus: 'AIRTIGHT',
    };
  }
}
