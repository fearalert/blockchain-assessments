<!-- @format -->

# Decentralized Voting Contracts

## Compile and Deploy Locally

### Compile

To compile the smart contracts, run the following command:

```bash
npx hardhat compile
```

### Deploy to a Local Hardhat Network

1. Start the local network in one terminal window:

```bash
    npx hardhat node
```

2. In another terminal, run the deploy script:

```bash
    npx hardhat run scripts/deploy.js --network localhost
```
