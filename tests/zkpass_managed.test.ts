import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  Contract,
  initialLedgerState,
  pureCircuits,
  ledger,
  Witnesses,
} from '../contract/src/managed/zkpass/index';
import { CompactContract } from '../contract/index';

describe('ZkPass Core - Managed Compact Contract & Circuit Artifacts', () => {
  it('Managed circuit metadata (zkpass.circ) exists and contains valid contract schema', () => {
    const circPath = path.resolve(__dirname, '../contract/src/managed/zkpass/zkpass.circ');
    expect(fs.existsSync(circPath)).toBe(true);

    const circData = JSON.parse(fs.readFileSync(circPath, 'utf-8'));
    expect(circData.contract).toBe('ZkPassContract');
    expect(circData.ledger).toBeDefined();
    expect(circData.witnesses).toContain('secretCredential');
    expect(circData.witnesses).toContain('credentialSalt');
    expect(circData.circuits).toContain('verifyCredentialProof');
  });

  it('Initializes Compact Contract with default ledger state', () => {
    const defaultState = initialLedgerState();
    expect(defaultState.accessGrantedCount).toBe(0n);
    expect(defaultState.credentialRoot).toBe('0'.repeat(64));
    expect(defaultState.revocationRoot).toBe('f'.repeat(64));

    const contractInstance = new Contract({
      secretCredential: () => '0'.repeat(64),
      credentialSalt: () => '0'.repeat(64),
      merklePath: () => [],
      leafIndex: () => 0,
    });

    expect(contractInstance).toBeDefined();
    expect(contractInstance.circuits).toBeDefined();
    expect(typeof contractInstance.circuits.computeCommitment).toBe('function');
  });

  it('Pure circuits compute valid cryptographic commitments and Merkle roots', () => {
    const secret = '1111111111111111111111111111111111111111111111111111111111111111';
    const salt = '2222222222222222222222222222222222222222222222222222222222222222';

    const commitment = pureCircuits.computeCommitment(secret, salt);
    expect(commitment).toHaveLength(64);

    const pathArray = ['0'.repeat(64)];
    const root = pureCircuits.calculateMerkleRoot(commitment, pathArray, 0);
    expect(root).toHaveLength(64);
  });

  it('CompactContract exported from contract package executes state transitions', () => {
    const secret = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const salt = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    const commitment = pureCircuits.computeCommitment(secret, salt);

    const witnesses: Witnesses = {
      secretCredential: () => secret,
      credentialSalt: () => salt,
      merklePath: () => [],
      leafIndex: () => 0,
    };

    const contractInstance = new CompactContract(witnesses);
    const state = {
      credentialRoot: commitment,
      accessGrantedCount: 0n,
      adminPublicKeyHash: 'admin_hash',
      revocationRoot: 'f'.repeat(64),
    };

    const result = contractInstance.circuits.verifyCredentialProof(
      { ledger: state, witnesses },
      'sample_context_hash'
    );

    expect(result.isValid).toBe(true);
    expect(state.accessGrantedCount).toBe(1n);
  });
});
