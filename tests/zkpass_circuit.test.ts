import { describe, it, expect } from 'vitest';
import {
  computeCommitment,
  buildMerkleTree,
  verifyCredentialProofCircuit,
  CredentialWitness,
  CompactProofContext
} from '../contract/circuit';

describe('ZkPass Core - Compact ZK Circuit Unit Tests', () => {
  const secret = '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
  const salt = 'a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890';
  const commitment = computeCommitment(secret, salt);

  const mockCommitments = [
    commitment,
    computeCommitment('secret2', salt),
    computeCommitment('secret3', salt),
    computeCommitment('secret4', salt),
  ];

  const tree = buildMerkleTree(mockCommitments);

  it('(a) Valid credential proof succeeds verification in Compact circuit', () => {
    const merklePath = tree.getPath(0);
    const witness: CredentialWitness = {
      secretCredential: secret,
      credentialSalt: salt,
      merklePath,
      leafIndex: 0,
    };

    const context: CompactProofContext = {
      accessContextHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      publicLedgerRoot: tree.root,
      revocationRoot: '0'.repeat(64),
    };

    const result = verifyCredentialProofCircuit(witness, context);

    expect(result.isValid).toBe(true);
    expect(result.computedRoot.toLowerCase()).toBe(tree.root.toLowerCase());
    expect(result.publicStateUpdate.accessGranted).toBe(true);
    expect(result.proofHash).toBeDefined();
    expect(result.proofHash.startsWith('zkp_')).toBe(true);
  });

  it('(b) Invalid or malformed credential proof fails verification in Compact circuit', () => {
    const merklePath = tree.getPath(0);
    const invalidWitness: CredentialWitness = {
      secretCredential: 'bad_secret_0000000000000000000000000000000000000000000000000000000',
      credentialSalt: salt,
      merklePath,
      leafIndex: 0,
    };

    const context: CompactProofContext = {
      accessContextHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      publicLedgerRoot: tree.root,
      revocationRoot: '0'.repeat(64),
    };

    const result = verifyCredentialProofCircuit(invalidWitness, context);

    expect(result.isValid).toBe(false);
    expect(result.publicStateUpdate.accessGranted).toBe(false);
  });
});
