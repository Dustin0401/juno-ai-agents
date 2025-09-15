import { useState, useEffect, useCallback } from 'react';

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  response?: string;
  tags: string[];
  favorite: boolean;
}

export const useQueryHistory = () => {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('juno-query-history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const converted = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(converted);
      } catch (error) {
        console.error('Failed to load query history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: QueryHistoryItem[]) => {
    try {
      localStorage.setItem('juno-query-history', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save query history:', error);
    }
  }, []);

  const addQuery = useCallback((query: string, response?: string, tags: string[] = []) => {
    const newItem: QueryHistoryItem = {
      id: Date.now().toString(),
      query,
      response,
      tags,
      favorite: false,
      timestamp: new Date()
    };

    const updatedHistory = [newItem, ...history.slice(0, 99)]; // Keep last 100 queries
    saveHistory(updatedHistory);
  }, [history, saveHistory]);

  const toggleFavorite = useCallback((id: string) => {
    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    saveHistory(updatedHistory);
  }, [history, saveHistory]);

  const deleteQuery = useCallback((id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    saveHistory(updatedHistory);
  }, [history, saveHistory]);

  const updateTags = useCallback((id: string, tags: string[]) => {
    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, tags } : item
    );
    saveHistory(updatedHistory);
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('juno-query-history');
    setHistory([]);
  }, []);

  // Filter history based on search and tags
  const filteredHistory = history.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.response && item.response.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => item.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(history.flatMap(item => item.tags))).sort();

  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `juno-query-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [history]);

  return {
    history: filteredHistory,
    allHistory: history,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    allTags,
    addQuery,
    toggleFavorite,
    deleteQuery,
    updateTags,
    clearHistory,
    exportHistory
  };
};