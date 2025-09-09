// Command Palette Hook (Ctrl+K / Cmd+K)
// Provides quick access to all platform features

import { useState, useCallback, useEffect } from 'react';

export interface Command {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
  category: 'agents' | 'charts' | 'portfolio' | 'settings' | 'navigation';
  shortcut?: string;
}

export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getCommands = useCallback((): Command[] => [
    // Agent Commands
    {
      id: 'sentiment-analysis',
      label: 'Sentiment Analysis',
      description: 'Get social sentiment and market mood analysis',
      icon: '📊',
      category: 'agents',
      shortcut: '/sentiment',
      action: () => {
        // Trigger sentiment analysis
        setIsOpen(false);
      }
    },
    {
      id: 'technical-analysis',
      label: 'Technical Analysis',
      description: 'Chart patterns and technical indicators',
      icon: '📈',
      category: 'agents',
      shortcut: '/technical',
      action: () => {
        // Trigger technical analysis
        setIsOpen(false);
      }
    },
    {
      id: 'macro-analysis',
      label: 'Macro Analysis',
      description: 'Global economic and monetary policy impact',
      icon: '🌍',
      category: 'agents',
      shortcut: '/macro',
      action: () => {
        // Trigger macro analysis
        setIsOpen(false);
      }
    },
    {
      id: 'onchain-analysis',
      label: 'On-Chain Analysis',
      description: 'Blockchain metrics and whale movements',
      icon: '⛓️',
      category: 'agents',
      shortcut: '/onchain',
      action: () => {
        // Trigger on-chain analysis
        setIsOpen(false);
      }
    },
    {
      id: 'multi-agent',
      label: 'Multi-Agent Analysis',
      description: 'Full analysis from all agents',
      icon: '🤖',
      category: 'agents',
      shortcut: '/multi',
      action: () => {
        // Trigger multi-agent analysis
        setIsOpen(false);
      }
    },
    
    // Chart Commands
    {
      id: 'upload-chart',
      label: 'Upload Chart',
      description: 'Analyze your chart with AI vision',
      icon: '📤',
      category: 'charts',
      shortcut: '/chart',
      action: () => {
        // Trigger file upload
        setIsOpen(false);
      }
    },
    {
      id: 'generate-chart',
      label: 'Generate Chart',
      description: 'Create technical analysis chart',
      icon: '📊',
      category: 'charts',
      action: () => {
        // Generate chart
        setIsOpen(false);
      }
    },
    
    // Portfolio Commands
    {
      id: 'portfolio-analysis',
      label: 'Portfolio Analysis',
      description: 'Analyze your current positions',
      icon: '💼',
      category: 'portfolio',
      shortcut: '/portfolio',
      action: () => {
        // Show portfolio analysis
        setIsOpen(false);
      }
    },
    {
      id: 'risk-assessment',
      label: 'Risk Assessment',
      description: 'Evaluate portfolio risk metrics',
      icon: '⚠️',
      category: 'portfolio',
      shortcut: '/risk',
      action: () => {
        // Show risk assessment
        setIsOpen(false);
      }
    },
    {
      id: 'paper-trade',
      label: 'Paper Trade',
      description: 'Simulate trades with current analysis',
      icon: '📝',
      category: 'portfolio',
      shortcut: '/trade',
      action: () => {
        // Open paper trading interface
        setIsOpen(false);
      }
    },
    
    // Navigation Commands
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new research session',
      icon: '💬',
      category: 'navigation',
      shortcut: 'Ctrl+N',
      action: () => {
        // Start new chat
        setIsOpen(false);
      }
    },
    {
      id: 'home',
      label: 'Go to Home',
      description: 'Navigate to homepage',
      icon: '🏠',
      category: 'navigation',
      action: () => {
        window.location.href = '/';
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Platform and account settings',
      icon: '⚙️',
      category: 'settings',
      action: () => {
        // Open settings
        setIsOpen(false);
      }
    },
    {
      id: 'help',
      label: 'Help & Documentation',
      description: 'Get help using the platform',
      icon: '❓',
      category: 'settings',
      shortcut: '?',
      action: () => {
        // Show help
        setIsOpen(false);
      }
    }
  ], []);

  const filteredCommands = useCallback(() => {
    const commands = getCommands();
    if (!search) return commands;
    
    return commands.filter(command => 
      command.label.toLowerCase().includes(search.toLowerCase()) ||
      command.description.toLowerCase().includes(search.toLowerCase()) ||
      command.shortcut?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, getCommands]);

  const groupedCommands = useCallback(() => {
    const commands = filteredCommands();
    const grouped: Record<string, Command[]> = {};
    
    commands.forEach(command => {
      if (!grouped[command.category]) {
        grouped[command.category] = [];
      }
      grouped[command.category].push(command);
    });
    
    return grouped;
  }, [filteredCommands]);

  const executeCommand = useCallback((command: Command) => {
    command.action();
    setSearch('');
  }, []);

  return {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    commands: filteredCommands(),
    groupedCommands: groupedCommands(),
    executeCommand
  };
};