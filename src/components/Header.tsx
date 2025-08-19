import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Menu, X } from 'lucide-react';

interface HeaderProps {
  connectedWallet: string | null;
  onWalletConnect: (wallet: string | null) => void;
}

export const Header = ({ connectedWallet, onWalletConnect }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWalletConnect = () => {
    if (connectedWallet) {
      onWalletConnect(null);
    } else {
      // Simulate wallet connection
      onWalletConnect('0x742d...3a9f');
    }
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
            {connectedWallet && (
              <Badge variant="outline" className="border-lime/30 text-lime">
                Free Tier • 10 RC/day
              </Badge>
            )}
            
            <Button
              onClick={handleWalletConnect}
              variant={connectedWallet ? "outline" : "default"}
              className={connectedWallet ? "btn-outline-lime" : "btn-lime"}
              size="sm"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {connectedWallet ? connectedWallet : 'Connect Wallet'}
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
    </header>
  );
};