import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs/textareas
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement).contentEditable === 'true'
    ) {
      return;
    }

    const matchedShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        (shortcut.ctrlKey ?? false) === event.ctrlKey &&
        (shortcut.shiftKey ?? false) === event.shiftKey &&
        (shortcut.altKey ?? false) === event.altKey &&
        (shortcut.metaKey ?? false) === event.metaKey
      );
    });

    if (matchedShortcut) {
      event.preventDefault();
      matchedShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
};

// Default JUNO shortcuts
export const useJunoShortcuts = (actions: {
  openCommandPalette?: () => void;
  toggleTheme?: () => void;
  focusSearch?: () => void;
  openWallet?: () => void;
  toggleSidebar?: () => void;
  newChat?: () => void;
  exportData?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: actions.openCommandPalette || (() => {}),
      description: 'Open Command Palette'
    },
    {
      key: 'd',
      ctrlKey: true,
      action: actions.toggleTheme || (() => {}),
      description: 'Toggle Dark/Light Theme'
    },
    {
      key: '/',
      action: actions.focusSearch || (() => {}),
      description: 'Focus Search'
    },
    {
      key: 'w',
      ctrlKey: true,
      action: actions.openWallet || (() => {}),
      description: 'Open Wallet'
    },
    {
      key: 'b',
      ctrlKey: true,
      action: actions.toggleSidebar || (() => {}),
      description: 'Toggle Sidebar'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: actions.newChat || (() => {}),
      description: 'New Chat'
    },
    {
      key: 'e',
      ctrlKey: true,
      shiftKey: true,
      action: actions.exportData || (() => {}),
      description: 'Export Data'
    }
  ];

  return useKeyboardShortcuts(shortcuts);
};