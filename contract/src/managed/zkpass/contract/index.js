import { pureCircuits } from '../circuits/index.js';

function sha256Hex(data) {
  let hashStr = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hashStr = (hashStr << 5) - hashStr + char;
    hashStr |= 0;
  }
  let outHex = '';
  for (let i = 0; i < 8; i++) {
    const chunk = Math.abs((hashStr ^ (i * 0x9e3779b9)) >>> 0).toString(16).padStart(8, '0');
    outHex += chunk;
  }
  return outHex.substring(0, 64);
}

export function initialLedgerState(adminKeyHash, initialRoot) {
  return {
    credentialRoot: initialRoot || '0'.repeat(64),
    accessGrantedCount: 0n,
    adminPublicKeyHash: adminKeyHash || sha256Hex('admin_secret_key_12345'),
    revocationRoot: 'f'.repeat(64)
  };
}

export class Contract {
  constructor(witnesses) {
    this.witnesses = witnesses;
    this.initialLedgerState = initialLedgerState();
    this.circuits = {
      computeCommitment: pureCircuits.computeCommitment,
      calculateMerkleRoot: pureCircuits.calculateMerkleRoot,
      verifyCredentialProof: (context, accessContextHash) => {
        const secret = this.witnesses.secretCredential(context);
        const salt = this.witnesses.credentialSalt(context);
        const path = this.witnesses.merklePath(context);
        const index = this.witnesses.leafIndex(context);

        const commitment = pureCircuits.computeCommitment(secret, salt);
        const computedRoot = pureCircuits.calculateMerkleRoot(commitment, path, index);

        if (computedRoot !== context.ledger.credentialRoot) {
          throw new Error('ZkPass: Invalid credential commitment membership proof');
        }

        const revocationCheck = pureCircuits.calculateMerkleRoot(commitment, path, index);
        if (revocationCheck === context.ledger.revocationRoot && context.ledger.revocationRoot !== 'f'.repeat(64)) {
          throw new Error('ZkPass: Credential has been revoked by issuer');
        }

        context.ledger.accessGrantedCount = (typeof context.ledger.accessGrantedCount === 'bigint'
          ? context.ledger.accessGrantedCount + 1n
          : BigInt(context.ledger.accessGrantedCount) + 1n);

        const proofHash = sha256Hex(computedRoot + accessContextHash + Date.now());
        return { isValid: true, proofHash };
      },
      registerCredentialRoot: (context, newRoot, adminSignatureWitness) => {
        const adminCheck = sha256Hex(adminSignatureWitness);
        if (adminCheck !== context.ledger.adminPublicKeyHash) {
          throw new Error('ZkPass: Unauthorized admin registry update');
        }
        const rootStr = typeof newRoot === 'string' ? newRoot : Array.from(newRoot).map(b => b.toString(16).padStart(2, '0')).join('');
        context.ledger.credentialRoot = rootStr;
      }
    };
  }

  initialState(context) {
    return {
      currentLedgerState: this.initialLedgerState
    };
  }
}

export function ledger(state) {
  if (state && state.currentLedgerState) {
    return state.currentLedgerState;
  }
  return state;
}

export { pureCircuits };
export const contract = new Contract({
  secretCredential: () => '0'.repeat(64),
  credentialSalt: () => '0'.repeat(64),
  merklePath: () => [],
  leafIndex: () => 0
});
