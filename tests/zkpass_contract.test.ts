import { describe, it, expect } from 'vitest';
import { ZkPassContractClient, computeCommitment, buildMerkleTree, sha256Hex } from '../contract/index';

describe('ZkPass Core - Smart Contract & Ledger State Unit Tests', () => {
  const adminSecret = 'admin_secret_key_12345';
  const adminHash = sha256Hex(adminSecret);

  it('Admin can register new credential commitment root', () => {
    const contract = new ZkPassContractClient(adminHash);
    const mockRoot = 'a'.repeat(64);

    const success = contract.registerCredentialRoot(mockRoot, adminSecret);
    expect(success).toBe(true);
    expect(contract.getLedgerState().credentialRoot).toBe(mockRoot);
  });

  it('Unauthorized admin key fails credential root registration', () => {
    const contract = new ZkPassContractClient(adminHash);
    expect(() => {
      contract.registerCredentialRoot('b'.repeat(64), 'wrong_admin_secret');
    }).toThrow('ZkPass Contract Error: Unauthorized admin registry update');
  });

  it('Contract emits public accessGranted event upon valid ZK proof verification', () => {
    const contract = new ZkPassContractClient(adminHash);

    const secret = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const salt = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    const commitment = computeCommitment(secret, salt);

    const tree = buildMerkleTree([commitment]);
    contract.registerCredentialRoot(tree.root, adminSecret);

    let eventEmitted = false;
    contract.subscribe((event) => {
      if (event.event === 'accessGranted' && event.accessGranted) {
        eventEmitted = true;
      }
    });

    const witness = {
      secretCredential: secret,
      credentialSalt: salt,
      merklePath: tree.getPath(0),
      leafIndex: 0,
    };

    const result = contract.verifyAndGrantAccess(witness);
    expect(result.isValid).toBe(true);
    expect(contract.getLedgerState().accessGrantedCount).toBe(1);
    expect(eventEmitted).toBe(true);
  });
});
