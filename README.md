<div align="center">
  <br>
  <h1>dFundr 💸</h1>
  <strong>Fully on-chain, fast, and secure.</strong>
</div>

## What is dFundr?
dFundr is a decentralized crowdfunding dApp built on the Fuel Network using Sway smart contracts. It enables users to create campaigns with funding goals and deadlines, accept donations in ETH, and manage funds securely and transparently.

### 🔑 Main Features:
- Campaign creation with title, goal, and deadline.
- Donations based on ETH.
- Fund withdrawal if the goal is reached within the deadline.
- Possibility of refund if the goal is not reached by the deadline.

## Technologies Used
- ⚙️ **Sway** – Smart contract language on [Fuel Network](https://fuel.network/)
- 🔗 **Fuel Network** – Modular blockchain for fast, scalable dApps
- 💻 **React** – Front-end user interface
- 🔒 **TypeScript** – Type-safe JavaScript
- 📦 **pnpm** – Package manager

## Project Structure
### 🧠 Back-end (On-chain)
Built with Sway on the Fuel Network, this part implements the crowdfunding logic via smart contracts. It manages campaign creation, donations, withdrawals, and refunds in a decentralized way.
```sh
crowdfunding-dapp
├── sway-programs
│   └── crowdfunding-contract
│       └── src/main.sw
└── README.md
```
### 🎯 Front-end
A React and TypeScript web interface enabling users to create campaigns, donate, track goals, and request refunds.
```sh
crowdfunding-dapp
├── src/main.tsx
└── README.md
```

## Getting Started
These instructions will help you set up and run the project locally. To deploy to the testnet, see the [Deploying to Testnet](https://docs.fuel.network/docs/fuels-ts/creating-a-fuel-dapp/deploying-a-dapp-to-testnet/) guide.

### 🔧 Prerequisites
- Node.js (version 22 or later)
- pnpm
- Fuel toolchain and Sway compiler (see Fuel Docs for setup)

### ⚙️ Installation
1. Clone the repository:
```bash
git clone https://github.com/ArthurCorbellini/crowdfunding-dapp.git
cd crowdfunding-dapp
```
2. Install dependencies:
```bash
pnpm install
```
3. Start the Fuel dev server:
```bash
pnpm fuels:dev
```
4. Start the front-end development server.
```bash
pnpm dev
```

## Rules
### ✅ Create Campaign Rules:
- Title, goal, and deadline are required fields;
- The goal must be greater than zero;
- The deadline must be a future date;
- You must have sufficient funds in your wallet.
### 💸 Donation Rules:
- The campaign must be open;
- The donation amount must be greater than zero;
- You must have sufficient funds in your wallet.
### 🏦 Withdraw Donations Rules:
- The campaign must be open;
- Only the campaign creator can withdraw the funds;
- The campaign deadline must have passed;
- The campaign must have reached its funding goal.
### 🔁 Refund Donations Rules:
- The campaign must be open;
- Only donors can request a refund;
- The campaign deadline must have passed;
- The campaign must **not** have reached its funding goal.

## 📄 Specification

For detailed information about the smart contract interface and behavior, see the [SPEC.md](./SPEC.md) file.
