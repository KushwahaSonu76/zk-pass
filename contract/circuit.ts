import { createHash } from 'crypto';

/**
 * ZkPass Core Circuit & Crypto Witness Simulator
 * Implements the off-chain ZK witness generator & commitment calculations
 * compatible with Midnight's Compact circuit specifications.
 */

export interface CredentialWitness {
  secretCredential: string; // Private user secret (32-byte hex)
  credentialSalt: string;   // Private salt (32-byte hex)
  merklePath: string[];     // Array of 8 sibling hash strings
  leafIndex: number;        // Leaf index in Merkle tree
}

export interface CompactProofContext {
  accessContextHash: string; // Context hash (e.g. timestamp + nonce)
  publicLedgerRoot: string;  // Current root in contract ledger
  revocationRoot: string;    // Current revocation root
}

export interface AccessProofResult {
  isValid: boolean;
  computedRoot: string;
  commitment: string;
  publicStateUpdate: {
    accessGranted: boolean;
    identityExposed: boolean;
    userAddressExposed: boolean;
  };
  proofHash: string;
}

/**
 * Utility: Sha256 helper for 32-byte hex strings
 */
export function sha256Hex(data: string): string {
  return createHash('sha256').update(Buffer.from(data, 'hex')).digest('hex');
}

/**
 * Compute private credential commitment: sha256(secret || salt)
 */
export function computeCommitment(secretHex: string, saltHex: string): string {
  const combined = secretHex + saltHex;
  return createHash('sha256').update(Buffer.from(combined, 'hex')).digest('hex');
}

/**
 * Compute Merkle root from leaf commitment, path, and leaf index
 */
export function calculateMerkleRoot(leafHex: string, path: string[], leafIndex: number): string {
  let current = leafHex;
  let idx = leafIndex;

  for (let i = 0; i < 8; i++) {
    const sibling = path[i] || '0'.repeat(64);
    if (idx % 2 === 1) {
      current = sha256Hex(sibling + current);
    } else {
      current = sha256Hex(current + sibling);
    }
    idx = Math.floor(idx / 2);
  }

  return current;
}

/**
 * Build a simple Merkle Tree of commitments for Admin registration
 */
export function buildMerkleTree(commitments: string[]): { root: string; getPath: (index: number) => string[] } {
  const TREE_DEPTH = 8;
  const totalLeaves = Math.pow(2, TREE_DEPTH);
  
  // Pad leaves to 256
  const leaves: string[] = new Array(totalLeaves).fill('0'.repeat(64));
  for (let i = 0; i < commitments.length && i < totalLeaves; i++) {
    leaves[i] = commitments[i];
  }

  // Build tree levels
  const levels: string[][] = [leaves];
  for (let d = 0; d < TREE_DEPTH; d++) {
    const currentLevel = levels[d];
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1];
      nextLevel.push(sha256Hex(left + right));
    }
    levels.push(nextLevel);
  }

  const root = levels[TREE_DEPTH][0];

  const getPath = (index: number): string[] => {
    const path: string[] = [];
    let idx = index;
    for (let d = 0; d < TREE_DEPTH; d++) {
      const level = levels[d];
      const isRight = idx % 2 === 1;
      const siblingIndex = isRight ? idx - 1 : idx + 1;
      path.push(level[siblingIndex] || '0'.repeat(64));
      idx = Math.floor(idx / 2);
    }
    return path;
  };

  return { root, getPath };
}

/**
 * Compact Circuit Witness Verifier (Simulates Midnight ZK Proof Execution)
 */
export function verifyCredentialProofCircuit(
  witness: CredentialWitness,
  context: CompactProofContext
): AccessProofResult {
  // 1. Compute private commitment
  const commitment = computeCommitment(witness.secretCredential, witness.credentialSalt);

  // 2. Compute Merkle root from path witness
  const computedRoot = calculateMerkleRoot(commitment, witness.merklePath, witness.leafIndex);

  // 3. Verify ZK constraint: calculated root must match public ledger root
  const rootMatches = computedRoot.toLowerCase() === context.publicLedgerRoot.toLowerCase();
  const isRevoked = computedRoot.toLowerCase() === context.revocationRoot.toLowerCase();

  const isValid = rootMatches && !isRevoked;

  // Generate synthetic Zero-Knowledge Proof hash
  const proofHash = sha256Hex(commitment + context.accessContextHash + (isValid ? '1' : '0'));

  return {
    isValid,
    computedRoot,
    commitment,
    proofHash: `zkp_${proofHash.substring(0, 32)}`,
    publicStateUpdate: {
      accessGranted: isValid,
      identityExposed: false,       // Core privacy guarantee
      userAddressExposed: false,    // Core privacy guarantee
    },
  };
}
