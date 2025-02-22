<!-- @format -->

# Decentralized Voting DApp

A decentralized voting application built on the hardhat local testnet using Solidity, Hardhat, and a modern React stack. The frontend is built with Vite, React (TypeScript), Tailwind CSS, Framer Motion, and react-toastify, and it uses ethers v5 to interact with the deployed smart contract.

---

## Features

- **Smart Contract:**  
  A Solidity Voting contract allowing users to vote for candidates. It includes functions for voting, checking vote counts, and validating candidates.
- **Frontend:**
  - **Wallet Integration:** Connects to MetaMask via ethers v5.
  - **Real-Time Data:** Polls the contract for candidate data every 10 seconds.
  - **User Notifications:** Uses react-toastify for toast notifications.
  - **Animations:** Smooth page and component animations with Framer Motion.
  - **Responsive UI:** Styled with Tailwind CSS.
- **Deployment:**  
  Deploy the Voting contract to the local hardhat testnet using Hardhat, and update the frontend with the deployed contract address via environment variables.

---

## Directory Structure

```
decentralized-voting/
├── contracts/                   # Hardhat project for Solidity contracts
│   ├── contracts/
│   │   └── Voting.sol           # Solidity Voting contract
│   ├── scripts/
│   │   └── deploy.js            # Deployment script for Polygon Mumbai
│   ├── hardhat.config.js        # Hardhat configuration file
│   └── package.json             # Contract project dependencies and scripts
└── frontend/                    # React frontend project
    ├── public/
    │   └── index.html           # HTML entry point
    ├── src/
    │   ├── assets/
    │   │   └── logo.svg         # Application logo
    │   ├── components/          # Reusable UI components
    │   │   ├── Header.tsx       # Header with navigation and wallet connect
    │   │   ├── CandidateCard.tsx# Candidate display and vote button
    │   │   └── CandidateList.tsx# List of candidates fetched from the contract
    │   ├── contracts/
    │   │   └── voting.json      # ABI file for the Voting contract
    │   ├── contexts/
    │   │   └── Web3Context.tsx   # Web3 context and provider (wallet integration)
    │   ├── hooks/
    │   │   └── useWeb3.ts       # Custom hook for accessing Web3 context
    │   ├── pages/               # Application pages
    │   │   ├── Home.tsx         # Main voting page
    │   │   ├── Results.tsx      # Voting results page
    │   │   └── About.tsx        # About page for project information
    │   ├── services/
    │   │   └── CandidateService.ts # Utility functions for Candidate interactions
    │   │   └── ContractService.ts # Utility functions for contract interactions
    │   ├── App.tsx              # Main application layout and router
    │   ├── main.tsx             # React entry point
    │   └── index.css            # Global styles (Tailwind CSS directives)
    ├── .env                     # Environment variables
    ├── package.json             # Frontend project dependencies and scripts
    ├── tsconfig.json            # TypeScript configuration for the frontend
    └── vite.config.ts           # Vite configuration file
```

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm or yarn**
- **MetaMask** (or another Ethereum-compatible wallet)
- **Basic knowledge of React, TypeScript, Solidity, and blockchain concepts**

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/fearalert/blockchain-assessments.git
cd decentralized-voting
```

### 2. Setting Up the Smart Contract

1. **Navigate to the contracts directory:**

   ```bash
   cd contracts
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Hardhat for Polygon Mumbai:**  
   Edit `hardhat.config.js` with your RPC URL and private key. For example:

   ```js
   require('@nomiclabs/hardhat-ethers');

   module.exports = {
     solidity: '0.8.0',
     networks: {
       mumbai: {
         url: 'https://rpc-mumbai.maticvigil.com/',
         accounts: ['YOUR_PRIVATE_KEY'], // Use environment variables in production
       },
     },
   };
   ```

4. **Compile the Contract:**

   ```bash
   npx hardhat compile
   ```

5. **Deploy the Contract:**

   ```bash
   npx hardhat run scripts/deploy.js --network hardhat
   ```

   Copy the deployed contract address from the output.

---

### 3. Setting Up the Frontend

1. **Navigate to the frontend directory:**

   ```bash
   cd ../frontend
   ```

2. **Create a `.env` File:**  
   In the root of the frontend folder, create a `.env` file with the following content:

   ```env
   VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
   ```

   Replace `0xYourDeployedContractAddressHere` with the address you obtained from the deployment.

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Run the Frontend Development Server:**

   ```bash
   npm run dev
   ```

   Open your browser and navigate to the URL shown (typically `http://localhost:5173`).

---

## Usage

- **Home Page:**  
  Vote for candidates by clicking the "Vote" button on each candidate card.
- **Results Page:**  
  View real-time voting results (updated every 10 seconds).
- **About Page:**  
  Learn more about the project.

Make sure MetaMask is connected and switched to the Polygon Mumbai network or same network where your smart contract is deployed.

---

## Troubleshooting

- **Contract Address Undefined:**  
  Ensure your `.env` file is correctly placed and formatted, and that you restart the development server after changes.
- **Network Mismatch:**  
  Confirm that your MetaMask wallet is connected to the same network where your contract is deployed.
- **ABI or Function Errors:**  
  Verify that your `voting.json` ABI file matches your deployed contract's interface.

---

## Acknowledgments

- [Ethers.js](https://docs.ethers.org/) for blockchain interactions.
- [Hardhat](https://hardhat.org/) for smart contract development and deployment.
- [Vite](https://vitejs.dev/) and [React](https://reactjs.org/) for the modern frontend stack.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Framer Motion](https://www.framer.com/motion/) for animations.
- [React Toastify](https://fkhadra.github.io/react-toastify/) for notifications.

---
