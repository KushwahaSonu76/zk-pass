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

export function computeCommitment(secret, salt) {
  const sStr = typeof secret === 'string' ? secret : Array.from(secret).map(b => b.toString(16).padStart(2, '0')).join('');
  const saltStr = typeof salt === 'string' ? salt : Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  return sha256Hex(sStr + saltStr);
}

export function calculateMerkleRoot(leaf, path, index) {
  let currentHash = typeof leaf === 'string' ? leaf : Array.from(leaf).map(b => b.toString(16).padStart(2, '0')).join('');
  let idx = typeof index === 'bigint' ? Number(index) : index;

  for (let i = 0; i < path.length; i++) {
    const sibling = typeof path[i] === 'string' ? path[i] : Array.from(path[i]).map(b => b.toString(16).padStart(2, '0')).join('');
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
