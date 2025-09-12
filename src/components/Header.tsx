import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { NotificationCenter } from '@/components/NotificationCenter';
import { WalletModal } from '@/components/WalletModal';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, Menu, X, Home } from 'lucide-react';

interface HeaderProps {
  connectedWallet: string | null;
  onWalletConnect: (wallet: string | null) => void;
}

export const Header = ({ connectedWallet, onWalletConnect }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { walletInfo, formatAddress, isConnecting } = useWallet();

  const handleWalletConnect = () => {
    // This function is now handled by the WalletModal
    setIsWalletModalOpen(true);
  };

  const navigation = [
    { name: 'Agents', href: '#agents' },
    { name: 'Features', href: '#features' },
    { name: 'Tokenomics', href: '#tokenomics' },
    { name: 'Community', href: '#community' }
  ];

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-lime-foreground text-lg">J</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">JUNO</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-lime transition-colors text-sm font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            <NotificationCenter />
            
            <Link to="/app">
              <Button variant="ghost" size="sm" className="hover:bg-lime/10">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            
            {walletInfo && (
              <Badge variant="outline" className="border-lime/30 text-lime hidden md:flex">
                {walletInfo.tier} Tier • {walletInfo.researchCredits} RC
              </Badge>
            )}
            
            <Button
              onClick={() => setIsWalletModalOpen(true)}
              variant={walletInfo ? "outline" : "default"}
              className={walletInfo ? "btn-outline-lime" : "btn-lime"}
              size="sm"
              disabled={isConnecting}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnecting ? 'Connecting...' : walletInfo ? formatAddress(walletInfo.address) : 'Connect Wallet'}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-lime transition-colors text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        open={isWalletModalOpen}
        onOpenChange={setIsWalletModalOpen}
      />
    </header>
  );
};