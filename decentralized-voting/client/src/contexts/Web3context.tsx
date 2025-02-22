/** @format */
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import VotingAbi from '../contracts/voting.json';

// Define the context type
export interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
}

// Create the Web3 context
export const Web3Context = createContext<Web3ContextType | undefined>(
  undefined
);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Function to connect wallet and initialize the contract
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // Use ethers.BrowserProvider from ethers v6 (if using ethers v5, use ethers.providers.Web3Provider)
        const _provider = new ethers.BrowserProvider((window as any).ethereum);
        await _provider.send('eth_requestAccounts', []);
        const signer = await _provider.getSigner();
        const address = await signer.getAddress();
        setProvider(_provider);
        setWalletAddress(address);

        const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
        if (!CONTRACT_ADDRESS) {
          throw new Error(
            'Contract address not defined in environment variables.'
          );
        }
        const _contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          VotingAbi.abi,
          signer
        );
        setContract(_contract);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  // Listen for account changes and update state accordingly
  useEffect(() => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          if (provider) {
            const signer = await provider.getSigner();
            const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
            const _contract = new ethers.Contract(
              CONTRACT_ADDRESS,
              VotingAbi.abi,
              signer
            );
            setContract(_contract);
          }
        } else {
          setWalletAddress(null);
          setContract(null);
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);

      // Cleanup the event listener on unmount
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [provider]);

  return (
    <Web3Context.Provider
      value={{ provider, contract, walletAddress, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
