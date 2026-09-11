import crypto from 'crypto';

function sha256Hex(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function computeCommitment(secret, salt) {
  const sStr = typeof secret === 'string' ? secret : Buffer.from(secret).toString('hex');
  const saltStr = typeof salt === 'string' ? salt : Buffer.from(salt).toString('hex');
  return sha256Hex(sStr + saltStr);
}

export function calculateMerkleRoot(leaf, path, index) {
  let currentHash = typeof leaf === 'string' ? leaf : Buffer.from(leaf).toString('hex');
  let idx = typeof index === 'bigint' ? Number(index) : index;

  for (let i = 0; i < path.length; i++) {
    const sibling = typeof path[i] === 'string' ? path[i] : Buffer.from(path[i]).toString('hex');
    if (idx % 2 === 1) {
      currentHash = sha256Hex(sibling + currentHash);
    } else {
      currentHash = sha256Hex(currentHash + sibling);
    }
    idx = Math.floor(idx / 2);
  }
  return currentHash;
}

export const pureCircuits = {
  computeCommitment,
  calculateMerkleRoot
};
