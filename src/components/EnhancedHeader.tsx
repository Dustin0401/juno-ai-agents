import React, { useState } from 'react';
import { Moon, Sun, Keyboard, Settings, Activity, History, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useTheme } from '../hooks/useTheme';
import { useJunoShortcuts } from '../hooks/useKeyboardShortcuts';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { useWallet } from '../hooks/useWallet';
import { Header } from './Header';

export const EnhancedHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { healthScore } = usePerformanceMonitor();
  const { walletInfo, connectWallet } = useWallet();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const shortcuts = useJunoShortcuts({
    toggleTheme,
    openCommandPalette: () => {
      // This will be handled by the command palette component
    },
    focusSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="search" i]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    newChat: () => {
      // This will be handled by the research page
    },
    exportData: () => {
      // Trigger export functionality
    }
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'bg-terminal-green';
    if (score >= 60) return 'bg-terminal-amber';
    return 'bg-terminal-red';
  };

  return (
    <div className="relative">
      <Header connectedWallet={walletInfo?.address} onWalletConnect={connectWallet} />
      
      {/* Enhanced Controls Overlay */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Performance Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-surface/80 backdrop-blur-sm rounded-xl border border-border">
          <div className={`w-2 h-2 rounded-full ${getHealthColor(healthScore)} animate-pulse`} />
          <span className="text-xs text-muted-foreground">
            {healthScore}/100
          </span>
          <Activity className="w-3 h-3 text-muted-foreground" />
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="bg-surface/80 backdrop-blur-sm border border-border hover:bg-surface"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        {/* Keyboard Shortcuts */}
        <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="bg-surface/80 backdrop-blur-sm border border-border hover:bg-surface"
            >
              <Keyboard className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-lime" />
                Keyboard Shortcuts
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-xl">
                  <span className="text-sm">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.ctrlKey && <Badge variant="outline" className="text-xs">Ctrl</Badge>}
                    {shortcut.shiftKey && <Badge variant="outline" className="text-xs">Shift</Badge>}
                    {shortcut.altKey && <Badge variant="outline" className="text-xs">Alt</Badge>}
                    {shortcut.metaKey && <Badge variant="outline" className="text-xs">Cmd</Badge>}
                    <Badge variant="outline" className="text-xs font-mono">
                      {shortcut.key.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};