# ZkPass Core 🛡️

[![ZkPass Core CI](https://github.com/zkpass-core/zkpass-core/actions/workflows/ci.yml/badge.svg)](https://github.com/zkpass-core/zkpass-core/actions/workflows/ci.yml)
![Midnight Compact](https://img.shields.io/badge/Midnight-Compact_v0.6-00F0FF?style=flat&logo=midnight)
![License](https://img.shields.io/badge/License-MIT-00FF9D?style=flat)
![Tests Passed](https://img.shields.io/badge/Tests-6%2F6_Passing-brightgreen?style=flat)

> **Private Credential & Selective Access Verification Layer built on the Midnight Blockchain.**

ZkPass Core enables users to prove they possess a verified KYC credential, accredited investor status, or exclusive membership tier **without revealing their identity, secret credential, wallet address, or position in the registry**.

---

## 📌 Project Overview & Problem Statement

Public smart contracts suffer from a critical privacy vulnerability: verifying identity or membership requires submitting an on-chain transaction that publicly links the user's wallet address (`msg.sender`) to their real-world credential status. 

**ZkPass Core** leverages Midnight's **Compact zero-knowledge programming language** and private ledger state to decouple access verification from user identity:
- **Issuers** register hashed credential commitments in Midnight private state.
- **Users** evaluate zero-knowledge witness circuits off-chain in their browser to prove membership.
- **The Public Ledger** records only `accessGranted = true` — preserving 100% identity privacy and zero address exposure.

---

## 🏗️ Technical Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|  [ Private Credential Secret ] + [ Private Salt ]                                 |
|                         │                                                         |
|                         ▼                                                         |
|         Compact Witness Circuit Generator (Off-Chain)                             |
|         - Evaluates sha256(secret || salt)                                        |
|         - Calculates Merkle inclusion proof path                                  |
|                         │                                                         |
|                         ▼ (Generates Zero-Knowledge Proof)                        |
+-------------------------│---------------------------------------------------------+
                          │  (Zero Identity Data Transmitted)
                          ▼
+-----------------------------------------------------------------------------------+
|                            MIDNIGHT BLOCKCHAIN LEDGER                             |
|                                                                                   |
|  ┌─────────────────────────────────┐       ┌───────────────────────────────────┐  |
|  │      Midnight Private State     │       │        Public Ledger State        │  |
|  ├─────────────────────────────────┤       ├───────────────────────────────────┤  |
|  │ • Credential Merkle Root        │       │ • accessGranted = true            │  |
|  │ • Issuer Admin Public Key Hash  │       │ • totalAccessCount += 1           │  |
|  │ • Revocation Root Hash          │       │ • ZK Proof Integrity Hash         │  |
|  └─────────────────────────────────┘       └───────────────────────────────────┘  |
+-----------------------------------------------------------------------------------+
                          │ (Event Listener)
                          ▼
+-----------------------------------------------------------------------------------+
|                        REST / WEBSOCKET EVENT INDEXER                             |
|   GET /api/verification-status/:proofHash -> { accessGranted: true, identity: 0 }|
+-----------------------------------------------------------------------------------+
```

---

## 🔒 Privacy Model (Explicit Audit)

Midnight's dual-state design guarantees strict selective disclosure.

### An observer of the public ledger CAN see:
1. `accessGranted = true` (Public verification boolean).
2. `accessGrantedCount` (Total aggregate verified access attempts on contract).
3. `credentialRoot` (Public Merkle root hash of registered commitments).
4. `proofHash` (Cryptographic proof hash validating circuit constraint satisfaction).

### An observer of the public ledger CANNOT see:
1. ❌ **The user's identity**, passport number, or raw credential secret.
2. ❌ **The user's wallet address** or public key.
3. ❌ **Which leaf index** in the credential registry belongs to the user.
4. ❌ **Linkability** between multiple verifications submitted by the same user.
5. ❌ **The underlying credential database** or uncommitted raw identities.

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Node.js**: v18.x or v20.x
- **npm**: v9.x or v10.x

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/zkpass-core/zkpass-core.git
cd zkpass-core
npm install --legacy-peer-deps
```

### 2. Run Local Development Server
```bash
npm run dev:frontend
```
Open your browser at `http://localhost:3000`.

### 3. Run Event Indexer Service (Optional)
```bash
npm run dev:indexer
```
Indexer API will run at `http://localhost:4000/api/events`.

---

## 🧪 Testing Instructions

Run the full automated Vitest test suite covering Compact circuit witness generation, contract state logic, and zero-identity-leakage verification:

```bash
npm test
```

### Verified Test Output Summary (6/6 Passing)

```text
 RUN  v1.6.1 ZkPass Core Workspace

 ✓ tests/zkpass_circuit.test.ts  (2 tests)
   ✓ (a) Valid credential proof succeeds verification in Compact circuit
   ✓ (b) Invalid or malformed credential proof fails verification in Compact circuit
 ✓ tests/zkpass_contract.test.ts  (3 tests)
   ✓ Admin can register new credential commitment root
   ✓ Unauthorized admin key fails credential root registration
   ✓ Contract emits public accessGranted event upon valid ZK proof verification
 ✓ tests/privacy_leakage.test.ts  (1 test)
   ✓ (c) Credential secret, leaf index, commitment hash, and wallet address NEVER appear in public ledger state or events

 Test Files  3 passed (3)
      Tests  6 passed (6)
   Duration  17.45s
```

---

## ⚙️ CI/CD Pipeline

Continuous Integration is enforced via GitHub Actions (`.github/workflows/ci.yml`). On every `push` and `pull_request`, the workflow automatically:
1. Installs workspace dependencies.
2. Performs full TypeScript type checking (`npx tsc --noEmit`).
3. Executes the entire 6-test Vitest suite (`npm test`).
4. Builds the frontend production bundle (`npm run build:frontend`).

---

## 🌐 Live Demo & Deployment

- **Live Frontend dApp**: [https://zkpass-core.vercel.app](https://zkpass-core.vercel.app) *(Deploy link)*
- **Midnight Network**: Midnight Testnet (DevNet)
- **Contract Code**: `contract/zkpass.compact`

---

## 🎬 1-Minute Demo Video Script & Outline

- **0:00 - 0:10 | Introduction & Problem**:
  *"Welcome to ZkPass Core — the private credential verification layer built on Midnight. Public blockchains force users to expose their wallet addresses when proving KYC or eligibility. ZkPass Core eliminates this."*

- **0:10 - 0:25 | Wallet Connection & Issuer Panel**:
  *"First, we connect our Midnight Lace wallet. In the Issuer Panel, an authorized admin registers hashed credential commitments into Midnight's private state root on-chain."*

- **0:25 - 0:45 | ZK Proof Generation & Submission**:
  *"As a user, I input my secret credential. The Compact circuit evaluates my witness locally in the browser, generating a zero-knowledge membership proof. I click 'Submit ZK Proof'."*

- **0:45 - 1:00 | On-Chain Verification & Zero Identity Leakage**:
  *"The Midnight contract verifies the proof. The Verifier Portal displays `accessGranted = true`. Notice the public ledger log: zero identity data and zero wallet address details are exposed. Access is proven with total privacy!"*

---

## 📄 Product Proposal

See [PROPOSAL.md](file:///c:/Users/hp/Desktop/Moon/Ritesh/ZkPass%20Core-level3/PROPOSAL.md) for the full 3-paragraph product rationale, solution overview, and Midnight privacy model comparison.

---

## 📜 License

MIT License © 2026 ZkPass Core Team. Built for the Midnight Blockchain Hackathon.
