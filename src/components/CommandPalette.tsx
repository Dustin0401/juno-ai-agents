// Command Palette Component
// Accessible via Ctrl+K / Cmd+K

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { Search, Zap } from 'lucide-react';

interface CommandPaletteProps {
  onSlashCommand?: (command: string) => void;
}

export const CommandPalette = ({ onSlashCommand }: CommandPaletteProps) => {
  const { 
    isOpen, 
    setIsOpen, 
    search, 
    setSearch, 
    groupedCommands,
    executeCommand 
  } = useCommandPalette();

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const allCommands = Object.values(groupedCommands).flat();
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allCommands.length) % allCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedCommand = allCommands[selectedIndex];
        if (selectedCommand) {
          if (selectedCommand.shortcut?.startsWith('/')) {
            // Insert slash command in chat
            onSlashCommand?.(selectedCommand.shortcut);
          } else {
            executeCommand(selectedCommand);
          }
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, groupedCommands, executeCommand, onSlashCommand, setIsOpen]);

  const categoryLabels = {
    agents: 'AI Agents',
    charts: 'Chart Analysis', 
    portfolio: 'Portfolio',
    navigation: 'Navigation',
    settings: 'Settings'
  };

  const categoryIcons = {
    agents: '🤖',
    charts: '📊',
    portfolio: '💼',
    navigation: '🧭',
    settings: '⚙️'
  };

  let commandIndex = 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            Command Palette
            <Badge variant="outline" className="text-xs">Ctrl+K</Badge>
          </div>
        </DialogHeader>
        
        <Command className="rounded-lg border-0 shadow-none">
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput 
              placeholder="Type a command or search..." 
              value={search}
              onValueChange={setSearch}
              className="border-0 px-0 py-3 text-sm focus:ring-0"
            />
          </div>
          
          <CommandList className="max-h-[400px] overflow-y-auto p-2">
            <CommandEmpty>No commands found.</CommandEmpty>
            
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category}>
                <CommandGroup 
                  heading={
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <span>{categoryIcons[category as keyof typeof categoryIcons]}</span>
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </div>
                  }
                >
                  {commands.map((command) => {
                    const isSelected = commandIndex === selectedIndex;
                    commandIndex++;
                    
                    return (
                      <CommandItem
                        key={command.id}
                        value={command.id}
                        onSelect={() => {
                          if (command.shortcut?.startsWith('/')) {
                            onSlashCommand?.(command.shortcut);
                          } else {
                            executeCommand(command);
                          }
                          setIsOpen(false);
                        }}
                        className={`flex items-center justify-between p-3 cursor-pointer ${
                          isSelected ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{command.icon}</span>
                          <div>
                            <div className="font-medium text-sm">{command.label}</div>
                            <div className="text-xs text-muted-foreground">{command.description}</div>
                          </div>
                        </div>
                        
                        {command.shortcut && (
                          <Badge variant="outline" className="text-xs font-mono">
                            {command.shortcut}
                          </Badge>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {Object.keys(groupedCommands).indexOf(category) < Object.keys(groupedCommands).length - 1 && (
                  <CommandSeparator />
                )}
              </div>
            ))}
          </CommandList>
          
          <div className="border-t p-2">
            <div className="text-xs text-muted-foreground text-center">
              Use ↑↓ to navigate • Enter to select • Esc to close
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
};