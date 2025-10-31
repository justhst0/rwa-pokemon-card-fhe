# Encrypt RWA Pokemon Cards

A decentralized application (DApp) that enables **confidential ownership** of NFT Pokemon cards using **Fully Homomorphic Encryption (FHE)** technology powered by Zama fhEVM.

**Live Demo:** https://rwa-pokemon-card-fhe.vercel.app/

**Contract Address (Sepolia):** `0x9A7f421c6b3B1ee2BBd02E932532B6956FD36cd3`

---

## Table of Contents

- [Overview](#overview)
- [Dual Ownership Model](#dual-ownership-model)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [FHE Logic & Implementation](#fhe-logic--implementation)
- [Project Structure](#project-structure)
- [License](#license)

---

## Overview

This project demonstrates how to tokenize Real World Assets (RWA) with **privacy-preserving smart contracts**. Unlike traditional NFTs where ownership is publicly visible, this implementation uses FHE to encrypt the true owner's address on-chain while maintaining the ability to perform transfers and verifications.

### Key Features

- **Confidential Ownership**: True owner address is encrypted using FHE
- **Dual Ownership Model**: Separate public holder and encrypted beneficial owner
- **FHE-Powered Transfers**: Secure transfers with encrypted proof verification
- **ERC721 Compliant**: Works with existing NFT marketplaces and wallets
- **Modern Web3 Frontend**: React + RainbowKit + Zama SDK

---

## Dual Ownership Model

### The Core Concept

This contract maintains **two separate ownership records** for each NFT:

#### 1. **Public Owner** (ERC721 Owner)
- **What**: The wallet address that holds the NFT token
- **Source**: `ownerOf(tokenId)` - standard ERC721 function
- **Visibility**: Public, anyone can see it
- **Purpose**: Determines who can transfer the token on-chain

#### 2. **Encrypted Owner** (Beneficial Owner)
- **What**: The actual beneficial owner's address, encrypted with FHE
- **Source**: `_encryptedOwner[tokenId]` - encrypted address (`eaddress`)
- **Visibility**: Private, only decryptable by authorized parties
- **Purpose**: Represents the true owner in privacy-preserving scenarios

### Why Two Owners?

This dual model enables powerful use cases:

1. **Custodial Services**
   - Public Owner: Custody wallet holds the token
   - Encrypted Owner: Actual beneficiary's address (private)

2. **DAO Treasuries**
   - Public Owner: Treasury wallet manages the token
   - Encrypted Owner: Individual beneficiaries remain private

3. **Privacy-Preserving Marketplaces**
   - Public Owner: Market escrow wallet
   - Encrypted Owner: Buyer's address stays hidden

### Example Scenario

When User A mints a card with recipient User B:
- **Public Owner**: User A (0xAAA...) - Visible to everyone, holds the token
- **Encrypted Owner**: User B (0xBBB...) - Encrypted on-chain, only authorized parties can decrypt

---

## Technology Stack

### Blockchain & Smart Contracts
- **Solidity ^0.8.24**: Smart contract language
- **Zama fhEVM**: Fully Homomorphic Encryption Virtual Machine
- **OpenZeppelin Contracts**: Secure ERC721 base contracts
- **Ethereum Sepolia**: Testnet deployment

### Frontend
- **React 19.1.1**: UI framework
- **RainbowKit 2.2.8**: Wallet connection
- **Wagmi 2.17.0**: Ethereum hooks
- **Zama Relayer SDK 0.2.0**: Client-side FHE encryption

### Development
- **Hardhat 2.26.0**: Development environment
- **TypeScript**: Type safety
- **Vite**: Build tool

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 7+
- Ethereum wallet with Sepolia ETH

### Installation

```bash
# Clone repository
git clone <repository-url>
cd rwa-pokemon-card-fhe

# Install dependencies
npm install
cd home && npm install && cd ..
```

### Environment Setup

Create `.env` file in project root:

```env
MNEMONIC="your twelve word mnemonic phrase"
PRIVATE_KEY="0xYourPrivateKey"
INFURA_API_KEY="your_infura_key"
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"
ETHERSCAN_API_KEY="your_etherscan_key"
```

### Deployment

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy:sepolia
```

### Run Frontend

```bash
cd home
npm run dev
```

Open `http://localhost:5173` and connect your wallet.

---

## How to Use

### Minting a Card

1. Go to **Mint Card** tab
2. Enter **Token URI** (e.g., `https://ipfs.io/ipfs/Qm...`)
3. Enter **Recipient Address** (the address to encrypt as beneficial owner)
   - This will be encrypted on-chain
   - Can be your address or someone else's
4. Click **Mint Card**
5. Approve transaction in wallet

**What Happens:**
- Your wallet address becomes the **Public Owner** (token holder)
- Recipient address is encrypted and stored as **Encrypted Owner**
- Token is minted with a unique Token ID

### Viewing a Card

1. Go to **View Card** tab
2. Enter **Token ID**
3. View information:
   - **Public Owner**: Who holds the token (ERC721 owner)
   - **Encrypted Owner**: Shown as `*** (Encrypted on-chain)`
   - **Card Image**: Displayed from Token URI

**Note:** The encrypted owner can only be decrypted by addresses with ACL permissions.

### Transferring a Card

1. Go to **Transfer Card** tab
2. Enter **Token ID**
3. Enter **Recipient Address** (new owner)
4. Click **Transfer Card**

**What Happens:**
- Contract verifies you have permission to access encrypted owner
- **Public Owner** transfers to recipient (ERC721 transfer)
- **Encrypted Owner** is updated with new encrypted address
- ACL permissions are updated for new owner

**Security:** Transfer fails if:
- You don't have ACL permissions on the encrypted owner
- Token doesn't exist
- Invalid recipient address

---

## FHE Logic & Implementation

### How FHE is Used

This project uses FHE to encrypt owner addresses. Here's where and how:

#### 1. **Encryption (Frontend)**

**Location:** `home/src/components/PokemonApp.tsx`

**Mint Card:**
```typescript
// Encrypt recipient address
const buf = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
buf.addAddress(recipient);
const enc = await buf.encrypt();

// Send encrypted data to contract
await c.mintCard(tokenUri, enc.handles[0], enc.inputProof);
```

**Transfer Card:**
```typescript
// Encrypt current owner and new owner
const buf = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
buf.addAddress(address);  // Current owner
buf.addAddress(to);       // New owner
const enc = await buf.encrypt();

// Send to contract
await c.transfer(tokenId, to, enc.handles[0], enc.handles[1], enc.inputProof);
```

#### 2. **On-Chain Processing (Smart Contract)**

**Location:** `contracts/RWAPokemonCards.sol`

**Mint:**
```solidity
function mintCard(
    string memory tokenUri,
    externalEaddress encryptedTo,  // Encrypted recipient
    bytes calldata inputProof
) external {
    // Import encrypted address and verify proof
    eaddress toEnc = FHE.fromExternal(encryptedTo, inputProof);
    
    // Mint token to msg.sender (Public Owner)
    _safeMint(msg.sender, tokenId);
    
    // Store encrypted owner (Encrypted Owner)
    _encryptedOwner[tokenId] = toEnc;
    
    // Grant permissions
    FHE.allowThis(toEnc);           // Contract can use
    FHE.allow(toEnc, msg.sender);   // Minter can decrypt
}
```

**Transfer:**
```solidity
function transfer(
    uint256 tokenId,
    address to,
    externalEaddress encryptedCurrentOwner,
    externalEaddress encryptedTo,
    bytes calldata inputProof
) external {
    // Import encrypted addresses
    eaddress currOwnerEnc = FHE.fromExternal(encryptedCurrentOwner, inputProof);
    eaddress toEnc = FHE.fromExternal(encryptedTo, inputProof);
    
    // Verify caller has permission
    if (!FHE.isSenderAllowed(_encryptedOwner[tokenId])) 
        revert UnauthorizedTransfer();
    
    // Transfer public ownership
    transferFrom(ownerOf(tokenId), to, tokenId);
    
    // Update encrypted owner
    _encryptedOwner[tokenId] = toEnc;
    FHE.allow(toEnc, to);
}
```

### Key FHE Operations

| Function | Purpose | Where Used |
|----------|---------|------------|
| `createEncryptedInput()` | Create encryption buffer | Frontend (Mint/Transfer) |
| `addAddress()` | Add address to encrypt | Frontend |
| `encrypt()` | Generate ciphertext + proof | Frontend |
| `FHE.fromExternal()` | Import & verify encrypted data | Smart Contract |
| `FHE.isSenderAllowed()` | Check ACL permissions | Smart Contract |
| `FHE.allow()` | Grant decryption permission | Smart Contract |
| `FHE.allowThis()` | Grant contract access | Smart Contract |

### About Decryption

Decrypt is **not used** in the current implementation. The application only encrypts addresses but does not decrypt them for display. This is intentional to maintain privacy - encrypted data stays encrypted.

---

## Project Structure

```
rwa-pokemon-card-fhe/
├── contracts/
│   └── RWAPokemonCards.sol       # Main contract with FHE
├── deploy/
│   └── deploy.ts                  # Deployment script
├── home/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── PokemonApp.tsx    # Main UI (Mint/View/Transfer)
│   │   ├── hooks/
│   │   │   └── useZamaInstance.ts # Zama SDK initialization
│   │   └── config/
│   │       └── contracts.ts      # Contract address & ABI
│   └── public/
│       └── logo.png               # Logo file
├── hardhat.config.ts
└── README.md
```

---

## License

BSD-3-Clause-Clear License

**Built with Zama fhEVM**

---

## Quick Reference

- **Contract (Sepolia)**: `0x9A7f421c6b3B1ee2BBd02E932532B6956FD36cd3`
- **Zama fhEVM Docs**: https://docs.zama.ai/fhevm
