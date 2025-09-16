import { useState, useEffect, useCallback } from 'react';
import { MarketData, PortfolioPosition } from './useMarketData';
import { safeGetItem } from '@/lib/storage';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CRYPTO_SYMBOLS = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum', 
  'SOL': 'solana',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave'
};

export const useRealMarketData = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [totalPnL, setTotalPnL] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cache for API responses
  const [cache, setCache] = useState<Record<string, { data: any, timestamp: number }>>({});
  const CACHE_DURATION = 30000; // 30 seconds

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null);
      const symbols = Object.values(CRYPTO_SYMBOLS).join(',');
      const cacheKey = `market-${symbols}`;
      
      // Check cache first
      const cached = cache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=${symbols}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Update cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: { data, timestamp: Date.now() }
      }));

      return data;
    } catch (err) {
      console.error('Market data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      
      // Return fallback mock data
      return null;
    }
  }, [cache]);

  const generateMockData = useCallback(() => {
    const basePrices = {
      BTC: 65000, ETH: 3200, SOL: 150, AVAX: 35, LINK: 14, UNI: 8, AAVE: 90
    };

    const mockData: Record<string, MarketData> = {};
    Object.keys(CRYPTO_SYMBOLS).forEach(symbol => {
      const basePrice = basePrices[symbol as keyof typeof basePrices];
      const volatility = Math.random() * 0.02 - 0.01;
      const change24h = Math.random() * 0.2 - 0.1;
      
      mockData[symbol] = {
        symbol,
        price: basePrice * (1 + volatility),
        change24h: change24h * basePrice,
        changePercent: change24h * 100,
        volume: Math.random() * 1000000000 + 100000000,
        marketCap: Math.random() * 100000000000 + 10000000000,
        timestamp: new Date()
      };
    });

    return mockData;
  }, []);

  const updateMarketData = useCallback(async () => {
    const apiData = await fetchMarketData();
    
    if (apiData) {
      // Convert API data to our format
      const formattedData: Record<string, MarketData> = {};
      
      Object.entries(CRYPTO_SYMBOLS).forEach(([symbol, coinId]) => {
        const coinData = apiData[coinId];
        if (coinData) {
          formattedData[symbol] = {
            symbol,
            price: coinData.usd || 0,
            change24h: coinData.usd_24h_change || 0,
            changePercent: coinData.usd_24h_change || 0,
            volume: coinData.usd_24h_vol || 0,
            marketCap: coinData.usd_market_cap || 0,
            timestamp: new Date()
          };
        }
      });
      
      setMarketData(formattedData);
      setIsConnected(true);
    } else {
      // Fallback to mock data
      setMarketData(generateMockData());
      setIsConnected(false);
    }
    
    setLastUpdate(new Date());
  }, [fetchMarketData, generateMockData]);

  // Initialize and set up polling
  useEffect(() => {
    updateMarketData();
    
    // Poll every 30 seconds
    const interval = setInterval(updateMarketData, 30000);
    
    return () => clearInterval(interval);
  }, [updateMarketData]);

  // Load portfolio from paper trades
  useEffect(() => {
    const loadPortfolio = () => {
      const paperTrades = JSON.parse(safeGetItem('paperTrades') || '[]');
      const openTrades = paperTrades.filter((trade: any) => trade.status === 'open');
      
      const positions: PortfolioPosition[] = openTrades.map((trade: any) => {
        const currentPrice = marketData[trade.asset]?.price || trade.entryPrice;
        const pnl = trade.position === 'long' 
          ? (currentPrice - trade.entryPrice) * (trade.size / trade.entryPrice)
          : (trade.entryPrice - currentPrice) * (trade.size / trade.entryPrice);
        
        return {
          id: trade.id,
          symbol: trade.asset,
          quantity: trade.size / trade.entryPrice,
          avgEntry: trade.entryPrice,
          currentPrice,
          pnl,
          pnlPercent: (pnl / trade.size) * 100,
          timestamp: new Date(trade.timestamp)
        };
      });

      setPortfolio(positions);
      setTotalPnL(positions.reduce((sum, pos) => sum + pos.pnl, 0));
    };

    if (Object.keys(marketData).length > 0) {
      loadPortfolio();
    }
  }, [marketData]);

  const getAssetData = (symbol: string) => marketData[symbol] || null;
  
  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const forceRefresh = () => {
    setCache({});
    updateMarketData();
  };

  return {
    marketData,
    portfolio,
    totalPnL,
    isConnected,
    lastUpdate,
    error,
    getAssetData,
    formatPrice,
    formatChange,
    refresh: forceRefresh
  };
};