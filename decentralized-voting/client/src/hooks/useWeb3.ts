import { useState, useEffect } from "react";
import { ethers } from "ethers";
import VotingAbi from "../contracts/voting.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

interface Web3State {
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
}

const useWeb3 = (): Web3State => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const _provider = new ethers.BrowserProvider((window as any).ethereum);
        await _provider.send("eth_requestAccounts", []);
        const signer = await _provider.getSigner();
        const address = await signer.getAddress();
        setProvider(_provider);
        setWalletAddress(address);
        // Instantiate contract with signer for read/write access
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, VotingAbi.abi, signer);
        setContract(_contract);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install Metamask");
    }
  };

  // Listen for account changes (e.g., user disconnecting or switching accounts)
  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          if (provider) {
            const signer = await provider.getSigner();
            const _contract = new ethers.Contract(CONTRACT_ADDRESS, VotingAbi.abi, signer);
            setContract(_contract);
          }
        } else {
          setWalletAddress(null);
          setContract(null);
        }
      });
    }
  }, [provider]);

  return {
    provider,
    contract,
    walletAddress,
    connectWallet,
  };
};

export default useWeb3;
