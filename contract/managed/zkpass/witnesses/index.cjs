'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createWitnessContext = createWitnessContext;

function createWitnessContext(witnesses) {
  return {
    secretCredential: witnesses.secretCredential,
    credentialSalt: witnesses.credentialSalt,
    merklePath: witnesses.merklePath,
    leafIndex: witnesses.leafIndex,
    adminSignatureWitness: witnesses.adminSignatureWitness
  };
}
