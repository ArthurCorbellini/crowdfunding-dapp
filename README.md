<div align="center">
  <h1>dFundr 💸</h1>
  <strong>Fully on-chain, fast, and secure.</strong>
</div>

## What is dFundr?
dFundr is a decentralized crowdfunding application (dApp) built on the Fuel Network using Sway smart contracts. It enables users to create campaigns with funding goals and deadlines, accept donations in ETH, and manage funds securely and transparently.

### 🔑 Main Features:
- Campaign creation with title, goal, and deadline.
- Donations based on ETH.
- Campaign creators can withdraw the funds if the goal is reached before the deadline.
- Donors can request a refund if the goal is not met by the deadline.

## dApp Overview

This decentralized application (dApp) consists of three main screens:
> Below each item are screenshots of each screen for reference:
1. **Wallet Connection**  
   Users must connect their wallet to interact with the contract and perform transactions such as creating campaigns, donating, or requesting refunds.

![alt text](public/connection.png)

2. **Home Page**  
   A simple introduction explaining how the DApp works, its purpose, and what users can expect from the platform.

![alt text](public/home.png)

3. **Campaigns Page**  
   Displays a list of all crowdfunding campaigns.  
   Users can:
   - Create new campaigns;
   - Donate to active campaigns;
   - Withdraw funds (if they are the creator and the goal is met);
   - Request a refund (if the campaign failed).

![alt text](public/campaign.png)

## Technologies Used
- **Sway** – Smart contract language on [Fuel Network](https://fuel.network/)
- **Fuel Network** – Modular blockchain for fast, scalable dApps
- **React** – Front-end user interface
- **TypeScript** – Type-safe JavaScript
- **pnpm** – Package manager

## Project Structure
### Back-end (On-chain)
Built with Sway on the Fuel Network, this part implements the crowdfunding logic via smart contracts. It manages campaign creation, donations, withdrawals, and refunds in a decentralized way.
```sh
crowdfunding-dapp
├── sway-programs
│   └── crowdfunding-contract
│       └── src/main.sw
└── README.md
```
### Front-end
A React and TypeScript web interface enabling users to create campaigns, donate, track goals, and request refunds.
```sh
crowdfunding-dapp
├── src/main.tsx
└── README.md
```

## Getting Started
These instructions will help you set up and run the project locally. To deploy to the testnet, see the [Deploying to Testnet](https://docs.fuel.network/docs/fuels-ts/creating-a-fuel-dapp/deploying-a-dapp-to-testnet/) guide.

### Prerequisites
- Node.js (version 22 or later)
- pnpm
- Fuel toolchain and Sway compiler (see Fuel Docs for setup)

### Installation
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
### Create Campaign Rules:
- Title, goal, and deadline are required fields;
- The goal must be greater than zero;
- The deadline must be a future date;
- You must have sufficient funds in your wallet.
### Donation Rules:
- The campaign must be open;
- The donation amount must be greater than zero;
- You must have sufficient funds in your wallet.
### Withdraw Donations Rules:
- The campaign must be open;
- Only the campaign creator can withdraw the funds;
- The campaign deadline must have passed;
- The campaign must have reached its funding goal.
### Refund Donations Rules:
- The campaign must be open;
- Only donors can request a refund;
- The campaign deadline must have passed;
- The campaign must **not** have reached its funding goal.

## Specification
For detailed information about the smart contract interface and behavior, see the [SPEC.md](./SPEC.md) file.

## Future Improvements
Here are some features and enhancements to improve the overall project quality and user experience:

- **Multilanguage Support**  
  Integrate a translation system to support multiple languages across the UI with [react-i18next](https://react.i18next.com/).

- **UI Component Library**  
  Implement a modern UI library such as [shadcn/ui](https://ui.shadcn.com/) or [Ant Design](https://ant.design/) for faster and more consistent front-end development.

- **Light & Dark Theme Toggle**  
  Add theme support so users can switch between light and dark modes.

- **Robust Form Validation**  
  Use [Zod](https://zod.dev/) to create more reliable and maintainable form validation schemas.

- **Smart Contract Portability**  
  Adapt the smart contract to support new tokens.

- **Funding Tiers**  
  Introduce contribution tiers (e.g. *Silver*, *Gold*, *Platinum*) with optional perks, badges, or unique descriptions for each level.  

- **Donor Rewards**  
  Based on the donation amount, users could receive NFTs, digital badges, or other types of rewards as recognition or utility.