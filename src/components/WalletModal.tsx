import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, ExternalLink, Copy, LogOut, Coins, TrendingUp } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalletModal = ({ open, onOpenChange }: WalletModalProps) => {
  const { walletInfo, isConnecting, connectWallet, disconnectWallet, formatAddress, getTierInfo } = useWallet();
  const [isConnecting2, setIsConnecting2] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = async (walletType: 'metamask' | 'phantom' | 'walletconnect') => {
    setIsConnecting2(walletType);
    await connectWallet(walletType);
    setIsConnecting2(null);
    if (walletInfo) {
      onOpenChange(false);
    }
  };

  const copyAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const openExplorer = () => {
    if (!walletInfo) return;
    
    const explorerUrl = walletInfo.network === 'ethereum' 
      ? `https://etherscan.io/address/${walletInfo.address}`
      : `https://explorer.solana.com/address/${walletInfo.address}`;
    
    window.open(explorerUrl, '_blank');
  };

  if (!walletInfo) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your wallet to access premium AI research features and track your $JNO staking tier.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => handleConnect('metamask')}
                disabled={isConnecting || isConnecting2 === 'metamask'}
                className="w-full justify-start gap-3 h-12"
                variant="outline"
              >
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                {isConnecting2 === 'metamask' ? 'Connecting...' : 'MetaMask'}
                <Badge variant="secondary" className="ml-auto">Ethereum</Badge>
              </Button>
              
              <Button
                onClick={() => handleConnect('phantom')}
                disabled={isConnecting || isConnecting2 === 'phantom'}
                className="w-full justify-start gap-3 h-12"
                variant="outline"
              >
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                {isConnecting2 === 'phantom' ? 'Connecting...' : 'Phantom'}
                <Badge variant="secondary" className="ml-auto">Solana</Badge>
              </Button>
              
              <Button
                onClick={() => handleConnect('walletconnect')}
                disabled={isConnecting || isConnecting2 === 'walletconnect'}
                className="w-full justify-start gap-3 h-12"
                variant="outline"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                {isConnecting2 === 'walletconnect' ? 'Connecting...' : 'WalletConnect'}
                <Badge variant="secondary" className="ml-auto">Multi-chain</Badge>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const tierInfo = getTierInfo(walletInfo.tier);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Wallet Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    walletInfo.network === 'ethereum' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}>
                    <span className="text-white text-sm font-bold">
                      {walletInfo.network === 'ethereum' ? 'ETH' : 'SOL'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{formatAddress(walletInfo.address)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{walletInfo.network}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={openExplorer}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="font-medium">
                    {walletInfo.balance.toFixed(4)} {walletInfo.network === 'ethereum' ? 'ETH' : 'SOL'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="font-medium capitalize">{walletInfo.network}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staking Tier */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Staking Tier</h3>
                <Badge variant={walletInfo.tier === 'Free' ? 'secondary' : 'default'}>
                  {walletInfo.tier}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Staked $JNO</span>
                  <span className="font-medium">{walletInfo.stakedAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Research Credits</span>
                  <span className="font-medium text-primary">{walletInfo.researchCredits} RC</span>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium mb-2">Tier Benefits:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {tierInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {walletInfo.tier !== 'Fund' && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      Next tier: {tierInfo.nextTier}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={disconnectWallet}
            variant="outline" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};