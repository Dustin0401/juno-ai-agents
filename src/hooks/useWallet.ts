// Web3 Wallet Integration Hook
// Supports MetaMask and Phantom for Ethereum and Solana

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  }
}

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

  const connectWallet = useCallback(async (walletType: 'metamask' | 'phantom') => {
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

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          await loadWalletInfo(accounts[0], 'ethereum');
          toast({
            title: "Wallet connected",
            description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
          });
        }
      } else if (walletType === 'phantom') {
        if (!window.solana) {
          toast({
            title: "Phantom not found", 
            description: "Please install Phantom wallet to continue",
            variant: "destructive"
          });
          return;
        }

        const response = await window.solana.connect();
        const address = response.publicKey.toString();
        
        await loadWalletInfo(address, 'solana');
        toast({
          title: "Wallet connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
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
      // In production, this would fetch real wallet data and $JNO staking info
      // For now, simulate based on address
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
        balance: mockStake / 100, // Mock balance
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