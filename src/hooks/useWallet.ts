// Enhanced Web3 Wallet Integration Hook
// Supports MetaMask, WalletConnect, and Phantom for Ethereum and Solana

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export interface WalletInfo {
  address: string;
  balance: number;
  network: 'ethereum' | 'solana';
  tier: 'Free' | 'Analyst' | 'Pro' | 'Fund';
  stakedAmount: number;
  researchCredits: number;
}

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
    BinanceChain?: any;
  }
}

const ETHEREUM_CHAIN_ID = '0x1'; // Mainnet
const SOLANA_NETWORK = clusterApiUrl('mainnet-beta');

export const useWallet = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check for existing wallet connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        await loadWalletInfo(address, 'ethereum');
      } else if (window.solana && window.solana.isConnected) {
        const address = window.solana.publicKey?.toString();
        if (address) {
          await loadWalletInfo(address, 'solana');
        }
      }
    } catch (error) {
      console.error('Failed to check existing connection:', error);
    }
  };

  const connectWallet = useCallback(async (walletType: 'metamask' | 'phantom' | 'walletconnect') => {
    setIsConnecting(true);
    
    try {
      if (walletType === 'metamask') {
        if (!window.ethereum) {
          toast({
            title: "MetaMask not found",
            description: "Please install MetaMask to continue",
            variant: "destructive"
          });
          return;
        }

        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        // Switch to Ethereum mainnet if needed
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ETHEREUM_CHAIN_ID }],
          });
        } catch (switchError: any) {
          console.log('Chain switch error:', switchError);
        }
        
        if (accounts.length > 0) {
          await loadWalletInfo(accounts[0], 'ethereum');
          
          // Set up account change listener
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              disconnectWallet();
            } else {
              loadWalletInfo(accounts[0], 'ethereum');
            }
          });

          toast({
            title: "Wallet connected",
            description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
          });
        }
      } else if (walletType === 'phantom') {
        if (!window.solana || !window.solana.isPhantom) {
          toast({
            title: "Phantom not found", 
            description: "Please install Phantom wallet to continue",
            variant: "destructive"
          });
          return;
        }

        const response = await window.solana.connect({ onlyIfTrusted: false });
        const address = response.publicKey.toString();
        
        await loadWalletInfo(address, 'solana');

        // Set up disconnect listener
        window.solana.on('disconnect', () => {
          disconnectWallet();
        });

        toast({
          title: "Wallet connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
        });
      } else if (walletType === 'walletconnect') {
        // WalletConnect implementation would need additional setup
        toast({
          title: "WalletConnect",
          description: "WalletConnect integration coming soon",
          variant: "default"
        });
      }
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const loadWalletInfo = async (address: string, network: 'ethereum' | 'solana') => {
    try {
      let balance = 0;
      
      // Get real balance for connected wallet
      if (network === 'ethereum' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balanceWei = await provider.getBalance(address);
          balance = parseFloat(ethers.formatEther(balanceWei));
        } catch (error) {
          console.error('Failed to fetch ETH balance:', error);
        }
      } else if (network === 'solana' && window.solana) {
        try {
          const connection = new Connection(SOLANA_NETWORK);
          const publicKey = new PublicKey(address);
          const balanceLamports = await connection.getBalance(publicKey);
          balance = balanceLamports / 1e9; // Convert lamports to SOL
        } catch (error) {
          console.error('Failed to fetch SOL balance:', error);
        }
      }

      // For now, simulate $JNO staking data based on wallet address
      // In production, this would query the actual staking contract
      const mockStake = parseInt(address.slice(-4), 16); // Use last 4 chars as pseudo-random
      const stakedAmount = mockStake % 150000; // 0-150k range
      
      const tier = stakedAmount >= 100000 ? 'Fund' :
                  stakedAmount >= 10000 ? 'Pro' :
                  stakedAmount >= 1000 ? 'Analyst' : 'Free';

      const baseCredits = tier === 'Free' ? 10 :
                         tier === 'Analyst' ? 100 :
                         tier === 'Pro' ? 500 : 1000;
      
      const researchCredits = Math.floor(baseCredits * (0.7 + Math.random() * 0.3));

      setWalletInfo({
        address,
        balance,
        network,
        tier,
        stakedAmount,
        researchCredits
      });
    } catch (error) {
      console.error('Failed to load wallet info:', error);
    }
  };

  const disconnectWallet = useCallback(() => {
    setWalletInfo(null);
    toast({
      title: "Wallet disconnected",
      description: "Successfully disconnected from wallet"
    });
  }, [toast]);

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const getTierInfo = useCallback((tier: string) => {
    switch (tier) {
      case 'Free':
        return {
          credits: '10 RC/day',
          features: ['Basic alerts', 'Single-chart analysis'],
          nextTier: 'Analyst (1,000 $JNO)'
        };
      case 'Analyst':
        return {
          credits: '100 RC/day', 
          features: ['Early agent access', 'Multi-chart Vision', 'Backtests ≤3y'],
          nextTier: 'Pro (10,000 $JNO)'
        };
      case 'Pro':
        return {
          credits: '500 RC/day',
          features: ['Priority routing', 'API access', 'Advanced hedging'],
          nextTier: 'Fund (100,000 $JNO)'
        };
      case 'Fund':
        return {
          credits: 'Unlimited',
          features: ['Dedicated workers', 'Private trials', 'SLA'],
          nextTier: 'Maximum tier'
        };
      default:
        return { credits: '0', features: [], nextTier: '' };
    }
  }, []);

  return {
    walletInfo,
    isConnecting,
    connectWallet,
    disconnectWallet,
    formatAddress,
    getTierInfo,
    isConnected: !!walletInfo
  };
};