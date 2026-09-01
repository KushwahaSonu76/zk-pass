import { describe, it, expect } from 'vitest';
import { ZkPassContractClient, computeCommitment, buildMerkleTree, sha256Hex } from '../contract/index';

describe('ZkPass Core - (c) Zero Identity & Information Leakage Tests', () => {
  const adminSecret = 'admin_secret_key_12345';
  const adminHash = sha256Hex(adminSecret);

  it('(c) Credential secret, leaf index, commitment hash, and wallet address NEVER appear in public ledger state or events', () => {
    const contract = new ZkPassContractClient(adminHash);

    const sensitiveUserSecret = 'super_secret_identity_passport_num_99999999999999999999999';
    const sensitiveUserSalt = 'user_private_salt_77777777777777777777777777777777777';
    const secretHex = sha256Hex(sensitiveUserSecret);
    const saltHex = sha256Hex(sensitiveUserSalt);

    const commitment = computeCommitment(secretHex, saltHex);
    const tree = buildMerkleTree([commitment, computeCommitment('other', saltHex)]);
    contract.registerCredentialRoot(tree.root, adminSecret);

    let emittedEventJson = '';
    contract.subscribe((event) => {
      emittedEventJson = JSON.stringify(event);
    });

    const witness = {
      secretCredential: secretHex,
      credentialSalt: saltHex,
      merklePath: tree.getPath(0),
      leafIndex: 0,
    };

    contract.verifyAndGrantAccess(witness);

    const ledgerJson = JSON.stringify(contract.getLedgerState());

    // 1. Ensure private secret credential hex never leaked into public state or event
    expect(ledgerJson.includes(secretHex)).toBe(false);
    expect(emittedEventJson.includes(secretHex)).toBe(false);

    // 2. Ensure raw sensitive user identity strings never leaked
    expect(ledgerJson.includes(sensitiveUserSecret)).toBe(false);
    expect(emittedEventJson.includes(sensitiveUserSecret)).toBe(false);

    // 3. Ensure raw commitment leaves never leaked in event
    expect(emittedEventJson.includes(commitment)).toBe(false);

    // 4. Ensure leafIndex position (index 0) is not disclosed in event
    expect(emittedEventJson).not.toContain('"leafIndex"');

    // 5. Ensure wallet address is absent from public event
    expect(emittedEventJson).not.toContain('"userAddress"');
    expect(emittedEventJson).not.toContain('"proverAddress"');
  });
});
