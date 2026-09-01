import { useState, useEffect, useCallback, useMemo } from 'react';
import { ZkPassContractClient, LedgerState, sha256Hex, buildMerkleTree, computeCommitment } from '../../../contract';
import { VerificationHistoryItem } from '../types';

const ADMIN_SECRET = 'admin_secret_key_12345';
const DEFAULT_SALT = 'a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890';

// Initial pre-registered mock credential commitments
const DEFAULT_USER_SECRET = '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
const INITIAL_COMMITMENTS = [
  computeCommitment(DEFAULT_USER_SECRET, DEFAULT_SALT),
  computeCommitment('secret_accredited_investor_9999', DEFAULT_SALT),
  computeCommitment('secret_vip_club_member_8888', DEFAULT_SALT),
];

export function useZkPassContract() {
  const contractClient = useMemo(() => {
    const adminHash = sha256Hex(ADMIN_SECRET);
    const client = new ZkPassContractClient(adminHash);
    
    // Seed contract with initial Merkle Root of 3 pre-registered credentials
    const tree = buildMerkleTree(INITIAL_COMMITMENTS);
    client.registerCredentialRoot(tree.root, ADMIN_SECRET);
    return client;
  }, []);

  const [ledgerState, setLedgerState] = useState<LedgerState>(contractClient.getLedgerState());
  const [registeredCommitments, setRegisteredCommitments] = useState<string[]>(INITIAL_COMMITMENTS);
  const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state on change
  useEffect(() => {
    const unsubscribe = contractClient.subscribe((event) => {
      setLedgerState(contractClient.getLedgerState());
      setHistory((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: event.timestamp,
          status: event.accessGranted ? 'SUCCESS' : 'FAILED',
          proofHash: event.proofHash,
          publicLedgerRoot: contractClient.getLedgerState().credentialRoot,
          identityExposed: false,
          userAddressExposed: false,
        },
        ...prev,
      ]);
    });

    return () => unsubscribe();
  }, [contractClient]);

  /**
   * Admin Function: Add a user credential secret to private registry
   */
  const addCredentialToRegistry = useCallback(
    async (userSecret: string, userSalt: string = DEFAULT_SALT) => {
      const commitment = computeCommitment(userSecret, userSalt);
      const updatedList = [...registeredCommitments, commitment];
      const tree = buildMerkleTree(updatedList);
      
      contractClient.registerCredentialRoot(tree.root, ADMIN_SECRET);
      setRegisteredCommitments(updatedList);
      setLedgerState(contractClient.getLedgerState());
      return { root: tree.root, commitmentIndex: updatedList.length - 1 };
    },
    [contractClient, registeredCommitments]
  );

  /**
   * Prover Function: Generate ZK witness & submit proof to Compact contract
   */
  const proveAndSubmitCredential = useCallback(
    async (secretInput: string, saltInput: string = DEFAULT_SALT) => {
      setIsSubmitting(true);
      
      // Simulate Compact ZK witness compilation time
      await new Promise((res) => setTimeout(res, 1200));

      const tree = buildMerkleTree(registeredCommitments);
      const userCommitment = computeCommitment(secretInput, saltInput);
      
      // Find index in tree or fallback to 0
      let foundIndex = registeredCommitments.indexOf(userCommitment);
      if (foundIndex === -1) {
        foundIndex = 0; // Will result in root mismatch and circuit failure if commitment not registered
      }

      const path = tree.getPath(foundIndex);
      const witness = {
        secretCredential: secretInput,
        credentialSalt: saltInput,
        merklePath: path,
        leafIndex: foundIndex,
      };

      const result = contractClient.verifyAndGrantAccess(witness);
      setIsSubmitting(false);
      return result;
    },
    [contractClient, registeredCommitments]
  );

  return {
    ledgerState,
    registeredCommitments,
    history,
    isSubmitting,
    addCredentialToRegistry,
    proveAndSubmitCredential,
    defaultUserSecret: DEFAULT_USER_SECRET,
    defaultSalt: DEFAULT_SALT,
  };
}
