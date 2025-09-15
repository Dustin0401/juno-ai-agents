import React, { useState } from 'react';
import { Search, Star, StarOff, Trash2, Download, Tag, X, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { useQueryHistory } from '../hooks/useQueryHistory';
import { format } from 'date-fns';

export const QueryHistoryPanel: React.FC = () => {
  const {
    history,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    allTags,
    toggleFavorite,
    deleteQuery,
    clearHistory,
    exportHistory
  } = useQueryHistory();

  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const favorites = history.filter(item => item.favorite);
  const recent = history.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search query history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Filter by tags:</div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => toggleTag(tag)}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={exportHistory} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
          <Button onClick={clearHistory} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lime flex items-center">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Favorites ({favorites.length})
          </h3>
          <div className="grid gap-3">
            {favorites.map(item => (
              <QueryHistoryCard
                key={item.id}
                item={item}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteQuery}
                onSelect={setSelectedQuery}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Queries */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {searchTerm || selectedTags.length > 0 ? 'Filtered Results' : 'Recent Queries'} ({history.length})
        </h3>
        
        {history.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No queries found. Start researching to build your history!
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="grid gap-3 pr-4">
              {history.map(item => (
                <QueryHistoryCard
                  key={item.id}
                  item={item}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteQuery}
                  onSelect={setSelectedQuery}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Query Detail Dialog */}
      {selectedQuery && (
        <Dialog open={!!selectedQuery} onOpenChange={() => setSelectedQuery(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Query Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {(() => {
                const item = history.find(h => h.id === selectedQuery);
                if (!item) return null;
                
                return (
                  <>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Query:</div>
                      <div className="p-3 bg-surface rounded-xl font-mono text-sm">
                        {item.query}
                      </div>
                    </div>
                    
                    {item.response && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Response:</div>
                        <div className="p-3 bg-surface rounded-xl text-sm max-h-[300px] overflow-y-auto">
                          {item.response}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{format(item.timestamp, 'PPpp')}</span>
                      <div className="flex gap-2">
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface QueryHistoryCardProps {
  item: any;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

const QueryHistoryCard: React.FC<QueryHistoryCardProps> = ({
  item,
  onToggleFavorite,
  onDelete,
  onSelect
}) => {
  return (
    <Card className="hover:bg-surface/50 transition-colors cursor-pointer group">
      <CardContent className="p-4" onClick={() => onSelect(item.id)}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-mono text-sm line-clamp-2 mb-2">
              {item.query}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{format(item.timestamp, 'MMM d, HH:mm')}</span>
              {item.tags.length > 0 && (
                <div className="flex gap-1">
                  {item.tags.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
            >
              {item.favorite ? (
                <Star className="w-4 h-4 fill-current text-lime" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};